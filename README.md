# Vinplan server

## Starting server with Docker

Make sure you have the needed environmental variables. (contact trusted entity)

```shell
docker-compose up
yarn install
yarn run dev-ts
```

### Starting server

Make sure an instance of _postgres_ and an instance of _redis_ is running in your computer.
Overwrite the environmental variables to fit your local instances.

```shell
yarn install
yarn run dev-ts
```

## Migrations

Use it everytime you generate changes in the DB entities, to generate the neccessary migration scripts

Requirements: Database must be running and there has to be a connection with the database.

### Automatic

0. Stop the server and make sure there is connection to the DB.
1. Run the migrate command from this folder
```bash
./migrate.sh
```
2. Provide a name for the migration in Camel Case format (e.g. AddNewFieldToTable)
3. Starting the server will run the migration. Hopefully your changes will be available right after that.

### Manual

0. Stop the server, Remove the old `dist/` Folder

1. Generate new production bundle `dist/`
```bash
npm run build
```
2. Generate migrations from `dist/`
```bash
npm run typeorm migration:generate -- -n AnyName
```
The Script to run the automatic migrations is in `package.json`:
```json
{
  "scripts": {
    "typeorm": "node --require ts-node/register ./node_modules/typeorm/cli.js"
  }
}
```

3. Move the new migrations file to the `src/migrations/` folder

4. Remove the  `dist/` again

5. Generate the dist folder again
```bash
npm run build
```
5. Run the server to apply the migrations (auto apply set on `src/typeorm.config.ts`)

### Reminders

[Docu](https://orkhan.gitbook.io/typeorm/docs/using-cli)
Dont use functions for the Default values in the entities.
[Error with defaults](https://github.com/typeorm/typeorm/issues/6490)

