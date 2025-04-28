FROM node:18-alpine
WORKDIR /backend
COPY package.json .
RUN npm install
COPY . .
EXPOSE 4444
CMD ["node", "server.js"]