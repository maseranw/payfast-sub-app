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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mb-6">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Message Sent Successfully!
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Thank you for contacting us. We've received your message and will get back to you within 24 hours.
          </p>
          
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              What happens next?
            </h2>
            <div className="text-left space-y-3">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">Our support team will review your message</span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">You'll receive a response via email</span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">Typical response time is under 24 hours</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setIsSubmitted(false)}
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            Send Another Message
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Contact Us
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Have a question or need help? We're here to assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="lg:col-span-1">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Get in Touch</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-4 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Email Support</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Get help with your account, billing, or technical issues.
                  </p>
                  <p className="text-blue-600 dark:text-blue-400 text-sm mt-2">support@subapp.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-4 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Live Chat</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Chat with our support team in real-time.
                  </p>
                  <p className="text-purple-600 dark:text-purple-400 text-sm mt-2">Available 9 AM - 6 PM EST</p>
                </div>
              </div>

              <div className="flex items-start">
                <User className="h-6 w-6 text-green-600 dark:text-green-400 mr-4 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Account Manager</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    For enterprise customers and custom solutions.
                  </p>
                  <p className="text-green-600 dark:text-green-400 text-sm mt-2">enterprise@subapp.com</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Quick Response</h4>
              <p className="text-blue-800 dark:text-blue-400 text-sm">
                We typically respond to all inquiries within 24 hours. For urgent issues, please mark your message as high priority.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : ''}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Brief description of your inquiry"
                  />
                </div>
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Please provide as much detail as possible about your inquiry..."
                />
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  * Required fields
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
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