// noinspection MissingOrObsoleteGoogRequiresInspection
module.exports = {
    root: true,
    env: {
        node: true,
        browser: true
    },
    extends: [
        "eslint:recommended",
        "@vue/typescript/recommended",
        "@vue/prettier",
        "@vue/prettier/@typescript-eslint"
    ],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module"
    },
    rules: {
        "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
        "@typescript-eslint/no-explicit-any": "off",
        "no-case-declarations": "off"
    }
};
