import { Link } from 'react-router-dom';
import './LegalPages.css';

const TermsConditions = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <header className="legal-header">
          <Link to="/" className="back-link">← Back to Home</Link>
          <h1>Terms and Conditions</h1>
          <p className="last-updated">Last Updated: January 3, 2026</p>
        </header>

        <div className="legal-content">
          <section>
            <h2>1. Agreement to Terms</h2>
            <p>
              Welcome to AmmaCollections. These Terms and Conditions ("Terms") govern your use of our website and 
              services. By accessing or using our website, you agree to be bound by these Terms. If you do not agree 
              with any part of these Terms, you may not use our services.
            </p>
            <p>
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting. 
              Your continued use of our services after changes constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section>
            <h2>2. Services Description</h2>
            <p>AmmaCollections provides:</p>
            <ul>
              <li>Custom tailoring and stitching services for ladies' garments</li>
              <li>Ready-made ethnic wear and designer clothing</li>
              <li>Alteration and fitting services</li>
              <li>Online ordering and delivery services</li>
              <li>Custom measurements and design consultations</li>
            </ul>
            <p>
              We reserve the right to modify, suspend, or discontinue any service at any time without prior notice.
            </p>
          </section>

          <section>
            <h2>3. User Accounts</h2>
            
            <h3>3.1 Account Creation</h3>
            <p>To place orders, you must create an account by providing:</p>
            <ul>
              <li>Your full name</li>
              <li>Valid phone number</li>
              <li>Email address (optional)</li>
              <li>Delivery address</li>
            </ul>

            <h3>3.2 Account Security</h3>
            <p>You are responsible for:</p>
            <ul>
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized access</li>
              <li>Ensuring your account information is accurate and up-to-date</li>
            </ul>

            <h3>3.3 Account Termination</h3>
            <p>
              We reserve the right to suspend or terminate your account if you violate these Terms or engage in 
              fraudulent or illegal activities.
            </p>
          </section>

          <section>
            <h2>4. Orders and Payments</h2>
            
            <h3>4.1 Order Placement</h3>
            <p>When you place an order:</p>
            <ul>
              <li>You make an offer to purchase products/services at the listed price</li>
              <li>We reserve the right to accept or reject any order</li>
              <li>Order confirmation will be sent via SMS/email</li>
              <li>All orders are subject to product availability</li>
            </ul>

            <h3>4.2 Pricing</h3>
            <ul>
              <li>All prices are in Indian Rupees (INR)</li>
              <li>Prices are subject to change without notice</li>
              <li>Shipping charges are calculated based on location and order value</li>
              <li>Custom stitching prices may vary based on design complexity</li>
              <li>We reserve the right to correct pricing errors</li>
            </ul>

            <h3>4.3 Payment</h3>
            <ul>
              <li>Payment is processed securely through Razorpay</li>
              <li>We accept credit cards, debit cards, UPI, and net banking</li>
              <li>Payment must be completed before order processing begins</li>
              <li>For custom orders, advance payment may be required</li>
              <li>All transactions are encrypted and secure</li>
            </ul>

            <h3>4.4 Order Modifications</h3>
            <p>
              Order modifications or cancellations must be requested within 2 hours of order placement. 
              Once stitching or processing has begun, modifications may not be possible.
            </p>
          </section>

          <section>
            <h2>5. Custom Stitching Services</h2>
            
            <h3>5.1 Measurements</h3>
            <ul>
              <li>Accurate measurements are your responsibility</li>
              <li>We provide measurement guides and assistance</li>
              <li>In-person measurement services are available at our location</li>
              <li>We are not liable for fitting issues due to incorrect measurements</li>
            </ul>

            <h3>5.2 Design and Fabric</h3>
            <ul>
              <li>Design consultations are available before order confirmation</li>
              <li>Fabric colors may vary slightly from images due to screen settings</li>
              <li>Custom designs require approval before stitching begins</li>
              <li>We reserve the right to suggest modifications for feasibility</li>
            </ul>

            <h3>5.3 Processing Time</h3>
            <ul>
              <li>Standard stitching: 7-10 business days</li>
              <li>Custom designs: 10-15 business days</li>
              <li>Rush orders: Available with additional charges (subject to availability)</li>
              <li>Processing times may vary during peak seasons</li>
            </ul>

            <h3>5.4 Alterations</h3>
            <ul>
              <li>One free alteration within 7 days of delivery (for fitting adjustments only)</li>
              <li>Additional alterations will be charged separately</li>
              <li>Alterations must be requested within 7 days of delivery</li>
              <li>Major design changes are not covered under free alterations</li>
            </ul>
          </section>

          <section>
            <h2>6. Delivery and Shipping</h2>
            
            <h3>6.1 Delivery Areas</h3>
            <p>We deliver across India. Shipping charges vary by location:</p>
            <ul>
              <li>Local delivery (within 50km): ₹50</li>
              <li>Within state: ₹100</li>
              <li>Other states: ₹150</li>
              <li>Free shipping on orders above ₹2000</li>
            </ul>

            <h3>6.2 Delivery Time</h3>
            <ul>
              <li>Standard delivery: 3-5 business days after order completion</li>
              <li>Express delivery: Available with additional charges</li>
              <li>Delivery times are estimates and not guaranteed</li>
              <li>Delays may occur due to unforeseen circumstances</li>
            </ul>

            <h3>6.3 Delivery Responsibility</h3>
            <ul>
              <li>You must provide accurate delivery address</li>
              <li>Someone must be available to receive the order</li>
              <li>We are not responsible for delays due to incorrect address</li>
              <li>Risk of loss passes to you upon delivery</li>
            </ul>
          </section>

          <section>
            <h2>7. Returns and Refunds</h2>
            
            <h3>7.1 Return Policy</h3>
            <p>Returns are accepted under the following conditions:</p>
            <ul>
              <li>Ready-made products: Within 7 days of delivery</li>
              <li>Products must be unused, unwashed, and in original condition</li>
              <li>Original tags and packaging must be intact</li>
              <li>Custom-stitched items are non-returnable (except for defects)</li>
            </ul>

            <h3>7.2 Non-Returnable Items</h3>
            <ul>
              <li>Custom-stitched garments (unless defective)</li>
              <li>Altered or modified products</li>
              <li>Products without original tags or packaging</li>
              <li>Sale or clearance items (unless defective)</li>
            </ul>

            <h3>7.3 Refund Process</h3>
            <ul>
              <li>Refunds are processed within 7-10 business days of return approval</li>
              <li>Refunds are issued to the original payment method</li>
              <li>Shipping charges are non-refundable</li>
              <li>Return shipping costs are borne by the customer (unless product is defective)</li>
            </ul>

            <h3>7.4 Defective Products</h3>
            <p>
              If you receive a defective or damaged product, contact us within 48 hours of delivery. 
              We will arrange for replacement or full refund, including shipping charges.
            </p>
          </section>

          <section>
            <h2>8. Intellectual Property</h2>
            <p>All content on our website, including:</p>
            <ul>
              <li>Text, images, logos, and graphics</li>
              <li>Design patterns and templates</li>
              <li>Website code and functionality</li>
              <li>Product descriptions and photographs</li>
            </ul>
            <p>
              are the property of AmmaCollections and protected by copyright and trademark laws. 
              You may not reproduce, distribute, or use any content without our written permission.
            </p>
          </section>

          <section>
            <h2>9. User Conduct</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use our services for any illegal or unauthorized purpose</li>
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit viruses or malicious code</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Harass, abuse, or harm other users or our staff</li>
              <li>Provide false or misleading information</li>
              <li>Engage in fraudulent activities</li>
            </ul>
          </section>

          <section>
            <h2>10. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, AmmaCollections shall not be liable for:
            </p>
            <ul>
              <li>Indirect, incidental, or consequential damages</li>
              <li>Loss of profits, data, or business opportunities</li>
              <li>Damages resulting from unauthorized access to your account</li>
              <li>Delays or failures due to circumstances beyond our control</li>
              <li>Issues arising from incorrect measurements provided by you</li>
            </ul>
            <p>
              Our total liability shall not exceed the amount paid by you for the specific product or service in question.
            </p>
          </section>

          <section>
            <h2>11. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless AmmaCollections, its owners, employees, and partners from any 
              claims, damages, losses, or expenses arising from:
            </p>
            <ul>
              <li>Your violation of these Terms</li>
              <li>Your use of our services</li>
              <li>Your violation of any rights of third parties</li>
              <li>Any fraudulent or illegal activities</li>
            </ul>
          </section>

          <section>
            <h2>12. Dispute Resolution</h2>
            
            <h3>12.1 Governing Law</h3>
            <p>
              These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive 
              jurisdiction of courts in Andhra Pradesh, India.
            </p>

            <h3>12.2 Dispute Process</h3>
            <p>In case of disputes:</p>
            <ul>
              <li>Contact our customer service first for resolution</li>
              <li>We will attempt to resolve disputes amicably within 15 days</li>
              <li>If unresolved, disputes may be escalated to legal proceedings</li>
            </ul>
          </section>

          <section>
            <h2>13. Force Majeure</h2>
            <p>
              We are not liable for delays or failures in performance due to circumstances beyond our reasonable control, 
              including but not limited to:
            </p>
            <ul>
              <li>Natural disasters</li>
              <li>Government actions or restrictions</li>
              <li>Pandemics or health emergencies</li>
              <li>Labor strikes or disputes</li>
              <li>Technical failures or internet outages</li>
              <li>Supply chain disruptions</li>
            </ul>
          </section>

          <section>
            <h2>14. Severability</h2>
            <p>
              If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions 
              shall continue in full force and effect.
            </p>
          </section>

          <section>
            <h2>15. Entire Agreement</h2>
            <p>
              These Terms, along with our Privacy Policy, constitute the entire agreement between you and 
              AmmaCollections regarding the use of our services.
            </p>
          </section>

          <section>
            <h2>16. Contact Information</h2>
            <p>For questions or concerns about these Terms, please contact us:</p>
            <div className="contact-info">
              <p><strong>AmmaCollections</strong></p>
              <p>9-262 pallapuveedhy, sankhavaram</p>
              <p>Phone: +918247588435</p>
              <p>WhatsApp: +918247588435</p>
            </div>
          </section>

          <section className="legal-footer">
            <p>
              By using our website and services, you acknowledge that you have read, understood, and agree to be 
              bound by these Terms and Conditions.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
