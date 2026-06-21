FROM ghcr.io/pnpm/pnpm:latest
RUN ["pnpm", "runtime", "set", "node", "22", "-g"]

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.json ./
COPY apps ./apps
COPY packages ./packages

RUN ["pnpm", "install", "--frozen-lockfile"]
RUN ["pnpm", "run", "build-packages"]
RUN ["pnpm", "run", "build-static"]

EXPOSE 8080

CMD ["pnpm", "--dir", "apps/back-end", "run", "start"]
