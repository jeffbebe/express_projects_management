import dotenv from "dotenv";
import { cleanEnv, host, num, port, str, testOnly } from "envalid";

dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    devDefault: testOnly("test"),
    choices: ["development", "production", "test"],
  }),
  MONGO_PORT: host({ devDefault: testOnly("27017") }),
  MONGO_HOST: host({ devDefault: testOnly("127.0.0.1") }),
  MONGO_DB: host({ devDefault: testOnly("db") }),
  MONGO_USER: host({ devDefault: testOnly("admin") }),
  MONGO_PASSWORD: host({ devDefault: testOnly("secret") }),
  SEED_DB: host({ devDefault: testOnly("true") }),
  PORT: port({ devDefault: testOnly(3000) }),
  CORS_ORIGIN: str({ devDefault: testOnly("http://localhost:3000") }),
});
