FROM node:10-alpine
WORKDIR /usr/src/app

COPY . .
RUN npm install

RUN npx -p @nestjs/cli nest build

EXPOSE 3000
CMD ["npm","run","start:prod"]