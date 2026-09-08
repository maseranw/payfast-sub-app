import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { CheckCircle, XCircle, Crown, Calendar, CreditCard, ArrowRight } from 'lucide-react'
import ReverseText from '../features/ReverseText'
import EmojiBlast from '../features/EmojiBlast'
import { getStatusBadgeConfig, getStatusPillClassName } from '../lib/subscription-status'

const Dashboard = () => {
  const { userProfile, subscription, hasFeature } = useAuth()
  const statusBadge = subscription ? getStatusBadgeConfig(subscription.status) : null
  const statusPillClass = subscription ? getStatusPillClassName(subscription.status) : ''

  const features = [
    { key: 'reverse_text', name: 'Reverse Text', description: 'Transform text by reversing it' },
    { key: 'emoji_blast', name: 'Emoji Blast', description: 'Generate random emoji combinations' }
  ]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14">
      <div className="mb-14 animate-fade-in-up">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3">
          Dashboard
        </p>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-neutral-950 dark:text-white mb-3">
          Welcome back, {userProfile?.first_name}!
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Manage your subscription and access your features
        </p>
      </div>

      {!subscription && (
        <div className="mb-14 bg-neutral-950 dark:bg-white p-10 sm:p-14 animate-fade-in-up">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-400 dark:text-blue-600 mb-4">
                Unlock Everything
              </p>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-white dark:text-neutral-950 mb-3">
                You have no active subscription
              </h2>
              <p className="text-neutral-400 dark:text-neutral-500 max-w-xl">
                Subscribe to a plan to unlock premium features like Reverse Text and Emoji Blast, and get full access to everything SubApp offers.
              </p>
            </div>
            <Link
              to="/subscribe"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wide bg-white dark:bg-neutral-950 text-neutral-950 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all duration-150 hover:scale-105 active:scale-95 shrink-0"
            >
              <Crown className="h-5 w-5" strokeWidth={2} />
              Subscribe Now
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 animate-fade-in-up animate-delay-100">
          <div className="bg-neutral-50 dark:bg-neutral-950 shadow-xl shadow-neutral-200/50 dark:shadow-none p-8">
            <div className="flex items-center mb-6">
              <Crown className="h-6 w-6 text-amber-500 mr-3" strokeWidth={2} />
              <h2 className="text-xl font-extrabold tracking-tight text-neutral-950 dark:text-white">Subscription Status</h2>
            </div>

            {subscription ? (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">Plan</span>
                  <span className="text-sm font-bold text-neutral-950 dark:text-white">{subscription.plan?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">Status</span>
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide transition-colors duration-300 ${statusPillClass}`}>
                    {statusBadge!.label}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">Next Billing</span>
                  <span className="text-sm font-bold text-neutral-950 dark:text-white">
                    {formatDate(subscription.current_period_end)}
                  </span>
                </div>
                {subscription.cancel_at_period_end && (
                  <div className="p-4 bg-amber-500 text-neutral-950 animate-fade-in">
                    <p className="text-sm font-semibold">
                      Your subscription will end on {formatDate(subscription.current_period_end)}
                    </p>
                  </div>
                )}
                <Link
                  to="/profile"
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wide text-neutral-950 dark:text-white bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all duration-150 hover:scale-105 active:scale-95"
                >
                  Manage Subscription
                </Link>
              </div>
            ) : (
              <div className="text-center py-6">
                <CreditCard className="h-12 w-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-5" strokeWidth={1.5} />
                <p className="text-neutral-500 dark:text-neutral-400 mb-6">No active subscription</p>
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

        <div className="lg:col-span-2 animate-fade-in-up animate-delay-200">
          <div className="bg-neutral-50 dark:bg-neutral-950 shadow-xl shadow-neutral-200/50 dark:shadow-none p-8">
            <h2 className="text-xl font-extrabold tracking-tight text-neutral-950 dark:text-white mb-8">Feature Access</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {features.map((feature) => (
                <div key={feature.key} className="p-5 bg-white dark:bg-black transition-colors duration-300">
                  <div className="flex items-center mb-2">
                    {hasFeature(feature.key) ? (
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" strokeWidth={2} />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" strokeWidth={2} />
                    )}
                    <h3 className="font-bold text-neutral-950 dark:text-white">{feature.name}</h3>
                  </div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{feature.description}</p>
                </div>
              ))}
            </div>

            <div className="space-y-8">
              {hasFeature('reverse_text') && (
                <div className="border-t border-neutral-100 dark:border-neutral-900 pt-8 animate-fade-in">
                  <ReverseText />
                </div>
              )}

              {hasFeature('emoji_blast') && (
                <div className="border-t border-neutral-100 dark:border-neutral-900 pt-8 animate-fade-in">
                  <EmojiBlast />
                </div>
              )}

              {!hasFeature('reverse_text') && !hasFeature('emoji_blast') && (
                <div className="text-center py-10 animate-fade-in">
                  <Calendar className="h-12 w-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-5" strokeWidth={1.5} />
                  <p className="text-neutral-500 dark:text-neutral-400 mb-6">
                    Subscribe to a plan to access premium features
                  </p>
                  <Link
                    to="/subscribe"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wide text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-400 transition-all duration-150 hover:scale-105 active:scale-95"
                  >
                    <Crown className="h-4 w-4" strokeWidth={2} />
                    View Plans
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
