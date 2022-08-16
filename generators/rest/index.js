const Generator = require("../base_generator");

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts);
  }


  writing() {
    this._writeAggregate()
    this._writeModel()
    this._writeMapper()
    this._writeIrepository()
    this._writeSqlRepository()
    this._writeCommand()
    this._writeDto()
    this._writeQuery()
    this._writeController()
    this._writeModule()
    this._writeError()
  }

  _writeModel() {
    this.composeWith("softobiz-ms:model", {
      arguments: [this.options.name],
    });
  }

  _writeController() {
    this.composeWith("softobiz-ms:controller", {
      arguments: [this.options.name],
    });
  }

  _writeCommand() {
    this.composeWith("softobiz-ms:command", {
      arguments: [this.options.name],
    });
  }

  _writeDto() {
    this.composeWith("softobiz-ms:dto", {
      arguments: [this.options.name],
    });
  }

  _writeModule() {
    this.composeWith("softobiz-ms:use-cases-module", {
      arguments: [this.options.name],
    });
  }

  _writeQuery() {
    this.composeWith("softobiz-ms:query", {
      arguments: [this.options.name],

    });
  }

  _writeMapper() {
    this.composeWith("softobiz-ms:mapper", {
      arguments: [this.options.name],
    });
  }

  _writeSqlRepository() {
    this.composeWith("softobiz-ms:sql-repositories", {
      arguments: [this.options.name],
    });
  }

  _writeError() {
    this.composeWith("softobiz-ms:error", {
      arguments: [this.options.name],
    });
  }

  _writeIrepository() {
    this.composeWith("softobiz-ms:irepository", {
      arguments: [this.options.name],
    });
  }

  _writeAggregate() {
    this.composeWith("softobiz-ms:aggregate", {
      arguments: [this.options.name],
    });
  }
};
