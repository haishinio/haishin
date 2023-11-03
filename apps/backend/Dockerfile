FROM oven/bun:alpine AS bun

FROM bun AS builder
RUN apk add --no-cache libc6-compat
RUN apk update
RUN pip3 install streamlink
WORKDIR /app
RUN bun install --global turbo
RUN bunx @turbo/workspaces@latest convert ./ yarn --skip-install
COPY . .
RUN turbo prune --scope @haishin/backend --docker

# Add lockfile and package.json's of isolated subworkspace
FROM bun AS installer
WORKDIR /app

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/bun.lockb ./bun.lockb
RUN bun install --production

# Use build args to enable remote caching
ARG TURBO_TEAM
ENV TURBO_TEAM=$TURBO_TEAM

ARG TURBO_TOKEN
ENV TURBO_TOKEN=$TURBO_TOKEN

# Build the project
COPY --from=builder /app/out/full/ .
RUN bunx turbo run build --filter=backend...

# Run the project
FROM bun AS runner
RUN apk add --no-cache g++ make py3-pip ffmpeg
RUN apk update
RUN pip3 install streamlink
WORKDIR /app
COPY --from=installer /app .

CMD ["bun", "apps/backend/src/index.ts"]

EXPOSE 3000