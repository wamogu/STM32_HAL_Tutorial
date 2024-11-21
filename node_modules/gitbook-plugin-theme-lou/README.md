# Gitbook 主题插件

## 效果

![](https://tva1.sinaimg.cn/large/008i3skNgy1gtg339c0csj61qj0u0gq302.jpg)

![](https://tva1.sinaimg.cn/large/008i3skNgy1gtg33wbnbdj61qm0u0gqe02.jpg)

## 使用

添加下面配置到 `book.json` 或 `book.js`文件中:

```js
// book.js
{
  "plugins": ["theme-lou"],
  "pluginsConfig": {
    "theme-lou": {
      "color": "#FF4848", // 主题色
      "favicon": "static/favicon.ico", // favicon图标
      "logo": "static/logo.png", // 顶部左侧图标
      "appleTouchIconPrecomposed152": "static/apple.png", // apple图标
      "copyrightLogo": "assets/copyright.png",  // 底部水印LOGO
      "forbidCopy": true, // 页面是否禁止复制
      "search-placeholder": "Input Keywords to Search", // 搜索框默认文本
      "book-summary-title": "Article Directory", // 目录标题
      "book-anchor-title": "Search In the Article", // 本章目录标题
      "hide-elements": [".summary .gitbook-link", ".summary .divider"], // 需要隐藏的标签
      "copyright": {
        "author": "松露老师"  // 底部版权展示的作者名
      }
    }
  },
  "variables": {
    "themeLou": {
      // 顶部导航栏配置
      "nav": [
        {
          "target": "_blank", // 跳转方式: 打开新页面
          "url": "http://...",  // 跳转页面
          "name": "简易教程"  // 导航名称
        }
      ],
      // 底部打赏配置
      "footer": {
        "donate": {
          "button": "捐赠", // 打赏按钮
          "avatar": "头像地址", // 头像地址
          "nickname": "松露老师", // 昵称
          "message": "随意打赏，但不要超过一顿早餐钱！", // 打赏消息文本
          "text": "『 赠人玫瑰 🌹 手有余香 』", // 打赏话语
          "wxpay": "你的微信收款码地址", // 微信收款码
          "alipay": "你的支付宝收款码地址" // 支付宝收款码
        },
        "copyright": true // 是否显示版权
      }
    }
  }
}
```
