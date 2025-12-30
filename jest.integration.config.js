const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  displayName: "integration",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testMatch: ["<rootDir>/tests/integration/**/*.test.ts"],
};

const buildConfig = createJestConfig(customJestConfig);

module.exports = async () => {
  const config = await buildConfig();

  config.transformIgnorePatterns = [
    "/node_modules/(?!.pnpm)(?!(msw|@mswjs|@open-draft|until-async)/)",
    "/node_modules/.pnpm/(?!(msw|@mswjs|@open-draft|until-async)@)",
    "^.+\\.module\\.(css|sass|scss)$",
  ];

  return config;
};
