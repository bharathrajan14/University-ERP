// express-validator gives us `body()` — a function that targets
// a specific field inside req.body and chains validation rules onto it.
const { body } = require('express-validator');

// ─────────────────────────────────────────────────────────────────
//  REGISTER VALIDATOR
//
//  This is an ARRAY of middleware functions. Express runs each one
//  in order before the request ever reaches the controller.
//  The controller then reads the results with validationResult().
//
//  WHY a separate file?
//  Keeps controllers clean. The controller's only job is to talk
//  to the database. Validation is a separate concern.
// ─────────────────────────────────────────────────────────────────
const registerValidator = [

  // ── FULL NAME ─────────────────────────────────────────────────
  // .trim()      → strips whitespace before any validation runs.
  // .notEmpty()  → fails if the value is "" after trimming.
  // .isLength()  → enforces min/max character count.
  // .withMessage() → the exact string sent to the client on failure.
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Full name must be between 3 and 100 characters'),

  // ── EMAIL ──────────────────────────────────────────────────────
  // .isEmail()       → checks structure (has @, has domain, etc.)
  // .normalizeEmail()→ lowercases and removes dots in Gmail names.
  //                    "John.Doe+test@Gmail.COM" → "johndoe@gmail.com"
  //                    This ensures consistent storage.
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  // ── PASSWORD ───────────────────────────────────────────────────
  // COMMON MISTAKE: validating password length AFTER hashing.
  // Always validate the RAW password first (before bcrypt runs).
  // By the time the pre-save hook fires, validation is already done.
  //
  // .matches() checks a regex pattern:
  //   (?=.*[a-z]) → at least one lowercase letter
  //   (?=.*[A-Z]) → at least one uppercase letter
  //   (?=.*\d)    → at least one number
  // This enforces basic password strength without a library.
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),

  // ── ROLE ───────────────────────────────────────────────────────
  // .optional() → only run this validation IF the field is present.
  //               If the client sends no role, the model default
  //               ('student') kicks in automatically.
  // .isIn()     → whitelist approach: only these exact values pass.
  body('role')
    .optional()
    .isIn(['student', 'faculty', 'admin', 'department_head'])
    .withMessage(
      "Role must be one of: student, faculty, admin, department_head"
    ),

  // ── DEPARTMENT ─────────────────────────────────────────────────
  // Also optional. An admin may register without a department.
  // .isLength() without min still catches accidental empty strings
  // that slip past .optional() when the field IS present but blank.
  body('department')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Department name cannot exceed 100 characters'),

];

// ─────────────────────────────────────────────────────────────────
//  LOGIN VALIDATOR
//
//  Login only needs two fields: email and password.
//  We do NOT check password strength here — that was a registration
//  concern. At login we just need to confirm both fields exist
//  so we can attempt the bcrypt comparison in the controller.
//
//  COMMON MISTAKE: copy-pasting the register password validator
//  here (with .isLength, .matches, etc.). A user might have
//  registered before the strength rules existed. If their old
//  password no longer passes the new rules, they can never log in.
//  Login validation must be as permissive as possible —
//  the bcrypt check is the real gate.
// ─────────────────────────────────────────────────────────────────
const loginValidator = [

  // Just confirm it looks like an email — normalizeEmail lowercases
  // it to match what was stored during registration.
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  // Just confirm password was sent — length/strength not checked.
  body('password')
    .notEmpty()
    .withMessage('Password is required'),

];

module.exports = { registerValidator, loginValidator };
