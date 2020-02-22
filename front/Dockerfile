# Compile
FROM node:10-alpine AS build
WORKDIR /app

COPY . .
RUN npm install

RUN npm run build

# Run
FROM node:10-alpine AS base
WORKDIR /app

COPY --from=build /app/build .

EXPOSE 3000
CMD ["npm","start"]
