const Generator = require("../base_generator");
const changeCase = require("change-case");
const fs = require("fs")

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts, ["application"], false, false);
    this.option("command", {
      required: false,
      description: "The optional sub folder inside command folder in which the template needs to be generated",
      type: String,
      alias: "c"
    });
  }

  async writing() {
    // create
    this.commandParentFolderName = this.options.command;
    this.commandName = `{ provide: ${changeCase.pascalCase(this.options.name)}Command, useClass: ${changeCase.pascalCase(this.options.name)}CommandHandler }`;
    this.commandFileName = `${changeCase.snakeCase(this.options.name)}.cmd`;
    this.commandFileName2 = `${changeCase.snakeCase(this.options.name)}.cmd.handler`;
    let folder = this.commandParentFolderName ? this.commandParentFolderName : this.options.name
    if (this.commandParentFolderName) {
      this.writeFile("createIndividual.cmd.handler.tmpl", "{name}.cmd.handler.ts", ["use-cases", folder, "commands", this.name]);
      this.writeFile("createIndividual.cmd.tmpl", "{name}.cmd.ts", ["use-cases", folder, "commands", this.name]);
      this.writeFile("createIndividual.response.type.tmpl", "{name}.response.type.ts", ["use-cases", folder, "commands", this.name]);
      const project = this.getProject()
      await this._writeCommandModuleDecorator(project)
    }
    else {
      this.writeFile("create.cmd.handler.tmpl", "{name}.cmd.handler.ts", ["use-cases", folder, "commands", this.name]);
      this.writeFile("create.cmd.tmpl", "{name}.cmd.ts", ["use-cases", folder, "commands", this.name]);
      this.writeFile("create.response.type.tmpl", "{name}.response.type.ts", ["use-cases", folder, "commands", this.name]);
      this.writeFile("create.cmd.spec.tmpl", "{name}.cmd.handler.spec.ts", ["use-cases", folder, "commands", this.name]);

    }

  }
  async _writeCommandModuleDecorator(project) {
    const useCaseModuleFilePath = ["commands", `${this.options.name}`, this.commandFileName].join('/');
    const useCaseModuleFilePath2 = ["commands", `${this.options.name}`, this.commandFileName2].join('/');
    const commandModuleFileRelativePath = ["src", "application", "use-cases", `${this.commandParentFolderName}`, `${this.commandParentFolderName}.module.ts`];
    const commandmoduleFilePath = this.destinationPath(commandModuleFileRelativePath.join("/"));
    if (!fs.existsSync(commandmoduleFilePath)) {
      this.log("please create the usecase module manually")
    } else {
      let appCommandModuleFile = this.getFile(project, commandmoduleFilePath, commandModuleFileRelativePath);
      this.addImport(appCommandModuleFile, `${changeCase.pascalCase(this.options.name)}Command`, useCaseModuleFilePath);
      this.addImport(appCommandModuleFile, `${changeCase.pascalCase(this.options.name)}CommandHandler`, useCaseModuleFilePath2);

      await this.addDecoratorProviders(appCommandModuleFile, this.commandName);
    }
  }


}