import dotenv from "dotenv";
import Joi from "joi";

dotenv.config();

console.log({ port: process.env.PORT });

const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),
  PORT: Joi.number().positive().required(),

  // jwt
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default("7d"),

  // database
  DATABASE_HOST: Joi.string().default("localhost"),
  DATABASE_PORT: Joi.number().default(5432),
  DATABASE_USER: Joi.string().default("postgres"),
  DATABASE_PASSWORD: Joi.string().default("your_password"),
  DATABASE_NAME: Joi.string().default("your_db"),
  DATABASE_SYNCHRONIZE: Joi.boolean().default(true),

  // email
  EMAIL_HOST: Joi.string().default("smtp.gmail.com"),
  EMAIL_PORT: Joi.number().default(587),
  EMAIL_SECURE: Joi.boolean().default(false),
  EMAIL_USER: Joi.string().email().required(),
  EMAIL_PASS: Joi.string().required(),
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
  email: {
    host: value.EMAIL_HOST,
    port: value.EMAIL_PORT,
    secure: Boolean(value.EMAIL_SECURE),
    user: value.EMAIL_USER,
    pass: value.EMAIL_PASS,
  },
} as const;
