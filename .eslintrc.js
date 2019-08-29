module.exports = {
  extends: ["eslint:recommended", "prettier", "plugin:jest/recommended"],
  parser: "babel-eslint",
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      sourceType: "module",
      allowImportExportEverywhere: false
    },
    sourceType: "module"
  },
  env: {
    es6: true,
    browser: true,
    node: true,
    jasmine: true
  }
};
