import { initPayFastClient, PayFastService, setAuthTokenProvider } from '@ngelekanyo/payfast/client'
import { supabase } from './supabase'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://your-backend.com'
initPayFastClient(BACKEND_URL)

setAuthTokenProvider(async () => {
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token ?? null
})

export interface PaymentData {
  amount: string
  item_name: string
  item_description?: string
  name_first?: string
  name_last?: string
  email_address?: string
  m_payment_id: string
  subscription_type?: string
  billing_date?: string
  recurring_amount?: string
  frequency?: string
  cycles?: string
  subscription_notify_email?: string
  subscription_notify_buyer?: string
}

export interface PayFastResponse {
  paymentData: Record<string, string>
  payfastUrl: string
}

export interface PayFastActionResponse {
  data: {
    code: number
    status: string
    data?: {
      message?: string
    }
  }
}

export { PayFastService }
