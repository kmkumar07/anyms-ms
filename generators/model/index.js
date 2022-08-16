const Generator = require("../base_generator");
const changeCase = require("change-case");
const Project = require("ts-morph").Project;
const fs = require("fs");

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts, ["infrastructure"], false, false);

  }

  async writing() {
    this.modelName = `${changeCase.pascalCase(this.options.name)}Model`;
    this.modelFileName = `${changeCase.camelCase(this.options.name)}.model`;
    this.writeFile("repository_model.tmpl", "{name}.model.ts", ["data-access", "sql-repositories", "models"]);
    const project = new Project();
    await this._writeModelIndex(project);
  }

  async _writeModelIndex(project) {
    // create index file
    const indexFileRelativePath = ["src", "infrastructure", "data-access", "sql-repositories", "models", "index.ts"];
    const indexFilePath = this.destinationPath(indexFileRelativePath.join("/"));
    var indexFile;
    if (!fs.existsSync(indexFilePath)) {
      indexFile = project.createSourceFile(indexFileRelativePath.join("/"));
    } else {
      indexFile = project.addSourceFileAtPathIfExists(indexFileRelativePath.join("/"));
    }
    indexFile.addExportDeclaration({
      moduleSpecifier: `./${this.modelFileName}`
    });
    await indexFile.save();
  }

};
