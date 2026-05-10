FROM ghcr.io/pnpm/pnpm:latest

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps ./apps
COPY packages ./packages
COPY patches ./patches

RUN ["pnpm", "install", "--frozen-lockfile"]
RUN ["pnpm", "run", "build", "--ui=stream"]

EXPOSE 8080

CMD ["pnpm", "run", "start", "--filter=back-end", "--ui=stream"]
