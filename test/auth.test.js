const request = require("supertest");
const app = require("../src/index"); // asire index.js export app la
const { sequelize, User } = require("../src/models");

beforeAll(async () => {
  await sequelize.sync({ force: true });
  await User.create({
    name: "Admin",
    email: "admin@church.com",
    password: "password",
    role: "admin",
  });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Auth API", () => {
  it("should login successfully", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "admin@church.com",
      password: "password",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user.email).toBe("admin@church.com");
  });
});
