# Lexicon

[![CI](https://github.com/alextheman231/lexicon/actions/workflows/ci.yml/badge.svg)](https://github.com/alextheman231/lexicon/actions/workflows/ci.yml)
[![Deploy](https://github.com/alextheman231/lexicon/actions/workflows/deploy.yml/badge.svg)](https://github.com/alextheman231/lexicon/actions/workflows/deploy.yml)

This is a blog site that I have created. It allows users to create, post, and edit blogs. It is the successor to my old Neurosongs project, taking a lot of the ideas that shaped that and polishing them even further with better patterns and a reusable package ecosystem to support it.

Perhaps its biggest selling point as of now is its revision system, where we keep track of the blog's progress through the revisions, and (eventually) we will allow creators to look through older revisions so they not only can see the blog's progress, but also revert back to an older version if needed.

## Tech Stack

The project is created using TypeScript throughout, with Express for the back-end and React + Vite for the front-end. Furthermore we also have the internal configs package providing common project configurations (e.g. for ESLint or alex-c-line), the internal models package for common types and parsers, and end-to-end testing with Playwright. On top of those, all workspaces also use my `@alextheman/utility` package for common utilities for use across this project and all my other projects in general, along with `@alextheman/eslint-plugin` for common linting rules and `alex-c-line` for common developer tooling.

The front-end of Lexicon also uses `@alextheman/components`, which contains common React components that can be used across all my React projects. As of now, though, Lexicon is the only active consumer but it is publicly available on NPM anyway. It particularly makes use of its `QueryBoundary` system to help with displaying data from a query while dealing with its loading, error, and data states.

## Links

You can access the [deployed site here](https://lexiconblogs.com/)
