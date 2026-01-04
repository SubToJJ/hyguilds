// client-webhook.js
// Attempt to send a message directly to Discord webhook (may be blocked by CORS)
async function sendToDiscordDirect(payload) {
  const webhookUrl = "https://discord.com/api/webhooks/1413009868364976218/FRWyak8eE5D6BdqXv5x3_bMiKexf5I8x1y1qJuMPHRMcirw3qxCZseR5qXdatlQrCntp";

  // Build a simple embed to match the example
  const body = {
    embeds: [
      {
        title: "📨 New sign-up received!",
        color: 3066993,
        fields: [
          { name: "Name", value: payload.name || "—", inline: true },
          { name: "Email", value: payload.email || "—", inline: true },
          { name: "Time", value: new Date().toLocaleString(), inline: false }
        ],
        footer: { text: "Sign-Up Details" }
      }
    ]
  };

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      // mode: "no-cors" // not recommended because response is opaque and errors are hidden
    });
    // Note: if CORS blocks this, fetch will throw or response will be opaque
    return res;
  } catch (err) {
    console.error("Direct webhook send failed:", err);
    throw err;
  }
}
