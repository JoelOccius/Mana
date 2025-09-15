/*const bcrypt = require("bcryptjs");
const { sequelize } = require("./config/db");
const User = require("./models/User");
const Sermon = require("./models/Sermon");
const Event = require("./models/Event");

async function seed() {
  try {
    await sequelize.sync({ force: true }); // ⚠️ efase epi rekree tablo yo

    // --- Admin User ---
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const admin = await User.create({
      name: "Admin Pastor",
      email: "admin@church.com",
      password: hashedPassword,
      role: "admin",
    });

    // --- Sermons ---
    const sermons = await Sermon.bulkCreate([
      {
        title: "The Power of Prayer",
        content: "A sermon about the importance of constant prayer in our daily lives.",
        preacher: "Pastor John Doe",
        date: new Date("2025-01-05"),
      },
      {
        title: "Walking in the Spirit",
        content: "How to live a Spirit-filled life as believers.",
        preacher: "Pastor Jane Smith",
        date: new Date("2025-01-12"),
      },
    ]);

    // --- Events ---
    const events = await Event.bulkCreate([
      {
        title: "Sunday Worship Service",
        description: "Main weekly service with worship, prayer, and preaching.",
        date: new Date("2025-09-01"),
        location: "Main Sanctuary",
      },
      {
        title: "Youth Conference 2025",
        description: "Special event for the church youth group.",
        date: new Date("2025-10-15"),
        location: "Community Hall",
      },
    ]);

    console.log("✅ Seed completed!");
    console.log("Admin user:", admin.email);
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
}

seed();*/

/*const { sequelize, User, Sermon, Event } = require("./models");

async function seed() {
  try {
    await sequelize.sync({ force: true }); // rekreye tout tab yo

    // Kreye admin user
    const admin = await User.create({
      name: "Admin",
      email: "admin@church.com",
      role: "admin",
      password: "admin123",   // 🔹 kounye a nou sove password an dirèkteman
    });

    console.log("✅ Admin user created:", admin.email);

    // Kreye kèk predikasyon
    await Sermon.bulkCreate([
      { title: "Viv nan Sentespri", content: "Yon mesaj sou wòl Sentespri." },
      { title: "Lanmou Bondye", content: "Bondye renmen ou san kondisyon." },
      { title: "Lapriyè ki gen pouvwa", content: "Pale ak Bondye ak lafwa." },
    ]);
    console.log("✅ 3 sermons created");

    // Kreye kèk evènman
    await Event.bulkCreate([
      { title: "Reyinyon Jèn", date: new Date(), description: "Rasanbleman pou jèn yo." },
      { title: "Sware Lapriyè", date: new Date(), description: "Yon swa lapriyè ak lwanj." },
    ]);
    console.log("✅ 2 events created");

    await sequelize.close();
    console.log("🌱 Seed finished!");
  } catch (err) {
    console.error("❌ Seed error:", err);
  }
}

seed();*/


const { sequelize, User, Sermon, Event } = require("./models");

async function seed() {
  try {
    await sequelize.sync({ force: true });

    await User.create({ name: "Admin", email: "admin@church.com", password: "admin123", role: "admin" });

    await Sermon.bulkCreate([
      { title: "Viv nan Sentespri", content: "Mesaj sou wòl Sentespri." },
      { title: "Lanmou Bondye", content: "Bondye renmen ou san kondisyon." },
      { title: "Lapriyè ki gen pouvwa", content: "Pale ak Bondye ak lafwa." }
    ]);

    await Event.bulkCreate([
      { title: "Reyinyon Jèn", description: "Rasanbleman pou jèn yo.", date: new Date(), location: "Hall 1" },
      { title: "Sware Lapriyè", description: "Yon swa lapriyè ak lwanj.", date: new Date(), location: "Main Sanctuary" }
    ]);

    console.log("🌱 Seed finished!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
}

seed();


