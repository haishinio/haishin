FROM node:18-alpine AS builder

RUN apk add --no-cache libc6-compat
RUN apk update

WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope @haishin/frontend --docker

# Add lockfile and package.json's of isolated subworkspace
FROM node:18-alpine AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
RUN npm install -g pnpm turbo

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install

# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

ARG GIT_REVISION
ENV HAISHIN_VERSION=$GIT_REVISION

ARG RTMP_CLIENT_API_URL
ENV RTMP_CLIENT_API_URL=$RTMP_CLIENT_API_URL
ENV NEXT_PUBLIC_RTMP_CLIENT_API_URL=$RTMP_CLIENT_API_URL

ARG WS_URL
ENV WS_URL=$WS_URL

ARG DEEPL_API_KEY
ENV DEEPL_API_KEY=$DEEPL_API_KEY

ARG OPENAI_API_KEY
ENV OPENAI_API_KEY=$OPENAI_API_KEY

ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN

# Uncomment and use build args to enable remote caching
ARG TURBO_TEAM
ENV TURBO_TEAM=$TURBO_TEAM

ARG TURBO_TOKEN
ENV TURBO_TOKEN=$TURBO_TOKEN

RUN pnpm turbo run build --filter=frontend...

FROM node:18-alpine AS runner

RUN apk add --no-cache g++ make py3-pip ffmpeg
RUN apk update

WORKDIR /app

# Don't run production as root
# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs
# USER nextjs

COPY --from=installer /app/apps/frontend/next.config.js .
COPY --from=installer /app/apps/frontend/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/frontend/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/frontend/.next/static ./apps/frontend/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/frontend/public ./apps/frontend/public

# Ideally we'd just copy the @ffmpeg folder but since it's got the version+patch it seems a little difficult
COPY --from=installer --chown=nextjs:nodejs /app/node_modules/.pnpm/@ffmpeg+core@0.11.0_patch_hash=ld7rzfw7iozpndvzizlt4sbpaa ./node_modules/.pnpm/@ffmpeg+core@0.11.0_patch_hash=ld7rzfw7iozpndvzizlt4sbpaa
COPY --from=installer /app/packages/transcriber/node_modules/@ffmpeg/core ./packages/transcriber/node_modules/@ffmpeg/core
COPY --from=installer /app/packages/transcriber/dist ./packages/transcriber/dist

CMD node apps/frontend/server.js