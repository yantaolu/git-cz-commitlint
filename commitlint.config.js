module.exports = {
  // original commitlint config
  extends: ['@commitlint/config-conventional'],

  // extra config
  format: '{type}{scope}: {emoji}{subject}',
  // config type list to select
  types: ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test'],
  // config scopes to select
  scopes: [],
  useEmoji: true,
  // type emoji
  emojis: {
    feat: '✏️',
    style: '🪄',
    revert: '👈',
    fix: '🐛',
    docs: '📚',
    refactor: '📦',
    perf: '🚀',
    test: '🚨',
    build: '🛠',
    ci: '⚙️',
    chore: '♻️',
  },
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
