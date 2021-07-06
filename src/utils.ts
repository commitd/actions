import * as process from "process"
import * as cp from "child_process"
import * as path from "path"

export async function wait(milliseconds: number): Promise<string> {
  return new Promise((resolve) => {
    if (isNaN(milliseconds)) {
      throw new Error("milliseconds not a number")
    }

    setTimeout(() => resolve("done!"), milliseconds)
  })
}

export function runAsAction(
  action: string,
  inputs: Record<string, string> = {}
): string {
  for (const [key, value] of Object.entries(inputs)) {
    process.env[`INPUT_${key.toUpperCase()}`] = `${value}`
  }

  const np = process.execPath

  // TODO: We could look here if dist/$action/index.js or build/$action/main.js exists
  // and pick the newer.
  // THough perhaps its better to have a different environment variable?

  const ip = path.join(__dirname, "..", "dist", action, "index.js")
  const options: cp.ExecFileSyncOptions = {
    env: process.env,
  }
  const stdout = cp.execFileSync(np, [ip], options).toString()

  // eslint-disable-next-line no-console
  console.log(stdout)
  return stdout
}
