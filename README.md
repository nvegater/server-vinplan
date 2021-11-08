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

## Automatic Migrations

[Docu](https://orkhan.gitbook.io/typeorm/docs/using-cli)
Dont use functions for the Default values in the entities.
[Error with defaults](https://github.com/typeorm/typeorm/issues/6490)


The Script to run the automatic migrations is in `package.json`:
```json
{
  "scripts": {
    "typeorm": "node --require ts-node/register ./node_modules/typeorm/cli.js"
  }
}
```
Use it everytime you generate changes in the DB entities, to generate the neccessary migration scripts
1. Generate production bundle `dist/`
```bash
npm run build
```
2. Generate migrations from `dist/`
```bash
npm run typeorm migration:generate -- -n AnyName
```
3. Restart the server
