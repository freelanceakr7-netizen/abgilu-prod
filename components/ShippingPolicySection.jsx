import React from 'react';

const ShippingPolicySection = () => {
  return (
    <div className="bg-kora text-indigo min-h-screen" style={{ lineHeight: '1.8' }}>
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-24">

        {/* Header */}
        <div className="text-center mb-16 space-y-6">
          <span className="text-xs uppercase tracking-[0.4em] text-terracotta font-medium">Customer Support</span>
          <h1 className="text-4xl md:text-5xl font-serif text-indigo">Shipping Policy</h1>
          <div className="w-24 h-[1px] bg-terracotta mx-auto"></div>
          <p className="text-indigo/70 font-light leading-relaxed">
            This Shipping Policy explains how orders placed on www.angilu.com are processed, shipped, and delivered. By placing an order on our website, customers agree to the shipping terms outlined below.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          
          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">1.</span> Order Processing
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>All orders placed on Angilu are processed within 1–2 business days. Order processing includes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Order verification</li>
                <li>Payment confirmation</li>
                <li>Product preparation and packaging</li>
              </ul>
              <p className="mt-4">Orders are processed only on business days, excluding weekends and public holidays. Once the order is processed and dispatched, customers will receive shipping confirmation along with tracking information.</p>
            </div>
          </section>

          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">2.</span> Delivery Timeline
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>After dispatch, delivery timelines may vary depending on the destination. Estimated delivery timelines are:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>6–8 business days for most locations within India</li>
                <li>Delivery timelines may vary for remote areas or during peak seasons</li>
              </ul>
              <p className="mt-4">While Angilu works with reliable courier partners to ensure timely delivery, shipping timelines are estimates and not guaranteed delivery dates. Delays may occur due to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Courier service disruptions</li>
                <li>Weather conditions</li>
                <li>Regional restrictions</li>
                <li>Unforeseen logistical issues</li>
              </ul>
            </div>
          </section>

          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">3.</span> Shipping Charges
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>Angilu offers free shipping on orders above a specified minimum order value, which may be displayed on the website during checkout or promotional campaigns.</p>
              <p>For orders below the applicable threshold, shipping charges may apply and will be displayed during checkout before payment is completed.</p>
              <p className="font-medium text-indigo md:mt-4">Angilu reserves the right to modify shipping charges or promotional shipping offers at any time.</p>
            </div>
          </section>

          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">4.</span> Cash on Delivery (COD)
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>Angilu offers Cash on Delivery (COD) as a payment option for eligible orders.</p>
              <div className="bg-terracotta/5 p-5 rounded-none border border-terracotta/20 my-4">
                <p>A COD handling fee of ₹100 may apply to orders placed using the Cash on Delivery payment method. This charge will be clearly displayed at checkout before the order is confirmed.</p>
              </div>
            </div>
          </section>

          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">5.</span> Shipping and Courier Partners
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>Orders are shipped through reliable third-party courier service providers selected by Angilu. The specific courier partner used for delivery may vary depending on:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Delivery location</li>
                <li>Service availability</li>
                <li>Operational efficiency</li>
              </ul>
              <p className="mt-4">Once the order is shipped, Angilu will provide customers with tracking details to monitor shipment progress.</p>
            </div>
          </section>

          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">6.</span> Order Tracking
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>After an order is dispatched, customers will receive tracking details via email, SMS, or other communication channels. Customers may use the provided tracking information to monitor delivery status through the courier partner's tracking system.</p>
            </div>
          </section>

          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">7.</span> Incorrect or Incomplete Address
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>Customers are responsible for providing accurate and complete shipping information when placing an order. If an incorrect or incomplete address results in delivery failure:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The order may be returned to the Angilu warehouse</li>
                <li>Re-shipping charges will be borne by the customer</li>
              </ul>
              <p className="mt-4 font-medium text-indigo">Angilu is not responsible for delivery issues caused by incorrect address information provided by the customer.</p>
            </div>
          </section>

          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">8.</span> Failed Delivery Attempts
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>Courier partners typically attempt delivery 2–3 times. If delivery attempts fail due to customer unavailability or other issues, the package may be returned to the Angilu warehouse. In such cases:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The customer may be required to pay additional shipping charges for re-dispatch, or</li>
                <li>The order may be cancelled according to Angilu policies</li>
              </ul>
            </div>
          </section>

          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">9.</span> Lost or Delayed Shipments
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>If a shipment appears to be lost or significantly delayed, Angilu will initiate an investigation with the courier partner. Resolution may depend on the outcome of the courier investigation.</p>
              <p>Angilu will make reasonable efforts to resolve such issues, which may include reshipping the product or offering a refund where applicable.</p>
            </div>
          </section>

          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">10.</span> International Shipping
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>Angilu may offer international shipping to select countries. International orders may be subject to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Customs duties</li>
                <li>Import taxes</li>
                <li>Local regulatory fees</li>
              </ul>
              <p className="mt-4">These charges are determined by the destination country's authorities and are the responsibility of the customer. Delivery timelines for international shipments may vary depending on customs clearance and local courier operations.</p>
              <p className="font-medium text-indigo">Please note that international orders are not eligible for returns or exchanges, unless otherwise specified.</p>
            </div>
          </section>

          <section className="bg-white/30 backdrop-blur-sm border border-gold/10 rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-serif text-indigo mb-6 pb-4 border-b border-gold/20 flex items-center gap-3">
              <span className="text-terracotta font-medium">11.</span> Shipping Policy Updates
            </h2>
            <div className="text-indigo/80 space-y-4 font-light">
              <p>Angilu reserves the right to update or modify this Shipping Policy at any time without prior notice. Customers are encouraged to review this policy periodically before placing orders.</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default ShippingPolicySection;

