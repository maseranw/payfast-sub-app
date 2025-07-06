import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

interface UserProfile {
  id: string
  first_name: string
  last_name: string
  avatar_url: string | null
  phone: string | null
  created_at: string
}

interface SubscriptionPlan {
  id: string
  name: string
  price: number
  currency: string
  billing_cycle: string
  features: string[]
}

interface Subscription {
  id: string
  user_id: string
  plan_id: string
  status: string
  payfast_token: string | null
  payfast_subscription_id: string | null
  cancel_at_period_end: boolean
  current_period_start: string
  current_period_end: string
  created_at: string
  updated_at: string
  plan?: SubscriptionPlan
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  subscription: Subscription | null
  allowedFeatures: string[]
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>
  signOut: () => Promise<void>
  refreshUserData: () => Promise<void>
  hasFeature: (featureKey: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [allowedFeatures, setAllowedFeatures] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }

    return data
  }

  const fetchUserSubscription = async (userId: string) => {
    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        plan:subscription_plans(*)
      `)
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle()

    if (error) {
      console.error('Error fetching subscription:', error)
      return null
    }

    return data
  }

  const fetchAllowedFeatures = async (planId: string) => {
    const { data, error } = await supabase
      .from('plan_features')
      .select(`
        feature:subscription_features(feature_key)
      `)
      .eq('plan_id', planId)

    if (error) {
      console.error('Error fetching allowed features:', error)
      return []
    }

    return data.map(item => item.feature[0]?.feature_key)
  }

  const refreshUserData = async () => {
    if (!user) return

    try {
      const [profile, sub] = await Promise.all([
        fetchUserProfile(user.id),
        fetchUserSubscription(user.id)
      ])

      setUserProfile(profile)
      setSubscription(sub)

      if (sub?.plan_id) {
        const features = await fetchAllowedFeatures(sub.plan_id)
        setAllowedFeatures(features)
      } else {
        setAllowedFeatures([])
      }
    } catch (error) {
      console.error('Error refreshing user data:', error)
    }
  }

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
        
        if (session?.user) {
          await refreshUserData()
        } else {
          setUserProfile(null)
          setSubscription(null)
          setAllowedFeatures([])
        }
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  useEffect(() => {
    if (user) {
      refreshUserData()
    }
  }, [user])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast.error(error.message)
      throw error
    }
    toast.success('Successfully signed in!')
  }

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      toast.error(error.message)
      throw error
    }

    if (data.user) {
      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([
          {
            id: data.user.id,
            first_name: firstName,
            last_name: lastName,
          }
        ])

      if (profileError) {
        console.error('Error creating user profile:', profileError)
        toast.error('Failed to create user profile')
        throw profileError
      }

      toast.success('Successfully signed up!')
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error(error.message)
      throw error
    }
    toast.success('Successfully signed out!')
  }

  const hasFeature = (featureKey: string) => {
    return allowedFeatures.includes(featureKey)
  }

  const value: AuthContextType = {
    user,
    userProfile,
    subscription,
    allowedFeatures,
    loading,
    signIn,
    signUp,
    signOut,
    refreshUserData,
    hasFeature
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}