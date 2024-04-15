module.exports = {
  roots: ['<rootDir>/tests'],
	collectCoverageFrom: [
		"<rootDir>/src/**/*.ts", 
		"!<rootDir>/src/main/**", 
		"!<rootDir>/src/**/**-protocols.ts",
		"!<rootDir>/src/**/index.ts",
	],
	coverageDirectory: "coraverage",
	preset: "@shelf/jest-mongodb",
	transform: {
		".+\\.ts$": "ts-jest",
	},
	testEnvironment: "node",
	moduleNameMapper: {
		'@/tests/(.*)': '<rootDir>/tests/$1',
		"@/(.*)": "<rootDir>/src/$1"
	}
};
