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

# RUN npx -p @nestjs/cli@6.10.5 nest build
RUN npm run build

# Run
FROM node:10-alpine AS base
WORKDIR /app

COPY --from=build /app/back .
COPY --from=build /app/front/build ./dist/static

EXPOSE 8080
CMD ["npm","run","start:prod"]
