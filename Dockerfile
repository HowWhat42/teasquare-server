FROM node:16

WORKDIR /usr/src/server

COPY . .

RUN npm install

CMD ["npm", "start"]