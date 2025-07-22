import React, { useRef } from 'react';

const sections = [
  { id: 'intro', title: 'Introduction' },
  { id: 'dataCollection', title: 'What Information We Collect' },
  { id: 'usage', title: 'How and Why We Use Your Information' },
  { id: 'sharing', title: 'How and Why We Share Your Information' },
  { id: 'rights', title: 'Your Rights and Choices' },
  { id: 'children', title: 'Children' },
  { id: 'security', title: 'Data Security and Retention' },
  { id: 'changes', title: 'Changes to the Privacy Policy' },
  { id: 'contact', title: 'Contact Us' },
];

const PrivacyPolicy = () => {
  const refs = useRef({});

  return (
    <div className="pp-container">
      <main className="pp-content">
        {sections.map(({ id, title }) => (
          <section
            key={id}
            id={id}
            ref={(el) => (refs.current[id] = el)}
            className="pp-section"
            tabIndex={-1}
            aria-labelledby={`${id}-heading`}
          >
            <h2 id={`${id}-heading`} className="pp-section-title">
              {title}
            </h2>
            <SectionContent id={id} />
          </section>
        ))}
      </main>

      <style>{`
        .pp-container {
          max-width: 1400px;
          margin: 40px auto;
          padding: 0 10px;
          font-family: 'Montserrat', sans-serif;
          color: #222;
          background: transparent;
        }

        .pp-content {
          width: 100%;
          line-height: 1.65;
          font-size: 14px;
          color: #333;
          background: transparent;
          padding: 0; /* no extra padding */
        }

        .pp-section {
          margin-bottom: 60px;
          scroll-margin-top: 120px;
          outline: none;
        }

        .pp-section-title {
          font-size: 18px;
          margin-bottom: 24px;
          border-bottom: 3px solid #eee;
          padding-bottom: 10px;
          font-weight: 700;
          color: #222;
        }

        h3 {
          font-size: 20px;
          margin-top: 30px;
          margin-bottom: 12px;
          font-weight: 600;
          color: #444;
        }

        ul {
          margin-left: 1.4rem;
          margin-bottom: 24px;
          color: #555;
        }

        a {
          color: #e60023;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }

        @media (max-width: 600px) {
          .pp-content {
            font-size: 16px;
          }
          .pp-section-title {
            font-size: 24px;
            margin-bottom: 18px;
          }
          h3 {
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  );
};

const SectionContent = ({ id }) => {
  switch (id) {
    case 'intro':
      return (
        <>
          <p>
            This Privacy Policy describes how, Whaleco Technology Limited, an Irish company ("Store1920", "we", "us" or "our") handles personal information that we collect through our digital properties that link to this Privacy Policy, including our website (www.Store1920.com), Store1920's mobile application (collectively, the "Service"), and other activities as described in this Privacy Policy. At Store1920, we care deeply about privacy and strive to be transparent about our privacy practices, including how we treat your personal information. This Privacy Policy explains how we collect, use, share, and otherwise process the personal information of users in connection with our Service.
          </p>
          <p><em>Last updated: May 28, 2025</em></p>
        </>
      );
    case 'dataCollection':
      return (
        <>
          <p>
            In the course of providing and improving our products and services, we collect your personal information for the purposes described in this Privacy Policy. The following are the types of personal information that we collect:
          </p>
          <h3>Information that you provide</h3>
          <p>
            When you create an account, place an order at checkout, contact us directly, or otherwise use the Service, you may provide some or all of the following information:
          </p>
          <ul>
            <li><strong>Account and profile:</strong> Your mobile phone number or email address used as login credentials, profile photo, username, account settings, and preferences.</li>
            <li><strong>Purchases:</strong> Data related to your order (transaction history), payment information (e.g., payment card number or third-party payment info), shipping address, and recipient contact information.</li>
            <li><strong>Customer support activity:</strong> Communication history with our customer service team to improve support.</li>
            <li><strong>Information when you contact us:</strong> Reports, feedback, or inquiries you send.</li>
            <li><strong>Chats with merchandise partners:</strong> Chat communications and related info when chatting with merchandise partners.</li>
            <li><strong>User-generated content:</strong> Product reviews, ratings, images, videos, text, and associated metadata.</li>
            <li><strong>Promotion and event participation:</strong> Information you share when participating in contests, sweepstakes, promotions, or surveys.</li>
            <li><strong>Other data:</strong> Other information you provide as disclosed at the time of collection.</li>
          </ul>
          <h3>Information from third-party sources</h3>
          <p>We may combine information from you with data from third-party sources, including:</p>
          <ul>
            <li>Data providers (e.g., demographic info, fraud detection)</li>
            <li>Marketing partners (e.g., joint events)</li>
            <li>Public sources (e.g., government records)</li>
            <li>Social media services (profile info if you login via third party)</li>
            <li>Logistics providers (delivery progress and address info)</li>
          </ul>
          <h3>Information collected automatically</h3>
          <ul>
            <li><strong>Device data:</strong> Device model, OS, ISP, language, unique IDs (including for advertising)</li>
            <li><strong>Service usage information:</strong> Pages viewed, time spent, clicks, email opens and link clicks</li>
            <li><strong>Location data:</strong> Approximate location (IP address), precise location with permission</li>
            <li><strong>Cookies and similar technologies:</strong> To analyze usage, improve service, deliver ads, and measure ad effectiveness</li>
          </ul>
        </>
      );
    case 'usage':
      return (
        <>
          <p>We use your personal information to:</p>
          <ul>
            <li>Create and maintain your account, enable security features.</li>
            <li>Process orders, payments, deliver products/services, communicate regarding orders and promotions.</li>
            <li>Improve, optimize, and troubleshoot our Service.</li>
            <li>Personalize your experience and recommend products.</li>
            <li>Communicate with you, provide support and respond to inquiries.</li>
            <li>Manage sweepstakes, contests, and promotions.</li>
            <li>Send marketing communications (email, SMS, push notifications, WhatsApp) with opt-out options.</li>
            <li>Provide interest-based advertising following Digital Advertising Alliance principles.</li>
            <li>Prevent fraud and unauthorized use.</li>
            <li>Comply with laws, legal requests, and protect rights.</li>
            <li>Use cookies and similar technologies for technical operations, performance, and advertising.</li>
          </ul>
        </>
      );
    case 'sharing':
      return (
        <>
          <p>We may share your personal information with:</p>
          <ul>
            <li><strong>Affiliates:</strong> For order fulfillment, only relevant order info shared, with privacy protections.</li>
            <li><strong>Service providers:</strong> Such as hosting, customer support, order fulfillment, marketing, analytics.</li>
            <li><strong>Payment processors:</strong> To complete payments, disputes, refunds.</li>
            <li><strong>Advertising and analytics partners:</strong> For interest-based ads, with opt-out choices.</li>
            <li><strong>Third parties you designate:</strong> Per your consent or instructions.</li>
            <li><strong>Business and marketing partners:</strong> For co-sponsored events or related products/services.</li>
            <li><strong>Professional advisors and authorities:</strong> Lawyers, auditors, regulators, legal compliance, fraud prevention.</li>
            <li><strong>Business transferees:</strong> In mergers, acquisitions, or sales of business/assets.</li>
            <li><strong>Merchandise partners:</strong> Product reviews, order info, customer support communication; no payment or device data shared.</li>
          </ul>
          <p>Note: Other users may see your reviews unless you hide your profile photo and name when posting reviews.</p>
        </>
      );
    case 'rights':
      return (
        <>
          <p>Depending on your location, you may have rights including:</p>
          <ul>
            <li>Access and obtain information about your personal data.</li>
            <li>Withdraw consent at any time (subject to other lawful bases for processing).</li>
            <li>Receive data in a structured, machine-readable format or transmit it to a third party.</li>
            <li>Request correction or deletion of your personal data.</li>
            <li>Object to or restrict processing in certain circumstances.</li>
            <li>Lodge complaints with data protection authorities.</li>
          </ul>
          <p>You can exercise these rights by contacting us at the contact info below.</p>
          <h3>Marketing Communications Opt-Out</h3>
          <ul>
            <li>Email: Use unsubscribe links or Notification settings.</li>
            <li>Mobile text messages: Follow message instructions or Notification settings.</li>
            <li>WhatsApp: Follow message instructions or Notification settings.</li>
            <li>Push notifications: Adjust device or app Notification settings.</li>
          </ul>
          <h3>Cookies & Tracking Settings</h3>
          <p>
            You can manage cookies through your browser settings. Disabling cookies may affect Service functionality. For more info, visit <a href="https://www.allaboutcookies.org" target="_blank" rel="noreferrer">allaboutcookies.org</a>.
          </p>
          <h3>Third-Party Links</h3>
          <p>
            Our Service may contain links to third-party sites and apps not controlled by us. Please review their privacy policies. Revoking access to third-party platforms won’t affect data already shared.
          </p>
          <h3>Do Not Track</h3>
          <p>We do not currently respond to Do Not Track browser signals.</p>
          <h3>Declining to Provide Information</h3>
          <p>Some personal data is required to provide services. Refusal may limit service availability.</p>
        </>
      );
    case 'children':
      return (
        <>
          <p>
            Store1920 does not knowingly collect personal information from minors under 18. If we become aware of such collection, we will delete the information promptly. Contact us if you believe a minor has provided us data.
          </p>
        </>
      );
    case 'security':
      return (
        <>
          <p>
            We use technical and administrative safeguards (encryption, access controls, PCI-DSS compliance) to protect your personal information. However, no online system is 100% secure.
          </p>
          <p>
            We retain data to fulfill its purpose, legal and accounting requirements, fraud prevention, or defending legal claims. When no longer needed, data is deleted, anonymized, or isolated from processing.
          </p>
          <p>
            Your data may be stored or processed outside your country, with appropriate legal protections.
          </p>
        </>
      );
    case 'changes':
      return (
        <>
          <p>
            We may update this policy anytime. Material changes will be notified by updating the date and posting on our Service. Please review this policy regularly.
          </p>
        </>
      );
    case 'contact':
      return (
        <>
          <p>Questions or comments? Contact Store1920's Data Protection Office:</p>
          <ul>
            <li>Email: <a href="mailto:privacy@Store1920.com">privacy@Store1920.com</a></li>
            <li>Postal Address: Whaleco Technology Limited, First Floor, 25 St, Stephens Green, Dublin 2, Ireland</li>
          </ul>
        </>
      );
    default:
      return null;
  }
};

export default PrivacyPolicy;
