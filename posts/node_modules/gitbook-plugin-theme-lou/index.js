var fs = require('fs');
var path = require('path');

module.exports = {
  website: {
    assets: './_assets/',
    js: ['lou.js'],
    css: ['lou.css'],
  },
  hooks: {
    finish: function () {
      var themeConfig = this.config.get('pluginsConfig')['theme-lou'];
      var output = themeConfig ? themeConfig.output || '_book' : '_book';
      var pathFile;

      // 更改主题色
      const themeColor = themeConfig.color || '#f34d4d';
      cssPath = path.join(
        process.cwd(),
        output,
        'gitbook',
        'gitbook-plugin-theme-lou',
        'lou.css'
      );
      if (fs.existsSync(cssPath)) {
        fs.appendFileSync(
          cssPath,
          `:root { 
--ThemeColor: ${themeColor}; 
}
`
        );
      }

      // 更改标题颜色
      themeConfig.titleColor = themeConfig.titleColor || {};
      const h1Color = themeConfig.titleColor['h1'] || themeColor;
      const h2Color = themeConfig.titleColor['h2'] || themeColor;
      const h3Color = themeConfig.titleColor['h3'] || themeColor;
      const h4Color = themeConfig.titleColor['h4'] || themeColor;
      const h5Color = themeConfig.titleColor['h5'] || themeColor;
      const h6Color = themeConfig.titleColor['h6'] || themeColor;
      if (fs.existsSync(cssPath)) {
        fs.appendFileSync(
          cssPath,
          `:root { 
  --H1Color: ${h1Color}; 
  --H2Color: ${h2Color}; 
  --H3Color: ${h3Color}; 
  --H4Color: ${h4Color}; 
  --H5Color: ${h5Color}; 
  --H6Color: ${h6Color}; 
}
`
        );
      }

      // 是否允许复制
      const forbidCopy = themeConfig.forbidCopy;
      if (forbidCopy && fs.existsSync(cssPath)) {
        fs.appendFileSync(
          cssPath,
          `* {
  -moz-user-select: none;
  -o-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
`
        );
      }

      // favicon
      pathFile = themeConfig && themeConfig.favicon;
      if (pathFile) {
        var faviconPath = path.join(process.cwd(), pathFile);
        var gitbookFaviconPath = path.join(
          process.cwd(),
          output,
          'gitbook',
          'images',
          'favicon.ico'
        );
        if (fs.existsSync(faviconPath)) {
          fs.writeFileSync(gitbookFaviconPath, fs.readFileSync(faviconPath));
        }
      }

      // appleTouchIconPrecomposed152
      pathFile = themeConfig && themeConfig.appleTouchIconPrecomposed152;
      if (pathFile) {
        var appleTouchIconPrecomposed152 = path.join(process.cwd(), pathFile);
        var gitbookAppleTouchPath = path.join(
          process.cwd(),
          output,
          'gitbook',
          'images',
          'apple-touch-icon-precomposed-152.png'
        );
        if (fs.existsSync(appleTouchIconPrecomposed152)) {
          fs.writeFileSync(
            gitbookAppleTouchPath,
            fs.readFileSync(appleTouchIconPrecomposed152)
          );
        }
      }

      // logo
      pathFile = themeConfig && themeConfig.logo;
      if (pathFile) {
        var logoPath = path.join(process.cwd(), pathFile);
        var pluginLogoPath = path.join(
          process.cwd(),
          output,
          'gitbook',
          'gitbook-plugin-theme-lou',
          'logo.png'
        );
        if (fs.existsSync(logoPath)) {
          fs.writeFileSync(pluginLogoPath, fs.readFileSync(logoPath));
        }
      }

      // 版权logo
      pathFile = themeConfig && themeConfig.copyrightLogo;
      if (pathFile) {
        var copyrightLogoPath = path.join(process.cwd(), pathFile);
        var pluginCopyrightLogoPath = path.join(
          process.cwd(),
          output,
          'gitbook',
          'gitbook-plugin-theme-lou',
          'copyright-logo.png'
        );
        if (fs.existsSync(copyrightLogoPath)) {
          fs.writeFileSync(
            pluginCopyrightLogoPath,
            fs.readFileSync(copyrightLogoPath)
          );
        }
        if (fs.existsSync(cssPath)) {
          fs.appendFileSync(
            cssPath,
            `.book-body { 
  background: url('./copyright-logo.png'); 
  }
  `
          );
        }
      }

      // css 替换
      cssFile = themeConfig && themeConfig.css;
      if (cssFile) {
        var cssFilePath = path.join(process.cwd(), cssFile);
        var pluginCssFilePath = path.join(
          process.cwd(),
          output,
          'gitbook',
          'gitbook-plugin-theme-lou',
          'lou.css'
        );
        if (fs.existsSync(cssFilePath)) {
          fs.writeFileSync(pluginCssFilePath, fs.readFileSync(cssFilePath));
        }
      }
    },
  },
};
