import { useState } from 'react'
import { RotateCcw, Copy } from 'lucide-react'
import toast from 'react-hot-toast'

const ReverseText = () => {
  const [inputText, setInputText] = useState('')
  const [reversedText, setReversedText] = useState('')

  const handleReverse = () => {
    const reversed = inputText.split('').reverse().join('')
    setReversedText(reversed)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reversedText)
      toast.success('Reversed text copied to clipboard!')
    } catch (err) {
      toast.error('Failed to copy text')
    }
  }

  const handleClear = () => {
    setInputText('')
    setReversedText('')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-4">
        <RotateCcw className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Reverse Text</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="input-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Enter text to reverse:
          </label>
          <textarea
            id="input-text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            placeholder="Type your text here..."
          />
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={handleReverse}
            disabled={!inputText.trim()}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reverse
          </button>
          
          <button
            onClick={handleClear}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Clear
          </button>
        </div>
        
        {reversedText && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reversed text:
            </label>
            <div className="relative">
              <textarea
                value={reversedText}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                rows={3}
              />
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                title="Copy to clipboard"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReverseText