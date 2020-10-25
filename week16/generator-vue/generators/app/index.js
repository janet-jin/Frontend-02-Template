var Generator = require("yeoman-generator");

var answer = {};

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  async initPackage() {
    answer = await this.prompt([{
        type: "input",
        name: "name",
        message: "Your project name",
        default: this.appname, // Default to current folder name
      }
    ]);

    const pkgJson = {
      name: answer.name,
      version: "1.0.0",
      description: "",
      main: "generators/app/index.js",
      scripts: {
        test: 'echo "Error: no test specified" && exit 1',
      },
      author: "",
      license: "ISC",
      dependencies: {
        "yeoman-generator": "^4.12.0",
        react: "^16.2.0",
      },
      devDependencies: {
        eslint: "^3.15.0",
      }
    };

    // Extend or create package.json file in destination path
    this.fs.extendJSON(this.destinationPath("package.json"), pkgJson);
    this.npmInstall(["vue"], {"save-dev":false});
    this.npmInstall(["webpack","webpack-cli","vue-loader","vue-style-loader",
    "css-loader","vue-template-compiler","copy-webpack-plugin"], {"save-dev":true});
  }

  copyFiles(){
    this.fs.copyTpl(
      this.templatePath('HelloWorld.vue'),
      this.destinationPath('src/HelloWorld.vue'),
      {}
    );
    this.fs.copyTpl(
      this.templatePath('webpack.config.js'),
      this.destinationPath('webpack.config.js'),
      {}
    );
    this.fs.copyTpl(
      this.templatePath('main.js'),
      this.destinationPath('src/main.js'),
      {}
    );
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('src/index.html'),
      { title: answer.name }
    );
  }
};