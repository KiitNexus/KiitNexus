'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

// ── Config ─────────────────────────────────────────────────────────────────
const CHATBOT_API_URL = 'https://kiit-nexus-chatbot-final-2.onrender.com'

// ── Types ──────────────────────────────────────────────────────────────────
interface Message {
  id: string
  role: 'bot' | 'user'
  text: string
  time: string
}

// ── Helpers ────────────────────────────────────────────────────────────────
function getTime(): string {
  return new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

/**
 * SECURITY FIX: Sanitize user input to prevent XSS.
 * Strips HTML tags and limits length so malicious scripts can't be injected
 * via the chat input.
 */
function sanitizeInput(raw: string): string {
  return raw
    .replace(
      /[<>'"&]/g,
      (c) => ({ '<': '', '>': '', "'": '', '"': '', '&': '&amp;' })[c] ?? c,
    )
    .trim()
    .slice(0, 500) // max 500 chars
}

const QUICK_REPLIES = [
  'Join Nexus',
  'View Projects',
  'Meet the Team',
  'Contact',
]

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'bot',
    text: "Hey there 👋 I'm NexBot, your KIIT Nexus assistant! How can I help you today?",
    time: getTime(),
  },
]

/**
 * Calls the live KIIT Nexus Chatbot API instead of a local rule-based reply.
 * Assumed contract: POST /chat with { message: string } → JSON containing
 * one of "response" | "reply" | "answer" | "message" as the bot's text.
 * If the real API differs (check /docs on the deployed service), just
 * update the body key and the `data.response ?? ...` line below.
 */
