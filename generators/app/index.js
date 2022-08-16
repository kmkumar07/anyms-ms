const Generator = require("yeoman-generator");
const fs = require("fs");
const changeCase = require("change-case");



module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts, false, false);
  }

  async prompting() {
    this.log("Welcome to the app");
    var answers = await this.prompt([

      {
        type: "input",
        name: "name",
        message: "Project name",
        default: this.appname // Default to current folder name
      },
      {
        type: "input",
        name: "description",
        message: "Project Description",
        default: "Getting started softobiz-nest-boilerplate"
      }

    ]);

    answers.LocalEnvAppBasic = await this.prompt([

      {
        type: "input",
        name: "AppRoutePrefix",
        message: "Prefix route",
        default: "nest-boilerplate/api/v1"
      },
      {
        type: "input",
        name: "AppPort",
        message: "App Port",
        default: 4201
      }
      

    ]);

    answers.LocalEnvDatabase = await this.prompt([

      {
        type: "input",
        name: "host",
        message: "Database host"
      },
      {
        type: "input",
        name: "port",
        message: "Database port"
      },
      {
        type: "input",
        name: "database_name",
        message: "Database name"
      },
      {
        type: "input",
        name: "username",
        message: "Database username"
      },
      {
        type: "input",
        name: "password",
        message: "Database password",
        default: "************"
      },
      
      {
        type: "checkbox",
        name: "type",
        message: "Database type",
        choices: [
          {
              name: 'MSSQL',
              value: "mssql",
              checked: true
          }
]
      }

    ]);

    this.answers = answers;
  }

  writing() {
    this._writeEnv();
    this._writePackageJson();
    this.fs.copy(this.templatePath("static/**"), this._destinationAppPath(""), { globOptions: { dot: true } });
    this.config.save();

  }
  _writeEnv() {
    this.fs.copyTpl(this.templatePath("local.env.tmpl"), this.destinationPath(this.answers.name, "env", ".local.env",), {
      ...this.answers,
      nameHyphen: changeCase.snakeCase(this.answers.name)
    });
    this.fs.copyTpl(this.templatePath("dev.env.tmpl"), this.destinationPath(this.answers.name, "env", ".dev.env",));
    this.fs.copyTpl(this.templatePath("test.env.tmpl"), this.destinationPath(this.answers.name, "env", ".test.env",));
    this.fs.copyTpl(this.templatePath("uat.env.tmpl"), this.destinationPath(this.answers.name, "env", ".uat.env",));
  }

  _writePackageJson() {
    this.fs.copyTpl(this.templatePath("src-package.json"), this.destinationPath(this.answers.name, "package.json"), {
      name: this.answers.name,
      description: this.answers.description,
      nameHyphen: changeCase.snakeCase(this.answers.name)
    });
  }
  _destinationAppPath(...path) {
    return this.destinationPath(this.answers.name, ...path);
  }




};

