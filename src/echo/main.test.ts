import { runAsAction } from "../utils"

test("test echo", () => {
  runAsAction("echo", {
    value: "From the Test",
  })
})

// Shows how the runner will run a javascript action with env / stdout protocol
