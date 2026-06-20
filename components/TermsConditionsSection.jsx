import React from 'react';

const TermsConditionsSection = () => {
  return (
    <div className="bg-kora text-indigo min-h-screen" style={{ lineHeight: '1.8' }}>
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-12">

        {/* Header */}
        <div className="text-center mb-12 space-y-6">
          <span className="text-xs uppercase tracking-[0.4em] text-terracotta font-medium">Legal Information</span>
          <h1 className="text-4xl md:text-5xl font-serif text-indigo">Terms & Conditions</h1>
          <div className="w-24 h-[1px] bg-terracotta mx-auto"></div>
          <p className="text-indigo/70 font-light leading-relaxed">
            These Terms & Conditions govern the use of the website www.angilu.com and all purchases made through it. By accessing or using this website, you agree to comply with and be bound by these terms. If you do not agree with any part of these terms, you should not use this website or place orders through it.
          </p>
        </div>

        {/* Main Content - Terms & Conditions */}
        <div className="space-y-12">
          
          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">1.</span> Business Information
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>This website is owned and operated by:</p>
              <div className="pl-4 border-l-2 border-terracotta/30 space-y-2 py-2">
                <p className="font-medium text-indigo">Sri Bhavani Enterprises</p>
                <p>Shamshabad, Hyderabad. – 501218, India.</p>
              </div>
              <p className="mt-4">For any support or inquiries, customers may contact:</p>
              <ul className="space-y-1">
                <li><span className="font-medium inline-block w-20">Email:</span> <a href="mailto:support@angilu.com" className="text-terracotta hover:underline">support@angilu.com</a></li>
                <li><span className="font-medium inline-block w-20">Phone:</span> +91 99664 86864</li>
              </ul>
            </div>
          </section>

          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">2.</span> Use of the Website
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>By using this website, you agree to use it only for lawful purposes and in accordance with these Terms & Conditions. Users must not:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Engage in fraudulent or illegal activities</li>
                <li>Attempt to gain unauthorized access to the website</li>
                <li>Interfere with website functionality or security</li>
                <li>Use automated systems, bots, or scraping tools to extract data</li>
                <li>Misuse promotions, discount codes, or offers</li>
              </ul>
              <p className="mt-4 italic">Angilu reserves the right to restrict or terminate access to any user who violates these rules.</p>
            </div>
          </section>

          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">3.</span> Product Information
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>Angilu strives to ensure that product descriptions, images, and pricing are accurate. However:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Slight variations in color may occur due to screen settings or lighting</li>
                <li>Product availability may change without notice</li>
                <li>Product details may be updated or modified when necessary</li>
              </ul>
              <p className="mt-4">Angilu does not guarantee that all product information will always be completely error-free.</p>
            </div>
          </section>

          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">4.</span> Pricing and Payment
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>All prices listed on the website are displayed in Indian Rupees (INR) unless stated otherwise. Angilu reserves the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Modify product prices at any time without prior notice</li>
                <li>Correct pricing errors</li>
                <li>Cancel orders placed with incorrect pricing</li>
              </ul>
              <p className="mt-4">Payments on Angilu may be made using approved payment methods available during checkout. Orders will only be processed after successful payment authorization.</p>
            </div>
          </section>

          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">5.</span> Order Acceptance and Cancellation
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>Placing an order on Angilu does not guarantee acceptance. Angilu reserves the right to cancel or refuse any order in situations including but not limited to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Product unavailability</li>
                <li>Suspected fraudulent activity</li>
                <li>Pricing or listing errors</li>
                <li>Payment issues</li>
              </ul>
              <p className="mt-4">Customers may cancel an order only before the order is shipped. Once shipped, the order will fall under the Returns & Exchange Policy.</p>
            </div>
          </section>

          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">6.</span> Shipping and Delivery
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>Angilu aims to process and ship orders within the timelines communicated on the website. However, delivery timelines may vary due to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Courier delays</li>
                <li>Unforeseen logistics issues</li>
                <li>Natural events or external disruptions</li>
              </ul>
              <p className="mt-4">Angilu will make reasonable efforts to ensure timely delivery but cannot guarantee exact delivery dates.</p>
            </div>
          </section>

          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">7.</span> Returns, Exchanges and Refunds
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>Returns, exchanges, and refunds are governed by the Returns, Exchanges & Refund Policy available on the website. Customers are advised to review the policy before placing an order.</p>
            </div>
          </section>

          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">8.</span> Intellectual Property
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>All content available on the website, including but not limited to logos, brand name, product images, product designs, graphics, website layout, and text and content, are the exclusive property of Angilu and Sri Bhavani Enterprises and are protected under applicable intellectual property laws. Users may not:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Copy or reproduce website content</li>
                <li>Reuse product images</li>
                <li>Distribute or modify any material from the website without written permission</li>
              </ul>
              <p className="mt-4 font-medium text-indigo">Unauthorized use may result in legal action.</p>
            </div>
          </section>

          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">9.</span> Limitation of Liability
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>Angilu shall not be held liable for any indirect, incidental, or consequential damages arising from:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use of the website</li>
                <li>Purchase or use of products</li>
                <li>Delays in delivery</li>
                <li>Website interruptions or technical errors</li>
              </ul>
              <p className="mt-4">To the maximum extent permitted by law, Angilu's liability shall be limited to the amount paid by the customer for the product.</p>
            </div>
          </section>

          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">10.</span> User Accounts
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>If users create an account on Angilu, they are responsible for maintaining the confidentiality of their login information. Users are responsible for all activities conducted under their account. Angilu reserves the right to suspend or terminate accounts suspected of misuse or fraudulent activity.</p>
            </div>
          </section>

          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">11.</span> Governing Law and Jurisdiction
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>These Terms & Conditions shall be governed by and interpreted in accordance with the laws of India. Any disputes arising from the use of this website shall fall under the jurisdiction of the courts located in Hyderabad, Telangana.</p>
            </div>
          </section>

          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">12.</span> Grievance Redressal
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>In accordance with applicable e-commerce regulations, the grievance officer for Angilu is:</p>
              <div className="bg-kora/50 p-6 rounded-none border border-gold/20 my-4">
                <p><span className="font-medium">Name:</span> Vardhan Gilla</p>
                <p><span className="font-medium">Email:</span> <a href="mailto:ceo@angilu.com" className="text-terracotta hover:underline">ceo@angilu.com</a></p>
              </div>
              <p>Customers may contact the grievance officer for complaints, feedback, or policy-related concerns.</p>
            </div>
          </section>

          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">13.</span> Changes to Terms
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>Angilu reserves the right to update or modify these Terms & Conditions at any time without prior notice. Any changes will be effective immediately upon publication on the website. Customers are encouraged to review these terms periodically.</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default TermsConditionsSection;

