const Generator = require("../base_generator");
const changeCase = require("change-case");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts, ["application"], false, false);

  }

  async writing() {
    this.writeFile("controller.tmpl", "{name}.controller.ts", ["rest-api"]);
  }
};
