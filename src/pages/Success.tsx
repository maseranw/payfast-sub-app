import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { CheckCircle, ArrowRight, AlertTriangle, RefreshCw } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const Success = () => {
  const { user, loading: authLoading, refreshUserData } = useAuth()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [verificationStatus, setVerificationStatus] = useState<'checking' | 'success' | 'failed' | 'pending'>('checking')
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 3

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { replace: true })
    }
  }, [authLoading, user, navigate])

  const checkSubscriptionStatus = async (attempt: number) => {
    if (!user) return

    try {
      // Get the subscription ID from URL params if available
      const subscriptionId = searchParams.get('subscription_id')

      if (subscriptionId) {
        // Check specific subscription status
        const { data: sub, error } = await supabase
          .from('subscriptions')
          .select(`
            *,
            plan:subscription_plans(*)
          `)
          .eq('id', subscriptionId)
          .eq('user_id', user.id)
          .single()

        if (error) {
          console.error('Error fetching subscription:', error)
          setVerificationStatus('failed')
          return
        }

        if (sub?.status === 'active') {
          setVerificationStatus('success')
          await refreshUserData()
        } else if (sub?.status === 'pending') {
          setVerificationStatus('pending')
          // Retry after a delay if we haven't exceeded max retries
          if (attempt < maxRetries) {
            setTimeout(() => {
              setRetryCount(attempt + 1)
              checkSubscriptionStatus(attempt + 1)
            }, 3000) // Wait 3 seconds before retry
          } else {
            setVerificationStatus('failed')
          }
        } else {
          setVerificationStatus('failed')
        }
      } else {
        // No specific subscription ID, just refresh user data and check current subscription
        await refreshUserData()
        setVerificationStatus('success')
      }
    } catch (error) {
      console.error('Error checking subscription status:', error)
      setVerificationStatus('failed')
    }
  }

  useEffect(() => {
    checkSubscriptionStatus(0)
  }, [user, searchParams])

  const handleRetryCheck = () => {
    setVerificationStatus('checking')
    setRetryCount(0)
    checkSubscriptionStatus(0)
  }

  const renderContent = () => {
    switch (verificationStatus) {
      case 'checking':
        return (
          <>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-600 mb-8">
              <RefreshCw className="h-8 w-8 text-white animate-spin" strokeWidth={2} />
            </div>

            <h1 className="text-4xl font-black tracking-tighter text-neutral-950 dark:text-white mb-4">
              Verifying Payment...
            </h1>

            <p className="text-lg text-neutral-500 dark:text-neutral-400 mb-10">
              Please wait while we confirm your subscription status.
            </p>
          </>
        )

      case 'pending':
        return (
          <>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-amber-500 mb-8">
              <AlertTriangle className="h-8 w-8 text-neutral-950" strokeWidth={2} />
            </div>

            <h1 className="text-4xl font-black tracking-tighter text-neutral-950 dark:text-white mb-4">
              Payment Processing...
            </h1>

            <p className="text-lg text-neutral-500 dark:text-neutral-400 mb-10">
              Your payment is being processed. This usually takes a few moments.
              {retryCount > 0 && ` (Attempt ${retryCount + 1}/${maxRetries + 1})`}
            </p>

            <div className="bg-neutral-50 dark:bg-neutral-950 shadow-xl shadow-neutral-200/50 dark:shadow-none p-8 mb-10 text-left">
              <h2 className="text-lg font-extrabold tracking-tight text-neutral-950 dark:text-white mb-5">
                What's happening?
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <RefreshCw className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0 animate-spin" strokeWidth={2} />
                  <span className="text-neutral-600 dark:text-neutral-300">PayFast is processing your payment</span>
                </div>
                <div className="flex items-start gap-3">
                  <RefreshCw className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0 animate-spin" strokeWidth={2} />
                  <span className="text-neutral-600 dark:text-neutral-300">Activating your subscription</span>
                </div>
                <div className="flex items-start gap-3">
                  <RefreshCw className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0 animate-spin" strokeWidth={2} />
                  <span className="text-neutral-600 dark:text-neutral-300">This page will update automatically</span>
                </div>
              </div>
            </div>
          </>
        )

      case 'failed':
        return (
          <>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-600 mb-8">
              <AlertTriangle className="h-8 w-8 text-white" strokeWidth={2} />
            </div>

            <h1 className="text-4xl font-black tracking-tighter text-neutral-950 dark:text-white mb-4">
              Subscription Verification Failed
            </h1>

            <p className="text-lg text-neutral-500 dark:text-neutral-400 mb-10">
              We couldn't verify your subscription status. This might be a temporary issue.
            </p>

            <div className="bg-neutral-50 dark:bg-neutral-950 shadow-xl shadow-neutral-200/50 dark:shadow-none p-8 mb-10 text-left">
              <h2 className="text-lg font-extrabold tracking-tight text-neutral-950 dark:text-white mb-5">
                What you can do:
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <RefreshCw className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" strokeWidth={2} />
                  <span className="text-neutral-600 dark:text-neutral-300">Try refreshing the page or checking again</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" strokeWidth={2} />
                  <span className="text-neutral-600 dark:text-neutral-300">Check your dashboard for subscription status</span>
                </div>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" strokeWidth={2} />
                  <span className="text-neutral-600 dark:text-neutral-300">Contact support if the issue persists</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleRetryCheck}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-wide text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-400 transition-all duration-150 hover:scale-105 active:scale-95"
              >
                <RefreshCw className="h-4 w-4" strokeWidth={2} />
                Check Again
              </button>
            </div>
          </>
        )

      case 'success':
      default:
        return (
          <>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-600 mb-8">
              <CheckCircle className="h-8 w-8 text-white" strokeWidth={2} />
            </div>

            <h1 className="text-4xl font-black tracking-tighter text-neutral-950 dark:text-white mb-4">
              Payment Successful!
            </h1>

            <p className="text-lg text-neutral-500 dark:text-neutral-400 mb-10">
              Thank you for your subscription. Your payment has been processed successfully and your plan is now active.
            </p>

            <div className="bg-neutral-50 dark:bg-neutral-950 shadow-xl shadow-neutral-200/50 dark:shadow-none p-8 mb-10 text-left">
              <h2 className="text-lg font-extrabold tracking-tight text-neutral-950 dark:text-white mb-5">
                What's Next?
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" strokeWidth={2} />
                  <span className="text-neutral-600 dark:text-neutral-300">Access to all premium features</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" strokeWidth={2} />
                  <span className="text-neutral-600 dark:text-neutral-300">Subscription automatically renews</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" strokeWidth={2} />
                  <span className="text-neutral-600 dark:text-neutral-300">Manage your subscription anytime</span>
                </div>
              </div>
            </div>

            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-wide text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-400 transition-all duration-150 hover:scale-105 active:scale-95"
            >
              Go to Dashboard
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
          </>
        )
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-2xl mx-auto px-6 py-24">
        <div className="text-center animate-fade-in-up">
          {renderContent()}

          {verificationStatus !== 'success' && (
            <div className="mt-10">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors duration-150"
              >
                <ArrowRight className="h-4 w-4 rotate-180" strokeWidth={2} />
                Back to Dashboard
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Success
