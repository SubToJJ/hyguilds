// app.js - small utilities used by pages
window.app = (function () {
  function generateVerificationCode() {
    // 6-digit numeric code as string
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    return code;
  }

  return {
    generateVerificationCode
  };
})();
