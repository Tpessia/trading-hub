# Compile 1
FROM node:10-alpine AS build
WORKDIR /app/front

COPY ./front .
RUN npm install

RUN npm run build

# Compile 2
WORKDIR /app/back

COPY ./back .
RUN npm install

RUN npx -p @nestjs/cli nest build

# Run
FROM node:10-alpine AS base
WORKDIR /app

COPY --from=build /app/back .
COPY --from=build /app/front/build ./dist/static


EXPOSE 3001
CMD ["npm","run","start:prod"]
