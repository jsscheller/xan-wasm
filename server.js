import * as serdev from "serdev";

serdev.listen({
  components: {
    tests: {
      dir: ".",
      build: "node scripts/build.js",
      watch: ["tests"],
    },
  },
  routes: {
    "/tests/index.html": "tests/index.html",
    "/tests/*rest": ["tests", (x) => `out/tests/${x.rest}`],
    "/assets/*rest": (x) => `assets/${x.rest}`,
    "/*rest": (x) => `out/${x.rest}`,
  },
});
