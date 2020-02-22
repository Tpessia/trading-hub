# Compile
FROM node:10-alpine AS build
WORKDIR /app

COPY . .
RUN npm install

RUN npx -p @nestjs/cli nest build

# Run
FROM node:10-alpine AS base
WORKDIR /app

COPY --from=build /app/dist .

EXPOSE 3001
CMD ["npm","run","start:prod"]
