FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# Cached if there is not change in package.json and yarn lock
COPY package*.json ./
COPY yarn.lock ./

RUN yarn
# Run TSC to generate the dist folder
RUN yarn build
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "dist/index.js" ]
