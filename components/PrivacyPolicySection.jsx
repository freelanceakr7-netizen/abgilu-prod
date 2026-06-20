import React from 'react';

const PrivacyPolicySection = () => {
  return (
    <div className="bg-kora text-indigo min-h-screen" style={{ lineHeight: '1.8' }}>
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-12">

        {/* Header */}
        <div className="text-center mb-12 space-y-6">
          <span className="text-xs uppercase tracking-[0.4em] text-terracotta font-medium">Legal Information</span>
          <h1 className="text-4xl md:text-5xl font-serif text-indigo">Privacy Policy</h1>
          <div className="w-24 h-[1px] bg-terracotta mx-auto"></div>
          <p className="text-indigo/70 font-light leading-relaxed">
            This Privacy Policy explains how Angilu.com, operated by Sri Bhavani Enterprises, collects, uses, stores, and protects personal information when customers visit or make purchases through our website. By accessing or using www.angilu.com, you agree to the collection and use of information in accordance with this policy.
          </p>
        </div>

        {/* Main Content - Privacy Policy */}
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
              <p className="mt-4">For privacy-related questions, customers may contact:</p>
              <ul className="space-y-1">
                <li><span className="font-medium">Email:</span> <a href="mailto:info@angilu.com" className="text-terracotta hover:underline">info@angilu.com</a></li>
                <li><span className="font-medium">Phone:</span> +91 99664 86864</li>
              </ul>
            </div>
          </section>

          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">2.</span> Information We Collect
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>When customers interact with Angilu, we may collect the following personal information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Full name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Shipping address</li>
                <li>Billing address</li>
                <li>Order details and purchase history</li>
              </ul>
              <p className="mt-4 p-4 bg-terracotta/5 rounded-none border border-terracotta/10 text-sm">
                <strong>Note:</strong> Payment information such as card details or UPI credentials is not stored by Angilu and is processed securely through third-party payment providers.
              </p>
            </div>
          </section>

          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">3.</span> How We Use Customer Information
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>The information collected may be used for purposes including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Processing and fulfilling orders</li>
                <li>Shipping and delivery coordination</li>
                <li>Customer support and communication</li>
                <li>Order confirmations and updates</li>
                <li>Improving website performance and services</li>
                <li>Fraud detection and prevention</li>
                <li>Marketing communications and promotional offers</li>
              </ul>
              <p className="mt-4 italic">Angilu uses customer information only for legitimate business purposes.</p>
            </div>
          </section>

          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">4.</span> Payment Processing
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>Payments on Angilu are processed through trusted third-party payment providers including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>PhonePe</li>
                <li>Razorpay</li>
              </ul>
              <p className="mt-4">
                These providers process payments through secure systems and maintain their own privacy and security standards. Angilu does not store customers' sensitive payment information.
              </p>
            </div>
          </section>

          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">5.</span> Account Creation
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>
                Customers may choose to create an account on Angilu, or complete purchases using guest checkout. When an account is created, certain personal details may be stored to allow easier future purchases and order tracking. Customers are responsible for maintaining the confidentiality of their login credentials.
              </p>
            </div>
          </section>

          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">6.</span> Cookies and Website Tracking
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>Angilu uses cookies and similar technologies to improve the browsing experience. Cookies may be used to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Remember user sessions</li>
                <li>Store preferences</li>
                <li>Improve website functionality</li>
                <li>Analyze website traffic and usage patterns</li>
              </ul>
              <p className="mt-4">
                Users may disable cookies through their browser settings, although certain website features may not function properly if cookies are disabled.
              </p>
            </div>
          </section>

          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">7.</span> Analytics and Marketing Tools
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>Angilu may use analytics and marketing tools to better understand customer behavior and improve services. These tools may collect limited technical information such as:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Device type</li>
                <li>Browser type</li>
                <li>IP address</li>
                <li>Pages visited on the website</li>
              </ul>
              <p className="mt-4">
                Such information is used only for website analytics, marketing insights, and improving user experience.
              </p>
            </div>
          </section>

          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">8.</span> Marketing Communications
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>Customers who interact with Angilu may receive marketing communications including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Promotional emails</li>
                <li>SMS updates</li>
                <li>WhatsApp notifications</li>
              </ul>
              <p className="mt-4">
                Customers may choose to opt out of marketing communications at any time by contacting our support team or following unsubscribe instructions provided in the communication.
              </p>
            </div>
          </section>

          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">9.</span> Sharing of Customer Data
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>Angilu may share limited customer information with trusted third-party service providers strictly for operational purposes. These may include:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Payment processing partners</li>
                <li>Courier and delivery partners</li>
                <li>Analytics providers</li>
                <li>Technology service providers</li>
              </ul>
              <p className="mt-4 font-medium text-indigo">
                Angilu will not sell, rent, or trade customer personal information to third parties.
              </p>
            </div>
          </section>

          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">10.</span> Data Security
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>
                Angilu implements reasonable security practices to protect customer information from unauthorized access, misuse, or disclosure. However, while we strive to protect personal data, no system can guarantee complete security over the internet. Customers share information with Angilu at their own discretion.
              </p>
            </div>
          </section>

          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">11.</span> Customer Rights
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>Customers may request:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Correction of inaccurate personal information</li>
                <li>Deletion of stored personal data</li>
                <li>Clarification regarding how their information is used</li>
              </ul>
              <p className="mt-4">
                Such requests can be made by contacting our support team. Angilu will review and process these requests in accordance with applicable regulations.
              </p>
            </div>
          </section>

          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">12.</span> Children's Privacy
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>
                Angilu does not knowingly collect personal information from children under the age of 13 years. If we become aware that personal information from a child has been collected without parental consent, we will take steps to remove that information.
              </p>
            </div>
          </section>

          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">13.</span> Changes to This Privacy Policy
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>
                Angilu reserves the right to update or modify this Privacy Policy at any time. Any changes will become effective immediately upon publication on the website. Customers are encouraged to review this policy periodically.
              </p>
            </div>
          </section>

          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">14.</span> Contact Information
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>For any privacy-related concerns or questions, customers may contact:</p>
              <ul className="space-y-1">
                <li><span className="font-medium inline-block w-32">Support Email:</span> <a href="mailto:info@angilu.com" className="text-terracotta hover:underline">info@angilu.com</a></li>
                <li><span className="font-medium inline-block w-32">Phone:</span> +91 99664 86864</li>
              </ul>
            </div>
          </section>
        </div>

        {/* Divider */}
        <div className="my-16 border-t-2 border-dashed border-gold/30"></div>

        {/* Header - Grievance Redressal Policy */}
        <div className="text-center mb-12 space-y-6">
          <span className="text-xs uppercase tracking-[0.4em] text-terracotta font-medium">Customer Support</span>
          <h1 className="text-4xl md:text-5xl font-serif text-indigo">Grievance Redressal Policy</h1>
          <div className="w-24 h-[1px] bg-terracotta mx-auto"></div>
          <p className="text-indigo/70 font-light leading-relaxed">
            Angilu is committed to providing a transparent and customer-friendly shopping experience. If customers have any concerns, complaints, or grievances related to orders, payments, products, or services on www.angilu.com, they may contact our grievance officer through the process described below. This policy is established in accordance with applicable consumer protection regulations governing e-commerce businesses in India.
          </p>
        </div>

        {/* Main Content - Grievance Redressal Policy */}
        <div className="space-y-12">
          
          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">1.</span> Purpose
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>The purpose of this policy is to provide customers with a clear mechanism to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Raise complaints or concerns</li>
                <li>Report issues related to orders or transactions</li>
                <li>Seek resolution for disputes related to products or services purchased from Angilu</li>
              </ul>
              <p className="mt-4 italic">Angilu aims to resolve customer grievances in a fair, transparent, and timely manner.</p>
            </div>
          </section>

          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">2.</span> Grievance Officer Details
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <div className="bg-kora/50 p-6 rounded-none border border-gold/20 mb-6">
                <p><span className="font-medium">Name:</span> Vardhan Gilla</p>
                <p><span className="font-medium">Email:</span> <a href="mailto:vardhan.gilla@angilu.com" className="text-terracotta hover:underline">vardhan.gilla@angilu.com</a></p>
              </div>
              <p>Customers may contact the grievance officer for matters related to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Order issues</li>
                <li>Payment disputes</li>
                <li>Delivery concerns</li>
                <li>Return or refund issues</li>
                <li>Website-related complaints</li>
              </ul>
            </div>
          </section>

          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">3.</span> How to Submit a Complaint
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>Customers may submit grievances by sending an email with the following details:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Full name</li>
                <li>Order number (if applicable)</li>
                <li>Description of the issue or complaint</li>
                <li>Supporting documents, screenshots, or photographs if relevant</li>
              </ul>
              
              <div className="mt-6 flex flex-col md:flex-row gap-6">
                <div className="flex-1 bg-white/50 p-5 rounded-none border border-gold/10">
                  <h3 className="font-medium text-indigo mb-2 border-b border-gold/20 pb-2">Complaints can be submitted to:</h3>
                  <p><span className="font-medium">Email:</span> <a href="mailto:vardhan.gilla@angilu.com" className="text-terracotta hover:underline">vardhan.gilla@angilu.com</a></p>
                </div>
                
                <div className="flex-1 bg-white/50 p-5 rounded-none border border-gold/10">
                  <h3 className="font-medium text-indigo mb-2 border-b border-gold/20 pb-2">For general support queries, contact:</h3>
                  <p><span className="font-medium">Email:</span> <a href="mailto:support@angilu.com" className="text-terracotta hover:underline">support@angilu.com</a></p>
                  <p><span className="font-medium">Phone:</span> +91 99664 86864</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">4.</span> Complaint Review Process
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>Once a complaint is received:</p>
              <ol className="list-decimal pl-6 space-y-3">
                <li><span className="text-terracotta font-medium">Acknowledge:</span> The grievance officer will review the complaint and acknowledge receipt where applicable.</li>
                <li><span className="text-terracotta font-medium">Investigate:</span> The issue will be investigated internally with relevant teams such as logistics, payments, or customer support.</li>
                <li><span className="text-terracotta font-medium">Resolve:</span> A response or resolution will be provided to the customer as soon as reasonably possible.</li>
              </ol>
            </div>
          </section>

          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">5.</span> Resolution Timeline
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>Angilu aims to acknowledge customer complaints within a reasonable time and resolve them as quickly as possible. Resolution timelines may vary depending on the nature of the issue, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Courier investigations</li>
                <li>Payment verification</li>
                <li>Product inspection</li>
              </ul>
              <p className="mt-4 italic">Customers will be informed if additional time is required for investigation.</p>
            </div>
          </section>

          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">6.</span> Misuse of Grievance Mechanism
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>
                Angilu reserves the right to take appropriate action against individuals who misuse the grievance mechanism by submitting fraudulent claims, false complaints, or repeated abuse of the complaint system. Such actions may lead to restriction of services or account suspension where applicable.
              </p>
            </div>
          </section>

          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">7.</span> Policy Updates
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>
                Angilu reserves the right to modify or update this Grievance Redressal Policy at any time without prior notice. Customers are encouraged to review this policy periodically.
              </p>
            </div>
          </section>

        </div>
        
      </div>
    </div>
  );
};

export default PrivacyPolicySection;


