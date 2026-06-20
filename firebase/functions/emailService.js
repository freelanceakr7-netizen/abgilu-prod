/**
 * Firebase Cloud Function for sending emails
 * Uses Zoho SMTP (port 587 STARTTLS) — compatible with GCP Cloud Functions.
 * NOTE: Port 465 (SSL) is blocked on GCP; always use 587 with requireTLS.
 */

const nodemailer = require('nodemailer');
const functions = require('firebase-functions/v1');

// Email configuration — port 587 STARTTLS (GCP only allows outbound on 587, not 465)
const emailConfig = {
  host: process.env.VITE_EMAIL_HOST || 'smtp.zoho.com',
  port: parseInt(process.env.VITE_EMAIL_PORT, 10) || 587,
  secure: false,      // false = STARTTLS; port 465 (SSL) is blocked on GCP
  requireTLS: true,   // force TLS upgrade after STARTTLS handshake
  auth: {
    user: process.env.VITE_EMAIL_USER || 'support@angilu.com',
    pass: process.env.VITE_EMAIL_PASS || '257679@angilu'
  },
  tls: {
    rejectUnauthorized: false  // allow self-signed certs in GCP environment
  }
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// NOTE: transporter.verify() is intentionally NOT called at module load time.
// The Firebase CLI runs the module locally during deploy analysis, causing
// false "535 Authentication Failed" errors in the deploy log.
// SMTP connectivity is verified automatically when the first email is sent.

/**
 * Send OTP Email Cloud Function
 * Triggered via HTTP request
 */
exports.sendOTPEmail = functions.https.onCall(async (data, context) => {
  try {
    const { email, otp } = data || {};

    if (!email || !otp) {
      throw new functions.https.HttpsError('invalid-argument', 'Email and OTP are required');
    }

    console.log('Sending OTP email to:', email);
    console.log('OTP:', otp);

    // Email content
    const mailOptions = {
      from: 'ANGILU <support@angilu.com>',
      to: email,
      subject: 'Your OTP for ANGILU Verification',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>OTP Verification</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333; margin: 0;">ANGILU</h1>
              <p style="color: #666; margin: 10px 0 0 0;">Your One-Time Password</p>
            </div>
            
            <div style="background-color: #f9f9f9; padding: 30px; text-align: center; border-radius: 8px; margin: 20px 0;">
              <p style="color: #333; font-size: 16px; margin: 0 0 15px 0;">Your verification code is:</p>
              <div style="font-size: 36px; font-weight: bold; color: #007bff; letter-spacing: 5px; margin: 20px 0;">
                ${otp}
              </div>
              <p style="color: #666; font-size: 14px; margin: 15px 0 0 0;">
                This code will expire in 5 minutes.
              </p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
              <p style="color: #666; font-size: 14px; margin: 0;">
                If you didn't request this code, please ignore this email.
              </p>
              <p style="color: #666; font-size: 14px; margin: 10px 0 0 0;">
                For assistance, contact us at <a href="mailto:support@angilu.com" style="color: #007bff;">support@angilu.com</a>
              </p>
            </div>
            
            <div style="margin-top: 30px; text-align: center; color: #999; font-size: 12px;">
              <p style="margin: 0;">© ${new Date().getFullYear()} ANGILU. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);

    return {
      success: true,
      message: 'OTP sent successfully',
      messageId: info.messageId
    };

  } catch (error) {
    console.error('Error sending email:', error);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError('internal', 'Failed to send email: ' + error.message);
  }
});

/**
 * Send Order Confirmation Email
 */
exports.sendOrderConfirmation = functions.https.onCall(async (data, context) => {
  try {
    const { email, orderDetails } = data || {};

    if (!email || !orderDetails) {
      throw new functions.https.HttpsError('invalid-argument', 'Email and order details are required');
    }

    console.log('Sending order confirmation to:', email);

    const mailOptions = {
      from: 'ANGILU <support@angilu.com>',
      to: email,
      subject: `Order Confirmation - ${orderDetails.orderId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333; margin: 0;">ANGILU</h1>
              <p style="color: #666; margin: 10px 0 0 0;">Order Confirmation</p>
            </div>
            
            <div style="background-color: #f9f9f9; padding: 30px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #333; margin: 0 0 15px 0;">Thank you for your order!</h2>
              <p style="color: #666; margin: 0;">Your order has been successfully placed.</p>
            </div>
            
            <div style="margin: 20px 0;">
              <h3 style="color: #333; margin: 0 0 10px 0;">Order Details:</h3>
              <p style="color: #666; margin: 5px 0;"><strong>Order ID:</strong> ${orderDetails.orderId}</p>
              <p style="color: #666; margin: 5px 0;"><strong>Total Amount:</strong> ₹${orderDetails.totalAmount}</p>
              <p style="color: #666; margin: 5px 0;"><strong>Payment Method:</strong> ${orderDetails.paymentMethod}</p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
              <p style="color: #666; font-size: 14px; margin: 0;">
                For any queries, contact us at <a href="mailto:support@angilu.com" style="color: #007bff;">support@angilu.com</a>
              </p>
            </div>
            
            <div style="margin-top: 30px; text-align: center; color: #999; font-size: 12px;">
              <p style="margin: 0;">© ${new Date().getFullYear()} ANGILU. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Order confirmation sent successfully:', info.messageId);

    return {
      success: true,
      message: 'Order confirmation sent successfully',
      messageId: info.messageId
    };

  } catch (error) {
    console.error('Error sending order confirmation:', error);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError('internal', 'Failed to send order confirmation: ' + error.message);
  }
});

/**
 * Send Custom Fit Form Submission Email
 */
exports.sendCustomFitEmail = functions.https.onCall(async (data, context) => {
  try {
    const { fullName, email, phone, message } = data || {};

    if (!fullName || !email || !phone) {
      throw new functions.https.HttpsError('invalid-argument', 'Full name, email, and phone are required');
    }

    console.log('Sending custom fit form submission to: support@angilu.com');
    console.log('From:', fullName, email, phone);

    const mailOptions = {
      from: 'ANGILU <support@angilu.com>',
      to: 'support@angilu.com',
      subject: `New Custom Fit Request - ${fullName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Custom Fit Request</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333; margin: 0;">ANGILU</h1>
              <p style="color: #666; margin: 10px 0 0 0;">New Custom Fit Request</p>
            </div>
            
            <div style="background-color: #f9f9f9; padding: 30px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #333; margin: 0 0 20px 0;">Customer Details</h2>
              
              <div style="margin-bottom: 15px;">
                <p style="color: #666; font-size: 14px; margin: 0 0 5px 0;"><strong>Full Name:</strong></p>
                <p style="color: #333; font-size: 16px; margin: 0;">${fullName}</p>
              </div>
              
              <div style="margin-bottom: 15px;">
                <p style="color: #666; font-size: 14px; margin: 0 0 5px 0;"><strong>Email Address:</strong></p>
                <p style="color: #333; font-size: 16px; margin: 0;">${email}</p>
              </div>
              
              <div style="margin-bottom: 15px;">
                <p style="color: #666; font-size: 14px; margin: 0 0 5px 0;"><strong>Phone Number:</strong></p>
                <p style="color: #333; font-size: 16px; margin: 0;">${phone}</p>
              </div>
              
              ${message ? `
              <div style="margin-top: 20px;">
                <p style="color: #666; font-size: 14px; margin: 0 0 5px 0;"><strong>Message / Comments:</strong></p>
                <p style="color: #333; font-size: 16px; margin: 0; line-height: 1.6;">${message}</p>
              </div>
              ` : ''}
            </div>
            
            <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
              <p style="color: #856404; font-size: 14px; margin: 0;">
                <strong>Action Required:</strong> Please contact the customer within 24 hours to discuss their custom fit requirements.
              </p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
              <p style="color: #666; font-size: 14px; margin: 0;">
                <strong>Submission Date:</strong> ${new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'full',
        timeStyle: 'long'
      })}
              </p>
            </div>
            
            <div style="margin-top: 30px; text-align: center; color: #999; font-size: 12px;">
              <p style="margin: 0;">© ${new Date().getFullYear()} ANGILU. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Custom fit email sent successfully:', info.messageId);

    return {
      success: true,
      message: 'Custom fit request submitted successfully',
      messageId: info.messageId
    };

  } catch (error) {
    console.error('Error sending custom fit email:', error);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError('internal', 'Failed to submit custom fit request: ' + error.message);
  }
});
