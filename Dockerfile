FROM node:16.14.2-alpine as builder
#Install curl for health check
#RUN apk --no-cache add curl
WORKDIR /app-ui
COPY package.json ./
RUN npm install --legacy-peer-deps
#RUN npm install && mkdir /app-ui && mv ./node_modules ./app-ui

RUN node --version
#WORKDIR /app-ui
COPY . .

RUN npm run build

FROM nginx:latest
#RUN apk add apache2-utils
COPY nginx-proxy.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app-ui/build /usr/share/nginx/html
EXPOSE 80
