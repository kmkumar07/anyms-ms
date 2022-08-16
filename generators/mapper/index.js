const Generator = require("../base_generator");
const changeCase = require("change-case");
const Project = require("ts-morph").Project;
const fs = require("fs");

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts, ["infrastructure"], false, false);

  }

  async writing() {
    this.mapperName = `${changeCase.pascalCase(this.options.name)}Mapper`;
    this.mapperFileName = `${changeCase.camelCase(this.options.name)}.mapper`;
    this.writeFile("repository_mapper.tmpl", "{name}.mapper.ts", ["data-access", "sql-repositories", "mappers"]);
    const project = new Project();
    await this._writeMapperIndex(project);
  }

  async _writeMapperIndex(project) {
    // create index file
    const indexFileRelativePath = ["src", "infrastructure", "data-access", "sql-repositories", "mappers", "index.ts"];
    const indexFilePath = this.destinationPath(indexFileRelativePath.join("/"));
    var indexFile;
    if (!fs.existsSync(indexFilePath)) {
      indexFile = project.createSourceFile(indexFileRelativePath.join("/"));
    } else {
      indexFile = project.addSourceFileAtPathIfExists(indexFileRelativePath.join("/"));
    }
    indexFile.addExportDeclaration({
      moduleSpecifier: `./${this.mapperFileName}`
    });
    await indexFile.save();
  }

};
