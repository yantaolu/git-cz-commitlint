import { UserConfig } from '@commitlint/types';

const typeEnum = {
  feat: {
    description: 'A new feature',
    desc: '新的功能',
    title: 'Features',
    emoji: '✏️',
  },
  fix: {
    description: 'A bug fix',
    desc: '缺陷修复',
    title: 'Bug Fixes',
    emoji: '🐛',
  },
  docs: {
    description: 'Documentation only changes',
    desc: '仅文档更新',
    title: 'Documentation',
    emoji: '📚',
  },
  style: {
    description:
      'Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)',
    desc: '格式化代码',
    title: 'Styles',
    emoji: '🪄',
  },
  refactor: {
    description: 'A code change that neither fixes a bug nor adds a feature',
    desc: '代码重构',
    title: 'Code Refactoring',
    emoji: '📦',
  },
  perf: {
    description: 'A code change that improves performance',
    desc: '性能优化',
    title: 'Performance Improvements',
    emoji: '🚀',
  },
  test: {
    description: 'Adding missing tests or correcting existing tests',
    desc: '添加或修改测试代码',
    title: 'Tests',
    emoji: '🚨',
  },
  build: {
    description: 'Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)',
    desc: '构建或依赖更新',
    title: 'Builds',
    emoji: '🛠',
  },
  ci: {
    description:
      'Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)',
    desc: 'CI配置更新',
    title: 'Continuous Integrations',
    emoji: '🎡',
  },
  chore: {
    description: "Other changes that don't modify src or test files",
    desc: '非业务代码及测试代码修改',
    title: 'Chores',
    emoji: '💡',
  },
  revert: {
    description: 'Reverts a previous commit',
    desc: '代码回滚',
    title: 'Reverts',
    emoji: '👈',
  },
};

const config: UserConfig = {
  parserPreset: 'conventional-changelog-conventionalcommits',
  rules: {
    'body-leading-blank': [1, 'always'],
    'body-max-line-length': [2, 'always', 100],
    'footer-leading-blank': [1, 'always'],
    'footer-max-line-length': [2, 'always', 100],
    'header-max-length': [2, 'always', 100],
    'header-min-length': [2, 'always', 5],
    'subject-min-length': [2, 'always', 5],
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'type-enum': [2, 'always', Object.keys(typeEnum)],
  },
  prompt: {
    questions: {
      type: {
        description: "Select the type of change that you're committing",
        enum: typeEnum,
      },
      scope: {
        description: 'What is the scope of this change (e.g. component or file name)',
      },
      subject: {
        description: 'Write a short, imperative tense description of the change',
      },
      body: {
        description: 'Provide a longer description of the change',
      },
      isBreaking: {
        description: 'Are there any breaking changes?',
      },
      breakingBody: {
        description: 'A BREAKING CHANGE commit requires a body. Please enter a longer description of the commit itself',
      },
      breaking: {
        description: 'Describe the breaking changes',
      },
      isIssueAffected: {
        description: 'Does this change affect any open issues?',
      },
      issuesBody: {
        description:
          'If issues are closed, the commit requires a body. Please enter a longer description of the commit itself',
      },
      issues: {
        description: 'Add issue references (e.g. "fix #123", "re #123".)',
      },
    },
  },
};

module.exports = config;
