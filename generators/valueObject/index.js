const Generator = require("../base_generator");
const changeCase = require("change-case");
const Project = require("ts-morph").Project;
const fs = require("fs");

module.exports = class extends Generator {

    constructor(args, opts) {
        super(args, opts, ["domain"], false);
        
    }

    async writing() {
        this.valueName = `${changeCase.pascalCase(this.options.name)}Domain`;
        this.valueFileName = `${changeCase.camelCase(this.options.name)}`;
        let fileFolder = (this.parentFolderName) ? [] : [this.options.name];
        this.writeFile("value_object.tmpl", "{name}.ts", fileFolder);
        
        const project = new Project();
        await this._writeModelIndex(project);

    }
    async _writeModelIndex(project) {
        // create index file
        let indexFolder = (this.parentFolderName) ? this.parentFolderName : this.options.name;
        const indexFileRelativePath = ["src", "domain", indexFolder, "index.ts"];
        const indexFilePath = this.destinationPath(indexFileRelativePath.join("/"));
        var indexFile;
        if (!fs.existsSync(indexFilePath)) {
            indexFile = project.createSourceFile(indexFileRelativePath.join("/"));
        } else {
            indexFile = project.addSourceFileAtPathIfExists(indexFileRelativePath.join("/"));
        }
        indexFile.addExportDeclaration({
            moduleSpecifier: `./${this.valueFileName}`
        });
        await indexFile.save();
    }
};
