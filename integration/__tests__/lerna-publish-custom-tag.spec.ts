import { cliRunner, cloneFixtureFactory, gitTag } from "@lerna/test-helpers";
import path from "path";

const cloneFixture = cloneFixtureFactory(
  path.resolve(__dirname, "../../packages/legacy-structure/commands/publish/__tests__")
);

// stabilize changelog commit SHA and datestamp
// eslint-disable-next-line @typescript-eslint/no-var-requires
expect.addSnapshotSerializer(require("@lerna/test-helpers/src/lib/serializers/serialize-changelog"));

const env = {
  // never actually upload when calling `npm publish`
  npm_config_dry_run: true,
  // skip npm package validation, none of the stubs are real
  LERNA_INTEGRATION: "SKIP",
};

test("lerna publish from-git handles custom tags", async () => {
  const { cwd } = await cloneFixture("independent");

  await gitTag(cwd, "some-unrelated-tag");

  const args = ["publish", "--yes", "from-git"];

  const { stderr } = await cliRunner(cwd, env)(...args);
  expect(stderr).toMatch("lerna notice from-git No tagged release found");
});
