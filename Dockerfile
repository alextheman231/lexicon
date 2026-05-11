FROM ghcr.io/pnpm/pnpm:latest
RUN ["pnpm", "runtime", "set", "node", "22", "-g"]

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.json ./
COPY apps ./apps
COPY packages ./packages
COPY patches ./patches

RUN ["pnpm", "install", "--frozen-lockfile"]
RUN ["pnpm", "run", "build", "--ui=stream"]

EXPOSE 8080

# CMD ["pnpm", "run", "start", "--filter=back-end", "--ui=stream"]
CMD ["sh", "-c", "echo NODE_ENV=$NODE_ENV && echo DATABASE_URL_EXISTS=${DATABASE_URL:+true}"]
