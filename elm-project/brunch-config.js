/*eslint-env node */

module.exports = {
  files: {
    javascripts: {
      joinTo: "app.js"
    },
    stylesheets: {
      joinTo: "app.css"
    },
  },
  paths: {
    watched: ["src/"],
    public: "dist/"
  },
  plugins: {
    elmBrunch: {
      mainModules: ["src/Main.elm"],
      makeParameters : ['--warn'],
      outPutPath : "dist/"
    }
  }
};