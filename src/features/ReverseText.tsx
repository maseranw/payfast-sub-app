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
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <RotateCcw className="h-6 w-6 text-blue-600 dark:text-blue-400" strokeWidth={2} />
        <h3 className="text-xl font-extrabold tracking-tight text-neutral-950 dark:text-white">Reverse Text</h3>
      </div>

      <div className="space-y-5">
        <div>
          <label htmlFor="input-text" className="block text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-2">
            Enter text to reverse
          </label>
          <textarea
            id="input-text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-900 text-neutral-950 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-950 dark:focus:ring-white transition-colors duration-150 resize-none"
            rows={3}
            placeholder="Type your text here..."
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleReverse}
            disabled={!inputText.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wide bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 hover:scale-105 active:scale-95 disabled:hover:scale-100"
          >
            <RotateCcw className="h-4 w-4" strokeWidth={2} />
            Reverse
          </button>

          <button
            onClick={handleClear}
            className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wide bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all duration-150 hover:scale-105 active:scale-95"
          >
            Clear
          </button>
        </div>

        {reversedText && (
          <div className="pt-1 animate-fade-in-up">
            <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-2">
              Reversed text
            </label>
            <div className="relative">
              <textarea
                value={reversedText}
                readOnly
                className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-900 text-neutral-950 dark:text-white resize-none"
                rows={3}
              />
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-1.5 rounded-full text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors duration-150"
                title="Copy to clipboard"
              >
                <Copy className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReverseText
