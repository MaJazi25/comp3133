const express = require("express");
const User = require("../models/User");

const router = express.Router();

function formatDate(d) {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();

  let hh = d.getHours();
  const min = String(d.getMinutes()).padStart(2, "0");
  const ampm = hh >= 12 ? "PM" : "AM";
  hh = hh % 12;
  if (hh === 0) hh = 12;
  const hour = String(hh).padStart(2, "0");

  return `${mm}-${dd}-${yyyy} ${hour}:${min} ${ampm}`;
}

router.post("/signup", async (req, res) => {
  try {
    const { username, firstname, lastname, password } = req.body;

    if (!username || !firstname || !lastname || !password) {
      return res.status(400).json({ ok: false, message: "All fields are required" });
    }

    const user = await User.create({
      username: username.trim(),
      firstname: firstname.trim(),
      lastname: lastname.trim(),
      password,
      createon: formatDate(new Date())
    });

    return res.json({ ok: true, user: { username: user.username } });
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({ ok: false, message: "Username already exists" });
    }
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ ok: false, message: "Username and password are required" });
    }

    const user = await User.findOne({ username: username.trim() });

    if (!user || user.password !== password) {
      return res.status(401).json({ ok: false, message: "Invalid username or password" });
    }

    return res.json({
      ok: true,
      user: { username: user.username, firstname: user.firstname, lastname: user.lastname }
    });
  } catch (err) {
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});

module.exports = router;
