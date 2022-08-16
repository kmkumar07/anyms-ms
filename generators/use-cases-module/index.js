const Generator = require("../base_generator");
const changeCase = require("change-case");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts, ["application"], false);
    
    

  }
  async writing() {
    this.moduleName = `${changeCase.pascalCase(this.options.name)}Module`
    this.moduleFileName = `${changeCase.snakeCase(this.options.name)}.module`;
    this.writeFile("module.tmpl", "{name}.module.ts", ["use-cases", `${this.options.name}`]);
    const project = this.getProject()
    await this._writeModuleDecorator(project)
  }
  async _writeModuleDecorator(project) {
    const useCaseModuleFilePath = ["application", "use-cases", `${this.options.name}`, this.moduleFileName].join('/')
    const appModuleFileRelativePath = ["src", "app.module.ts"];
    const appMmoduleFilePath = this.destinationPath(appModuleFileRelativePath.join("/"));
    let appModuleFile = this.getFile(project, appMmoduleFilePath, appModuleFileRelativePath)
    this.addImport(appModuleFile, this.moduleName, useCaseModuleFilePath)
    await this.addDecoratorImport(appModuleFile, this.moduleName)
  }
};