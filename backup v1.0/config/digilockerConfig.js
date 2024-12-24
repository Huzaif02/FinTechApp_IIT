module.exports = {
    baseUrl: 'https://api.digilocker.gov.in/v1',
    apiKey: process.env.DIGILOCKER_API_KEY || '',
    documentTypes: ['PAN', 'Aadhaar', 'DrivingLicense'], // Supported document types
  };
  