/** @type {import("@commitlint/types").UserConfig} */
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [2, "always", ["etl", "web", "db", "ci", "docs", "deps", "repo"]],
    "subject-case": [2, "always", "lower-case"],
  },
};
