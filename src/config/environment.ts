import dotenv from "dotenv";
import Joi from "joi";

dotenv.config();

const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default(process.env.NODE_ENV || "development"),
  PORT: Joi.number().positive().required(),

  // jwt
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default("7d"),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default("30d"),

  // database
  DATABASE_TYPE: Joi.string().valid("postgres", "sqlite").default("sqlite"),
  DATABASE_HOST: Joi.string().default("localhost"),
  DATABASE_PORT: Joi.number().default(5432),
  DATABASE_USER: Joi.string().default("postgres"),
  DATABASE_PASSWORD: Joi.string().default("your_password"),
  DATABASE_NAME: Joi.string().default("your_db"),
  DATABASE_SYNCHRONIZE: Joi.boolean().default(true),
  DATABASE_SSL: Joi.boolean().default(false),   // 👈 added
  // email
  EMAIL_HOST: Joi.string().default("smtp.gmail.com"),
  EMAIL_PORT: Joi.number().default(587),
  EMAIL_SECURE: Joi.boolean().default(false),
  EMAIL_USER: Joi.string().email().required(),
  EMAIL_PASS: Joi.string().required(),

  // frontend
  FRONTEND_URL: Joi.string().uri().default("http://localhost:3000"),
}).unknown();

const { error, value } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const config = {
  nodeEnv: value.NODE_ENV,
  port: value.PORT,
  database: {
    type: value.DATABASE_TYPE,
    host: value.DATABASE_HOST,
    port: value.DATABASE_PORT,
    user: value.DATABASE_USER,
    password: value.DATABASE_PASSWORD,
    name: value.DATABASE_NAME,
    database: value.DATABASE_NAME, // For SQLite compatibility
    synchronize: Boolean(value.DATABASE_SYNCHRONIZE),
    ssl: value.DATABASE_SSL ? { rejectUnauthorized: false } : false,  // 👈 FIXED here
  },
  jwt: {
    secret: value.JWT_SECRET,
    expiresIn: value.JWT_EXPIRES_IN,
    refreshSecret: value.JWT_REFRESH_SECRET,
    refreshExpiresIn: value.JWT_REFRESH_EXPIRES_IN,
  },
  email: {
    host: value.EMAIL_HOST,
    port: value.EMAIL_PORT,
    secure: Boolean(value.EMAIL_SECURE),
    user: value.EMAIL_USER,
    pass: value.EMAIL_PASS,
  },
  frontend: {
    url: value.FRONTEND_URL,
  },
} as const;

