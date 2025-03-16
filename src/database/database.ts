import mongoose from "mongoose";
import { env } from "../common/utils/env.config";
import InitialSeeder from "./seeders/initial.seeder";

export const initializeDatabaseConnection = async () => {
  const MONGO_URI = `mongodb://${env.MONGO_USER}:${env.MONGO_PASSWORD}@${env.MONGO_HOST}:${env.MONGO_PORT}/${env.MONGO_DB}?authSource=admin`;
  const seeder = new InitialSeeder();
  for (let i = 1; i < 3; ++i) {
    try {
      console.log(`Connecting to db...(${i})`);
      await mongoose.connect(MONGO_URI);

      if (env.SEED_DB === "true") {
        await seeder.run();
      }

      break;
    } catch (err) {
      console.log("Failed", i);
      if (i >= 2) {
        throw err;
      }
    }
  }
};
