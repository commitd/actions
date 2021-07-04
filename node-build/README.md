# node-build

Perform a complete node install, format check, build.

Example of use:

```yaml
name: Check PR

on:
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      # Get all the history which is useful for sonar
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0

      # Install Node
      - name: Set up Node
        uses: actions/setup-node@v1
        with:
          node-version: "16"

      # Cache everything
      - uses: actions/cache@v2
        env:
          cache-name: node
        with:
          path: ~/.npm
          key: ${{ runner.os }}-${{ env.cache-name }}-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-${{ env.cache-name }}-
      - name: Cache eslintcache
        uses: actions/cache@v2
        env:
          cache-name: eslint
        with:
          path: "**/.eslintcache"
          key: ${{ runner.os }}-${{ env.cache-name }}-$${{ github.ref }}
          restore-keys: |
            ${{ runner.os }}-${{ env.cache-name }}
      - name: Cache sonar
        uses: actions/cache@v2
        env:
          cache-name: sonar
        with:
          path: ~/.sonar
          key: ${{ runner.os }}-${{ env.cache-name }}
          restore-keys: |
            ${{ runner.os }}-${{ env.cache-name }}

      # Our build
      - name: Build
        uses: commitd/actions/node-build@main
```
