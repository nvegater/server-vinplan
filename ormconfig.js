require("dotenv-safe/config")

module.exports = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  logging: true, // log SQL
  synchronize: true, // npx typeorm migration:create -n InitialDBSetup
  entities: [
    "dist/entities/*.js"
  ],
  migrations: [
    "dist/migrations/*.js"
  ]
}
