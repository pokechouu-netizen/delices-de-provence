/* ---------------------------------------------------------------
   admin-invite.js  —  Netlify Function (temporary)
   Envoie des invitations Netlify Identity en utilisant le token
   service-role injecté par Netlify dans context.clientContext.

   Usage: POST /.netlify/functions/admin-invite
   Body: { "secret": "ddp-invite-2026", "email": "user@example.com" }
   --------------------------------------------------------------- */
const https = require('https');

const INVITE_SECRET = 'ddp-invite-2026'; // clé secrète simple

function request(url, options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, res => {
      let data = '';
      res.on('data', c => (data += c));
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

exports.handler = async function (event, context) {
  const cors = { 'Access-Control-Allow-Origin': '*' };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: cors, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: cors, body: 'Method not allowed' };

  let payload;
  try { payload = JSON.parse(event.body || '{}'); } catch { return { statusCode: 400, headers: cors, body: 'Bad JSON' }; }

  if (payload.secret !== INVITE_SECRET) {
    return { statusCode: 403, headers: cors, body: JSON.stringify({ error: 'Wrong secret' }) };
  }

  // Récupère le token service-role injecté par Netlify
  const identity = context.clientContext && context.clientContext.identity;
  if (!identity || !identity.token) {
    return {
      statusCode: 500,
      headers: cors,
      body: JSON.stringify({ error: 'No identity context — check that Netlify Identity is enabled on the site' })
    };
  }

  const { token, url: identityUrl } = identity;

  // Appel GoTrue admin pour envoyer l'invitation
  const ghRes = await request(
    `${identityUrl}/admin/users`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    },
    JSON.stringify({ email: payload.email, invite: true })
  );

  return {
    statusCode: ghRes.status,
    headers: { ...cors, 'Content-Type': 'application/json' },
    body: ghRes.body
  };
};
