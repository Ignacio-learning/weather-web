// Vercel serverless entry: load the CJS bundle produced by `npm run build:server`.
// Do NOT import server/src/*.ts here — Vercel treats that as ESM and fails with ERR_REQUIRE_ESM.
const bundled = require('../server/dist/index.cjs');
module.exports = bundled.default || bundled;
