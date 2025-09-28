/*const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email taken' });
    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password_hash });
    res.status(201).json({ id: user.id, email: user.email });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Bad credentials' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Bad credentials' });
    const payload = { id: user.id, role: user.role, email: user.email };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '30m' });
    res.json({ accessToken, user: payload });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;*/


/*const express = require("express");
const router = express.Router();
const { User } = require("../models");

// 👉 Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.json({
      message: "✅ Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;*/

// server/src/routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // <- asire modèl sa a egziste

const router = express.Router();

/**
 * POST /auth/seed-admin
 * Kreye admin si pa egziste, ak done ki nan .env:
 *   ADMIN_EMAIL, ADMIN_PASS
 */
router.post("/seed-admin", async (_req, res) => {
  try {
    const email = process.env.ADMIN_EMAIL;
    const pass = process.env.ADMIN_PASS;

    if (!email || !pass) {
      return res.status(400).json({ error: "ADMIN_EMAIL/ADMIN_PASS missing in .env" });
    }

    const found = await User.findOne({ where: { email } });
    if (found) {
      return res.json({ message: "Admin already exists" });
    }

    const hash = await bcrypt.hash(pass, 10);
    await User.create({
      email,
      password_hash: hash,
      role: "admin",
    });

    return res.json({ message: "Admin user created" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
});

/**
 * POST /auth/login
 * Body: { email, password }
 * Retounen: { token, user }
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    // konpare modpas ak bcrypt
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    // si tout bon, siyen yon JWT
    const token = jwt.sign(
      { user_id: user.user_id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "✅ Login successful",
      token,
      user: {
        id: user.user_id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports = router;

