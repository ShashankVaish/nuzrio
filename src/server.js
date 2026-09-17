const app = require('./app');
const connectDB = require('./config/db');
const env = require('./config/env');

async function start() {
  try {
    await connectDB();
    app.listen(env.port, () => {
      console.log(`[server] Nuzio backend running on port ${env.port} (${env.nodeEnv})`);
    });
  } catch (err) {
    console.error('[server] Failed to start:', err);
    process.exit(1);
  }
}

start();
