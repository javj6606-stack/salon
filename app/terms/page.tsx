export default function TermsOfServicePage() {
  const content = `
Last updated: [Add date when you publish this]

These Terms of Service ("Terms") govern the use of Glowly's WhatsApp AI booking platform ("Service") by beauty salons and their staff ("Salon Partner", "you"). By signing up, you agree to these Terms.

1. The Service

Glowly provides a dashboard and an AI-powered WhatsApp assistant that helps you manage customer bookings, appointments, and conversations. The AI assistant automatically responds to customer messages using Google's Gemini AI, based on the information and settings you configure.

2. Free Trial and Subscription

- New Salon Partners receive a free trial period of 14 days, with no charge.
- After the free trial ends, continued use of the Service requires a paid monthly subscription of 1500 PKR, billed automatically each month unless cancelled.
- You may cancel your subscription at any time before the next billing date to avoid being charged for the following month. Cancelling does not entitle you to a refund of the current billing period.
- We reserve the right to change subscription pricing with at least 30 days' notice to existing Salon Partners.

3. Your Responsibilities

As a Salon Partner, you agree to:
- Provide accurate business and contact information
- Use the Service only for legitimate salon/beauty business purposes
- Not use the Service to send unsolicited bulk messages, spam, or content that violates WhatsApp's or Meta's own policies
- Keep your login credentials confidential
- Obtain any consent required from your customers to contact them via WhatsApp, in line with applicable law and WhatsApp's own messaging policies

4. Service Availability and Limitations

Glowly depends on third-party infrastructure we do not control, including Meta's WhatsApp Business Platform, Google's Gemini AI, and our hosting providers. While we work to keep the Service reliable, we do not guarantee uninterrupted availability, and we are not liable for:
- Missed messages or bookings caused by outages, delays, or changes on WhatsApp/Meta's platform
- Errors or inaccuracies in AI-generated responses
- Data loss caused by circumstances outside our reasonable control

We recommend Salon Partners periodically review AI conversations and confirm important bookings directly with customers when in doubt.

5. Account Suspension and Termination

We may suspend or terminate a Salon Partner's account if:
- Payment is not received for 7 days past the due date
- The Service is used in violation of these Terms, or WhatsApp's/Meta's policies
- We reasonably believe the account is being used for fraudulent or illegal activity

You may terminate your account at any time by contacting us or through the dashboard settings.

6. Data Ownership

You retain ownership of your business data and your customers' data collected through your use of the Service. See our Privacy Policy for details on how this data is handled.

7. Limitation of Liability

To the fullest extent permitted by law, Glowly's total liability for any claim relating to the Service is limited to the amount you paid us in the 3 months preceding the claim. We are not liable for indirect, incidental, or consequential damages, including lost business or lost bookings.

8. Changes to These Terms

We may update these Terms from time to time. Continued use of the Service after changes take effect constitutes acceptance of the updated Terms.

9. Governing Law

These Terms are governed by the laws of Pakistan.

10. Contact Us

Email: j3599420@gmail.com
`;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px", lineHeight: 1.7 }}>
      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>Terms of Service — Glowly</h1>
      <div style={{ whiteSpace: "pre-wrap", fontFamily: "system-ui, sans-serif", fontSize: "15px" }}>
        {content}
      </div>
    </div>
  );
}