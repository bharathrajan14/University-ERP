// validationResult reads the errors collected by the validator
// middleware (authValidator.js) that ran before this controller.
const { validationResult } = require('express-validator');

// Import the User model. All database operations go through this.
const User = require('../models/User');

// Utility that signs a JWT with the user's id, role, and email.
// Lives in config/ because it is a shared infrastructure concern,
// not business logic tied to a single feature.
const generateToken = require('../config/generateToken');

// ─────────────────────────────────────────────────────────────────
//  REGISTER USER
//  Route  : POST /api/auth/register
//  Access : Public (no token required)
//
//  Execution order:
//    1. express-validator middleware runs (in authValidator.js)
//    2. This controller runs
//    3. Mongoose pre-save hook hashes the password (in User.js)
//    4. MongoDB stores the document
//    5. We return a JSON response
// ─────────────────────────────────────────────────────────────────
const registerUser = async (req, res) => {

  // ── async / try-catch ────────────────────────────────────────
  // Every database call can fail (network issue, DB down, etc.).
  // Without try-catch on an async function, a rejected Promise
  // crashes the entire Node.js process in older versions, or
  // produces an unhandled rejection warning in newer ones.
  // The catch block at the bottom handles ALL unexpected errors.
  try {

    // ── STEP 1: CHECK VALIDATION RESULTS ──────────────────────
    // validationResult(req) collects every error that the validator
    // middleware attached to the request object (req).
    // .isEmpty() returns true if there are NO errors → proceed.
    // If there ARE errors we return immediately with 400 Bad Request.
    //
    // COMMON MISTAKE: forgetting the `return` keyword here.
    // Without `return`, execution continues to the next lines
    // EVEN AFTER sending the 400 response, causing a
    // "Cannot set headers after they are sent" crash.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success : false,
        message : 'Validation failed',
        errors  : errors.array(),
        // errors.array() looks like:
        // [{ type: 'field', msg: 'Email is required', path: 'email', ... }]
      });
    }

    // ── STEP 2: DESTRUCTURE REQUEST BODY ──────────────────────
    // Pull only the fields we expect. Never do `...req.body` and
    // pass it all directly to the DB — a malicious user could send
    // { isActive: false } or { role: 'admin' } and pollute the doc.
    // Explicitly naming each field is the safe pattern.
    const { fullName, email, password, role, department } = req.body;

    // ── STEP 3: CHECK FOR DUPLICATE EMAIL ─────────────────────
    // We do this BEFORE creating the user document.
    //
    // WHY check here when the schema has `unique: true`?
    // Because the MongoDB duplicate-key error (code 11000) is a
    // raw database error with a technical message, not a clean
    // user-friendly response. We intercept it here to return a
    // proper 409 Conflict with a readable message.
    //
    // The `unique` index on the schema acts as the final safety net
    // (handled in the catch block) in case of a race condition
    // (two identical requests hitting the server at the exact
    // same millisecond, both passing this check simultaneously).
    //
    // COMMON MISTAKE: using findOne({ email }) without lowercasing.
    // "John@uni.edu" and "john@uni.edu" would be treated as different
    // emails. The validator's .normalizeEmail() lowercases on input,
    // and the schema's `lowercase: true` lowercases on save, so
    // we are safe — but being explicit here adds clarity.
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success : false,
        message : 'An account with this email address already exists',
      });
    }

    // ── STEP 4: CREATE THE USER ───────────────────────────────
    // User.create({ ... }) is shorthand for:
    //   const user = new User({ ... });
    //   await user.save();
    //
    // It triggers the pre-save hook in User.js, which:
    //   a) detects that `password` is new/modified
    //   b) generates a salt
    //   c) hashes the password with bcrypt
    //   d) replaces the plain-text password with the hash
    // THEN the hashed document is saved to MongoDB.
    //
    // COMMON MISTAKE: manually calling bcrypt.hash() here AND
    // having the pre-save hook. The password would be hashed TWICE,
    // making it permanently unverifiable at login. One place only.
    const user = await User.create({
      fullName,
      email,
      password,   // ← plain text here; hash happens in the model hook
      role,
      department,
    });

    // ── STEP 5: RETURN SUCCESS RESPONSE ──────────────────────
    // HTTP 201 Created = the standard status for a new resource.
    // (200 OK means the request succeeded but nothing was created.)
    //
    // CRITICAL: Never return `user` directly. The schema has
    // `select: false` on the password field so it won't appear in
    // the user object — BUT that protection only applies to
    // .find() / .findOne() queries, NOT to User.create().
    // Manually building the response object is the safe pattern.
    // Explicitly list ONLY the fields the client should see.
    return res.status(201).json({
      success : true,
      message : 'Account created successfully',
      data    : {
        _id        : user._id,
        fullName   : user.fullName,
        email      : user.email,
        role       : user.role,
        department : user.department,
        isActive   : user.isActive,
        createdAt  : user.createdAt,
      },
    });

  } catch (error) {

    // ── SAFETY NET: MongoDB Duplicate Key ────────────────────
    // Error code 11000 = a unique index constraint was violated.
    // This fires if two requests passed Step 3 simultaneously
    // (race condition) and both tried to save the same email.
    // We catch it here and return the same friendly 409 message.
    if (error.code === 11000) {
      return res.status(409).json({
        success : false,
        message : 'An account with this email address already exists',
      });
    }

    // ── SAFETY NET: Mongoose Validation Error ─────────────────
    // If for any reason a validation error reaches here (e.g.,
    // the route was called without the validator middleware),
    // Mongoose throws a ValidationError with a descriptive message.
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success : false,
        message : 'Validation failed',
        errors  : messages,
      });
    }

    // ── SAFETY NET: Unexpected Server Error ───────────────────
    // Log the REAL error on the server (for your debugging),
    // but send only a generic message to the client.
    // NEVER send error.message or error.stack to the client —
    // it can leak internal file paths, DB structure, or library
    // versions that help attackers map your system.
    console.error('[registerUser] Unexpected error:', error);

    return res.status(500).json({
      success : false,
      message : 'Internal server error. Please try again later.',
    });
  }
};

