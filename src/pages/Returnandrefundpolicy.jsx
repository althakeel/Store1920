import React, { useEffect, useRef, useState } from 'react';

// Inject Montserrat font
const injectFont = () => {
  if (!document.getElementById('montserrat-font')) {
    const link = document.createElement('link');
    link.id = 'montserrat-font';
    link.href =
      'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
};

const sections = [
  {
    id: 'how-to-return',
    title: '1. How do I make a return?',
    content: (
      <>
        <p>You can make a return by following these steps:</p>
        <ol>
          <li>Open the Store1920 app or website.</li>
          <li>Go to "Your Orders" and click "Return / Refund".</li>
          <li>Select item(s), reason, and return method.</li>
          <li>Download the return label and attach it to the package.</li>
          <li>Schedule a pickup or drop off at the return center.</li>
        </ol>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod massa ac justo vehicula,
          vitae blandit nulla fermentum. Curabitur vulputate lorem at enim fermentum, sed tincidunt justo
          pulvinar.
        </p>
      </>
    ),
  },
  {
    id: 'free-shipping',
    title: '2. Is the return shipping free?',
    content: (
      <>
        <p>
          Yes, return shipping is free for most items within the return window. You'll receive a prepaid
          label when you initiate the return.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus magnam molestiae hic nulla!
        </p>
      </>
    ),
  },
  {
    id: 'return-window',
    title: '3. How long do I have before making a return?',
    content: (
      <>
        <p>
          You usually have <strong>90 days</strong> from the date of purchase to request a return.
        </p>
        <p>Items must be in their original condition, unused, and with all packaging included.</p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras gravida mi non orci egestas,
          id blandit quam tincidunt.
        </p>
      </>
    ),
  },
  {
    id: 'refunds',
    title: '4. Refunds',
    content: (
      <>
        <ul>
          <li>Refunds can go back to your original payment method or Store1920 credit.</li>
          <li>Store1920 credit is refunded instantly after approval.</li>
          <li>Card/Bank refunds may take up to 14 business days.</li>
        </ul>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores, numquam! Fugiat eaque totam
          aperiam recusandae?
        </p>
      </>
    ),
  },
  {
    id: 'refund-timeline',
    title: '5. Refund timeline',
    content: (
      <>
        <ul>
          <li><strong>Store1920 credit:</strong> Instant</li>
          <li><strong>PayPal / Apple Pay:</strong> 1–5 business days</li>
          <li><strong>Debit/Credit Card:</strong> 5–14 business days</li>
        </ul>
        <p>
          Proin viverra mi a eros porta, in finibus sapien porttitor. Suspendisse potenti. Cras a nulla a
          libero malesuada laoreet.
        </p>
      </>
    ),
  },
  {
    id: 'important-notice',
    title: '6. Important Notice',
    content: (
      <>
        <p>
          ❗ Please do not use the original sender address for returns. Always use the label provided.
        </p>
        <p>Items sent by mistake or damaged returns may not be refunded. Contact support for assistance.</p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vero nobis quae molestiae! Quibusdam
          itaque velit consequatur!
        </p>
      </>
    ),
  },
];

// CSS styles for hiding scrollbar on Webkit and Firefox
const hideScrollbar = {
  scrollbarWidth: 'none', // Firefox
  msOverflowStyle: 'none', // IE 10+
};

const hideScrollbarWebkit = {
  '&::-webkit-scrollbar': {
    display: 'none', // Safari and Chrome
  },
};

const styles = {
  layout: {
    display: 'flex',
    fontFamily: "'Montserrat', sans-serif",
    maxWidth: '1400px',
    margin: '0 auto',
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  sidebar: {
    width: '280px',
    padding: '40px 25px',
    borderRight: '1px solid #eee',
    position: 'sticky',
    top: 0,
    height: '100vh',
    overflowY: 'auto',
    ...hideScrollbar,
    // To hide scrollbars on Webkit browsers (Chrome, Safari)
    scrollbarWidth: 'none',
  },
  sidebarItem: (active) => ({
    padding: '14px 0',
    cursor: 'pointer',
    borderLeft: active ? '4px solid #FF6600' : '4px solid transparent',
    paddingLeft: '14px',
    fontWeight: active ? '600' : '500',
    color: active ? '#FF6600' : '#333',
    fontSize: '15px',
    transition: 'all 0.3s ease',
    userSelect: 'none',
  }),
  contentWrapper: {
    flex: 1,
    padding: '40px 60px',
    overflowY: 'auto',
    scrollBehavior: 'smooth',
    ...hideScrollbar,
  },
  section: {
    marginBottom: '80px',
    scrollMarginTop: '100px',
  },
  heading: {
    fontSize: '22px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#222',
  },
  text: {
    fontSize: '15px',
    lineHeight: 1.7,
    color: '#444',
  },
};

const ReturnPolicyPage = () => {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const contentRef = useRef(null);

  useEffect(() => {
    injectFont();

    if (!contentRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: contentRef.current,
        rootMargin: '-50px 0px -60% 0px',
        threshold: 0.1,
      }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el && contentRef.current) {
      contentRef.current.scrollTo({
        top: el.offsetTop - 20,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div style={styles.layout}>
      {/* Sidebar */}
      <aside
        style={{
          ...styles.sidebar,
          // Hide scrollbar on Webkit browsers by inline style trick:
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          // Need to use global CSS or inject style tag for ::-webkit-scrollbar to hide scrollbar on Chrome/Safari
        }}
        className="hide-scrollbar"
      >
        {sections.map(({ id, title }) => (
          <div
            key={id}
            onClick={() => scrollToSection(id)}
            style={styles.sidebarItem(activeSection === id)}
          >
            {title}
          </div>
        ))}
      </aside>

      {/* Content */}
      <main
        style={{
          ...styles.contentWrapper,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        ref={contentRef}
        className="hide-scrollbar"
      >
        {sections.map(({ id, title, content }) => (
          <section key={id} id={id} style={styles.section}>
            <h2 style={styles.heading}>{title}</h2>
            <div style={styles.text}>{content}</div>
          </section>
        ))}
      </main>

      {/* Inline style to hide scrollbars on Webkit browsers */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
          width: 0 !important;
          height: 0 !important;
        }
      `}</style>
    </div>
  );
};

export default ReturnPolicyPage;
