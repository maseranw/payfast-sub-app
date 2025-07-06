import React, { useEffect, useState } from 'react'
import { XCircle, ArrowLeft, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const Cancel = () => {
  const { user, refreshUserData } = useAuth()
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'checking' | 'success' | 'cancelled' | 'pending' | 'failed'>('checking')
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 3

  const checkSubscriptionStatus = async () => {
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
          if (retryCount < maxRetries) {
            setTimeout(() => {
              setRetryCount((prev) => prev + 1)
              checkSubscriptionStatus()
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
    checkSubscriptionStatus()
  }, [user, searchParams])

  const handleRetry = () => {
    setRetryCount(0)
    setStatus('checking')
    checkSubscriptionStatus()
  }

  const renderContent = () => {
    switch (status) {
      case 'checking':
        return (
          <>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
              <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Checking Status...</h1>
            <p className="text-lg text-gray-600 mb-8">
              Hold on while we confirm your subscription status.
            </p>
          </>
        )

      case 'success':
        return (
          <>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Subscription Active</h1>
            <p className="text-lg text-gray-600 mb-8">
              Your payment actually went through successfully. You now have access to premium features.
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center px-6 py-3 rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition"
            >
              Go to Dashboard
              <ArrowLeft className="ml-2 h-5 w-5 rotate-180" />
            </Link>
          </>
        )

      case 'pending':
        return (
          <>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-6">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Processing...</h1>
            <p className="text-lg text-gray-600 mb-8">
              We’re still waiting for confirmation. Please wait a moment.
              {retryCount > 0 && ` (Attempt ${retryCount + 1}/${maxRetries + 1})`}
            </p>
          </>
        )

      default: // 'cancelled' or 'failed'
        return (
          <>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Cancelled</h1>
            <p className="text-lg text-gray-600 mb-8">
              Your payment was cancelled or did not complete. No charges were made.
            </p>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">What happened?</h2>
              <div className="text-left space-y-3">
                <div className="flex items-start">
                  <XCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                  <span className="text-gray-700">Payment process was interrupted or cancelled</span>
                </div>
                <div className="flex items-start">
                  <XCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                  <span className="text-gray-700">No charges were made to your account</span>
                </div>
                <div className="flex items-start">
                  <XCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                  <span className="text-gray-700">You can try subscribing again</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleRetry}
                className="inline-flex items-center px-6 py-3 rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition"
              >
                <RefreshCw className="mr-2 h-5 w-5" />
                Check Again
              </button>
              <Link
                to="/subscribe"
                className="inline-flex items-center px-6 py-3 text-white rounded-lg bg-gray-700 hover:bg-gray-800 transition"
              >
                Try Again
              </Link>
              <div>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center text-gray-600 hover:text-gray-900 transition"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </>
        )
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        {renderContent()}
      </div>
    </div>
  )
}

export default Cancel
