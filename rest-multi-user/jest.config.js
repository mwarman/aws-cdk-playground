module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/cdk"],
  testMatch: ["**/*.test.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};
