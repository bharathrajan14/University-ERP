const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ─────────────────────────────────────────────────────────────────
//  USER SCHEMA
//  Defines the shape, rules, and behaviour of every user document
//  stored in MongoDB. Think of this as the "blueprint" for a user.
// ─────────────────────────────────────────────────────────────────
const UserSchema = new mongoose.Schema(
  {
    // ── FULL NAME ───────────────────────────────────────────────
    // `trim` removes accidental leading/trailing whitespace.
    // `minlength` / `maxlength` prevent empty strings and
    // unreasonably long values that could cause UI or DB issues.
    // The second element in the array is the custom error message
    // returned to the client when validation fails.
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [3, 'Full name must be at least 3 characters'],
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },

    // ── EMAIL ───────────────────────────────────────────────────
    // `unique: true` tells Mongoose to create a MongoDB index so
    // no two users can share the same email address.
    // `lowercase: true` normalises the value before saving, so
    // "User@Gmail.com" and "user@gmail.com" are treated as one.
    // `match` runs a Regular Expression check for a valid email
    // format before the document is ever saved.
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },

    // ── PASSWORD ────────────────────────────────────────────────
    // WHY NOT PLAIN TEXT?
    // If your database is ever breached, plain-text passwords
    // expose every user instantly. bcrypt turns the password into
    // a one-way hash (e.g. "$2a$12$...") so even the developer
    // cannot reverse it back to the original string.
    //
    // `select: false` means password is NEVER returned in any
    // query result by default. You must explicitly ask for it
    // with .select('+password') only when you need to verify it
    // (i.e., during login). This protects against accidental leaks.
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },

    // ── ROLE ────────────────────────────────────────────────────
    // `enum` restricts the value to a fixed list. If someone
    // tries to save role: "superuser" it will fail at the DB
    // layer before your controller logic even runs.
    // `default: 'student'` means if no role is supplied during
    // registration, the user is automatically a student.
    role: {
      type: String,
      enum: {
        values: ['student', 'faculty', 'admin', 'department_head'],
        message: "'{VALUE}' is not a recognised role",
      },
      default: 'student',
    },

    // ── DEPARTMENT ──────────────────────────────────────────────
    // Not `required` because an admin user may not belong to any
    // department. We will enforce this at the controller level
    // using conditional validation based on the user's role.
    department: {
      type: String,
      trim: true,
      maxlength: [100, 'Department name cannot exceed 100 characters'],
    },

    // ── IS ACTIVE ───────────────────────────────────────────────
    // Soft-delete / account suspension flag. Instead of deleting
    // a user from the DB (which breaks foreign-key references),
    // we set isActive to false. Middleware can then filter out
    // inactive accounts on every query automatically.
    isActive: {
      type: Boolean,
      default: true,
    },
  },

  // ── SCHEMA OPTIONS ────────────────────────────────────────────
  // `timestamps: true` instructs Mongoose to automatically manage
  // two extra fields on every document:
  //   • createdAt — set once when the document is first saved.
  //   • updatedAt — updated automatically every time the document
  //                 is modified and saved again.
  // You never set these manually; Mongoose handles them for you.
  {
    timestamps: true,
  }
);


// ═════════════════════════════════════════════════════════════════
//  PRE-SAVE MIDDLEWARE  (Mongoose "hook")
//  Runs automatically BEFORE every .save() call on a User document.
//
//  WHY HERE and not in the controller?
//  If you hash in the controller you must remember to do it in
//  every place that touches passwords (register, reset, admin
//  update). Putting it here means it happens exactly once,
//  automatically, no matter which part of the app saves the user.
// ═════════════════════════════════════════════════════════════════
UserSchema.pre('save', async function (next) {
  // `this` refers to the current User document being saved.
  // `isModified('password')` returns true only when the password
  // field has actually changed. This prevents re-hashing an
  // already-hashed password when you update, say, the user's
  // department or role.
  if (!this.isModified('password')) return next();

  // bcrypt.genSalt(12) generates a cryptographic "salt" —
  // a random string mixed into the password before hashing.
  // The number 12 is the "cost factor": higher = slower to
  // compute = harder for attackers to brute-force.
  // 12 is the industry-recommended balance of security vs speed.
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);

  next(); // hand control back to Mongoose to complete the save
});


// ═════════════════════════════════════════════════════════════════
//  INSTANCE METHOD — comparePassword
//  Attached to every User document. Called during login to check
//  if the entered password matches the stored hash.
//
//  Usage in your auth controller:
//    const isMatch = await user.comparePassword(req.body.password);
// ═════════════════════════════════════════════════════════════════
UserSchema.methods.comparePassword = async function (enteredPassword) {
  // bcrypt.compare hashes `enteredPassword` the same way and
  // checks if the result matches `this.password`. Returns true/false.
  return await bcrypt.compare(enteredPassword, this.password);
};


// ═════════════════════════════════════════════════════════════════
//  EXPORT
//  mongoose.model('User', UserSchema) does two things:
//    1. Registers the model with Mongoose under the name 'User'.
//    2. Maps to the 'users' collection in MongoDB (auto-pluralised
//       and lowercased by Mongoose).
// ═════════════════════════════════════════════════════════════════
module.exports = mongoose.model('User', UserSchema);
