### gitbook-plugin-navigation
基于Gitbook实现的导航栏插件, 用于追加单独的导航

### Install
in the book.json:

config your chrome exec file
```json
  "plugins": [
    "navigation"
  ],
  "pluginsConfig": {
    "navigation": {
      "navigatorList": [
        { "name": "百度首页", "url": "https://www.baidu.com" },
        { "name": "新浪微博", "url": "https://www.sina.com" }
      ]
    }
  }
```
