import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "../lib/supabase";
import { PayFastService, PaymentData } from "../lib/payfast";

export interface SubscribeActionPlan {
  id: string;
  name: string;
  price: number;
  billing_cycle: string;
}

export interface SubscriptionActionsUser {
  id: string;
  email?: string | null;
}

export interface SubscriptionActionsUserProfile {
  first_name: string;
  last_name: string;
}

export interface SubscriptionActionsSubscription {
  id: string;
  payfast_token: string | null;
}

interface UseSubscriptionActionsParams {
  user: SubscriptionActionsUser | null;
  userProfile: SubscriptionActionsUserProfile | null;
  subscription: SubscriptionActionsSubscription | null;
  refreshUserData: () => Promise<void>;
}

type PayFastServiceInstance = InstanceType<typeof PayFastService>;
type PayFastActionResult = Awaited<
  ReturnType<PayFastServiceInstance["pauseSubscription"]>
>;

export type SubscriptionActionName = "cancel" | "pause" | "resume";

export interface UseSubscriptionActionsResult {
  subscribe: (plan: SubscribeActionPlan) => Promise<void>;
  cancel: () => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  subscribingPlanId: string | null;
  loadingAction: SubscriptionActionName | null;
  error: string | null;
}

export function useSubscriptionActions({
  user,
  userProfile,
  subscription,
  refreshUserData,
}: UseSubscriptionActionsParams): UseSubscriptionActionsResult {
  const [subscribingPlanId, setSubscribingPlanId] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<SubscriptionActionName | null>(null);
  const [error, setError] = useState<string | null>(null);

  const subscribe = useCallback(
    async (plan: SubscribeActionPlan) => {
      if (!user || !userProfile) {
        const message = "Please sign in to subscribe";
        setError(message);
        toast.error(message);
        return;
      }

      setError(null);
      setSubscribingPlanId(plan.id);
      try {
        const currentPeriodStart = new Date();
        const currentPeriodEnd = new Date();
        if (plan.billing_cycle === "monthly") {
          currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
        } else {
          currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);
        }

        const { data: createdSubscription, error: subscriptionError } = await supabase
          .from("subscriptions")
          .insert({
            user_id: user.id,
            plan_id: plan.id,
            status: "pending",
            current_period_start: currentPeriodStart.toISOString(),
            current_period_end: currentPeriodEnd.toISOString(),
          })
          .select()
          .single();

        if (subscriptionError) {
          throw new Error(
            `Failed to create subscription record: ${subscriptionError.message}`
          );
        }

        const paymentData: PaymentData = {
          amount: plan.price.toString(),
          item_name: plan.name,
          item_description: `${plan.name} - ${plan.billing_cycle} subscription`,
          name_first: userProfile.first_name,
          name_last: userProfile.last_name,
          email_address: user.email!,
          m_payment_id: createdSubscription.id,
          subscription_type: "1",
          billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          recurring_amount: plan.price.toString(),
          frequency: plan.billing_cycle === "monthly" ? "3" : "6",
          cycles: "0",
          subscription_notify_email: user.email!,
          subscription_notify_buyer: "1",
        };

        const payfast = new PayFastService();
        const response = await payfast.initiatePayment(paymentData);

        payfast.submitPayment(response.paymentData, response.payfastUrl);
      } catch (err) {
        console.error("Payment initiation error:", err);
        const message = err instanceof Error ? err.message : "Failed to initiate payment";
        setError(message);
        toast.error(message);
      } finally {
        setSubscribingPlanId(null);
      }
    },
    [user, userProfile]
  );

  const runSubscriptionAction = useCallback(
    async (
      actionName: SubscriptionActionName,
      action: (
        payfast: PayFastServiceInstance,
        token: string
      ) => Promise<PayFastActionResult>,
      missingTokenMessage: string,
      failureMessage: string,
      successMessage: string,
      logLabel: string
    ) => {
      if (!subscription || !subscription.payfast_token) {
        setError(missingTokenMessage);
        toast.error(missingTokenMessage);
        return;
      }

      setError(null);
      setLoadingAction(actionName);
      try {
        const payfast = new PayFastService();
        const response = await action(payfast, subscription.payfast_token);

        const success =
          response?.data?.code === 200 && response?.data?.status === "success";
        if (!success) {
          throw new Error(response?.data?.data?.message || failureMessage);
        }

        await refreshUserData();
        toast.success(successMessage);
      } catch (err) {
        console.error(`${logLabel} error:`, err);
        const message = err instanceof Error ? err.message : failureMessage;
        setError(message);
        toast.error(message);
      } finally {
        setLoadingAction(null);
      }
    },
    [subscription, refreshUserData]
  );

  const cancel = useCallback(async () => {
    const subscriptionId = subscription?.id;
    await runSubscriptionAction(
      "cancel",
      (payfast, token) => payfast.cancelSubscriptionById(token, subscriptionId!),
      "Cannot cancel subscription: missing PayFast token",
      "Cancellation failed",
      "Subscription cancelled",
      "Cancel"
    );
  }, [runSubscriptionAction, subscription]);

  const pause = useCallback(async () => {
    await runSubscriptionAction(
      "pause",
      (payfast, token) => payfast.pauseSubscription(token),
      "Cannot pause subscription: missing PayFast token",
      "Pause failed",
      "Subscription paused",
      "Pause"
    );
  }, [runSubscriptionAction]);

  const resume = useCallback(async () => {
    await runSubscriptionAction(
      "resume",
      (payfast, token) => payfast.unpauseSubscription(token),
      "Cannot resume subscription: missing PayFast token",
      "Resume failed",
      "Subscription resumed",
      "Resume"
    );
  }, [runSubscriptionAction]);

  return {
    subscribe,
    cancel,
    pause,
    resume,
    subscribingPlanId,
    loadingAction,
    error,
  };
}
