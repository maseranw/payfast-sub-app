import { useState } from 'react'
import { Sparkles, RefreshCw, Copy } from 'lucide-react'
import toast from 'react-hot-toast'

const EmojiBlast = () => {
  const [emojiBlast, setEmojiBlast] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const emojiSets = [
    ['🎉', '🎊', '🎈', '🎁', '🎀', '🎪', '🎭', '🎨'],
    ['🌟', '✨', '💫', '⭐', '🌠', '☄️', '🔥', '💥'],
    ['😀', '😁', '😊', '😍', '🥰', '😂', '🤣', '😋'],
    ['🦄', '🌈', '🦋', '🌺', '🌸', '🌻', '🌷', '🌹'],
    ['🚀', '🛸', '🌙', '🌍', '🌎', '🌏', '🪐', '🌌'],
    ['🎵', '🎶', '🎸', '🎹', '🎺', '🎻', '🥁', '🎤'],
    ['🍕', '🍔', '🍟', '🍿', '🎂', '🍰', '🧁', '🍭'],
    ['🏆', '🥇', '🎖️', '🏅', '👑', '💎', '💰', '🔑']
  ]

  const generateEmojiBlast = () => {
    setIsGenerating(true)
    
    setTimeout(() => {
      const randomSet = emojiSets[Math.floor(Math.random() * emojiSets.length)]
      const blastCount = Math.floor(Math.random() * 8) + 5 // 5-12 emojis
      let blast = ''
      
      for (let i = 0; i < blastCount; i++) {
        const randomEmoji = randomSet[Math.floor(Math.random() * randomSet.length)]
        blast += randomEmoji + ' '
      }
      
      setEmojiBlast(blast.trim())
      setIsGenerating(false)
    }, 500)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(emojiBlast)
      toast.success('Emoji blast copied to clipboard!')
    } catch (err) {
      toast.error('Failed to copy emojis')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-4">
        <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-3" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Emoji Blast</h3>
      </div>
      
      <div className="text-center">
        <button
          onClick={generateEmojiBlast}
          disabled={isGenerating}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5 mr-2" />
              Generate Emoji Blast
            </>
          )}
        </button>
        
        {emojiBlast && (
          <div className="mt-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
            <div className="text-4xl leading-relaxed mb-4 select-all">
              {emojiBlast}
            </div>
            <button
              onClick={handleCopy}
              className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-50 dark:hover:bg-gray-700 border border-purple-200 dark:border-purple-600 transition-colors"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Emojis
            </button>
          </div>
        )}
      </div>
      
      <div className="text-sm text-gray-600 text-center">
        <p className="text-gray-600 dark:text-gray-400">Click the button to generate a random emoji combination!</p>
      </div>
    </div>
  )
}

export default EmojiBlast