// ═════════════════════════════════════════════════════════════════
//  LOGIN USER
//  Route  : POST /api/auth/login
//  Access : Public (no token required — this is where you GET one)
//
//  Execution order:
//    1. loginValidator middleware runs   (in authValidator.js)
//    2. This controller runs
//    3. bcrypt compares passwords        (inside user.comparePassword)
//    4. generateToken signs a JWT
//    5. Token + user data returned to client
// ═════════════════════════════════════════════════════════════════
const loginUser = async (req, res) => {
  try {

    // ── STEP 1: CHECK VALIDATION RESULTS ──────────────────────
    // Same pattern as register. If email or password field is
    // missing or malformed, stop here with a 400 before touching
    // the database at all.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success : false,
        message : 'Validation failed',
        errors  : errors.array(),
      });
    }

    // ── STEP 2: DESTRUCTURE BODY ──────────────────────────────
    // Login only needs two fields. Anything else in the body
    // is silently ignored — we never destructure req.body blindly.
    const { email, password } = req.body;

    // ── STEP 3: FIND THE USER — AND INCLUDE THE PASSWORD ──────
    // The User schema sets `select: false` on the password field,
    // so every normal query omits it for safety.
    //
    // Here we NEED the password hash to compare it, so we use
    // .select('+password') to explicitly opt it back in for this
    // one query only.
    //
    // COMMON MISTAKE: forgetting .select('+password') and then
    // wondering why bcrypt.compare always returns false —
    // you're comparing the entered password against `undefined`.
    const user = await User.findOne({ email }).select('+password');

    // ── STEP 4: GENERIC "NOT FOUND" RESPONSE ─────────────────
    // CRITICAL SECURITY RULE: never tell the client WHICH part
    // was wrong (email vs password). Two separate messages like
    // "Email not found" and "Wrong password" let attackers run
    // an enumeration attack — they can discover which emails are
    // registered just by reading error messages.
    // Always use the EXACT same message for both failure cases.
    if (!user) {
      return res.status(401).json({
        success : false,
        message : 'Invalid email or password',
      });
    }

    // ── STEP 5: SOFT-DELETE / SUSPENSION CHECK ────────────────
    // If an admin deactivated this account, we block login before
    // even checking the password. We use 403 Forbidden (the user
    // exists and is authenticated, but not authorised to proceed)
    // rather than 401 Unauthorised.
    if (!user.isActive) {
      return res.status(403).json({
        success : false,
        message : 'Your account has been deactivated. Please contact the administrator.',
      });
    }

    // ── STEP 6: COMPARE PASSWORD ──────────────────────────────
    // user.comparePassword() is the instance method we defined
    // on the User schema. It calls bcrypt.compare() internally:
    //
    //   bcrypt.compare("Entered123", "$2a$12$stored_hash")
    //     → hashes "Entered123" the same way and compares
    //     → returns true / false
    //
    // This takes ~100–400 ms because of bcrypt's cost factor.
    // That delay is intentional — it makes brute-force slow.
    //
    // COMMON MISTAKE: comparing passwords BEFORE checking if the
    // user exists. Calling bcrypt.compare(password, undefined)
    // throws an error and hits the catch block with a 500,
    // instead of a clean 401. Always check user first (Step 4).
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success : false,
        message : 'Invalid email or password',  // ← same message as Step 4
      });
    }

    // ── STEP 7: GENERATE JWT TOKEN ────────────────────────────
    // We embed three claims in the payload:
    //
    //   id    → identifies the user on future protected requests
    //           (middleware will do User.findById(decoded.id))
    //
    //   role  → lets route-level middleware check permissions
    //           (e.g. only 'admin' can access /api/admin/*)
    //           without an extra DB lookup on every request
    //
    //   email → convenient for logging and audit trails
    //
    // Keep the payload SMALL. Every API request carries this
    // token in the Authorization header, so every byte matters.
    // Do NOT include fullName, department, or anything that
    // changes over time — the token is not updated on profile edits.
    const token = generateToken({
      id    : user._id,
      role  : user.role,
      email : user.email,
    });

    // ── STEP 8: RETURN SUCCESS RESPONSE ──────────────────────
    // HTTP 200 OK — the user already existed; nothing was created.
    //
    // We return BOTH the token and selected user fields so the
    // client (React app) can:
    //   a) Store the token for future API calls
    //   b) Display the user's name and role in the UI immediately
    //      without a second /me API call
    //
    // password is NOT in this object — user.password is the hash,
    // and we never send it even as a hash.
    return res.status(200).json({
      success : true,
      message : 'Login successful',
      token   : token,
      data    : {
        _id        : user._id,
        fullName   : user.fullName,
        email      : user.email,
        role       : user.role,
        department : user.department,
      },
    });

  } catch (error) {

    // ── SAFETY NET ────────────────────────────────────────────
    // Log real error internally, return generic message to client.
    console.error('[loginUser] Unexpected error:', error);

    return res.status(500).json({
      success : false,
      message : 'Internal server error. Please try again later.',
    });
  }
};

