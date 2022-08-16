const Generator = require("../base_generator");
const changeCase = require("change-case");
const Project = require("ts-morph").Project;
const fs = require("fs");

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts, ["infrastructure"], false, false);

  }

  async writing() {

    this.repositoryName = `${changeCase.pascalCase(this.options.name)}Repository`;
    this.repositoryFileName = `${changeCase.camelCase(this.options.name)}.repository`;
    this.writeFile("irepository.tmpl", "i{name}.repository.ts", ["data-access", "irepositories"]);
    const project = new Project();
    await this._writeIrepositoryIndex(project);
  }

  async _writeIrepositoryIndex(project) {
    // create index file
    const indexFileRelativePath = ["src", "infrastructure", "data-access", "irepositories", "index.ts"];
    const indexFilePath = this.destinationPath(indexFileRelativePath.join("/"));
    var indexFile;
    if (!fs.existsSync(indexFilePath)) {
      indexFile = project.createSourceFile(indexFileRelativePath.join("/"));
    } else {
      indexFile = project.addSourceFileAtPathIfExists(indexFileRelativePath.join("/"));
    }
    indexFile.addExportDeclaration({
      moduleSpecifier: `./i${this.repositoryFileName}`
    });
    await indexFile.save();
  }



};
