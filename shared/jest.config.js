module.exports = {
    preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
    roots: ["<rootDir>/src"],
    moduleNameMapper: {
        "^@shared/(.*)$": "<rootDir>/src/$1"
    }
};
