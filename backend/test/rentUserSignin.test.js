const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const bcrypt = require("bcryptjs");

let mongoServer;
let app;
const User = require("../models/RentUserRegister");

// Suppress console.error in tests
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
});

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Connect mongoose (no deprecated options)
  await mongoose.connect(uri);

  app = require("../index");
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("POST /api/rent-user/signin", () => {
  it("✅ should login successfully with correct email and password", async () => {
    const password = "secret123";
    const user = await User.create({
      username: "testuser",
      email: "test@example.com",
      phone: "9876543210",
      password: await bcrypt.hash(password, 10),
    });

    const res = await request(app)
      .post("/api/rent-user/signin")
      .send({ email: user.email, password });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Login successful");
    expect(res.body.user).toHaveProperty("id"); // changed from _id
    expect(res.body.user.email).toBe(user.email);
  });

  it("❌ should fail with wrong password", async () => {
    const password = "secret123";
    const user = await User.create({
      username: "testuser",
      email: "test@example.com",
      phone: "9876543210",
      password: await bcrypt.hash(password, 10),
    });

    const res = await request(app)
      .post("/api/rent-user/signin")
      .send({ email: user.email, password: "wrongpassword" });

    expect(res.statusCode).toBe(400); // match your controller
    expect(res.body.message).toBe("Invalid credentials");
  });

  it("❌ should fail with unregistered email", async () => {
    const res = await request(app)
      .post("/api/rent-user/signin")
      .send({ email: "unknown@example.com", password: "any" });

    expect(res.statusCode).toBe(400); // match your controller
    expect(res.body.message).toBe("User not found");
  });

  it("❌ should fail if email or password missing", async () => {
    const res = await request(app)
      .post("/api/rent-user/signin")
      .send({ email: "test@example.com" }); // password missing

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Email and password are required");
  });
});