import 'dotenv/config';

export default {
  schema: './src/models/*.js',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  }
};

//drizzle is mongoose but for the postgres sql instead of writing the raw sql queries we write the javascript and dzzle convert it to the sql queries