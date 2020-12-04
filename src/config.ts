import "dotenv/config";

export default {
  PORT: process.env.PORT || 3000,
  SECRET_KEY: process.env.SECRET_KEY || "secret_key"
};

