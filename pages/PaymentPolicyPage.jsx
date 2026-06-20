import React from 'react';

const PaymentPolicyPage = () => {
  return (
    <div className="bg-kora text-indigo min-h-screen pt-4 pb-12 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl mb-12 text-center text-indigo">Payment Policy</h1>
        
        <div className="space-y-8 text-indigo/80 leading-relaxed font-sans">
          
          <p className="text-lg mb-8">
            This Payment Policy explains how payments are accepted, processed, and managed on www.angilu.com, operated by Sri Bhavani Enterprises. 
            By placing an order on the website, customers agree to comply with the terms outlined in this Payment Policy.
          </p>

          <section>
            <h2 className="font-serif text-2xl text-indigo mb-4">1. Accepted Payment Methods</h2>
            <p className="mb-4">Angilu accepts multiple payment methods to ensure a convenient checkout experience for customers. The currently supported payment options include:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>UPI payments</li>
              <li>Debit cards</li>
              <li>Credit cards</li>
              <li>Net banking</li>
              <li>Cash on Delivery (COD)</li>
            </ul>
            <p>Available payment options may vary depending on location, order value, or technical availability during checkout.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-indigo mb-4">2. Payment Processing Partners</h2>
            <p className="mb-4">All online payments on Angilu are processed through secure third-party payment service providers, including:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>PhonePe</li>
              <li>Razorpay</li>
            </ul>
            <p className="mb-4">These payment gateways handle payment authorization, encryption, and transaction security.</p>
            <p className="mb-4">Angilu does not store sensitive payment information, such as card numbers, banking credentials, or UPI authentication details.</p>
            <p>Customers are advised to review the privacy and security policies of the respective payment providers.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-indigo mb-4">3. Cash on Delivery (COD)</h2>
            <p className="mb-4">Angilu offers Cash on Delivery (COD) as a payment option for eligible orders.</p>
            <p className="mb-4">A COD handling fee of ₹100 will be applied to orders placed using the Cash on Delivery option. This fee will be clearly displayed during the checkout process before the order is confirmed.</p>
            <p>Angilu reserves the right to limit or disable COD services for certain locations, products, or customers where necessary.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-indigo mb-4">4. Payment Authorization</h2>
            <p className="mb-4">For online payments, the transaction must be successfully authorized by the payment gateway or banking institution before the order is confirmed.</p>
            <p className="mb-4">If a payment attempt fails or is declined by the bank or payment provider, the order will not be processed.</p>
            <p>Customers may retry the transaction using the same or a different payment method.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-indigo mb-4">5. Failed Transactions</h2>
            <p className="mb-4">In certain cases, payment transactions may fail due to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>network issues</li>
              <li>bank authorization errors</li>
              <li>payment gateway interruptions</li>
              <li>incomplete transaction attempts</li>
            </ul>
            <p className="mb-4">If a payment amount is deducted but the order is not confirmed, the payment will typically be automatically reversed by the bank or payment provider.</p>
            <p className="mb-4">Refunds for such failed transactions generally occur within 5–7 business days, depending on the bank or payment gateway.</p>
            <p>Customers experiencing delays may contact Angilu support with the transaction details.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-indigo mb-4">6. Duplicate Payments</h2>
            <p className="mb-4">If a customer accidentally completes multiple payments for the same order, Angilu will verify the transaction details and initiate the applicable refund after confirmation.</p>
            <p className="mb-4">Customers should provide the following information when reporting duplicate payments:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Order number</li>
              <li>Transaction ID</li>
              <li>Payment receipt or screenshot</li>
            </ul>
            <p>Refund processing timelines may depend on the bank or payment gateway involved.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-indigo mb-4">7. Pricing and Currency</h2>
            <p className="mb-4">All prices displayed on Angilu.com are listed in Indian Rupees (INR) unless stated otherwise.</p>
            <p className="mb-4">Angilu reserves the right to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>update product pricing at any time</li>
              <li>correct pricing errors or inaccuracies</li>
              <li>cancel orders placed under incorrect pricing conditions</li>
            </ul>
            <p>In such situations, customers will be notified and the applicable refund will be processed if payment has already been made.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-indigo mb-4">8. Payment Security</h2>
            <p className="mb-4">Angilu takes reasonable measures to ensure the security of online transactions.</p>
            <p className="mb-4">All payments are processed through secure encrypted payment gateways operated by trusted third-party providers.</p>
            <p>Customers are responsible for safeguarding their personal banking credentials and payment details when conducting transactions online.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-indigo mb-4">9. Fraud Prevention</h2>
            <p className="mb-4">To protect customers and maintain transaction security, Angilu reserves the right to review and cancel orders suspected of fraudulent activity.</p>
            <p className="mb-4">Orders may be cancelled in cases including but not limited to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>suspicious transaction patterns</li>
              <li>payment verification failures</li>
              <li>incorrect customer information</li>
              <li>suspected misuse of promotional offers</li>
            </ul>
            <p>Angilu may contact customers for additional verification if required.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-indigo mb-4">10. Chargebacks and Payment Disputes</h2>
            <p className="mb-4">Customers are encouraged to contact Angilu customer support to resolve any payment-related concerns before initiating a dispute or chargeback through their bank or payment provider.</p>
            <p className="mb-4">If a chargeback or payment dispute is initiated for an order that has already been delivered, Angilu reserves the right to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>provide transaction records, delivery confirmation, and communication records to the payment provider or financial institution</li>
              <li>temporarily suspend the customer account during the investigation</li>
              <li>restrict future purchases if fraudulent activity is suspected</li>
            </ul>
            <p className="mb-4">If the chargeback dispute is resolved in favor of Angilu and the product has already been delivered, Angilu may pursue recovery of the product or payment through appropriate legal channels.</p>
            <p>Customers agree not to misuse the chargeback process for legitimate transactions.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-indigo mb-4">11. Contact for Payment Issues</h2>
            <p className="mb-4">For any payment-related inquiries or issues, customers may contact:</p>
            <p className="font-semibold mt-2">Email: <a href="mailto:support@angilu.com" className="text-terracotta hover:underline">support@angilu.com</a></p>
            <p className="font-semibold">Phone: <a href="tel:+919966486864" className="text-terracotta hover:underline">+91 99664 86864</a></p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PaymentPolicyPage;


