# CRA 从零配置

虽然有 umi 这类的框架，但是作为一个有代码洁癖的人来说，基于 create-react-app 从零开始搭建一套业务框架才能实现自由定制，深度拓展，所以这里也就记录下搭建的过程；

## 工具基础

这里主要是介绍基础工具，包括 eslint 以及 prettier 等；

### eslint + prettier

假如我们搜索一些 CRA 配置 eslint 的文章，基本上都是一上来就吭哧吭哧安装一大堆依赖，然后告诉你 OK 了，但是我们更想要知道的是每个库的作用，以及如何去定制，而不是简单的安装；

但是实际上，很多配置都是没有必要的，因为 CRA 都帮你做好了，下面来详细的说明下；

当我们使用如下的命令创建一个 ts 的模板时，其实 CRA 已经默认配置好了一些规则，包括 `eslint-plugin-react`, `eslint-plugin-react-hooks`, 即使我们不做任何的配置，它也会校验代码并自动格式化

```js
yarn create react-app my-app --template typescript
```

这些都是内置在`react-scripts`里面的， 我们打开`yarn.lock`就能看到有如下的依赖，基本上涵盖了大部分的规则，所以很多的库我们都不用再继续安装了

```yml
    "@typescript-eslint/eslint-plugin" "^2.10.0"
    "@typescript-eslint/parser" "^2.10.0"
    eslint "^6.6.0"
    eslint-config-react-app "^5.2.1"
    eslint-loader "3.0.3"
    eslint-plugin-flowtype "4.6.0"
    eslint-plugin-import "2.20.1"
    eslint-plugin-jsx-a11y "6.2.3"
    eslint-plugin-react "7.19.0"
    eslint-plugin-react-hooks "^1.6.1"
```

来讲解下这些库的作用吧：

- `@typescript-eslint/eslint-plugin`:这个是使用 eslint 来校验 ts 的库，众所周知 tslint 已经被放弃了，官方也是推荐使用 eslint 来校验，所以这个就必不可少了
- `@typescript-eslint/parser`:这个则是解析 ts 然后输出给 eslint 的，毕竟 eslint 主要针对的是 js, 所以也需要这个库对 ts 进行转换
- `eslint`:这个就不说了，校验规则，下面的都是它的插件，我们也不用额外的安装`eslint`了

那照这么说，其实我们压根不用处理啥啊，所以各种文章一上来就要你安装`@typescript-eslint/parser`的，多半是一开始就起了个 js 的模板。。。

但是 eslint 更多的是规则校验，虽然也能用做格式化，不过用专一的工具来做更合适，那就是`prettier`;

不过 prettier 可能会跟 eslint 的规则相互冲突，而且 prettier 也没有语法提示，虽然在保存的时候可以自动格式化，但是在分析的时候确实不太直观

可以安装:`eslint-config-prettier`,`eslint-plugin-prettier`,`prettier`这三个库，`eslint-plugin-prettier`可以将 `prettier` 的规则设置为 `eslint` 的规则，对不符合规则的进行提示，也就是说统一输出错误给 `eslint`;`eslint-config-prettier`可以关闭`eslint`可能与`prettier`发生冲突的代码格式化规则, 也就是说以`prettier`为准；

这样最好采用 eslint 来格式文件，需要修改 setting.json,在保存文件的时候调用 eslint 去格式化

```js
{
    "editor.formatOnSave": true,
    "eslint.alwaysShowStatus": true,
    "eslint.format.enable": true,
    "eslint.lintTask.enable": true,
    "eslint.run": "onSave",
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    },
    "eslint.probe": [
        "javascript",
        "javascriptreact",
        "typescript",
        "typescriptreact",
        "html",
        "vue"
    ],
}
```

### 配置文件

- `.eslintrc.js`

其实`package.json`中已经有了`eslintConfig`的配置，但是我们需要关闭一些校验啥的，全都写在`package.json`就有点长了，新建一个`.eslintrc.js`，然后根据一些规则写就行， 举例：

```js
module.exports = {
  extends: [
    'react-app',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'warn',
    '@typescript-eslint/no-empty-interface': 0,
    '@typescript-eslint/no-var-requires': 0,
  },
};
```

- `.prettierrc.js`

`prettier`的配置也写在一个文件里，具体的也是看文档就行：

```js
module.exports = {
  singleQuote: false,
  printWidth: 120,
  trailingComma: 'es5',
  arrowParens: 'avoid',
  endOfLine: 'auto',
};
```

有一点需要注意，eslint 只会在初次加载 prettier 的规则，中间修改了 prettier 的话，需要重启 vscode 才行，暂时没找到比较好的办法，除非将 prettier 的配置放在 eslint 的 rules 里面

```
"rules": {
    "prettier/prettier": [
      "error",
      // 针对会被 ESLint 格式化的文件类型，Prettier 会作为 ESLint 的一个规则运行并格式化文件，因此需要添加如下配置
      {
        "tabWidth": 4,
        "singleQuote": true
      }
    ]
    // ...
  }
```

### 总结

`react-scripts`内置的插件版本都很低，比如说`@typescript-eslint/parser`才 2.34 的版本，最新的差不多都 4.2 了，假如我们要用一些最新的 ts 语法，可能都不支持；

这个时候我们也可以手动安装`@typescript-eslint`这两个库，但是安装完之后，`react-scripts`内置的规则就失效了，所以我们需要重新安装`eslint-plugin-react`这些, 否则你看到的错误会大大减少，不要以为是自己写的代码完美无缺，单纯就是规则失效了；

## 开发工具

这里主要是 antd 的定制，less 的支持等；

### antd 主题

这个其实官方就给出了方案，用的是`craco`, 当然其实还可以用`react-app-rewired`,不过后者基本上不怎么更新了，当前前者的更新频率也不算很高，后续也可能放弃

不过 antd 官方给的方案还做不到按需加载，`craco-antd`基本也不怎么兼容最新的版本，所以直接手动安装`babel-plugin-import`就行

```js
const CracoLessPlugin = require('craco-less');
const path = require('path');

module.exports = {
  babel: {
    plugins: [['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }]],
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#1DA57A' },
            javascriptEnabled: true,
          },
        },
        modifyLessRule(lessRule) {
          lessRule.test = /node_modules\/antd/;
          return lessRule;
        },
      },
    },
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {},
        modifyLessRule(lessRule) {
          lessRule.test = /src/;
          return lessRule;
        },
        cssLoaderOptions: {
          modules: {
            localIdentName: '[local]_[hash:base64:5]',
          },
        },
      },
    },
  ],
  webpack: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://code.qinmei.org:7001',
        secure: false,
        changeOrigin: true,
      },
    },
    port: 2333,
  },
};
```

中间写了两个 CracoLessPlugin，主要是 antd 需要定制主题，其次就是 src 内部需要将 less 以 css module 的形式调用

### theme 主题文件

当然我们可以将配置文件以 less 的形式保存，然后通过 less->js 传给 config.js，这样我们既能定制 antd 的主题，也能将变量引入自己的 less 里面去

```js
const lessToJs = require('less-vars-to-js');
const path = require('path');
const fs = require('fs');

const getAntdTheme = filePath => {
  const paletteLess = fs.readFileSync(path.join(__dirname, filePath), 'utf8');
  const palette = lessToJs(paletteLess, { resolveVariables: true, stripPrefix: true });
  return palette;
};
```
