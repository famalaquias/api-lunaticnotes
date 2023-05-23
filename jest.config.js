module.exports = {
  /* se um teste falhar, não passa pra outro, para nele para resolver */
  bail: true,
  coverageProvider: "v8",

  testMatch: [
    "**/*.spec.js"
  ],
}
