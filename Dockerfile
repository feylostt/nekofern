FROM node:latest

# make dir
RUN mkdir -p /usr/src/nekofern
WORKDIR /usr/src/nekofern

COPY package.json /usr/src/nekofern
RUN npm install

COPY . /usr/src/nekofern

# start :3
CMD ["npm", "run", "deploy"]
CMD ["npm", "run", "production"]
