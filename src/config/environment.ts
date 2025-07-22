import dotenv from "dotenv";
import Joi from "joi";

dotenv.config();

const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),
  PORT: Joi.number().positive().default(3000),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default("7d"),

  // database
  DATABASE_HOST: Joi.string().default("localhost"),
  DATABASE_PORT: Joi.number().default(5432),
  DATABASE_USER: Joi.string().default("postgres"),
  DATABASE_PASSWORD: Joi.string().default("your_password"),
  DATABASE_NAME: Joi.string().default("your_db"),
  DATABASE_SYNCHRONIZE: Joi.boolean().default(true),
}).unknown();

const { error, value } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const config = {
  nodeEnv: value.NODE_ENV,
  port: value.PORT,
  database: {
    host: value.DATABASE_HOST,
    port: value.DATABASE_PORT,
    user: value.DATABASE_USER,
    password: value.DATABASE_PASSWORD,
    name: value.DATABASE_NAME,
    synchronize: Boolean(value.DATABASE_SYNCHRONIZE),
  },
  jwt: {
    secret: value.JWT_SECRET,
    expiresIn: value.JWT_EXPIRES_IN,
  },
} as const;
