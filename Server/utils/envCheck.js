
const requiredVars = [
  'DATABASE',
  'NODE_ENV',
  'PORT',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'KEY',
  'IV',
  'HOST',
  'USER_EMAIL',
  'PASS'
  , 'USER'
];

function humanize(list) {
  return list.map((s) => `
  - ${s}`).join('');
}

module.exports = function checkEnv() {
  const missing = requiredVars.filter((v) => !process.env[v] || process.env[v].trim() === '');

  if (missing.length > 0) {
    console.error('\n[ENV CHECK] Missing required environment variables:');
    console.error(humanize(missing));
    console.error('\nPlease populate these in your `Server/config.env` or the environment and restart.');
    process.exit(1);
  }

  const key = process.env.KEY || '';
  const iv = process.env.IV || '';

  if (!/^[0-9a-fA-F]+$/.test(key) || key.length !== 64) {
    console.error('\n[ENV CHECK] Invalid `KEY` — expected a 64-character hex string (32 bytes).');
    process.exit(1);
  }

  if (!/^[0-9a-fA-F]+$/.test(iv) || iv.length !== 32) {
    console.error('\n[ENV CHECK] Invalid `IV` — expected a 32-character hex string (16 bytes).');
    process.exit(1);
  }

  if (process.env.JWT_SECRET && process.env.JWT_SECRET.includes('your_jwt_secret')) {
    console.warn('\n[ENV CHECK] Warning: `JWT_SECRET` still looks like a placeholder. Replace with a strong secret.');
  }

  console.log('[ENV CHECK] All required environment variables are present.');
};