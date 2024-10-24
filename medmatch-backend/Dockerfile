# /backend/Dockerfile
FROM node:18-alpine

WORKDIR /var/www

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
