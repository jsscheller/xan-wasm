import * as path from "path";
import * as os from "os";
import * as fs from "fs/promises";
import { run } from "runish";

const LIB_DIR = path.resolve("./lib");
const JS_DIR = path.resolve("./js");
const OUT_DIR = path.resolve("./out");

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  await run("patch", ["-p1", "-i", "patches/xan.patch"]);

  const emccArgs = [
    "-lworkerfs.js",
    `--pre-js=${JS_DIR}/pre.js`,
    `--post-js=${JS_DIR}/post.js`,
    "-sALLOW_MEMORY_GROWTH=1",
    "-sEXPORTED_RUNTIME_METHODS=[callMain,FS,WORKERFS,ENV]",
    "-sINCOMING_MODULE_JS_API=[noInitialRun,noFSInit,locateFile,preRun,instantiateWasm,quit,noExitRuntime,onExit]",
    "-sMODULARIZE=1",
    "-sEXPORT_ES6=1",
    "-sEXPORT_NAME=init",
    `-o${path.join(OUT_DIR, "xan.js")}`,
  ];
  await run(
    "cargo",
    ["build", "--target=wasm32-unknown-emscripten", "--release"],
    {
      cwd: path.join(LIB_DIR, "xan"),
      env: {
        RUSTFLAGS: emccArgs.map((x) => `-Clink-arg=${x}`).join(" "),
        ...process.env,
      },
    },
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
