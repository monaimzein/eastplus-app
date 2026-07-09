'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Sparkles, X, Send, Bot, User } from 'lucide-react'
import { SITE } from '@/lib/siteConfig'
import { useI18n } from '@/lib/i18n/I18nProvider'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function SmartAssistant() {
  const { dir, locale } = useI18n()
  const [isOpenMenu, setIsOpenMenu] = useState(false)
  const [isOpenChat, setIsOpenChat] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const labelWhatsApp = locale === 'ar' ? 'تواصل واتساب' : 'WhatsApp'
  const labelAssistant = locale === 'ar' ? 'الدردشة الذكية' : 'AI Assistant'
  const positionClass = dir === 'rtl' ? 'left-5' : 'right-5'
  const alignmentClass = dir === 'rtl' ? 'items-start' : 'items-end'

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpenChat) {
      scrollToBottom()
    }
  }, [messages, isOpenChat])

  // Initialize with a welcome message if empty
  useEffect(() => {
    if (messages.length === 0) {
      const welcome =
        locale === 'ar'
          ? 'مرحباً بك في إيست بلس! أنا مساعدك الذكي هنا للإجابة على كافة استفساراتك حول خدمات التوريد، مواد البناء والسباكة والكهرباء، أو خدمات الصيانة والإنشاءات. كيف يمكنني خدمتك اليوم؟'
          : 'Welcome to EAST PLUS! I am your AI assistant here to answer all your questions about our supply services, construction materials, plumbing, electrical, or maintenance and project divisions. How can I help you today?'
      setMessages([{ role: 'assistant', content: welcome }])
    }
  }, [locale])

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return

    const userMsg = text.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }])
    setIsLoading(true)

    try {
      // Build message payload
      const chatHistory = [...messages, { role: 'user', content: userMsg }].map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory }),
      })

      if (!res.ok) {
        throw new Error('Failed to get response')
      }

      const data = await res.json()
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
    } catch (error) {
      console.error(error)
      const errorMsg =
        locale === 'ar'
          ? 'عذراً، واجهت مشكلة في الاتصال بالخادم. يرجى المحاولة مرة أخرى.'
          : 'Sorry, I encountered an issue connecting to the server. Please try again.'
      setMessages((prev) => [...prev, { role: 'assistant', content: errorMsg }])
    } finally {
      setIsLoading(false)
    }
  }

  const quickPrompts =
    locale === 'ar'
      ? [
          'ما هي خدمات التوريد لديكم؟',
          'كيف يمكنني طلب عرض سعر؟',
          'أريد تحميل بروفايل الشركة',
          'أريد التواصل مع المبيعات مباشرة',
        ]
      : [
          'What are your supply services?',
          'How can I request a quote?',
          'I want to download the company profile',
          'I want to contact sales directly',
        ]

  // Simple Markdown parsing helper for links and bullet points
  const formatMessageContent = (content: string) => {
    const lines = content.split('\n')
    return lines.map((line, i) => {
      // Bullet points
      if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
        const text = line.replace(/^[-*]\s*/, '')
        return (
          <li key={i} className="list-disc list-inside ms-2 my-1 text-[13.5px] leading-relaxed">
            {parseInlineStyles(text)}
          </li>
        )
      }
      return (
        <p key={i} className="my-1.5 text-[13.5px] leading-relaxed text-pretty">
          {parseInlineStyles(line)}
        </p>
      )
    })
  }

  // Parse bold and links in text
  const parseInlineStyles = (text: string) => {
    // Basic regex for markdown links: [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
    const boldRegex = /\*\*([^*]+)\*\*/g

    let formatted: React.ReactNode[] = []
    let lastIndex = 0
    let match

    // First replace links
    const tempText = text.replace(linkRegex, (m, label, url) => {
      return `##LINK##${label}##URL##${url}##END##`
    })

    // Now split and render
    const parts = tempText.split(/##LINK##|##URL##|##END##/)
    for (let j = 0; j < parts.length; j++) {
      if (j % 3 === 0) {
        // Normal text, check for bold
        const boldParts = parts[j].split(/\*\*([^*]+)\*\*/)
        for (let k = 0; k < boldParts.length; k++) {
          if (k % 2 === 1) {
            formatted.push(<strong key={`b-${j}-${k}`} className="font-bold text-[var(--gold)]">{boldParts[k]}</strong>)
          } else if (boldParts[k]) {
            formatted.push(boldParts[k])
          }
        }
      } else if (j % 3 === 1) {
        // Link label, URL is next
        const label = parts[j]
        const url = parts[j + 1]
        formatted.push(
          <a
            key={`l-${j}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--gold)] underline hover:text-[var(--gold-soft)] font-medium"
          >
            {label}
          </a>
        )
        j++ // Skip the URL part as we handled it
      }
    }

    return formatted.length > 0 ? formatted : text
  }

  return (
    <div className={`fixed bottom-6 ${positionClass} z-50 flex flex-col ${alignmentClass} gap-3`}>
      {/* 1. Chat Window */}
      <AnimatePresence>
        {isOpenChat && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="w-[calc(100vw-40px)] sm:w-[400px] h-[550px] max-h-[80vh] rounded-2xl glass border border-[var(--gold)]/20 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Chat Header */}
            <div className="px-5 py-4 border-b border-[var(--border)] bg-gradient-to-r from-[var(--surface-2)]/80 to-[var(--surface)]/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/30 flex items-center justify-center text-[var(--gold)]">
                  <Bot size={22} className="animate-float" />
                </div>
                <div className="text-start">
                  <h3 className="text-sm font-semibold text-[var(--fg)]">{labelAssistant}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] text-[var(--fg-muted)]">
                      {locale === 'ar' ? 'نشط الآن' : 'Active now'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpenChat(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-2)] transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => {
                const isAI = msg.role === 'assistant'
                return (
                  <div
                    key={index}
                    className={`flex ${isAI ? 'justify-start' : 'justify-end'} gap-2.5 items-start`}
                  >
                    {isAI && (
                      <div className="w-7 h-7 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/30 flex items-center justify-center text-[var(--gold)] shrink-0 mt-0.5">
                        <Bot size={14} />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-[13.5px] ${
                        isAI
                          ? 'bg-[var(--surface-2)]/80 border border-[var(--border)] text-[var(--fg)] rounded-ss-none'
                          : 'bg-[var(--gold)] text-[var(--primary-fg)] rounded-se-none font-medium shadow-md shadow-[var(--gold)]/10'
                      }`}
                    >
                      {formatMessageContent(msg.content)}
                    </div>
                  </div>
                )
              })}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex justify-start gap-2.5 items-start">
                  <div className="w-7 h-7 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/30 flex items-center justify-center text-[var(--gold)] shrink-0 mt-0.5">
                    <Bot size={14} />
                  </div>
                  <div className="bg-[var(--surface-2)]/80 border border-[var(--border)] rounded-2xl rounded-ss-none px-4 py-3 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions / Suggested chips */}
            {messages.length === 1 && !isLoading && (
              <div className="px-4 pb-2 pt-1 flex flex-wrap gap-1.5 justify-start max-h-[120px] overflow-y-auto">
                {quickPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(prompt)}
                    className="text-[11px] font-medium px-3 py-1.5 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--gold)] hover:border-[var(--gold)]/40 transition-all text-start"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Chat Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage(input)
              }}
              className="p-3 border-t border-[var(--border)] bg-[var(--surface)] flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={locale === 'ar' ? 'اكتب رسالتك هنا...' : 'Type your message...'}
                className="flex-1 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-3.5 py-2 text-xs focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]/20"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-9 h-9 rounded-xl bg-[var(--gold)] text-[var(--primary-fg)] flex items-center justify-center hover:bg-[var(--gold-soft)] disabled:opacity-40 disabled:hover:bg-[var(--gold)] transition-colors shrink-0 shadow-md shadow-[var(--gold)]/10"
                aria-label="Send"
              >
                <Send size={15} className={dir === 'rtl' ? 'rotate-180' : ''} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Floating Action Options Submenu */}
      <AnimatePresence>
        {isOpenMenu && !isOpenChat && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={`flex flex-col gap-2.5 ${alignmentClass}`}
          >
            {/* WhatsApp option */}
            <motion.a
              href={`https://wa.me/${SITE.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#25D366] text-white shadow-xl hover:bg-[#20ba59] transition-colors group cursor-pointer"
            >
              <MessageCircle size={18} />
              <span className="text-xs font-semibold">{labelWhatsApp}</span>
            </motion.a>

            {/* AI Assistant option */}
            <motion.button
              onClick={() => {
                setIsOpenChat(true)
                setIsOpenMenu(false)
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[var(--gold)] text-[var(--primary-fg)] shadow-xl hover:bg-[var(--gold-soft)] transition-colors group"
            >
              <Sparkles size={18} />
              <span className="text-xs font-semibold">{labelAssistant}</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Main Floating Button */}
      {!isOpenChat && (
        <motion.button
          onClick={() => setIsOpenMenu(!isOpenMenu)}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-14 h-14 rounded-full bg-[var(--gold)] text-[var(--primary-fg)] flex items-center justify-center shadow-2xl cursor-pointer"
          aria-label={labelAssistant}
        >
          {/* Pulsing ring animation */}
          <span className="absolute inset-0 rounded-full bg-[var(--gold)]/40 animate-ping-soft" />

          {/* Toggle between Sparkles/X */}
          <AnimatePresence mode="wait">
            {isOpenMenu ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center justify-center"
              >
                <Bot size={24} className="animate-float" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      )}
    </div>
  )
}
