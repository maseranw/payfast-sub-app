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
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" strokeWidth={2} />
        <h3 className="text-xl font-extrabold tracking-tight text-neutral-950 dark:text-white">Emoji Blast</h3>
      </div>

      <div className="text-center">
        <button
          onClick={generateEmojiBlast}
          disabled={isGenerating}
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-wide bg-purple-600 dark:bg-purple-500 text-white hover:bg-purple-700 dark:hover:bg-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 hover:scale-105 active:scale-95 disabled:hover:scale-100"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" strokeWidth={2} />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" strokeWidth={2} />
              Generate Emoji Blast
            </>
          )}
        </button>

        {emojiBlast && (
          <div className="mt-6 p-6 bg-purple-600 animate-scale-in">
            <div className="text-4xl leading-relaxed mb-4 select-all">
              {emojiBlast}
            </div>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wide bg-white text-purple-700 hover:bg-purple-50 transition-all duration-150 hover:scale-105 active:scale-95"
            >
              <Copy className="h-4 w-4" strokeWidth={2} />
              Copy Emojis
            </button>
          </div>
        )}
      </div>

      <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center">
        Click the button to generate a random emoji combination!
      </p>
    </div>
  )
}

export default EmojiBlast
