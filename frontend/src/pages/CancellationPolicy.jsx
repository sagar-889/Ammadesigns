import { Link } from 'react-router-dom';
import './LegalPages.css';

const CancellationPolicy = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <header className="legal-header">
          <Link to="/" className="back-link">← Back to Home</Link>
          <h1>Cancellation Policy</h1>
          <p className="last-updated">Last Updated: January 5, 2026</p>
        </header>

        <div className="legal-content">
          <section>
            <h2>1. Overview</h2>
            <p>
              At AmmaCollections, we understand that circumstances may change after placing an order. 
              This Cancellation Policy explains how and when you can cancel your order, and the 
              associated terms and conditions.
            </p>
          </section>

          <section>
            <h2>2. Order Cancellation by Customer</h2>
            
            <h3>2.1 Before Order Processing</h3>
            <p>
              You can cancel your order <strong>free of charge</strong> if the cancellation request 
              is made within <strong>2 hours</strong> of placing the order and before the order has 
              been processed or shipped.
            </p>
            <p><strong>How to Cancel:</strong></p>
            <ul>
              <li>Go to "My Orders" section in your account</li>
              <li>Select the order you wish to cancel</li>
              <li>Click on "Cancel Order" button</li>
              <li>Or contact us immediately at <strong>+918247588435</strong></li>
            </ul>

            <h3>2.2 After Order Processing</h3>
            <p>
              Once your order has been processed and is being prepared for shipment, cancellation 
              may not be possible. However, you can:
            </p>
            <ul>
              <li>Refuse delivery when the product arrives</li>
              <li>Return the product as per our <Link to="/refund-policy">Refund Policy</Link></li>
            </ul>
            <p>
              <strong>Note:</strong> If you refuse delivery, return shipping charges may apply 
              unless the product is damaged or defective.
            </p>

            <h3>2.3 After Shipment</h3>
            <p>
              Orders cannot be cancelled once they have been shipped. You may:
            </p>
            <ul>
              <li>Refuse the delivery at your doorstep</li>
              <li>Accept delivery and initiate a return within 7 days</li>
            </ul>
          </section>

          <section>
            <h2>3. Cancellation by AmmaCollections</h2>
            <p>We reserve the right to cancel any order in the following situations:</p>
            
            <h3>3.1 Product Unavailability</h3>
            <p>
              If the ordered product is out of stock or discontinued, we will notify you immediately 
              and process a full refund within 5-7 business days.
            </p>

            <h3>3.2 Pricing or Product Information Errors</h3>
            <p>
              In case of pricing errors or incorrect product information on our website, we reserve 
              the right to cancel the order and issue a full refund.
            </p>

            <h3>3.3 Payment Issues</h3>
            <p>
              If payment authorization fails or if we suspect fraudulent activity, the order may be 
              cancelled automatically.
            </p>

            <h3>3.4 Delivery Restrictions</h3>
            <p>
              If we are unable to deliver to your location due to logistical constraints or other 
              reasons, we will cancel the order and process a full refund.
            </p>
          </section>

          <section>
            <h2>4. Refund for Cancelled Orders</h2>
            
            <h3>4.1 Cancellation Before Shipment</h3>
            <p>
              If you cancel your order before it is shipped, you will receive a <strong>full refund</strong> 
              of the order amount, including any shipping charges paid.
            </p>

            <h3>4.2 Cancellation After Shipment</h3>
            <p>
              If you refuse delivery or return the product after shipment:
            </p>
            <ul>
              <li>Refund amount = Order amount - Return shipping charges (if applicable)</li>
              <li>Original shipping charges are non-refundable</li>
            </ul>

            <h3>4.3 Refund Timeline</h3>
            <ul>
              <li><strong>Online Payments:</strong> 5-7 business days to original payment method</li>
              <li><strong>Cash on Delivery:</strong> Not applicable (no payment made)</li>
            </ul>
          </section>

          <section>
            <h2>5. Non-Cancellable Orders</h2>
            <p>The following orders cannot be cancelled:</p>
            <ul>
              <li>Customized or personalized products</li>
              <li>Products marked as "Final Sale" or "Clearance"</li>
              <li>Orders that have already been delivered</li>
            </ul>
          </section>

          <section>
            <h2>6. How to Cancel Your Order</h2>
            
            <h3>6.1 Through Website</h3>
            <ol>
              <li>Log in to your account</li>
              <li>Go to "My Orders"</li>
              <li>Find the order you want to cancel</li>
              <li>Click "Cancel Order" (if available)</li>
              <li>Select cancellation reason</li>
              <li>Confirm cancellation</li>
            </ol>

            <h3>6.2 Contact Customer Support</h3>
            <p>If you cannot cancel through the website, contact us immediately:</p>
            <ul>
              <li><strong>Phone:</strong> +918247588435</li>
              <li><strong>WhatsApp:</strong> +918247588435</li>
            </ul>
            <p>
              Provide your order number and reason for cancellation. Our team will assist you 
              with the cancellation process.
            </p>
          </section>

          <section>
            <h2>7. Partial Cancellations</h2>
            <p>
              If your order contains multiple items, you may be able to cancel individual items 
              before the order is shipped. Contact customer support for assistance with partial 
              cancellations.
            </p>
          </section>

          <section>
            <h2>8. Cancellation Confirmation</h2>
            <p>
              Once your cancellation is processed, you will receive:
            </p>
            <ul>
              <li>Email confirmation (if email provided)</li>
              <li>SMS notification to your registered phone number</li>
              <li>Refund confirmation (if payment was made)</li>
            </ul>
          </section>

          <section>
            <h2>9. Contact Information</h2>
            <p>For cancellation-related queries, please contact us:</p>
            <ul>
              <li><strong>Phone:</strong> +918247588435</li>
              <li><strong>WhatsApp:</strong> +918247588435</li>
              <li><strong>Address:</strong> 9-262 pallapuveedhy, sankhavaram</li>
            </ul>
          </section>

          <section>
            <h2>10. Policy Updates</h2>
            <p>
              We reserve the right to update this Cancellation Policy at any time. Changes will be 
              effective immediately upon posting on our website. Your continued use of our services 
              after any changes constitutes acceptance of the updated policy.
            </p>
          </section>
        </div>

        <footer className="legal-footer">
          <p>
            If you have any questions about our Cancellation Policy, please contact us at{' '}
            <a href="tel:+918247588435">+918247588435</a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default CancellationPolicy;
