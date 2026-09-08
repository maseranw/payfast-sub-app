import { useEffect, useState } from 'react'
import { XCircle, ArrowLeft, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const Cancel = () => {
  const { user, loading: authLoading, refreshUserData } = useAuth()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'checking' | 'success' | 'cancelled' | 'pending' | 'failed'>('checking')
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
      const subscriptionId = searchParams.get('subscription_id')

      if (subscriptionId) {
        const { data: sub, error } = await supabase
          .from('subscriptions')
          .select(`*, plan:subscription_plans(*)`)
          .eq('id', subscriptionId)
          .eq('user_id', user.id)
          .single()

        if (error) {
          console.error('Error fetching subscription:', error)
          setStatus('cancelled')
          return
        }

        if (sub?.status === 'active') {
          setStatus('success')
          await refreshUserData()
        } else if (sub?.status === 'pending') {
          setStatus('pending')
          if (attempt < maxRetries) {
            setTimeout(() => {
              setRetryCount(attempt + 1)
              checkSubscriptionStatus(attempt + 1)
            }, 3000)
          } else {
            setStatus('cancelled')
          }
        } else {
          setStatus('cancelled')
        }
      } else {
        // No subscription ID, fallback
        await refreshUserData()
        setStatus('cancelled')
      }
    } catch (error) {
      console.error('Error checking subscription:', error)
      setStatus('cancelled')
    }
  }

  useEffect(() => {
    checkSubscriptionStatus(0)
  }, [user, searchParams])

  const handleRetry = () => {
    setRetryCount(0)
    setStatus('checking')
    checkSubscriptionStatus(0)
  }

  const renderContent = () => {
    switch (status) {
      case 'checking':
        return (
          <>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-600 mb-8">
              <RefreshCw className="h-8 w-8 text-white animate-spin" strokeWidth={2} />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-neutral-950 dark:text-white mb-4">Checking Status...</h1>
            <p className="text-lg text-neutral-500 dark:text-neutral-400 mb-10">
              Hold on while we confirm your subscription status.
            </p>
          </>
        )

      case 'success':
        return (
          <>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-600 mb-8">
              <CheckCircle className="h-8 w-8 text-white" strokeWidth={2} />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-neutral-950 dark:text-white mb-4">Subscription Active</h1>
            <p className="text-lg text-neutral-500 dark:text-neutral-400 mb-10">
              Your payment actually went through successfully. You now have access to premium features.
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-wide text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-400 transition-all duration-150 hover:scale-105 active:scale-95"
            >
              Go to Dashboard
              <ArrowLeft className="h-4 w-4 rotate-180" strokeWidth={2} />
            </Link>
          </>
        )

      case 'pending':
        return (
          <>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-amber-500 mb-8">
              <AlertTriangle className="h-8 w-8 text-neutral-950" strokeWidth={2} />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-neutral-950 dark:text-white mb-4">Payment Processing...</h1>
            <p className="text-lg text-neutral-500 dark:text-neutral-400 mb-10">
              We're still waiting for confirmation. Please wait a moment.
              {retryCount > 0 && ` (Attempt ${retryCount + 1}/${maxRetries + 1})`}
            </p>
          </>
        )

      default: // 'cancelled' or 'failed'
        return (
          <>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-600 mb-8">
              <XCircle className="h-8 w-8 text-white" strokeWidth={2} />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-neutral-950 dark:text-white mb-4">Payment Cancelled</h1>
            <p className="text-lg text-neutral-500 dark:text-neutral-400 mb-10">
              Your payment was cancelled or did not complete. No charges were made.
            </p>

            <div className="bg-neutral-50 dark:bg-neutral-950 shadow-xl shadow-neutral-200/50 dark:shadow-none p-8 mb-10 text-left">
              <h2 className="text-lg font-extrabold tracking-tight text-neutral-950 dark:text-white mb-5">What happened?</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" strokeWidth={2} />
                  <span className="text-neutral-600 dark:text-neutral-300">Payment process was interrupted or cancelled</span>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" strokeWidth={2} />
                  <span className="text-neutral-600 dark:text-neutral-300">No charges were made to your account</span>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" strokeWidth={2} />
                  <span className="text-neutral-600 dark:text-neutral-300">You can try subscribing again</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-5">
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-wide text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-400 transition-all duration-150 hover:scale-105 active:scale-95"
              >
                <RefreshCw className="h-4 w-4" strokeWidth={2} />
                Check Again
              </button>
              <Link
                to="/subscribe"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-wide text-white bg-neutral-950 dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all duration-150 hover:scale-105 active:scale-95"
              >
                Try Again
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-all duration-150 hover:scale-105 active:scale-95"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={2} />
                Back to Dashboard
              </Link>
            </div>
          </>
        )
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-2xl mx-auto px-6 py-24">
        <div className="text-center animate-fade-in-up">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default Cancel
