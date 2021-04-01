require("dotenv-safe/config")

module.exports = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || "5432"),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE_NAME,
  logging: true, // log SQL
  synchronize: false, // npx typeorm migration:create -n InitialDBSetup
  entities: [
    "dist/entities/*.js"
  ],
  migrations: [
    "dist/migrations/*.js"
  ]
}
