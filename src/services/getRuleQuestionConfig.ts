import { RuleField } from '@commitlint/types';
import { QuestionConfig } from '../Question';
import { getCzCommitConfig } from '../store/cz';
import { getPromptMessages, getPromptQuestions } from '../store/prompts';
import { getRule } from '../store/rules';
import getCaseFn from '../utils/case-fn';
import getFullStopFn from '../utils/full-stop-fn';
import {
  enumRuleIsActive,
  getEnumList,
  getMaxLength,
  getMinLength,
  ruleIsActive,
  ruleIsApplicable,
  ruleIsDisabled,
} from '../utils/rules';

export default function (rulePrefix: RuleField, useEmoji?: boolean): QuestionConfig | null {
  const questions = getPromptQuestions();
  const questionSettings = questions[rulePrefix];
  const emptyRule = getRule(rulePrefix, 'empty');

  const mustBeEmpty = emptyRule && ruleIsActive(emptyRule) && ruleIsApplicable(emptyRule);

  if (mustBeEmpty) {
    return null;
  }

  const canBeSkip = !emptyRule || ruleIsDisabled(emptyRule);

  // 配置可以跳过
  if (canBeSkip && getCzCommitConfig().skips.includes(rulePrefix as any)) {
    return null;
  }

  const enumRule = getRule(rulePrefix, 'enum');
  const enumRuleList = enumRule && enumRuleIsActive(enumRule) ? getEnumList(enumRule) : null;
  let enumList;

  if (enumRuleList) {
    const enumDescriptions = questionSettings?.['enum'];

    if (enumDescriptions) {
      // const enumNames = Object.keys(enumDescriptions);
      const longest = Math.max(...enumRuleList.map((enumName) => enumName.length)) + (useEmoji ? 6 : 4);
      // TODO emoji + title
      enumList = enumRuleList
        // .sort((a, b) => enumNames.indexOf(a) - enumNames.indexOf(b))
        .map((enumName) => {
          const enumDescription = enumDescriptions[enumName]?.description;
          if (enumDescription) {
            const emoji = useEmoji ? enumDescriptions[enumName]?.emoji ?? '' : '';
            const title = enumDescriptions[enumName]?.title ?? enumName;
            return {
              name:
                `${emoji} ${enumName}:`.trim().padEnd(longest) +
                (getCzCommitConfig().typeEnumDescriptions[enumName] ?? enumDescription),
              value: enumName,
              short: enumName,
              title,
            };
          } else {
            return enumName;
          }
        });
    } else {
      enumList = [...enumRuleList];
    }
  }

  return {
    skip: canBeSkip,
    enumList,
    title:
      getCzCommitConfig().questionDescriptions[rulePrefix] ?? questionSettings?.['description'] ?? `${rulePrefix}:`,
    caseFn: getCaseFn(getRule(rulePrefix, 'case')),
    fullStopFn: getFullStopFn(getRule(rulePrefix, 'full-stop')),
    minLength: getMinLength(getRule(rulePrefix, 'min-length')),
    maxLength: getMaxLength(getRule(rulePrefix, 'max-length')),
    messages: getPromptMessages(),
  };
}
