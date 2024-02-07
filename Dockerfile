# get the base image
FROM node:18.19-alpine3.18 as builder

# set the app working directory
WORKDIR /usr/src/app

# copy package.json
COPY ../package*.json ./

# install dependencies
RUN npm install

# copy the rest of the application code
COPY ../ ./

# build the application
RUN npm run build

# expose the port in which the app will listen
EXPOSE 3000

# start the application
CMD ["node", "dist/main.js"]