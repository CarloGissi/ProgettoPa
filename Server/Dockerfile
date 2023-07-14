FROM node:14-bullseye

EXPOSE 8080

WORKDIR /src

COPY ../package.json ../package*.json ./
COPY ../dist ./
RUN  apt-get update -y 
RUN apt-get -y upgrade
RUN apt-get install -y ffmpeg
RUN npm install

CMD ["node", "index.js"]