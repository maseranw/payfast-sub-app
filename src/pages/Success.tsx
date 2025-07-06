import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { CheckCircle, ArrowRight, AlertTriangle, RefreshCw } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const Success = () => {
  const { user, refreshUserData, subscription } = useAuth()
  const [searchParams] = useSearchParams()
  const [verificationStatus, setVerificationStatus] = useState<'checking' | 'success' | 'failed' | 'pending'>('checking')
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 3

  const checkSubscriptionStatus = async () => {
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
          if (retryCount < maxRetries) {
            setTimeout(() => {
              setRetryCount(prev => prev + 1)
              checkSubscriptionStatus()
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
    checkSubscriptionStatus()
  }, [user, searchParams])

  const handleRetryCheck = () => {
    setVerificationStatus('checking')
    setRetryCount(0)
    checkSubscriptionStatus()
  }

  const renderContent = () => {
    switch (verificationStatus) {
      case 'checking':
        return (
          <>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
              <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Verifying Payment...
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              Please wait while we confirm your subscription status.
            </p>
          </>
        )

      case 'pending':
        return (
          <>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-6">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Payment Processing...
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              Your payment is being processed. This usually takes a few moments.
              {retryCount > 0 && ` (Attempt ${retryCount + 1}/${maxRetries + 1})`}
            </p>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                What's happening?
              </h2>
              <div className="text-left space-y-3">
                <div className="flex items-start">
                  <RefreshCw className="h-5 w-5 text-blue-500 mr-3 mt-0.5 animate-spin" />
                  <span className="text-gray-700">PayFast is processing your payment</span>
                </div>
                <div className="flex items-start">
                  <RefreshCw className="h-5 w-5 text-blue-500 mr-3 mt-0.5 animate-spin" />
                  <span className="text-gray-700">Activating your subscription</span>
                </div>
                <div className="flex items-start">
                  <RefreshCw className="h-5 w-5 text-blue-500 mr-3 mt-0.5 animate-spin" />
                  <span className="text-gray-700">This page will update automatically</span>
                </div>
              </div>
            </div>
          </>
        )

      case 'failed':
        return (
          <>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Subscription Verification Failed
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              We couldn't verify your subscription status. This might be a temporary issue.
            </p>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                What you can do:
              </h2>
              <div className="text-left space-y-3">
                <div className="flex items-start">
                  <RefreshCw className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                  <span className="text-gray-700">Try refreshing the page or checking again</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <span className="text-gray-700">Check your dashboard for subscription status</span>
                </div>
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
                  <span className="text-gray-700">Contact support if the issue persists</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={handleRetryCheck}
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                <RefreshCw className="mr-2 h-5 w-5" />
                Check Again
              </button>
            </div>
          </>
        )

      case 'success':
      default:
        return (
          <>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Payment Successful!
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              Thank you for your subscription. Your payment has been processed successfully and your plan is now active.
            </p>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                What's Next?
              </h2>
              <div className="text-left space-y-3">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <span className="text-gray-700">Access to all premium features</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <span className="text-gray-700">Subscription automatically renews</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <span className="text-gray-700">Manage your subscription anytime</span>
                </div>
              </div>
            </div>
            
            <Link
              to="/dashboard"
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Go to Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </>
        )
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        {renderContent()}
        
        {verificationStatus !== 'success' && (
          <div className="mt-8">
            <Link
              to="/dashboard"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
              Back to Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Success