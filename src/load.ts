import { validateConfig } from '@commitlint/config-validator';
import executeRule from '@commitlint/execute-rule';
import resolveExtends from '@commitlint/resolve-extends';
import { LoadOptions, PluginRecords, PromptName, QualifiedConfig, QualifiedRules, UserConfig } from '@commitlint/types';
import isPlainObject from 'lodash.isplainobject';
import merge from 'lodash.merge';
import uniq from 'lodash.uniq';
import Path from 'path';
import resolveFrom from 'resolve-from';
import { loadConfig } from './utils/load-config';
import { loadParserOpts } from './utils/load-parser-opts';
import loadPlugin from './utils/load-plugin';

// type CustomPromptConfig = Omit<UserPromptConfig, 'questions'> & {
//   questions?: Partial<
//     Record<
//       PromptName | string,
//       {
//         description?: string;
//         messages?: {
//           [K: string]: string;
//         };
//         enum?: {
//           [enumName: string]: {
//             description?: string;
//             title?: string;
//             emoji?: string;
//           };
//         };
//       }
//     >
//   >;
// };

export interface CzCommitConfig {
  /**
   * commit msg format
   */
  format: string;
  /**
   * selectable type list
   */
  types: string[];
  /**
   * type enum description
   */
  typeEnumDescriptions: Record<string, string>;
  /**
   * question description
   */
  questionDescriptions: Record<PromptName, string>;
  /**
   * selectable scope list
   */
  scopes: string[];
  /**
   * enable emoji
   */
  useEmoji: boolean;
  /**
   * subject emojis
   */
  emojis: Record<string, string>;
  /**
   * skip question
   */
  skips: ('header' | 'scope' | 'body' | 'footer' | 'breaking' | 'issues')[];
}

export type CommitLintConfig = UserConfig & Partial<Omit<CzCommitConfig, 'emojis'>>;

export default async function load(
  seed: CommitLintConfig = {},
  options: LoadOptions = {},
): Promise<
  QualifiedConfig & {
    czCommitConfig: CzCommitConfig;
  }
> {
  const cwd = typeof options.cwd === 'undefined' ? process.cwd() : options.cwd;
  const loaded = await loadConfig(cwd, options.file);
  const base = loaded && loaded.filepath ? Path.dirname(loaded.filepath) : cwd;
  let config: CommitLintConfig = {};
  if (loaded) {
    validateConfig(loaded.filepath || '', loaded.config);
    config = loaded.config;
  }

  // Merge passed config with file based options
  config = merge(
    {
      extends: [],
      plugins: [],
      rules: {},
    },
    config,
    seed,
  );

  // Resolve parserPreset key
  if (typeof config.parserPreset === 'string') {
    const resolvedParserPreset = resolveFrom(base, config.parserPreset);

    config.parserPreset = {
      name: config.parserPreset,
      path: resolvedParserPreset,
      parserOpts: require(resolvedParserPreset),
    };
  }

  // "types" can not be empty
  if ('types' in config && !config.types?.length) {
    throw new Error('"types" can not be empty');
  }

  const czCommitConfig: CzCommitConfig = {
    format: config.format || '{type}{scope}: {emoji}{subject}',
    types: config.types || [],
    scopes: config.scopes || [],
    useEmoji: config.useEmoji ?? true,
    emojis: {},
    typeEnumDescriptions: { ...config.typeEnumDescriptions },
    questionDescriptions: { ...config.questionDescriptions } as CzCommitConfig['questionDescriptions'],
    skips: config.skips || [],
  };

  // Resolve extends key
  const extended = resolveExtends(config, {
    prefix: 'commitlint-config',
    cwd: base,
    parserPreset: config.parserPreset,
  });

  if (!extended.formatter || typeof extended.formatter !== 'string') {
    extended.formatter = '@commitlint/format';
  }

  let plugins: PluginRecords = {};
  if (Array.isArray(extended.plugins)) {
    uniq(extended.plugins || []).forEach((plugin) => {
      if (typeof plugin === 'string') {
        plugins = loadPlugin(plugins, plugin, process.env.DEBUG === 'true');
      } else {
        plugins.local = plugin;
      }
    });
  }

  const rules = (
    await Promise.all(Object.entries(extended.rules || {}).map((entry) => executeRule(entry)))
  ).reduce<QualifiedRules>((registry, item) => {
    // type of `item` can be null, but Object.entries always returns key pair
    const [key, value] = item!;
    registry[key] = value;
    return registry;
  }, {});

  const helpUrl =
    typeof extended.helpUrl === 'string'
      ? extended.helpUrl
      : typeof config.helpUrl === 'string'
      ? config.helpUrl
      : 'https://github.com/conventional-changelog/commitlint/#what-is-commitlint';

  const prompt = extended.prompt && isPlainObject(extended.prompt) ? extended.prompt : {};

  if (!!czCommitConfig.types.length) {
    Object.assign(rules, {
      'type-enum': [2, 'always', czCommitConfig.types],
      'type-empty': [2, 'never'],
    });
  }

  if (!!czCommitConfig.scopes.length) {
    Object.assign(rules, {
      'scope-enum': [2, 'always', czCommitConfig.scopes],
      'scope-empty': [2, 'never'],
    });
  }

  if (prompt.questions?.type?.enum) {
    for (const enumKey in prompt.questions.type.enum) {
      const item = prompt.questions.type.enum[enumKey];
      if (item.description && czCommitConfig.emojis[enumKey]) {
        item.emoji = czCommitConfig.emojis[enumKey];
      }
      item.emoji && (czCommitConfig.emojis[enumKey] = item.emoji);
    }
  }

  return {
    extends: Array.isArray(extended.extends)
      ? extended.extends
      : typeof extended.extends === 'string'
      ? [extended.extends]
      : [],
    // Resolve config-relative formatter module
    formatter: resolveFrom.silent(base, extended.formatter) || extended.formatter,
    // Resolve parser-opts from preset
    parserPreset: await loadParserOpts(extended.parserPreset),
    ignores: extended.ignores,
    defaultIgnores: extended.defaultIgnores,
    plugins: plugins,
    rules: rules,
    helpUrl: helpUrl,
    prompt,
    czCommitConfig,
  };
}
