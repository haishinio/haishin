# FROM node:18-alpine AS node
FROM oven/bun:alpine AS bun

# FROM node AS builder
# RUN apk add --no-cache libc6-compat
# RUN apk update
# WORKDIR /app
# RUN yarn global add turbo
# COPY . .
# RUN turbo prune --scope @haishin/frontend --docker

# Add lockfile and package.json's of isolated subworkspace
# FROM bun AS installer
# WORKDIR /app
# # First install the dependencies (as they change less often)
# COPY .gitignore .gitignore
# COPY --from=builder /app/out/json/ .
# COPY --from=builder /app/out/bun.lockb ./bun.lockb
# RUN bun install --production
# # Build the project
# COPY --from=builder /app/out/full/ .

FROM bun AS installer
WORKDIR /app

# Get turbo
RUN bun install -g turbo

# First install the dependencies (as they change less often)
COPY . .
RUN bun install --frozen-lockfile

ARG GIT_SHA
ENV HAISHIN_VERSION=$GIT_SHA

ARG BACKEND_URL
ENV BACKEND_URL=$BACKEND_URL
ENV NEXT_PUBLIC_BACKEND_URL=$BACKEND_URL

ARG WS_URL
ENV WS_URL=$WS_URL

ARG DEEPL_API_KEY
ENV DEEPL_API_KEY=$DEEPL_API_KEY

ARG OPENAI_API_KEY
ENV OPENAI_API_KEY=$OPENAI_API_KEY

ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN

# Use build args to enable remote caching
ARG TURBO_TEAM
ENV TURBO_TEAM=$TURBO_TEAM
ARG TURBO_TOKEN
ENV TURBO_TOKEN=$TURBO_TOKEN

ENV NODE_ENV="production"

RUN bunx turbo run build --filter=frontend...

FROM bun AS runner

ENV FLY="true"
ENV INTERNAL_PORT="3000"
ENV PORT="3000"
ENV NODE_ENV="production"

WORKDIR /app

# Copy our required files from the installer stage
COPY --from=installer /app/apps/frontend ./apps/frontend
COPY --from=installer /app/bun.lockb ./apps/bun.lockb
COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/package.json ./apps/package.json
COPY --from=installer /app/packages ./apps/packages

CMD bun apps/frontend/.next/standalone/server.js