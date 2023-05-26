![npm type definitions](https://img.shields.io/npm/types/@handy-js/git-cz)
![npm](https://img.shields.io/npm/v/@handy-js/git-cz)
![NPM](https://img.shields.io/npm/l/@handy-js/git-cz)
![npm](https://img.shields.io/npm/dw/@handy-js/git-cz)
![GitHub last commit](https://img.shields.io/github/last-commit/yantaolu/git-cz-commitlint)

---

# @handy-js/git-cz

Adapter for [commitizen](http://commitizen.github.io/cz-cli/) and author commit messages that adhere to the commit convention configured in `commitlint.config.js`.

## [Install commitlint](https://commitlint.js.org/#/guides-local-setup)

```
$ npm install @commitlint/cli --save-dev
```

## Install peer Dependencies

```
$ npm install commitizen inquirer@8 --save-dev
```

## Install

```
$ npm install @handy-js/git-cz --save-dev
```

or

```
$ yarn add @handy-js/git-cz -D
```

or

```
$ pnpm add @handy-js/git-cz -D
```

## Config `commitizen` in `package.json`
```json
{
  "config": {
    "commitizen": {
      "path": "@handy-js/git-cz"
    }
  }
}
```

## Custom config

You can provide a custom configuration in a `commitlint` config file like `commitlint.config.js`.

```js
module.exports = {
  // original commitlint config
  extends: ['@handy-js/git-cz/lib/config'],

  // extra config
  format: '{type}{scope}: {emoji}{subject}', // => 'fix(scope): 🐛 fix xxx'
  // config type list to select
  types: ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test'],
  // config scopes to select
  scopes: [],
  // enable emoji
  useEmoji: true,
  // if rule can skip
  skips: ['scope'],
  // custom question description
  questionDescriptions: {
    type: '选择您要提交的变更类型',
  },
  // custom type enum description
  typeEnumDescriptions: {
    feat: '新增功能',
  },
};
```

![img.png](https://raw.githubusercontent.com/yantaolu/git-cz-commitlint/main/img.png)

