![npm type definitions](https://img.shields.io/npm/types/git-cz-commitlint)
![npm](https://img.shields.io/npm/v/git-cz-commitlint)
![NPM](https://img.shields.io/npm/l/git-cz-commitlint)
![npm](https://img.shields.io/npm/dw/git-cz-commitlint)
![GitHub last commit](https://img.shields.io/github/last-commit/yantaolu/git-cz-commitlint)

---

# git-cz-commitlint

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
$ npm install git-cz-commitlint --save-dev
```

or

```
$ yarn add git-cz-commitlint -D
```

or

```
$ pnpm add git-cz-commitlint -D
```

## Config `commitizen` in `package.json`
```json
{
  "config": {
    "commitizen": {
      "path": "git-cz-commitlint"
    }
  }
}
```

## Custom config

You can provide a custom configuration in a `commitlint` config file like `commitlint.config.js`.

```js
module.exports = {
  // original commitlint config
  extends: ['git-cz-commitlint/lib/config'],

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

![img.png](https://github.com/yantaolu/git-cz-commitlint/blob/main/img.png?raw=true)

