import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { useSubscriptionActions } from "../hooks/useSubscriptionActions";
import ConfirmDialog from "../components/ConfirmDialog";
import {
  canPause,
  canResume,
  getStatusBadgeConfig,
  getStatusPillClassName,
} from "../lib/subscription-status";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  Save,
  Loader2,
  Crown,
  Pause,
  Play,
  X,
  Calendar,
  CreditCard,
} from "lucide-react";

const Profile = () => {
  const { user, userProfile, subscription, refreshUserData } = useAuth();
  const [firstName, setFirstName] = useState(userProfile?.first_name ?? "");
  const [lastName, setLastName] = useState(userProfile?.last_name ?? "");
  const [phone, setPhone] = useState(userProfile?.phone ?? "");
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    setFirstName(userProfile?.first_name ?? "");
    setLastName(userProfile?.last_name ?? "");
    setPhone(userProfile?.phone ?? "");
  }, [userProfile]);

  const { cancel, pause, resume, loadingAction } = useSubscriptionActions({
    user,
    userProfile,
    subscription,
    refreshUserData,
  });
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const handleConfirmCancel = async () => {
    await cancel();
    setCancelDialogOpen(false);
  };

  const statusBadge = subscription ? getStatusBadgeConfig(subscription.status) : null;
  const statusPillClass = subscription ? getStatusPillClassName(subscription.status) : "";

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSavingProfile(true);
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({
          first_name: firstName,
          last_name: lastName,
          phone: phone || null,
        })
        .eq("id", user.id);

      if (error) throw error;

      await refreshUserData();
      toast.success("Profile updated");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const inputClasses =
    "w-full pl-12 pr-4 py-3.5 bg-neutral-100 dark:bg-neutral-900 text-neutral-950 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-950 dark:focus:ring-white transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed";

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-10 py-14">
      <div className="mb-14 animate-fade-in-up">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3">
          Account
        </p>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-neutral-950 dark:text-white mb-3">
          Your Profile
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Manage your personal details and subscription in one place
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="animate-fade-in-up animate-delay-100">
          <div className="bg-neutral-50 dark:bg-neutral-950 shadow-xl shadow-neutral-200/50 dark:shadow-none p-8">
            <h2 className="text-xl font-extrabold tracking-tight text-neutral-950 dark:text-white mb-8">
              Personal Details
            </h2>

            <form className="space-y-5" onSubmit={handleSaveProfile}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-2"
                  >
                    First Name
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 dark:text-neutral-500"
                      strokeWidth={2}
                    />
                    <input
                      id="firstName"
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-2"
                  >
                    Last Name
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 dark:text-neutral-500"
                      strokeWidth={2}
                    />
                    <input
                      id="lastName"
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 dark:text-neutral-500"
                    strokeWidth={2}
                  />
                  <input
                    id="email"
                    type="email"
                    value={user?.email ?? ""}
                    disabled
                    className={inputClasses}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-2"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 dark:text-neutral-500"
                    strokeWidth={2}
                  />
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputClasses}
                    placeholder="Add a phone number"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-full text-sm font-bold uppercase tracking-wide text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-400 transition-all duration-150 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {savingProfile ? (
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                ) : (
                  <Save className="h-4 w-4" strokeWidth={2} />
                )}
                Save Changes
              </button>
            </form>
          </div>
        </div>

        <div className="animate-fade-in-up animate-delay-200">
          <div className="bg-neutral-50 dark:bg-neutral-950 shadow-xl shadow-neutral-200/50 dark:shadow-none p-8">
            <div className="flex items-center mb-8">
              <Crown className="h-6 w-6 text-amber-500 mr-3" strokeWidth={2} />
              <h2 className="text-xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
                Subscription
              </h2>
            </div>

            {subscription ? (
              <div className="space-y-6">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                      Plan
                    </span>
                    <span className="text-sm font-bold text-neutral-950 dark:text-white">
                      {subscription.plan?.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                      Status
                    </span>
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide transition-colors duration-300 ${statusPillClass}`}
                    >
                      {statusBadge!.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                      Next Billing
                    </span>
                    <span className="text-sm font-bold text-neutral-950 dark:text-white">
                      {formatDate(subscription.current_period_end)}
                    </span>
                  </div>
                  {subscription.cancel_at_period_end && (
                    <div className="p-4 bg-amber-500 text-neutral-950 animate-fade-in">
                      <p className="text-sm font-semibold">
                        Your subscription will end on{" "}
                        {formatDate(subscription.current_period_end)}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-900">
                  {canPause(subscription.status) && (
                    <button
                      onClick={pause}
                      disabled={loadingAction !== null}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wide bg-amber-500 text-neutral-950 hover:bg-amber-400 transition-all duration-150 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {loadingAction === "pause" ? (
                        <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                      ) : (
                        <Pause className="h-4 w-4" strokeWidth={2} />
                      )}
                      Pause
                    </button>
                  )}
                  {canResume(subscription.status) && (
                    <button
                      onClick={resume}
                      disabled={loadingAction !== null}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wide bg-green-600 text-white hover:bg-green-700 transition-all duration-150 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {loadingAction === "resume" ? (
                        <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                      ) : (
                        <Play className="h-4 w-4" strokeWidth={2} />
                      )}
                      Resume
                    </button>
                  )}
                  <button
                    onClick={() => setCancelDialogOpen(true)}
                    disabled={loadingAction !== null}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wide bg-neutral-100 dark:bg-neutral-900 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-all duration-150 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <X className="h-4 w-4" strokeWidth={2} />
                    Cancel
                  </button>
                </div>

                <Link
                  to="/subscribe"
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wide text-neutral-950 dark:text-white bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all duration-150 hover:scale-105 active:scale-95"
                >
                  <Calendar className="h-4 w-4" strokeWidth={2} />
                  Change Plan
                </Link>
              </div>
            ) : (
              <div className="text-center py-6">
                <CreditCard
                  className="h-12 w-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-5"
                  strokeWidth={1.5}
                />
                <p className="text-neutral-500 dark:text-neutral-400 mb-6">
                  No active subscription
                </p>
                <Link
                  to="/subscribe"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wide text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-400 transition-all duration-150 hover:scale-105 active:scale-95"
                >
                  <Crown className="h-4 w-4" strokeWidth={2} />
                  Subscribe Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={cancelDialogOpen}
        title="Cancel Subscription?"
        description="Your subscription will remain active until the end of the current billing period, then it won't renew. This can't be undone from here."
        confirmLabel="Cancel Subscription"
        cancelLabel="Keep Subscription"
        isConfirming={loadingAction === "cancel"}
        onConfirm={handleConfirmCancel}
        onCancel={() => setCancelDialogOpen(false)}
      />
    </div>
  );
};

export default Profile;
