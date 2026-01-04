const webhookUrl = 'https://discord.com/api/webhooks/1413009868364976218/FRWyak8eE5D6BdqXv5x3_bMiKexf5I8x1y1qJuMPHRMcirw3qxCZseR5qXdatlQrCntp';

const sendNameEmail = (name, email) => {
  const msg = {
    content: `📨 New sign-up received!\n**Name:** ${name}\n**Email:** ${email}`,
    embeds: [{
      title: 'Sign-Up Details',
      color: 3447003,
      fields: [
        { name: 'Name', value: name },
        { name: 'Email', value: email }
      ],
      timestamp: new Date().toISOString()
    }]
  };

  console.log('Sending to webhook:', msg); // Debug log

  fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(msg)
  })
  .then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    console.log('Webhook sent successfully');
  })
  .catch(err => {
    console.error('Webhook error:', err);
  });
};

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#form1').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.querySelector('#Name').value.trim();
    const email = document.querySelector('#Email').value.trim();
    if (!name || !email) return console.warn('Missing input');
    sendNameEmail(name, email);
    setTimeout(() => window.location.href = "Sign Up Code.html", 750);
  });
});
