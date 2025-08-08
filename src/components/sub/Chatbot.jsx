import React, { useState, useEffect, useRef } from 'react';

const ChatBot = () => {
  const API_URL = 'https://db.store1920.com/wp-json/ai-chatbot/v1/chat';

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: '👋 Welcome! Ask about any product or category. 💡 Try: "شامبو", "serum", or "مرطب"',
    },
  ]);

  const chatEndRef = useRef(null);

  // Scroll chat to bottom on new messages
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  // Toggle chat open/close
  const toggleChat = () => {
    setOpen((prev) => !prev);
    if (!open) {
      setInput('');
      setMessages([
        {
          from: 'bot',
          text: '👋 Welcome! Ask about any product or category. 💡 Try: "شامبو", "serum", or "مرطب"',
        },
      ]);
      setLoading(false);
    }
  };

  // Send user message and get bot response
  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { from: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });
      if (!res.ok) throw new Error('Network error');

      const data = await res.json();

      // Handle error from backend
      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { from: 'bot', text: '❌ Oops! ' + data.error + '. Please try again later.' },
        ]);
        setLoading(false);
        return;
      }

      // If redirect intent from OpenAI fallback
      if (data.intent === 'redirect_category' && data.categorySlug) {
        setMessages((prev) => [
          ...prev,
          { from: 'bot', text: `Redirecting you to category: ${data.categorySlug}...` },
        ]);
        setTimeout(() => {
          window.location.href = `/product-category/${data.categorySlug}`;
        }, 1500);
        setLoading(false);
        return;
      }
      if (data.intent === 'redirect_product' && data.productSlug) {
        setMessages((prev) => [
          ...prev,
          { from: 'bot', text: `Redirecting you to product: ${data.productSlug}...` },
        ]);
        setTimeout(() => {
          window.location.href = `/product/${data.productSlug}`;
        }, 1500);
        setLoading(false);
        return;
      }

      // If products found
      if (data.products && data.products.length > 0) {
        setMessages((prev) => [
          ...prev,
          { from: 'bot', text: 'Here are some products matching your search:', products: data.products },
        ]);
      } else {
        // No products found
        setMessages((prev) => [
          ...prev,
          {
            from: 'bot',
            text:
              '❌ No matching products found. Try another keyword like "زيت", "كريم", or "مكياج".',
          },
        ]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          from: 'bot',
          text: '❌ Something went wrong. Please try again later.',
        },
      ]);
    }
    setLoading(false);
  };

  // Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !loading) {
      sendMessage();
    }
  };

  // Render product cards inside bot messages
  const renderProducts = (products) => (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 12,
        marginTop: 10,
        justifyContent: 'flex-start',
      }}
    >
      {products.map((p) => (
        <div
          key={p.id}
          onClick={() => window.open(p.url, '_blank')}
          title={p.name}
          style={{
            cursor: 'pointer',
            width: '48%',
            backgroundColor: '#fff3e0',
            borderRadius: 14,
            padding: 10,
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            userSelect: 'none',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          aria-label={`View product ${p.name}`}
        >
          {p.image ? (
            <img
              src={p.image}
              alt={p.name}
              loading="lazy"
              style={{ width: '100%', height: 100, objectFit: 'contain', borderRadius: 10 }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: 100,
                backgroundColor: '#ffd54f',
                borderRadius: 10,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#6d4c41',
                fontWeight: '600',
                fontSize: 14,
              }}
            >
              No Image
            </div>
          )}
          <div
            style={{
              marginTop: 8,
              color: '#ef6c00',
              fontWeight: '700',
              fontSize: 14,
              textAlign: 'center',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: '100%',
            }}
          >
            {p.name}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = p.url;
            }}
            style={{
              marginTop: 6,
              backgroundColor: '#ef6c00',
              color: '#fff',
              border: 'none',
              borderRadius: 20,
              padding: '6px 14px',
              fontSize: 13,
              cursor: 'pointer',
              width: '100%',
              fontWeight: '600',
            }}
            aria-label={`View ${p.name}`}
          >
            View Product
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={toggleChat}
        aria-label={open ? 'Close chat' : 'Open chat'}
        title={open ? 'Close chat' : 'Open chat'}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 60,
          height: 60,
          borderRadius: '50%',
          backgroundColor: '#ef6c00',
          border: 'none',
          color: 'white',
          fontSize: 30,
          cursor: 'pointer',
          boxShadow: '0 6px 14px rgba(239,108,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none',
          zIndex: 9999,
          transition: 'background-color 0.3s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#d35400')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ef6c00')}
      >
        {open ? '×' : '💬'}
      </button>

      {/* Chat Window */}
      {open && (
        <div
          role="region"
          aria-live="polite"
          style={{
            position: 'fixed',
            bottom: 90,
            right: 24,
            width: '90vw',
            maxWidth: 420,
            height: 520, // fixed height for all devices
            backgroundColor: 'white',
            borderRadius: 20,
            boxShadow: '0 14px 40px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            color: '#4e342e',
            zIndex: 9999,
          }}
        >
          {/* Messages container */}
          <div
            style={{
              flexGrow: 1,
              overflowY: 'auto',
              padding: 16,
              backgroundColor: '#fff8e1',
              borderRadius: '20px 20px 0 0',
              color: '#4e342e',
            }}
          >
            {messages.length === 0 && (
              <p style={{ textAlign: 'center', fontStyle: 'italic', color: '#a1887f' }}>
                Try typing product names, categories, or order numbers.
              </p>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: 14,
                  flexDirection: 'column',
                  alignItems: msg.from === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '75%',
                    backgroundColor: msg.from === 'user' ? '#ff8f00' : '#fff3e0',
                    color: msg.from === 'user' ? 'white' : '#5d4037',
                    padding: '14px 20px',
                    borderRadius: 25,
                    fontSize: 15,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    position: 'relative',
                  }}
                >
                  {msg.text}
                  {msg.products && renderProducts(msg.products)}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              backgroundColor: 'white',
              borderRadius: '0 0 20px 20px',
              boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.05)',
            }}
          >
            <input
              type="text"
              placeholder={loading ? 'Loading...' : 'Type your message...'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              autoFocus
              style={{
                flexGrow: 1,
                padding: '14px 20px',
                fontSize: 16,
                borderRadius: 9999,
                border: '1px solid #ffd54f',
                outline: 'none',
                marginRight: 14,
                transition: 'border-color 0.3s',
                color: '#4e342e',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#ffa000')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#ffd54f')}
              aria-label="Chat input"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              aria-label="Send message"
              title="Send message"
              style={{
                backgroundColor: loading || !input.trim() ? '#ffe082' : '#ffa000',
                color: '#4e342e',
                border: 'none',
                borderRadius: '50%',
                width: 46,
                height: 46,
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 3px 8px rgba(255,160,0,0.7)',
                transition: 'background-color 0.3s',
                userSelect: 'none',
                fontWeight: 'bold',
                fontSize: 20,
                userSelect: 'none',
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
