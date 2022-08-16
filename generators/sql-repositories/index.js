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
    this.writeFile("repository.tmpl", "{name}.repository.ts", ["data-access", "sql-repositories"]);
    this.writeFile("sql-repository_module.tmpl", "{name}-sql-repository.module.ts", ["data-access", "sql-repositories"]);
    const project = new Project();
    await this._writeRepositoryIndex(project);
  }


  async _writeRepositoryIndex(project) {
    // create index file
    const indexFileRelativePath = ["src", "infrastructure", "data-access", "sql-repositories", "index.ts"];
    const indexFilePath = this.destinationPath(indexFileRelativePath.join("/"));
    var indexFile;
    if (!fs.existsSync(indexFilePath)) {
      indexFile = project.createSourceFile(indexFileRelativePath.join("/"));
    } else {
      indexFile = project.addSourceFileAtPathIfExists(indexFileRelativePath.join("/"));
    }
    console.log(this.repositoryFileName)
    indexFile.addExportDeclaration({
      moduleSpecifier: `./${this.repositoryFileName}`
    });
    await indexFile.save();
  }

};
