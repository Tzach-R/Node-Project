const dotenv = require('dotenv');
const env = process.env.NODE_ENV || 'development';

// Load env-specific .env
dotenv.config({ path: `.env.${env}` });

// Access env var
console.log('Database Host:', process.env.DB_HOST);
console.log('API Key:', process.env.API_KEY_DEV || process.env.API_KEY_PROD);

function error(message) {
  throw new Error(message);
}

const config = {
  environment:
    process.env.ENVIRONMENT || error("ENVIRONMENT is required in env"),
  mongo: {
    uri: process.env.MONGO_URI,
    dbName: process.env.MONGO_DB_NAME,
  },
  app: {
    port: +process.env.PORT,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
};

module.exports = config;
