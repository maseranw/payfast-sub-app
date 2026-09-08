import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { Send, Mail, MessageSquare, User, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const Contact = () => {
  const { user, userProfile } = useAuth()
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    priority: 'medium'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !userProfile) {
      toast.error('Please sign in to send a message')
      return
    }

    if (!formData.subject.trim() || !formData.message.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          user_id: user.id,
          subject: formData.subject.trim(),
          message: formData.message.trim(),
          priority: formData.priority,
          user_email: user.email,
          user_name: `${userProfile.first_name} ${userProfile.last_name}`
        })

      if (error) throw error

      setIsSubmitted(true)
      setFormData({ subject: '', message: '', priority: 'medium' })
      toast.success('Message sent successfully! We\'ll get back to you soon.')
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24">
        <div className="text-center animate-fade-in-up">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-600 mb-8 animate-scale-in">
            <CheckCircle className="h-8 w-8 text-white" strokeWidth={2} />
          </div>

          <h1 className="text-4xl font-black tracking-tighter text-neutral-950 dark:text-white mb-4">
            Message Sent Successfully!
          </h1>

          <p className="text-lg text-neutral-500 dark:text-neutral-400 mb-10">
            Thank you for contacting us. We've received your message and will get back to you within 24 hours.
          </p>

          <div className="bg-neutral-50 dark:bg-neutral-950 shadow-xl shadow-neutral-200/50 dark:shadow-none p-8 mb-10 text-left">
            <h2 className="text-lg font-extrabold tracking-tight text-neutral-950 dark:text-white mb-5">
              What happens next?
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" strokeWidth={2} />
                <span className="text-neutral-600 dark:text-neutral-300">Our support team will review your message</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" strokeWidth={2} />
                <span className="text-neutral-600 dark:text-neutral-300">You'll receive a response via email</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" strokeWidth={2} />
                <span className="text-neutral-600 dark:text-neutral-300">Typical response time is under 24 hours</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsSubmitted(false)}
            className="inline-flex items-center px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-wide text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-400 transition-all duration-150 hover:scale-105 active:scale-95"
          >
            Send Another Message
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-10 py-14">
      <div className="mb-14 animate-fade-in-up">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3">
          Support
        </p>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-neutral-950 dark:text-white mb-3">
          Contact Us
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Have a question or need help? We're here to assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 animate-fade-in-up animate-delay-100">
          <div className="bg-neutral-50 dark:bg-neutral-950 shadow-xl shadow-neutral-200/50 dark:shadow-none p-8">
            <h2 className="text-lg font-extrabold tracking-tight text-neutral-950 dark:text-white mb-8">Get in Touch</h2>

            <div className="space-y-7">
              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1 shrink-0" strokeWidth={2} />
                <div>
                  <h3 className="font-bold text-neutral-950 dark:text-white">Email Support</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                    Get help with your account, billing, or technical issues.
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-2 font-semibold">support@subapp.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-400 mt-1 shrink-0" strokeWidth={2} />
                <div>
                  <h3 className="font-bold text-neutral-950 dark:text-white">Live Chat</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                    Chat with our support team in real-time.
                  </p>
                  <p className="text-sm text-purple-600 dark:text-purple-400 mt-2 font-semibold">Available 9 AM - 6 PM EST</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <User className="h-6 w-6 text-green-600 dark:text-green-400 mt-1 shrink-0" strokeWidth={2} />
                <div>
                  <h3 className="font-bold text-neutral-950 dark:text-white">Account Manager</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                    For enterprise customers and custom solutions.
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-2 font-semibold">enterprise@subapp.com</p>
                </div>
              </div>
            </div>

            <div className="mt-10 p-5 bg-blue-600">
              <h4 className="font-bold text-white mb-2 text-sm uppercase tracking-wide">Quick Response</h4>
              <p className="text-blue-50 text-sm">
                We typically respond to all inquiries within 24 hours. For urgent issues, please mark your message as high priority.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 animate-fade-in-up animate-delay-200">
          <div className="bg-neutral-50 dark:bg-neutral-950 shadow-xl shadow-neutral-200/50 dark:shadow-none p-8 sm:p-10">
            <h2 className="text-lg font-extrabold tracking-tight text-neutral-950 dark:text-white mb-8">Send us a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : ''}
                    disabled
                    className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400 transition-colors duration-150"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400 transition-colors duration-150"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="subject" className="block text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white dark:bg-black text-neutral-950 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-950 dark:focus:ring-white transition-colors duration-150"
                    placeholder="Brief description of your inquiry"
                  />
                </div>
                <div>
                  <label htmlFor="priority" className="block text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-2">
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white dark:bg-black text-neutral-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-950 dark:focus:ring-white transition-colors duration-150"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-white dark:bg-black text-neutral-950 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-950 dark:focus:ring-white transition-colors duration-150 resize-none"
                  placeholder="Please provide as much detail as possible about your inquiry..."
                />
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-widest font-bold">
                  * Required fields
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-wide text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-400 transition-all duration-150 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" strokeWidth={2} />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
