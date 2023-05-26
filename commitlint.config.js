module.exports = {
  // original commitlint config
  extends: ['./lib/config.js'],

  // extra config
  format: '{type}{scope}: {emoji}{subject}',
  // config type list to select
  // types: ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test', 'wip'],
  // config scopes to select
  scopes: [],
  useEmoji: true,
  // if rule can skip
  skips: ['scope'],
  // custom question description
  // questionDescriptions: {
  //   type: '选择您要提交的变更类型',
  // },
  // // custom type enum description
  // typeEnumDescriptions: {
  //   feat: '新增功能',
  // },
  // prompt: {
  //   questions: {
  //     type: {
  //       enum: {
  //         wip: {
  //           description: '正在开发中',
  //         },
  //       },
  //     },
  //   },
  // },
};
