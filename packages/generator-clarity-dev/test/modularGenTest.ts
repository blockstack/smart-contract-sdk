import path = require("path");
import assert = require("yeoman-assert");
import helpers = require("yeoman-test");
import * as modularGen from "../src/modularGen";
import utils = require("./util");

describe("generator tests [generator instance usage]", () => {
  const projectName = "example-mod-gen-output";
  let testingDir: string;
  let generator: import("yeoman-generator");
  let runGen: () => Promise<unknown>;

  before(async () => {
    testingDir = path.join(__dirname, "../.yo-test");
    await new Promise((resolve, reject) => {
      helpers.testDirectory(testingDir, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });

  it("create app generator", async () => {
    const result = modularGen.createAppGen({
      args: [projectName, "hello-world"],
      options: { skipInstall: true }
    });
    const instance = result.createInstance();
    generator = instance.generator;
    runGen = instance.run;
  });

  it("generate a project", async () => {
    await runGen();
  });

  it("validate output directory", () => {
    const outputDir = path.resolve(generator.destinationRoot());
    const expectedOutDir = path.resolve(path.join(testingDir, projectName));
    assert.strictEqual(outputDir, expectedOutDir);
  });

  it("generated files", () => {
    assert.file(utils.EXPECTED_OUTPUT_FILES);
  });

  it("run npm test", () => {
    // Ensure `npm test` succeeds in generated project.
    generator.spawnCommandSync("npm", ["test"]);
  });

  after(async () => {
    // Clean temp output dir.
    await new Promise((resolve, reject) => {
      helpers.testDirectory(testingDir, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
});
