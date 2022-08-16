const Generator = require("../base_generator");
const changeCase = require("change-case");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts, ["application"], false, false);

  }

  async writing() {
    this.writeFile("dto.tmpl", "{name}.dto.ts", ["use-cases", `${this.options.name}`, "dto"]);
  }


};
