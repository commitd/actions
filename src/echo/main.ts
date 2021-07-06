import * as core from "@actions/core"

async function run(): Promise<void> {
  try {
    const value: string = core.getInput("value")
    core.info(`Echo value="${value}".`)
    core.setOutput("value", value)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
