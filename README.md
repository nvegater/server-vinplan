# Vinplan server


## Starting server with Docker

Make sure you have the needed environmental variables. (contact trusted entity)

```shell
docker-compose up
yarn install
yarn run dev-ts 
```

### Starting server 

Make sure an instance of *postgres* and an instance of *redis* is running in your computer.
Overwrite the environmental variables to fit your local instances.

```shell
yarn install
yarn run dev-ts 
```
