// Dependabot hardcodes a capitalised "Bump ..." subject that no configuration
// on its side can change, so its dependency commits are exempt from the
// subject-case rule. Every human commit stays subject to the full rule set.
const DEPENDABOT_SUBJECT = /^(chore|ci)\(deps\): Bump /;

/** @type {import("@commitlint/types").UserConfig} */
export default {
  extends: ["@commitlint/config-conventional"],
  ignores: [(message) => DEPENDABOT_SUBJECT.test(message)],
  rules: {
    "scope-enum": [2, "always", ["etl", "web", "db", "ci", "docs", "deps", "repo"]],
    "subject-case": [2, "always", "lower-case"],
  },
};
