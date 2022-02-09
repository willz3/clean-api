module.exports = {
  roots: ["<rootDir>/src"],
  collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
  coverageDirectory: "coraverage",
  preset: "ts-jest",
  transform: {
    ".+\\.ts$": "ts-jest",
  },
  testEnvironment: "node",
};
