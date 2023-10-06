FROM oven/bun:alpine

RUN apk add --no-cache g++ make py3-pip ffmpeg
RUN apk update
RUN pip3 install streamlink

WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN bun install --production

COPY src src
COPY tsconfig.json .
# COPY public public

ENV NODE_ENV production
CMD ["bun", "src/index.ts"]

EXPOSE 3000