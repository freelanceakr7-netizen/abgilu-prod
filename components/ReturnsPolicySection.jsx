import React from 'react';

const ReturnsPolicySection = () => {
  return (
    <div className="bg-kora text-indigo min-h-screen" style={{ lineHeight: '1.8' }}>
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-12">

        {/* Header */}
        <div className="text-center mb-12 space-y-6">
          <span className="text-xs uppercase tracking-[0.4em] text-terracotta font-medium">Customer Support</span>
          <h1 className="text-4xl md:text-5xl font-serif text-indigo">Returns & Exchanges</h1>
          <div className="w-24 h-[1px] bg-terracotta mx-auto"></div>
          <p className="text-indigo/70 font-light leading-relaxed">
            This Returns, Exchanges & Refund Policy governs purchases made through Angilu.com. By placing an order on our website, you agree to the terms outlined below. Angilu reserves the right to approve, reject, or modify any return or exchange request in accordance with the conditions stated in this policy.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          
          {/* Section 1 */}
          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">1.</span> Return Eligibility
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>Customers may request a return within 48 hours of delivery. To be eligible for a return, the product must meet the following conditions:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The item must be unused, unworn, and unwashed</li>
                <li>All original tags must remain attached and intact</li>
                <li>The product must be returned with original packaging</li>
                <li>The product must be in the same condition in which it was delivered</li>
              </ul>
              <p className="mt-4">Any item returned with removed tags, signs of wear, damage caused by the customer, or missing packaging will not be eligible for a return or refund.</p>
              <p className="font-medium text-indigo">Angilu reserves the sole right to determine whether the returned product meets these conditions.</p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">2.</span> Exchange Policy
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>At Angilu, we are committed to delivering products of the highest quality. Every product undergoes a careful quality inspection before it is packaged and shipped. However, in the unlikely event that you receive a damaged or defective item, we are here to assist you.</p>
              
              <h3 className="text-lg font-serif text-indigo mt-6 mb-2">Exchange Eligibility</h3>
              <p>Customers may request an exchange within 2 days of delivery under the following circumstance: the product received is damaged or defective at the time of delivery.</p>
              <p>To initiate an exchange request, customers must contact our support team within 24–48 hours of receiving the order and provide clear supporting evidence, including photographs or videos of the damaged or defective product.</p>
              <p>Angilu reserves the right to review and verify the submitted evidence before approving the exchange request.</p>

              <h3 className="text-lg font-serif text-indigo mt-6 mb-2">Exchange Limitations</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Each order is eligible for only one exchange request</li>
                <li>Once a product has been exchanged, the replacement item cannot be exchanged again</li>
                <li>Exchanges are subject to product availability</li>
              </ul>
              <p className="mt-4">If the requested replacement product is unavailable, Angilu may, at its sole discretion, offer store credit or a refund in accordance with our refund policy.</p>

              <h3 className="text-lg font-serif text-indigo mt-6 mb-2">Items Not Eligible for Exchange</h3>
              <div className="space-y-4 border-l-2 border-gold/30 pl-4 py-2 mt-4">
                <div>
                  <h4 className="font-medium text-indigo">Size Exchanges</h4>
                  <p>We provide a detailed Size Guide under each product page and in the website footer. Customers are strongly encouraged to review the size chart carefully before placing an order. Therefore, requests for exchanges due to size issues will not be accepted.</p>
                </div>
                <div>
                  <h4 className="font-medium text-indigo">Exchange for a Different Product</h4>
                  <p>Exchanges for a different product, design, or variant are not permitted. All orders are thoroughly verified for product design, size specifications, and quality before dispatch to ensure accuracy.</p>
                </div>
                <div>
                  <h4 className="font-medium text-indigo">Quality Assurance</h4>
                  <p>Every Angilu product undergoes a detailed quality check before packaging to ensure it meets our standards. While such issues are extremely rare, we remain committed to resolving genuine concerns promptly and fairly.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">3.</span> Non-Returnable Products
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>The following items are not eligible for return or exchange:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Products purchased during sale or discount promotions</li>
                <li>Gift cards</li>
                <li>Any product that has been used, worn, washed, altered, or damaged after delivery</li>
              </ul>
              <p className="mt-4 italic">Angilu may also mark certain products as final sale on the product page. Such items are not eligible for returns or exchanges.</p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">4.</span> Return Shipping Charges
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <div className="bg-white/50 p-5 rounded-none border border-gold/10 mb-4">
                <h3 className="font-medium text-indigo mb-2">Defective / Damaged / Wrong Item</h3>
                <p>If the return is due to a damaged product, a defective product, or an incorrect item delivered, Angilu will arrange free return pickup.</p>
              </div>
              <div className="bg-white/50 p-5 rounded-none border border-gold/10">
                <h3 className="font-medium text-indigo mb-2">Other Returns</h3>
                <p>If the return is requested for reasons such as change of mind or size preference, a return processing fee of ₹75–₹100 may be deducted from the refund amount. Angilu reserves the right to determine the applicable processing charge.</p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">5.</span> Reporting Damaged or Incorrect Products
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>If a customer receives a damaged item, a defective product, or the wrong product, the issue must be reported within 24–48 hours of delivery. Customers must send:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Clear photos of the product</li>
                <li>Photos of packaging</li>
                <li>Order details</li>
              </ul>
              <p className="mt-4 font-medium text-indigo">Failure to report the issue within the specified time frame may result in the request being rejected.</p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">6.</span> Return Verification Process
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>To maintain quality control and prevent fraudulent claims, Angilu follows a two-stage verification process.</p>
              
              <h3 className="text-lg font-serif text-indigo mt-6 mb-2">Step 1 — Customer Evidence</h3>
              <p>Customers may be required to provide:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Photos or videos showing the condition of the product</li>
                <li>Visible tags and packaging</li>
              </ul>

              <h3 className="text-lg font-serif text-indigo mt-6 mb-2">Step 2 — Pickup Verification</h3>
              <p>During return pickup:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The courier partner will inspect the item</li>
                <li>The product tags must be intact and unbroken</li>
                <li>The item condition will be recorded or verified</li>
              </ul>
              
              <p className="mt-4 p-4 bg-terracotta/5 rounded-none border border-terracotta/10 text-sm">
                Returns that fail courier inspection may be rejected at pickup. Final approval is subject to inspection at the Angilu warehouse.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">7.</span> Refund Processing
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>Once the returned product is received and inspected at our warehouse, the refund will be processed.</p>
              <ul className="space-y-2">
                <li><span className="font-medium inline-block w-32 md:w-40">Refund timeline:</span> 10–14 business days after the returned product reaches our warehouse and passes inspection.</li>
              </ul>
              <p className="mt-4">Refunds will be issued to the original payment method used for the order. If a return processing charge applies, the amount will be deducted from the total refund.</p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">8.</span> Return Request Process
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>To initiate a return or exchange request, customers must contact:</p>
              <p><span className="font-medium inline-block w-16">Email:</span> <a href="mailto:support@angilu.com" className="text-terracotta hover:underline">support@angilu.com</a></p>
              <p className="mt-4">The request must include:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Order number</li>
                <li>Reason for return or exchange</li>
                <li>Photos of the product if required</li>
              </ul>
              <p className="mt-4 italic">Once approved, Angilu will arrange courier pickup.</p>
            </div>
          </section>

          {/* Section 9 */}
          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">9.</span> Order Cancellation
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>Orders may be cancelled only before shipment. Once an order has been shipped, cancellation is no longer possible and the order will fall under the return or exchange policy.</p>
            </div>
          </section>

          {/* Section 10 */}
          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">10.</span> International Orders
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>Currently, international orders are not eligible for returns or exchanges. In exceptional cases involving defective products, Angilu may review requests on a case-by-case basis.</p>
            </div>
          </section>

          {/* Section 11 */}
          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">11.</span> Policy Abuse
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>Angilu reserves the right to refuse returns or exchanges from customers who demonstrate patterns of excessive returns, fraudulent claims, or misuse of return policies. Accounts involved in such activities may be restricted or suspended.</p>
            </div>
          </section>

          {/* Section 12 */}
          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">12.</span> Policy Updates
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>Angilu reserves the right to modify or update this policy at any time without prior notice. Customers are advised to review the policy periodically.</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default ReturnsPolicySection;


