import * as path from "path";
import * as fs from "fs/promises";
import { run } from "runish";

const LIB_DIR = path.resolve("./lib");

async function main() {
  await fs.mkdir(LIB_DIR, { recursive: true });

  const libs = [
    [
      "xan",
      "https://github.com/medialab/xan",
      "be1ef3abcb1461778c14e113e32eb93855ff48bd",
    ],
  ];
  for (const [name, repo, hash] of libs) {
    process.chdir(LIB_DIR);
    await gitClone(name, repo, hash);
  }
}

async function gitClone(name, repo, hash) {
  const exists = await fs
    .access(name)
    .then(() => true)
    .catch(() => false);
  if (exists) return;

  console.log(`git cloning ${name} - ${repo} - ${hash}`);
  await run("git", ["init", name]);
  process.chdir(path.join(LIB_DIR, name));
  await run("git", ["fetch", "--depth", "1", repo, hash]);
  await run("git", ["checkout", "FETCH_HEAD"]);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
