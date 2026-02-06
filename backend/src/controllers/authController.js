const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { ApiError } = require("../utils/apiError");
const { requireEnv } = require("../config/env");

function signToken(user) {
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

  return jwt.sign(
    { email: user.email },
    requireEnv("JWT_SECRET"),
    { subject: user._id.toString(), expiresIn }
  );
}

async function register(req, res, next) {
  try {
    const { email, password, name } = req.validated.body;

    const exists = await User.findOne({ email }).lean();
    if (exists) throw new ApiError(409, "EMAIL_TAKEN", "Email is already registered");

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({ email, passwordHash, name });

    const token = signToken(user);

    res.status(201).json({
      data: {
        user: { id: user._id, email: user.email, name: user.name || null },
        token
      }
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.validated.body;

    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user) throw new ApiError(401, "INVALID_CREDENTIALS", "Invalid email or password");

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new ApiError(401, "INVALID_CREDENTIALS", "Invalid email or password");

    const token = signToken(user);

    res.json({
      data: {
        user: { id: user._id, email: user.email, name: user.name || null },
        token
      }
    });
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) throw new ApiError(401, "UNAUTHORIZED", "User not found");

    res.json({
      data: { user: { id: user._id, email: user.email, name: user.name || null } }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, me };
