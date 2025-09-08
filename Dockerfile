FROM node:20 AS builder

ARG APP_NAME

WORKDIR /usr/src/app

COPY package*.json ./

COPY ./example.env ./

RUN mv example.env .env

COPY ./apps/vehicles-microservice/prisma ./prisma

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build ${APP_NAME}

RUN npm prune --production

FROM node:20-alpine
ARG APP_NAME

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules

COPY --from=builder /usr/src/app/dist/apps/${APP_NAME} ./dist

COPY --from=builder /usr/src/app/prisma ./prisma

COPY package.json .

EXPOSE 3000

CMD [ "node", "dist/main.js" ]
