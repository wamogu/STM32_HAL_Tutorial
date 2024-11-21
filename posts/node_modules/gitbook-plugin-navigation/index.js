module.exports = {
  book: {
    assets: "./assets",
    js: [
        "nav.js"
    ],
    css: [
      "nav.css"
    ]
  },
  hooks: {
    "init": function() {
      this.log.debug.ln('init', this.options.pluginsConfig.navigation);

      navigationConfig = this.options.pluginsConfig.navigation;
    },
      "page": function(page) {
        // console.log('page', page)
        return page;
      },
      "finish:before": function (page) {
        // console.log('finish:before', page)
        return page
      },
      "page:before": function (page) {
        // console.log('page:before', page)
        return page
      },
      "config": function (config) {
        // console.log(config)
        return config
      },
      "page:change": function(page) {
        // console.log('page:change', page)
        return page
      }
  }
};