// app.js - small utilities used by pages
window.app = (function () {
  // 6-digit numeric code as string
  function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // FORWARD_SECRET is optional here for local testing.
  // In production, never embed secrets in client code.
  // For local testing you may set window.app.FORWARD_SECRET = 'your-test-secret';
  return {
    generateVerificationCode,
    FORWARD_SECRET: '' // set this in the browser console for local testing if needed
  };
})();
