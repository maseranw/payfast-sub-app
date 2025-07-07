import React from "react";
import { useAuth } from "../context/AuthContext";
import {
  CheckCircle,
  XCircle,
  Crown,
  Calendar,
  CreditCard,
} from "lucide-react";
import ReverseText from "../features/ReverseText";
import EmojiBlast from "../features/EmojiBlast";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { userProfile, subscription, hasFeature } = useAuth();

  const features = [
    {
      key: "reverse_text",
      name: "Reverse Text",
      description: "Transform text by reversing it",
    },
    {
      key: "emoji_blast",
      name: "Emoji Blast",
      description: "Generate random emoji combinations",
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {userProfile?.first_name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your subscription and access your features
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Subscription Status */}
        <div className="lg:col-span-1">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <Crown className="h-6 w-6 text-yellow-500 dark:text-yellow-400 mr-2" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Subscription Status
              </h2>
            </div>

            {subscription ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Plan
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {subscription.plan?.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Status
                  </span>
                  <span
                    className={`text-sm font-bold capitalize ${
                      subscription.status === "active"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {subscription.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Next Billing
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {formatDate(subscription.current_period_end)}
                  </span>
                </div>
                {subscription.cancel_at_period_end && (
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <p className="text-sm text-yellow-800 dark:text-yellow-300">
                      Your subscription will end on{" "}
                      {formatDate(subscription.current_period_end)}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <CreditCard className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No active subscription
                </p>
                <Link
                  to="/subscribe"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Subscribe Now
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Feature Access */}
        <div className="lg:col-span-2">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Feature Access
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {features.map((feature) => (
                <div
                  key={feature.key}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-center mb-2">
                    {hasFeature(feature.key) ? (
                      <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 dark:text-red-400 mr-2" />
                    )}
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {feature.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Feature Components */}
            <div className="space-y-6">
              {hasFeature("reverse_text") && (
                <div className="border-t pt-6">
                  <ReverseText />
                </div>
              )}

              {hasFeature("emoji_blast") && (
                <div className="border-t pt-6">
                  <EmojiBlast />
                </div>
              )}

              {!hasFeature("reverse_text") && !hasFeature("emoji_blast") && (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Subscribe to a plan to access premium features
                  </p>
                  <Link
                    to="/subscribe"
                    className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    View Plans
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
