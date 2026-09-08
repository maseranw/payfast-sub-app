import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { Check, Crown, Loader2, Settings } from "lucide-react";
import toast from "react-hot-toast";
import { useSubscriptionActions } from "../hooks/useSubscriptionActions";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  billing_cycle: string;
  features: string[];
}

const Subscribe = () => {
  const { user, userProfile, subscription, refreshUserData } = useAuth();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const { subscribe, subscribingPlanId } = useSubscriptionActions({
    user,
    userProfile,
    subscription,
    refreshUserData,
  });

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
      toast.error(
        error instanceof Error ? error.message : "Failed to load subscription plans"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14">
      <div className="text-center mb-14 animate-fade-in-up">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3">
          Pricing
        </p>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-neutral-950 dark:text-white mb-4">
          Choose Your Plan
        </h1>
        <p className="text-lg text-neutral-500 dark:text-neutral-400">
          Select the perfect plan for your needs
        </p>
      </div>

      {subscription && (
        <div className="mb-10 bg-neutral-50 dark:bg-neutral-950 shadow-xl shadow-neutral-200/50 dark:shadow-none p-6 sm:p-8 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h2 className="text-lg font-extrabold tracking-tight text-neutral-950 dark:text-white mb-2">
                Current Subscription
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 capitalize">
                {subscription.plan?.name} - {subscription.status}
                {subscription.cancel_at_period_end &&
                  " (Cancelling at period end)"}
              </p>
            </div>
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wide bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all duration-150 hover:scale-105 active:scale-95 shrink-0"
            >
              <Settings className="h-4 w-4" strokeWidth={2} />
              Manage Subscription
            </Link>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl w-full">
          {plans.map((plan, index) => {
            const isCurrentPlan = subscription?.plan_id === plan.id;
            return (
              <div
                key={plan.id}
                style={{ animationDelay: `${index * 100}ms` }}
                className={`relative p-8 sm:p-10 transition-transform duration-150 hover:-translate-y-1 animate-fade-in-up ${
                  isCurrentPlan
                    ? "bg-neutral-950 dark:bg-white shadow-2xl"
                    : "bg-neutral-50 dark:bg-neutral-950 shadow-xl shadow-neutral-200/50 dark:shadow-none"
                }`}
              >
                {isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                      Current Plan
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <Crown className="h-10 w-10 text-purple-500 dark:text-purple-400 mx-auto mb-5" strokeWidth={1.75} />
                  <h3 className={`text-2xl font-extrabold tracking-tight mb-2 ${isCurrentPlan ? "text-white dark:text-neutral-950" : "text-neutral-950 dark:text-white"}`}>
                    {plan.name}
                  </h3>
                  <div className={`text-5xl font-black tracking-tighter mb-1 ${isCurrentPlan ? "text-white dark:text-neutral-950" : "text-neutral-950 dark:text-white"}`}>
                    {plan.currency}
                    {plan.price}
                  </div>
                  <p className={`capitalize text-sm ${isCurrentPlan ? "text-neutral-300 dark:text-neutral-600" : "text-neutral-500 dark:text-neutral-400"}`}>
                    per {plan.billing_cycle}
                  </p>
                </div>

                <div className="space-y-4 mb-10">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <Check className={`h-5 w-5 shrink-0 ${isCurrentPlan ? "text-green-400 dark:text-green-600" : "text-green-600 dark:text-green-400"}`} strokeWidth={2} />
                      <span className={`text-sm sm:text-base ${isCurrentPlan ? "text-neutral-200 dark:text-neutral-700" : "text-neutral-600 dark:text-neutral-300"}`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => subscribe(plan)}
                  disabled={
                    subscribingPlanId === plan.id ||
                    isCurrentPlan
                  }
                  className={`w-full py-4 rounded-full text-xs font-bold uppercase tracking-wide transition-all duration-150 ${
                    isCurrentPlan
                      ? "bg-neutral-800 dark:bg-neutral-200 text-neutral-400 dark:text-neutral-500 cursor-not-allowed"
                      : `bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-400 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`
                  }`}
                >
                  {subscribingPlanId === plan.id ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                      Processing...
                    </div>
                  ) : isCurrentPlan ? (
                    "Current Plan"
                  ) : (
                    "Subscribe Now"
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
