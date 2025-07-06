import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { PayFastService, PaymentData } from "../lib/payfast";
import { Check, Crown, Loader2, X, Play, Pause } from "lucide-react";
import toast from "react-hot-toast";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  billing_cycle: string;
  features: string[];
}

export interface PayFastActionResponse {
  data: {
    code: number;
    status: string;
    data: {
      response: string | boolean;
      message: string;
    };
  };
}

const Subscribe = () => {
  const { user, userProfile, subscription, refreshUserData } = useAuth();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .order("price", { ascending: true });

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error("Error fetching plans:", error);
      toast.error("Failed to load subscription plans");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (!user || !userProfile) {
      toast.error("Please sign in to subscribe");
      return;
    }

    setLoadingPlanId(plan.id);
    try {
      // First create subscription record with pending status
      const currentPeriodStart = new Date();
      const currentPeriodEnd = new Date();
      if (plan.billing_cycle === "monthly") {
        currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
      } else {
        currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);
      }

      const { data: subscription, error: subscriptionError } = await supabase
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
        m_payment_id: subscription.id,
        subscription_type: "1",
        billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0], // 30 days from now
        recurring_amount: plan.price.toString(),
        frequency: plan.billing_cycle === "monthly" ? "3" : "6", // 3 = Monthly, 6 = Annually
        cycles: "0", // 0 = indefinite
        subscription_notify_email: user.email!,
        subscription_notify_buyer: "1",
      };

      const payfast = new PayFastService();
      const response = await payfast.initiatePayment(paymentData);

      // Submit payment form to PayFast
      payfast.submitPayment(response.paymentData, response.payfastUrl);
    } catch (error) {
      console.error("Payment initiation error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to initiate payment"
      );
    } finally {
      setLoadingPlanId(null);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription || !subscription.payfast_token) {
      toast.error("Cannot cancel subscription: missing PayFast token");
      return;
    }

    setActionLoading(true);
    try {
      const payfast = new PayFastService();
      const response: PayFastActionResponse =
        await payfast.cancelSubscriptionById(
          subscription.payfast_token,
          subscription.id
        );

      const success =
        response?.data?.code === 200 && response?.data?.status === "success";
      if (!success) {
        throw new Error(response?.data?.data?.message || "Cancellation failed");
      }

      await refreshUserData();
      toast.success("Subscription scheduled for cancellation at period end");
    } catch (error) {
      console.error("Cancel error:", error);
      toast.error("Failed to cancel subscription");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Choose Your Plan
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Select the perfect plan for your needs
        </p>
      </div>

      {subscription && (
        <div className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Current Subscription
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {subscription.plan?.name} - {subscription.status}
                {subscription.cancel_at_period_end &&
                  " (Cancelling at period end)"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 sm:space-x-3 sm:gap-0">
              <button
                onClick={handleCancelSubscription}
                disabled={actionLoading}
                className="flex items-center px-3 sm:px-4 py-2 border border-red-300 rounded-lg text-red-700 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {actionLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <X className="h-4 w-4 mr-2" />
                )}
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-4xl w-full">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border transition-all hover:shadow-2xl ${
                subscription?.plan_id === plan.id
                  ? "border-blue-500 dark:border-blue-400 ring-2 ring-blue-500 dark:ring-blue-400"
                  : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
              }`}
            >
              <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl"></div>
              <div className="relative">
                {subscription?.plan_id === plan.id && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Current Plan
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <Crown className="h-12 w-12 text-purple-500 dark:text-purple-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                    {plan.currency}
                    {plan.price}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 capitalize">
                    per {plan.billing_cycle}
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 dark:text-green-400 mr-3" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={
                    loadingPlanId === plan.id ||
                    subscription?.plan_id === plan.id
                  }
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                    subscription?.plan_id === plan.id
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      : `bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed ${
                          loadingPlanId === plan.id
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`
                  }`}
                >
                  {loadingPlanId === plan.id ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Processing...
                    </div>
                  ) : subscription?.plan_id === plan.id ? (
                    "Current Plan"
                  ) : (
                    "Subscribe Now"
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
