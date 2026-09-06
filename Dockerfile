FROM ghcr.io/pnpm/pnpm:latest
RUN ["pnpm", "runtime", "set", "node", "26", "-g"]

ARG GITHUB_SHA=unknown
ENV GITHUB_SHA=${GITHUB_SHA}
ENV VITE_SENTRY_RELEASE=${GITHUB_SHA}

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.json ./
COPY apps ./apps
COPY packages ./packages

RUN ["curl", "-fsSL", "https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem", "-o", "apps/back-end/aws-rds-global-bundle.pem"]

RUN ["pnpm", "install", "--frozen-lockfile"]
RUN ["pnpm", "run", "build-packages"]

EXPOSE 8080

CMD ["pnpm", "--dir", "apps/back-end", "run", "start"]
