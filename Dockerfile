FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# Cached if there is not change in package.json
COPY package*.json ./

RUN npm
# Run TSC to generate the dist folder
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
# Copy files before compiling
COPY . .
# Copy the production envs into the main envs so they get read
COPY .env.production .env
RUN npm build

ENV NODE_ENV production


EXPOSE 8080
CMD [ "node", "dist/index.js" ]

USER node
