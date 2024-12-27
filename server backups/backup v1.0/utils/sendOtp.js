// utils/sendOtp.js
const sendOtp = async (recipient, otp, type) => {
    if (type === 'email') {
      // Use a library like nodemailer to send OTP via email
      console.log(`Sending OTP ${otp} to email ${recipient}`);
    } else if (type === 'sms') {
      // Use an SMS gateway API to send OTP via SMS
      console.log(`Sending OTP ${otp} to mobile ${recipient}`);
    }
  };
  
  module.exports = sendOtp;
  