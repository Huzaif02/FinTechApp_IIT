const axios = require('axios'); // For making HTTP requests (used in generateOTPLive)
const nodemailer = require('nodemailer'); // For sending emails


// Function to generate a 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP

/**
 * Sends OTPs to a mobile number and email address.
 * Logs OTPs to the console in development mode.
 * Sends OTPs using live services in production.
 *
 * @param {string} mobile - The user's mobile number.
 * @param {string} email - The user's email address.
 * @param {string} mobileOtp - OTP for mobile verification.
 * @param {string} emailOtp - OTP for email verification.
 * @returns {Promise<void>}
 */

const sendOTP = async (mobile, email, mobileOtp, emailOtp) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      // Log OTPs in development mode
      console.log(`Development Mode: OTP for mobile ${mobile} is ${mobileOtp}`);
      console.log(`Development Mode: OTP for email ${email} is ${emailOtp}`);
      
      // Sending OTP via Email
      const emailTransporter = nodemailer.createTransport({
        service: 'Gmail', // You can replace this with other email providers
        auth: {
          user: process.env.EMAIL_USER, // Your email address
          pass: process.env.EMAIL_PASS, // Your email password or app password
        },
      });

      const emailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP for Registration Verification',
        text: `Your OTP is ${emailOtp}. It will expire in 5 minutes.`,
      };

      await emailTransporter.sendMail(emailOptions);
      console.log(`OTP sent successfully to email ${email}`);
    
    } else {
      // Live mode: Send OTP via SMS and email

      // Sending OTP via SMS
      const smsServiceURL = process.env.SMS_SERVICE_URL; // Your SMS service URL
      const smsApiKey = process.env.SMS_API_KEY; // SMS service API key
      const smsSenderId = process.env.SMS_SENDER_ID; // Sender ID for SMS

      const smsPayload = {
        apiKey: smsApiKey,
        sender: smsSenderId,
        numbers: mobile,
        message: `Your OTP is ${mobileOtp}. It will expire in 5 minutes.`,
      };

      await axios.post(smsServiceURL, smsPayload).then((response) => {
        if (response.data.status === 'success') {
          console.log(`OTP sent successfully to mobile ${mobile}`);
        } else {
          console.error(`Failed to send OTP to mobile ${mobile}: ${response.data.message}`);
        }
      });

      // Sending OTP via Email
      const emailTransporter = nodemailer.createTransport({
        service: 'Gmail', // You can replace this with other email providers
        auth: {
          user: process.env.EMAIL_USER, // Your email address
          pass: process.env.EMAIL_PASS, // Your email password or app password
        },
      });

      const emailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP for Verification',
        text: `Your OTP is ${emailOtp}. It will expire in 5 minutes.`,
      };

      await emailTransporter.sendMail(emailOptions);
      console.log(`OTP sent successfully to email ${email}`);
    }
  } catch (error) {
    console.error('Error in sendOTP:', error.message);
    throw new Error('Error sending OTP. Please try again.');
  }
};

module.exports = { generateOTP, sendOTP };
