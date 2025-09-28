// backend/jest.config.js
module.exports = {
  roots: ["<rootDir>/"],             // only scan files in backend/
  testMatch: [
    "**/__tests__/**/*.test.js",
    "**/?(*.)+(spec|test).js"
  ],
  testEnvironment: "node",           // for Express/Mongo backend
  testTimeout: 30000,                // allow time for MongoMemoryServer
  testPathIgnorePatterns: [
    "<rootDir>/../src/"               // ignore frontend folder
  ],
  verbose: true
};
