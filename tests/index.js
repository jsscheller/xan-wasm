import { test } from "uvu";
import init from "/xan.js";
import * as assert from "uvu/assert";

let xan;

test("count", async function () {
  await initXan([await download("ice-cream.csv")]);
  xan.callMain(["count", "input/ice-cream.csv"]);
});

async function download(asset) {
  const blob = await fetch(`/assets/${asset}`).then((x) => x.blob());
  return new File([blob], asset, { type: blob.type });
}

async function initXan(input) {
  xan = await init({
    locateFile: () => "/xan.wasm",
  });
  xan.FS.mkdir("/input");
  const mount = input[0] && input[0].data ? { blobs: input } : { files: input };
  xan.FS.mount(xan.WORKERFS, mount, "/input");
  xan.FS.mkdir("/output");
}

test.run();
