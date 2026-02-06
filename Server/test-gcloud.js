const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'config.env') });
const { Storage } = require('@google-cloud/storage');

function resolveCredentialsPath() {
  let credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!credPath) {

    const candidates = ['service-account-key.json', 'service-account-key.json.json', 'service-account.json'];
    for (const c of candidates) {
      const p = path.join(__dirname, c);
      if (fs.existsSync(p)) return p;
    }
    return null;
  }

  if (!path.isAbsolute(credPath)) credPath = path.join(__dirname, credPath);
  if (fs.existsSync(credPath)) return credPath;

  if (!credPath.endsWith('.json') && fs.existsSync(credPath + '.json')) return credPath + '.json';

  return null;
}

async function testConnection() {
  try {
    const resolved = resolveCredentialsPath();
    if (!resolved) {
      console.error('\n❌ Google Cloud credentials not found.');
      console.error('Expected env `GOOGLE_APPLICATION_CREDENTIALS` pointing to a service account JSON.');
      console.error('Current `config.env` value:', process.env.GOOGLE_APPLICATION_CREDENTIALS);
      console.error('Place a key file in the Server folder (e.g. service-account-key.json) or set the env var.');
      process.exitCode = 1;
      return;
    }

    process.env.GOOGLE_APPLICATION_CREDENTIALS = resolved;

    const storage = new Storage(); 
    const [buckets] = await storage.getBuckets(); 
    console.log('✅ Connected successfully! Buckets:', buckets.map(b => b.name));
  } catch (error) {
    console.error('❌ Error connecting to Google Cloud:');
    console.error(error && error.message ? error.message : error);
    if (error && error.code === 7) {
      console.error('Permission denied. Check service account roles and billing.');
    }
    process.exitCode = 1;
  }
}

testConnection();
