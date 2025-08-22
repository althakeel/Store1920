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
    id: 'eligibility',
    title: '1. Return Window & Eligibility',
    content: (
      <>
        <p>
          Almost all items purchased on Store1920 are eligible for return within <strong>7 days</strong> from the date of purchase for a full refund. 
          There are exceptions for health, safety, or hygiene reasons:
        </p>
        <ul>
          <li>Used or damaged personal items (e.g., worn clothing, lingerie without tags/seals).</li>
          <li>Perishable or personal care items (food, groceries, opened cosmetics/skincare, sanitary products).</li>
          <li>Custom or made-to-order products (e.g., engraved items).</li>
          <li>Underwear & swimwear (if hygiene liners are removed).</li>
          <li>Free gifts or promotional items.</li>
        </ul>
        <p>
          <strong>Electronics:</strong> Most electronics have a 90-day window, though some may be shorter (45–60 days). 
          Electronics also come with manufacturer warranties and consumer law protection.
        </p>
      </>
    ),
  },
  {
    id: 'how-to-return',
    title: '2. How to Initiate a Return',
    content: (
      <>
        <ol>
          <li>Log in to your Store1920 account → “Your Orders” → click “Return/Refund”.</li>
          <li>If you checked out as guest, use the link in your confirmation email.</li>
          <li>Select item(s) & reason for return. Upload a photo if requested.</li>
          <li>Receive a prepaid return shipping label (or QR code).</li>
          <li>Pack securely, attach label, and hand over to courier/drop-off point.</li>
        </ol>
        <p>The first return per order is <strong>free</strong>. Later returns from the same order may incur a fee.</p>
      </>
    ),
  },
  {
    id: 'shipping',
    title: '3. Return Shipping Costs',
    content: (
      <>
        <p>
          The first return per order is <strong>free</strong>. If you return additional items later from the same order, 
          a return shipping fee may be deducted from your refund.
        </p>
        <p>
          Oversized/heavy items or remote locations may require special arrangements. 
          If you pay for return shipping due to our or seller’s fault, we reimburse reasonable costs.
        </p>
      </>
    ),
  },
  {
    id: 'refund-process',
    title: '4. Refund Process & Methods',
    content: (
      <>
        <p>Once your return arrives and passes inspection, refunds are processed as follows:</p>
        <ul>
          <li><strong>Original Payment Method:</strong> 5–14 business days (up to 30 for some banks).</li>
          <li><strong>Cash on Delivery:</strong> Refunded via bank transfer or Store1920 credits.</li>
          <li><strong>Store1920 Credits:</strong> Instant after check-in (can be used for future orders).</li>
        </ul>
        <p>
          In some cases, we may issue an <strong>Instant/Advanced Refund</strong> before the return arrives, 
          especially for loyal customers or obvious defects.
        </p>
      </>
    ),
  },
  {
    id: 'refund-amounts',
    title: '5. Refund Amounts',
    content: (
      <>
        <p>
          If the return is due to our/seller’s fault (wrong/defective item), you’ll receive a full refund including shipping.  
          If due to buyer’s remorse, original shipping fees may not be refunded.
        </p>
        <p>
          Items returned used/damaged beyond normal inspection may be refunded partially.  
          We assess fairly and notify you if a deduction applies.
        </p>
      </>
    ),
  },
  {
    id: 'non-delivery',
    title: '6. Non-Delivery & Missing Items',
    content: (
      <>
        <p>
          If your order shows “delivered” but you didn’t receive it, or if items are missing from the package, 
          contact us. We’ll investigate and either resend or refund after verification.
        </p>
      </>
    ),
  },
  {
    id: 'exchange',
    title: '7. Exchange Policy',
    content: (
      <>
        <p>
          Currently, exchanges are processed as return-and-reorder.  
          Return the item for a refund, then place a new order for the size/color you want.
        </p>
      </>
    ),
  },
  {
    id: 'important-notices',
    title: '8. Important Notices',
    content: (
      <>
        <ul>
          <li>Always use the return label provided — not the manufacturer/original sender’s address.</li>
          <li>Do not include unrelated/personal items in your return package.</li>
          <li>Contact support if you face issues; we can assist or liaise with sellers.</li>
          <li>Policy abuse (excessive returns of used items) may result in refusal or restocking fees.</li>
        </ul>
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
  // Immediately highlight in sidebar
 setActiveSection(id);
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
    <h2
      style={{
        ...styles.heading,
        textDecoration: activeSection === id ? 'underline' : 'none',
        textDecorationColor: '#FF6600',
        textDecorationThickness: '2px',
      }}
    >
      {title}
    </h2>
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
