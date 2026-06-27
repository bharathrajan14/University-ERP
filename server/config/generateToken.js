// jsonwebtoken is the Node.js library for creating and verifying JWTs.
const jwt = require('jsonwebtoken');

// ─────────────────────────────────────────────────────────────────
//  WHAT IS A JWT?
//
//  A JSON Web Token is a compact, self-contained string made of
//  three Base64-encoded parts separated by dots:
//
//    eyJhbGciOiJIUzI1NiJ9   ← HEADER  (algorithm used)
//    .
//    eyJpZCI6IjY0ZjhhMiJ9   ← PAYLOAD (data you put inside)
//    .
//    SflKxwRJSMeKKF2QT4fw   ← SIGNATURE (proof it wasn't tampered)
//
//  The server creates it at login. The client stores it and sends
//  it back on every future request inside the Authorization header:
//    Authorization: Bearer <token>
//
//  The server verifies the SIGNATURE to trust the PAYLOAD.
//  No database lookup needed — the token IS the session.
//
//  ┌─────────────────────────────────────────────────────────┐
//  │  JWT is NOT encryption. The payload is only Base64-     │
//  │  encoded, which anyone can decode. Never store          │
//  │  passwords, credit cards, or secrets inside a JWT.      │
//  └─────────────────────────────────────────────────────────┘
// ─────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────
//  WHAT IS THE SECRET KEY?
//
//  JWT_SECRET is a long random string only your server knows.
//  It is used to sign the token (HMAC-SHA256 by default).
//
//  If an attacker modifies the payload (e.g., changes role from
//  'student' to 'admin'), the signature breaks. The server
//  detects this and rejects the token — because re-signing the
//  tampered payload with the secret would produce a DIFFERENT
//  signature than the one attached.
//
//  Rules for a good secret key:
//    ✔  At least 32 characters long (256 bits)
//    ✔  Random — not "mysecret" or your app name
//    ✔  Stored in .env, NEVER hardcoded in source code
//    ✔  Never committed to Git
//
//  Generate one safely in your terminal:
//    node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
// ─────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────
//  WHAT IS EXPIRY TIME?
//
//  `expiresIn` embeds an `exp` claim inside the payload.
//  After this time the token is mathematically expired — the
//  server will reject it even if the signature is valid.
//
//  Common ERP patterns:
//    '15m'  → access token (short-lived, high security APIs)
//    '7d'   → standard session (balanced security / UX)
//    '30d'  → "remember me" (low-security dashboards)
//
//  COMMON MISTAKE: Never setting an expiry.
//  A token without `expiresIn` is valid forever. If it is stolen,
//  the attacker has permanent access with no way to revoke it.
//
//  We read the value from .env so it can differ between
//  development (long) and production (short) without code changes.
// ─────────────────────────────────────────────────────────────────

const generateToken = (payload) => {
  // jwt.sign() takes three arguments:
  //
  //   1. payload  — the data to embed (keep it small; it travels
  //                 in every request header). We store just enough
  //                 to identify the user and check their role
  //                 without another DB query.
  //
  //   2. secret   — the signing key from environment variables.
  //                 NEVER use a hardcoded string here.
  //
  //   3. options  — expiresIn is the most important one.
  //                 Fallback to '7d' if the env variable is missing,
  //                 so the app doesn't crash during initial setup.
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

module.exports = generateToken;
