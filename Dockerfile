FROM node:10 

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install 
COPY . .
RUN node_modules/typescript/bin/tsc
EXPOSE 80
CMD [ "npm", "start" ] 