// ═════════════════════════════════════════════════════════════════
//  GET PROFILE
//  Route  : GET /api/auth/profile
//  Access : Private — requires a valid JWT (protect middleware)
//
//  By the time this controller runs, protect middleware has:
//    1. Verified the JWT
//    2. Looked up the user in MongoDB
//    3. Attached the full user document to req.user
//
//  This means getProfile needs ZERO database calls.
//  The work was already done in middleware — we just respond.
// ═════════════════════════════════════════════════════════════════
const getProfile = async (req, res) => {
  try {

    // req.user is the complete, fresh Mongoose user document
    // populated by protect. It already excludes the password
    // because protect used .select('-password').
    //
    // We respond with 200 OK — the resource exists and is returned.
    // No database query here: protect already ran User.findById().
    return res.status(200).json({
      success : true,
      message : 'Profile fetched successfully',
      data    : req.user,
    });

  } catch (error) {
    console.error('[getProfile] Unexpected error:', error);
    return res.status(500).json({
      success : false,
      message : 'Internal server error.',
    });
  }
};


// ═════════════════════════════════════════════════════════════════
//  UPDATE PROFILE
//  Route  : PUT /api/auth/profile
//  Access : Private — requires a valid JWT (protect middleware)
//
//  A user can update only their own non-sensitive fields.
//  Sensitive changes (email, password, role) are intentionally
//  blocked here — they belong on separate, audited endpoints.
// ═════════════════════════════════════════════════════════════════
const updateProfile = async (req, res) => {
  try {

    // ── STEP 1: VALIDATE INPUT ────────────────────────────────
    // updateProfileValidator ran before this controller.
    // Collect its results the same way every controller does.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success : false,
        message : 'Validation failed',
        errors  : errors.array(),
      });
    }

    // ── STEP 2: WHITELIST UPDATABLE FIELDS ───────────────────
    // Destructure ONLY the two fields we allow to change.
    // Even if the client sends { role: 'admin', isActive: false },
    // those keys are silently dropped because we never read them.
    //
    // COMMON MISTAKE: doing User.findByIdAndUpdate(id, req.body).
    // That passes the entire request body straight to MongoDB,
    // letting a user update any field including role and isActive.
    const { fullName, department } = req.body;

    // ── STEP 3: BUILD THE UPDATE OBJECT DYNAMICALLY ──────────
    // Only include a field in the update if the client actually
    // sent it. Without this check, sending { "fullName": "Arun" }
    // would also set department to undefined, clearing the
    // existing value the user never intended to remove.
    const updateFields = {};
    if (fullName  !== undefined) updateFields.fullName  = fullName;
    if (department !== undefined) updateFields.department = department;

    // If the body contained nothing we can update, tell the client.
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success : false,
        message : 'Please provide at least one field to update: fullName or department.',
      });
    }

    // ── STEP 4: UPDATE THE DOCUMENT ──────────────────────────
    // User.findByIdAndUpdate() arguments:
    //
    //   1. req.user._id    — the ID attached by protect middleware.
    //                        Users can only update THEIR OWN profile.
    //                        There is no id in the URL that could
    //                        be swapped to edit someone else's data.
    //
    //   2. updateFields    — only the whitelisted fields.
    //
    //   3. { new: true }   — return the document AFTER the update.
    //                        Without this, Mongoose returns the old
    //                        document and the client sees stale data.
    //
    //   4. { runValidators: true } — re-run schema validators
    //                        (minlength, maxlength, etc.) on the
    //                        new values before saving. Without this,
    //                        schema rules are bypassed on updates.
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateFields,
      { new: true, runValidators: true }
    ).select('-password');

    return res.status(200).json({
      success : true,
      message : 'Profile updated successfully',
      data    : updatedUser,
    });

  } catch (error) {

    // Mongoose validation error — schema constraint violated during update.
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success : false,
        message : 'Validation failed',
        errors  : messages,
      });
    }

    console.error('[updateProfile] Unexpected error:', error);
    return res.status(500).json({
      success : false,
      message : 'Internal server error.',
    });
  }
};

// Also export getMe as alias to getProfile for backwards compatibility
const getMe = getProfile;

// Export all controller functions
module.exports = { registerUser, loginUser, getProfile, updateProfile, getMe };
