FROM node:20.17.0-alpine

WORKDIR /app

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

WORKDIR /app/server

EXPOSE 8080

CMD npx nodemon -L --inspect=0.0.0.0 index.js --host 0.0.0.0 --port 8080 --cache ./cache
