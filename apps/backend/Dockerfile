FROM oven/bun:alpine AS base

FROM base AS builder
RUN apk add --no-cache libc6-compat g++ make py3-pip ffmpeg
RUN apk update

RUN pip3 install streamlink

WORKDIR /app

COPY . .
RUN bunx turbo prune --scope @haishin/backend --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
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
RUN bunx turbo run build --filter=@haishin/backend...

# Run the project
FROM base AS runner
WORKDIR /app

COPY --from=installer /app .

CMD ["bun", "apps/backend/src/index.ts"]

EXPOSE 3000