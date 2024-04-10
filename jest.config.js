module.exports = {
	roots: ["<rootDir>/src"],
	collectCoverageFrom: [
		"<rootDir>/src/**/*.ts", 
		"!<rootDir>/src/main/**", 
		"!<rootDir>/src/**/**-protocols.ts",
		"!<rootDir>/src/**/index.ts",
		"!<rootDir>/src/**/test/**"
	],
	coverageDirectory: "coraverage",
	preset: "@shelf/jest-mongodb",
	transform: {
		".+\\.ts$": "ts-jest",
	},
	testEnvironment: "node",
	moduleNameMapper: {
		"@/(.*)": "<rootDir>/src/$1"
	}
};
