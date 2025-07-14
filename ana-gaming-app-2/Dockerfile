FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .
COPY .env .env

RUN npm run build

EXPOSE 3031

CMD ["node", "dist/main.js"]
