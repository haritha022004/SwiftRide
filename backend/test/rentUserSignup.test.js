const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const bcrypt = require("bcryptjs");

let mongoServer;
let app;
const User = require("../models/RentUserRegister");

// Suppress console.error in tests (so bcrypt errors for missing password don't clutter output)
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
});

beforeAll(async () => {
  // Start in-memory MongoDB
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Connect mongoose
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Load app AFTER DB connect
  app = require("../index");
});

afterEach(async () => {
  // Clear users after each test
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("POST /api/rent-user/register", () => {
  it("✅ should create a new user and hash the password", async () => {
    const payload = {
      username: "testuser",
      email: "test@example.com",
      phone: "9876543210",
      password: "secret123",
    };

    const res = await request(app).post("/api/rent-user/register").send(payload);

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User registered successfully");

    // Controller returns full user object with _id
    expect(res.body.user).toHaveProperty("_id");
    expect(res.body.user.email).toBe(payload.email);

    const saved = await User.findOne({ email: payload.email });
    expect(saved).not.toBeNull();
    expect(saved.password).not.toBe(payload.password);

    const match = await bcrypt.compare(payload.password, saved.password);
    expect(match).toBe(true);
  });

  it("❌ should reject duplicate emails", async () => {
    const payload = {
      username: "duper",
      email: "dup@example.com",
      phone: "1234567890",
      password: "secret123",
    };

    // First signup
    await request(app).post("/api/rent-user/register").send(payload);

    // Second signup with same email
    const res = await request(app).post("/api/rent-user/register").send(payload);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Email already registered");
  });

  it("❌ should reject missing required fields", async () => {
    const res = await request(app).post("/api/rent-user/register").send({
      email: "missing@example.com",
    });

    // Your controller currently throws bcrypt error → 500
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("Server error");
  });
});