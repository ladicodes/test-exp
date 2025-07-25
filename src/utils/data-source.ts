import { DataSource, DataSourceOptions } from "typeorm";
import entities from "../entities";
import { config } from "../config/environment";

export const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: config.database.host,
  port: config.database.port,
  username: config.database.user,
  password: config.database.password,
  database: config.database.name,
  synchronize: config.database.synchronize,
  // logging: true,
  entities,
  ...(config.nodeEnv === "development"
    ? {}
    : {
        ssl: {
          rejectUnauthorized: false,
        },
      }),
};

export const AppDataSource = new DataSource(dataSourceOptions);
