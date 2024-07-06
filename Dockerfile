FROM node:latest

WORKDIR /admin

ENV AWS_REGION=us-west-1
ENV AWS_SECRET=staging-admin 

COPY ./package.json .

RUN yarn install

RUN yarn add aws-sdk

COPY . .

EXPOSE 8080

CMD ["sh", "-c", "node secrets.cjs && yarn build && yarn start"]
