# actions

Committed GitHub Actions.

This is a mix of Typescript actions, composite actions and Dockerfile actions.

## Usage

Use the `latest` branch for the version, unless you want to specific tagged version.
For example use `commitd/action/name@latest` (where `name` is the directory in which the action is in this repository).

## Development

This repository is based on [actions/typescript-action](https://github.com/actions/typescript-action) which is a basic template and [github/codeql-action](https://github.com/github/codeql-action) which illustrates a multi-action repository (though is not a starter template).

We use the following branches:

- `main` the source
- `latest` the release branch. This contains the node_modules and build artifacts.

We have two different build processes:

- Running `npm run package --action=<action_name>` or `npm run package:all` will create a packaged ncc build which will be output to the `dist/` directory. This is the artifact which are used by GitHub and in the tests.
- Running `npm run build` will perform a typescript build, which will be output to the build directory. This are not used, but the build is quicker.

The tests (`npm test`) can be considered (manual verified in most case) integration tests. Used the `package` built artifacts.
As such you must build before you test:

```
npm run package:all
npm test
```

## Adding a new Typescript action

Creating a new action with Typescript is simple by convention.

We assume the action is called `example`. Everywhere where example is included below you be replaced with the actual action name.

- Create a new directory in the root called `example`.
- Create an `action.yml` which should reference the script

```
# TODO: Give a good name and description
name: 'Committed Example'
description: 'An example github action'
author: 'Committed'
# TODO You may need inputs and outputs
runs:
  using: 'node12'
  # TODO: Replace this
  main: 'dist/example/index.js'
```

- Create a directory called `example` under `src`.
- Create an `main.ts` which will look like:

```
import * as core from "@actions/core"

async function run(): Promise<void> {
  try {
      // TODO Your code here
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
```

- Create a `main.test.ts` (though any name will do) which will run the compiled action

```
test("Run example", () => {
  runAsAction("example", {
    // TODO: if you have any variables
  })
})
```

- You can now implement you function. If you are building a complex function then spilt into smaller files which can be independently unit tested.
- (Build and) Test your script as GitHub will `npm run test:action --action=example`
- Add a `.github/workflow/test-example.yml` which will run your test within an GitHub Action (but in this repo). This isn't checking general formatting, etc but will it will specifically run your tests and then GitHub will run your action.

```
name: Test example

# Only run on pull requests and push to main when the
on:
  push:
    branches:
      - main
    paths:
      - src/example/**.ts
  pull_request:
    paths:
      - src/example/**.ts

env:
  ACTION: example

jobs:
  test-action:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Set up Node
        uses: actions/setup-node@v1
        with:
          node-version: "16"
          cache: "npm"

      - name: Install
        run: npm ci

      - name: Build
        run: npm run package --action=${env.ACTION}

      - name: Test
        run: npm test src/${env.ACTION}

      # TODO: Before you run your example you might need something to run it on
      # e.g. a node project.
      # Here you will need to setup that test environment.

      - name: Use action
        uses: ./${env.ACTION}
        with:
          value: "Hello from GitHub Actions"
```

## Adding a new composite or Docker action

Composite and Docker action can be created simply:

- Create a new directory with the name of your action.
- Add the `action.yml` as specification
- Add the another files (e.g. Dockerfile)

This can then be pull-requested, etc as with a Typescript action.

### Please note!

You **must** commit the `node_modules` directory and all the build artifacts.

This is a multi action repository, the actions are named by directory.
Within an action directory there will is a `action.yml` file.
To avoid confusion, limit the number of directories to a minimum!

You can use either branch or tag (or commit) to refer to which action you want.
As we have multiple actions, we are versioning everything at once.

### Tips

debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
