// app.js - small utilities used by pages
window.app = (function () {
  function generateVerificationCode() {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    return code;
  }

  return {
    generateVerificationCode
  };
})();
