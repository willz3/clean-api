module.exports = {
	roots: ["<rootDir>/src"],
	collectCoverageFrom: ["<rootDir>/src/**/*.ts", "!<rootDir>/src/main/**"],
	coverageDirectory: "coraverage",
	preset: "@shelf/jest-mongodb",
	transform: {
		".+\\.ts$": "ts-jest",
	},
	testEnvironment: "node",
};
