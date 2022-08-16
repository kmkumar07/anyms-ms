const Generator = require("yeoman-generator");
const changeCase = require("change-case");
const Project = require("ts-morph").Project
const SyntaxKind = require("ts-morph").SyntaxKind
const fs = require("fs")

var rootFolder = ["src"];
module.exports = class extends Generator {
    constructor(args, opts, folders = [], createFolder = true, Isparentneeded = true) {
        super(args, opts);
        this.baseFolder = [...rootFolder, ...folders];
        this.createFolder = createFolder;
        this.argument("name", {
            required: true,
            description: "The name of the object that needs to be created",
            type: String
        });
        if (Isparentneeded) {
            this.option("parent", {
                required: false,
                description: "The optional sub folder inside parent folder in which the template needs to be generated",
                type: String,
                alias: "p"
            });
            this.parentFolderName = this.options.parent;
        }
        this.name = args[0];
    }
    /**
     * Generate a file using template
     *
     * @param {string} template The template that needs to be used
     * @param {string} destFileNameTemplate The file name template the placeholder {name} will be replaced
     */
    writeFile(template, destFileNameTemplate, folders = [], templateParams = {}) {
        this.folderName = changeCase.snakeCase(this.name);
        const nameSnake = changeCase.snakeCase(this.name);
        const namePascal = changeCase.pascalCase(this.name);
        const nameCamel = changeCase.camelCase(this.name);
        // get paths
        var path = [...this.baseFolder];
        if (this.createFolder) {
            path.push(this.folderName);
        }
        if (this.parentFolderName) {
            path.push(this.parentFolderName);
        }
        path.push(...folders);

        this.fs.copyTpl(
            this.templatePath(template),
            this.destinationFolder(path, destFileNameTemplate.replace("{name}", nameSnake)),
            {
                namePascal: namePascal,
                nameSnake: nameSnake,
                nameCamel: nameCamel,
                ...templateParams
            }
        );
    }

    /**
     * Get the destination folder path
     *
     * @param {string[]} paths The folders
     * @param {string} fileName The file name
     * @returns {string} The destination path
     */
    destinationFolder(paths, fileName) {
        return this.destinationPath(...paths, fileName);
    }
    /**
   * Get typescript source file, create a file if it doesn't exist already
   *
   * @param {import("ts-morph").Project} project The ts-morph project
   * @param {String} filePath Absolute path to the file
   * @param {String} fileRelativePath Relative path to the file
   * @returns {import("ts-morph").SourceFile} The source file
   */
    getFile(project, filePath, fileRelativePath) {
        if (!fs.existsSync(filePath)) {
            return project.createSourceFile(fileRelativePath.join("/"));
        } else {
            return project.addSourceFileAtPathIfExists(fileRelativePath.join("/"));
        }
    }

    /**
     * Add import declaration to the ts file
     *
     * @param {import("ts-morph").SourceFile} file The file to which the import defnition needs to be added
     * @param {String} importName The class name
     * @param {*} moduleName The file name of the import
     */
    addImport(file, importName, moduleName) {
        file.addImportDeclaration({
            namedImports: [importName],
            moduleSpecifier: `./${moduleName}`
        });
    }

    /**
     * Add a new named export
     *
     * @param {import("ts-morph").SourceFile} file The source file to which export declaration needs to be added
     * @param {String} exportName The name of the export
     */
    addExport(file, exportName) {
        const exportDeclarations = file.getExportDeclarations(d => d.hasNamedExports());
        if (exportDeclarations.length > 0) {
            exportDeclarations[0].addNamedExport({ name: exportName });
        } else {
            file.addExportDeclaration({
                namedExports: [exportName]
            });
        }
    }

    /**
     * Get ts project
     *
     * @returns {import("ts-morph").Project} The project
     */
    getProject() {
        return new Project();
    }
    /**
     * Add a new Controllers to Module
     *
     * @param {import("ts-morph").SourceFile} file The source file to which export declaration needs to be added
     * @param {String} exportName The name of the export
     */
    async addDecoratorMetaDataInModule(moduleFile, className, decoratorParam) {
        // console.warn(moduleFile)
        const appModuleClass = moduleFile.getClass(c => c.getText().includes('@Module'));
        const appModuledecorator = appModuleClass.getDecorator('Module');
        const moduleArguments = appModuledecorator.getArguments()[0];
        const declarationsProp = moduleArguments.getDescendants()
            .find(d => d.getKind() === SyntaxKind.PropertyAssignment &&
                (d.compilerNode).name.getText() === decoratorParam);
        const array = declarationsProp.getFirstChildByKindOrThrow(SyntaxKind.ArrayLiteralExpression);
        array.addElement(className);
        await moduleFile.save();
    }

    async addDecoratorImport(moduleFile, className) {
        await this.addDecoratorMetaDataInModule(moduleFile, className, "imports")
    }
    async addDecoratorControllers(file, className) {
        await this.addDecoratorMetaDataInModule(file, className, "controllers")
    }
    async addDecoratorProviders(file, className) {
        await this.addDecoratorMetaDataInModule(file, className, "providers")
    }
};
