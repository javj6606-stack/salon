export default function PrivacyPolicyPage() {
  const content = `
Last updated: [Add date when you publish this]

Glowly ("we", "us", "our") provides an AI-powered WhatsApp booking assistant for beauty salons ("Salon Partners") in Pakistan. This Privacy Policy explains what information we collect, why, and how it is handled — both for Salon Partners who use our dashboard, and for their customers who interact with our WhatsApp assistant.

1. Information We Collect

From Salon Partners (our direct customers):
- Name, email address, phone number, business name and details
- Login credentials (passwords are never stored in plain text)
- Payment/billing information (processed via [your payment provider — add once decided])

From Salon Customers (people who message the salon's WhatsApp number):
- Name and phone number, as provided during the WhatsApp conversation
- Messages sent to and received from the AI assistant
- Appointment/booking details (service requested, date, time)

2. How We Use This Information

We use the information collected to:
- Enable Salon Partners to manage bookings and customer conversations
- Allow our AI assistant (powered by Google Gemini) to understand and respond to customer messages automatically
- Send booking confirmations and reminders via WhatsApp
- Maintain and improve the security and reliability of the service
- Communicate with Salon Partners about their account, billing, and service updates

3. Who We Share Information With

We share information with the following third-party service providers, only as needed to operate Glowly:

- Meta / WhatsApp Business Platform — sending and receiving WhatsApp messages
- Google (Gemini AI) — generating automated replies to customer messages
- Supabase — secure database storage and user authentication
- Railway — hosting our backend messaging service
- Vercel — hosting our dashboard application

We do not sell personal information to third parties. We do not share Salon Customer data with any Salon Partner other than the one the customer messaged.

4. Data Retention

We retain Salon Partner account data for as long as the account remains active, and for a reasonable period afterward for legal and accounting purposes. Salon Customer conversation data is retained for as long as needed to provide the booking service, or until deletion is requested.

5. Your Rights

You may request access to, correction of, or deletion of your personal data by contacting us at j3599420@gmail.com. We will respond to such requests within a reasonable time.

6. Data Security

We take reasonable technical measures to protect your data, including encrypted connections, access controls limiting who can view customer data across different salons, and restricted, secret-protected access to our messaging infrastructure. No method of transmission or storage is 100% secure, and we cannot guarantee absolute security.

7. Children's Privacy

Glowly is intended for use by business owners and their adult customers. We do not knowingly collect data from children.

8. Changes to This Policy

We may update this Privacy Policy from time to time. Material changes will be communicated to Salon Partners via email or dashboard notice.

9. Contact Us

Email: j3599420@gmail.com
`;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px", lineHeight: 1.7 }}>
      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>Privacy Policy — Glowly</h1>
      <div style={{ whiteSpace: "pre-wrap", fontFamily: "system-ui, sans-serif", fontSize: "15px" }}>
        {content}
      </div>
    </div>
  );
}