require("dotenv-safe/config")

module.exports = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  logging: true, // log SQL
  synchronize: false, // npx typeorm migration:create -n InitialDBSetup
  entities: [
    "dist/entities/*.js"
  ],
  migrations: [
    "dist/migrations/*.js"
  ]
}
