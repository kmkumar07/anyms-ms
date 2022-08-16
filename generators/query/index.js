const Generator = require("../base_generator");
const changeCase = require("change-case");
const fs = require("fs")


module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts, ["application"], false, false);
    this.option("query", {
      required: false,
      description: "The optional sub folder inside query folder in which the template needs to be generated",
      type: String,
      alias: "q"
    });

  }

  async writing() {

    this.queryParentFolderName = this.options.query;
    this.queryName = `{ provide: ${changeCase.pascalCase(this.options.name)}Query, useClass: ${changeCase.pascalCase(this.options.name)}QueryHandler }`;
    this.queryFileName = `${changeCase.snakeCase(this.options.name)}.query`;
    this.queryFileName2 = `${changeCase.snakeCase(this.options.name)}.query.handler`;

    // get-One
    let folder = this.queryParentFolderName ? this.queryParentFolderName : this.options.name
    if (this.queryParentFolderName) {
      this.writeFile("getIndividual.query.handler.tmpl", "{name}.query.handler.ts", ["use-cases", folder, "queries", this.name]);

      this.writeFile("getIndividual.query.tmpl", "{name}.query.ts", ["use-cases", folder, "queries", this.name]);

      this.writeFile("getIndividual.response.type.tmpl", "{name}.response.type.ts", ["use-cases", folder, "queries", this.name]);
      const project = this.getProject()
      await this._writeQueryModuleDecorator(project)
    }
    else {
      this.writeFile("getByName.query.handler.tmpl", "{name}.query.handler.ts", ["use-cases", folder, "queries", this.name]);

      this.writeFile("getByName.query.tmpl", "{name}.query.ts", ["use-cases", folder, "queries", this.name]);

      this.writeFile("getByName.response.type.tmpl", "{name}.response.type.ts", ["use-cases", folder, "queries", this.name]);
    }


  }

  async _writeQueryModuleDecorator(project) {
    const useCaseModuleFilePath = ["queries", `${this.options.name}`, this.queryFileName].join('/');
    const useCaseModuleFilePath2 = ["queries", `${this.options.name}`, this.queryFileName2].join('/');
    const queryModuleFileRelativePath = ["src", "application", "use-cases", `${this.queryParentFolderName}`, `${this.queryParentFolderName}.module.ts`];
    const querymoduleFilePath = this.destinationPath(queryModuleFileRelativePath.join("/"));
    if (!fs.existsSync(querymoduleFilePath)) {
      this.log("please create the usecase module manually")
    } else {
      let appQueryModuleFile = this.getFile(project, querymoduleFilePath, queryModuleFileRelativePath);
      this.addImport(appQueryModuleFile, `${changeCase.pascalCase(this.options.name)}Query`, useCaseModuleFilePath);
      this.addImport(appQueryModuleFile, `${changeCase.pascalCase(this.options.name)}QueryHandler`, useCaseModuleFilePath2);

      await this.addDecoratorProviders(appQueryModuleFile, this.queryName);
    }
  }
};