async function getBotReply(input: string): Promise<string> {
  try {
    const res = await fetch(`${CHATBOT_API_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    })

    if (!res.ok) {
      throw new Error(`API responded with status ${res.status}`)
    }

    const data = await res.json()

    // Try common response field names so this keeps working even if the
    // API's exact key differs from our assumption.
    const reply = data?.response ?? data?.reply ?? data?.answer ?? data?.message

    if (typeof reply === 'string' && reply.trim()) {
      return reply
    }

    return "Hmm, I didn't quite get a proper reply from the server. Try again in a moment! 😊"
  } catch (err) {
    console.error('NexBot API error:', err)
    return "⚠️ I'm having trouble reaching the server right now (it might be waking up — first request can take up to a minute on Render's free tier). Please try again shortly!"
  }
}

// ── Bot Widget ─────────────────────────────────────────────────────────────
export default function Bot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [showBadge, setShowBadge] = useState(true)
  const [quickRepliesUsed, setQuickRepliesUsed] = useState(false)
  const [hovered, setHovered] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 300)
      setShowBadge(false)
      return () => clearTimeout(t)
    }
  }, [open])

  // Calls the live API now (async), shows typing indicator while waiting.
  const sendMessage = useCallback(async (raw: string) => {
    const text = sanitizeInput(raw)
    if (!text) return
    setQuickRepliesUsed(true)
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text,
      time: getTime(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setTyping(true)

    const replyText = await getBotReply(text)

    setTyping(false)
    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'bot',
      text: replyText,
      time: getTime(),
    }
    setMessages((prev) => [...prev, botMsg])
  }, [])

  return (
    <>
      {/* ── Keyframes injected once ── */}
      <style>{`
        @keyframes _bot_pulse {
          0%  { box-shadow: 0 0 0 0   rgba(255,194,14,0.5); }
          70% { box-shadow: 0 0 0 14px rgba(255,194,14,0);  }
          100%{ box-shadow: 0 0 0 0   rgba(255,194,14,0);  }
        }
        @keyframes _bot_slideIn {
          from { opacity:0; transform:scale(0.88) translateY(20px); }
          to   { opacity:1; transform:scale(1)    translateY(0);    }
        }
        @keyframes _msg_in {
          from { opacity:0; transform:translateY(8px); }
          to   { opacity:1; transform:translateY(0);   }
        }
        @keyframes _dot {
          0%,60%,100%{ transform:translateY(0);   opacity:0.4; }
          30%         { transform:translateY(-5px); opacity:1;   }
        }
        @keyframes _blink {
          0%,100%{ opacity:1;   }
          50%    { opacity:0.3; }
        }
        @keyframes _badgePop {
          from{ transform:scale(0); }
          to  { transform:scale(1); }
        }
        ._bot_win   { animation: _bot_slideIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards; }
        ._bot_pulse { animation: _bot_pulse 2.4s ease-in-out infinite; }
        ._msg_in    { animation: _msg_in 0.3s cubic-bezier(0.16,1,0.3,1) forwards; }
        ._dot1      { animation: _dot 1.2s ease-in-out infinite;       }
        ._dot2      { animation: _dot 1.2s ease-in-out 0.2s infinite;  }
        ._dot3      { animation: _dot 1.2s ease-in-out 0.4s infinite;  }
        ._blink     { animation: _blink 1.6s ease-in-out infinite;     }
        ._badge     { animation: _badgePop 0.3s cubic-bezier(0.34,1.56,0.64,1); }
        ._qr:hover  { background:#FFC20E !important; color:#000 !important; }
        ._inp:focus { border-color:rgba(255,194,14,0.35) !important;
                      background:rgba(255,255,255,0.07) !important; }
        ._send:hover:not(:disabled){ transform:scale(1.1);
                                     box-shadow:0 0 16px rgba(255,194,14,0.4); }
        ._send:disabled{ opacity:0.4; cursor:default; }
        ._scrollbar{ scrollbar-width:thin; scrollbar-color:rgba(255,194,14,0.15) transparent; }
        ._scrollbar::-webkit-scrollbar{ width:4px; }
        ._scrollbar::-webkit-scrollbar-thumb{ background:rgba(255,194,14,0.2); border-radius:4px; }
        @media(max-width:480px){
          ._bot_win{
            right:0 !important; bottom:0 !important;
            width:100vw !important; max-height:70vh !important;
            border-radius:18px 18px 0 0 !important;
          }
          ._bot_trigger{
            bottom:16px !important;
            right:16px !important;
          }
        }
      `}</style>

      {/* ── Chat Window ── */}
      {open && (
        <div
          className="_bot_win"
          role="dialog"
          aria-label="NexBot chat window"
          aria-modal="true"
          style={{
            position: 'fixed',
            bottom: '96px',
            right: '28px',
            zIndex: 9998,
            width: '360px',
            maxHeight: '540px',
            display: 'flex',
            flexDirection: 'column',
            background: '#0a0a0a',
            border: '1px solid rgba(255,194,14,0.2)',
            borderRadius: '18px',
            overflow: 'hidden',
            boxShadow:
              '0 0 0 1px rgba(255,255,255,0.04),0 24px 60px rgba(0,0,0,0.7),0 0 80px rgba(255,194,14,0.06)',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px 18px',
              background:
                'linear-gradient(135deg,rgba(255,194,14,0.08) 0%,transparent 100%)',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: '#FFC20E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                flexShrink: 0,
              }}
              aria-hidden="true"
            >
              🤖
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#fff',
                  letterSpacing: '0.06em',
                  fontFamily: 'monospace',
                  textTransform: 'uppercase',
                }}
              >
                NexBot
              </div>
              <div
                style={{
                  fontSize: '10px',
                  color: '#22c55e',
                  fontFamily: 'monospace',
                  letterSpacing: '0.08em',
                  marginTop: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <span
                  className="_blink"
                  style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    background: '#22c55e',
                    display: 'inline-block',
                  }}
                  aria-hidden="true"
                />
                Online
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.04)',
                color: 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div
            className="_scrollbar"
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '18px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
            role="log"
            aria-live="polite"
            aria-label="Chat messages"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="_msg_in"
                style={{
                  display: 'flex',
                  flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                  gap: '8px',
                  alignItems: 'flex-end',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background:
                      msg.role === 'bot'
                        ? 'rgba(255,194,14,0.12)'
                        : 'rgba(255,255,255,0.08)',
                    border:
                      msg.role === 'bot'
                        ? '1px solid rgba(255,194,14,0.2)'
                        : '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                >
                  {msg.role === 'bot' ? '🤖' : '👤'}
                </div>
                <div style={{ maxWidth: '76%' }}>
                  <div
                    style={{
                      padding: '10px 13px',
                      borderRadius: '14px',
                      fontSize: '13px',
                      lineHeight: 1.55,
                      fontFamily: 'Arial,Helvetica,sans-serif',
                      ...(msg.role === 'bot'
                        ? {
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.07)',
                            borderBottomLeftRadius: '4px',
                            color: 'rgba(255,255,255,0.88)',
                          }
                        : {
                            background: '#FFC20E',
                            color: '#000',
                            fontWeight: 500,
                            borderBottomRightRadius: '4px',
                          }),
                    }}
                  >
                    {/* SECURITY: render as text, not HTML — prevents XSS */}
                    {msg.text}
                  </div>
                  <div
                    style={{
                      fontSize: '9px',
                      fontFamily: 'monospace',
                      color: 'rgba(255,255,255,0.2)',
                      marginTop: '4px',
                      letterSpacing: '0.05em',
                      textAlign: msg.role === 'user' ? 'right' : 'left',
                    }}
                    aria-hidden="true"
                  >
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}

            {/* Quick Replies */}
            {!quickRepliesUsed && messages.length === 1 && (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px',
                  marginTop: '4px',
                }}
              >
                {QUICK_REPLIES.map((qr) => (
                  <button
                    key={qr}
                    className="_qr"
                    onClick={() => sendMessage(qr)}
                    style={{
                      padding: '5px 11px',
                      border: '1px solid rgba(255,194,14,0.3)',
                      borderRadius: '100px',
                      background: 'transparent',
                      color: '#FFC20E',
                      fontSize: '11px',
                      fontFamily: 'monospace',
                      letterSpacing: '0.05em',
                      cursor: 'pointer',
                      transition: 'background 0.2s,color 0.2s',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {qr}
                  </button>
                ))}
              </div>
            )}

            {/* Typing Indicator */}
            {typing && (
              <div
                style={{ display: 'flex', gap: '8px' }}
                aria-label="NexBot is typing"
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'rgba(255,194,14,0.12)',
                    border: '1px solid rgba(255,194,14,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    flexShrink: 0,
                    alignSelf: 'flex-end',
                  }}
                  aria-hidden="true"
                >
                  🤖
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '10px 13px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '14px',
                    borderBottomLeftRadius: '4px',
                  }}
                >
                  {(['_dot1', '_dot2', '_dot3'] as const).map((cls) => (
                    <span
                      key={cls}
                      className={cls}
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: 'rgba(255,194,14,0.6)',
                        display: 'inline-block',
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 14px',
              borderTop: '1px solid rgba(255,255,255,0.05)',
              background: 'rgba(0,0,0,0.3)',
              flexShrink: 0,
            }}
          >
            <input
              ref={inputRef}
              className="_inp"
              value={input}
              onChange={(e) => setInput(e.target.value.slice(0, 500))} // hard cap at 500
              onKeyDown={(e) =>
                e.key === 'Enter' && !e.shiftKey && sendMessage(input)
              }
              placeholder="Ask me anything..."
              maxLength={500}
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              aria-label="Type a message"
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '100px',
                padding: '9px 15px',
                fontSize: '13px',
                fontFamily: 'Arial,Helvetica,sans-serif',
                color: 'rgba(255,255,255,0.85)',
                outline: 'none',
                transition: 'border-color 0.2s,background 0.2s',
                caretColor: '#FFC20E',
              }}
            />
            <button
              className="_send"
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || typing}
              aria-label="Send message"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#FFC20E',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'transform 0.18s,box-shadow 0.18s',
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{ width: '15px', height: '15px', color: '#000' }}
                aria-hidden="true"
              >
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>

          {/* Footer */}
          <div
            style={{
              textAlign: 'center',
              fontSize: '9px',
              fontFamily: 'monospace',
              color: 'rgba(255,255,255,0.12)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '0 14px 10px',
              flexShrink: 0,
            }}
          >
            Powered by KIIT Nexus
          </div>
        </div>
      )}

      {/* ── Trigger Button ── */}
      <button
        className={`_bot_trigger${open ? '' : ' _bot_pulse'}`}
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label={open ? 'Close chat' : 'Open NexBot chat'}
        aria-expanded={open}
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '28px',
          zIndex: 9999,
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: '#FFC20E',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: hovered ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.22s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        {/* Badge */}
        {showBadge && !open && (
          <span
            className="_badge"
            aria-label="1 unread message"
            style={{
              position: 'absolute',
              top: '-3px',
              right: '-3px',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: '#ef4444',
              border: '2px solid #000',
              fontSize: '9px',
              fontWeight: 800,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'monospace',
            }}
          >
            1
          </span>
        )}

        {open ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            style={{ width: '22px', height: '22px', color: '#000' }}
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ width: '24px', height: '24px', color: '#000' }}
            aria-hidden="true"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>
    </>
  )
}
