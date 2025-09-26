import { DataSource, DataSourceOptions } from "typeorm";
import entities from "../entities";
import { config } from "../config/environment";

export const dataSourceOptions: DataSourceOptions =
  config.database.type === "sqlite"
    ? {
        type: "sqlite",
        database: config.database.database || "squadco_hackademy.db",
        synchronize: config.database.synchronize,
        entities,
      }
    : {
        type: "postgres",
        host: config.database.host,
        port: config.database.port,
        username: config.database.user,
        password: config.database.password,
        database: config.database.name,
        synchronize: config.database.synchronize,
        entities,
        ...(config.database.ssl
          ? {
              ssl: {
                rejectUnauthorized: false,
              },
            }
          : {}),
      };

export const AppDataSource = new DataSource(dataSourceOptions);
