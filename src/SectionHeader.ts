import { PromptName, RuleField } from '@commitlint/types';
import fuzzy from 'fuzzy';
import { Answers, DistinctQuestion } from 'inquirer';
import Question, { QuestionConfig } from './Question';
import getRuleQuestionConfig from './services/getRuleQuestionConfig';
import { getCzCommitConfig } from './store/cz';
import { getPromptSettings } from './store/prompts';

export class HeaderQuestion extends Question {
  headerMaxLength: number;
  headerMinLength: number;
  constructor(name: PromptName, questionConfig: QuestionConfig, headerMaxLength?: number, headerMinLength?: number) {
    super(name, questionConfig);
    this.headerMaxLength = headerMaxLength ?? Infinity;
    this.headerMinLength = headerMinLength ?? 0;
  }
  beforeQuestionStart(answers: Answers): void {
    const headerRemainLength = this.headerMaxLength - combineCommitMessage(answers).length;
    this.maxLength = Math.min(this.maxLength, headerRemainLength);
    this.minLength = Math.min(this.minLength, this.headerMinLength);
  }
}

export function combineCommitMessage(answers: Answers): string {
  const { format, useEmoji, emojis } = getCzCommitConfig();
  const { type = '', scope = '', subject = '' } = answers;

  return format
    .replace(/\{type\}/gi, type ?? '')
    .replace(/\{scope\}/gi, scope ? `(${scope})` : '')
    .replace(/\{subject\}/gi, subject ?? '')
    .replace(/\{emoji\}/gi, useEmoji && emojis[type] ? `${emojis[type]} ` : '')
    .trim();
}

export function getQuestions(): Array<DistinctQuestion> {
  // header: type, scope, subject
  const questions: Array<DistinctQuestion> = [];

  const headerRuleFields: RuleField[] = ['type', 'scope', 'subject'];

  const headerRuleQuestionConfig = getRuleQuestionConfig('header');

  if (!headerRuleQuestionConfig) {
    return [];
  }

  headerRuleFields.forEach((name) => {
    const questionConfig = getQuestionConfig(name, name === 'type' && getCzCommitConfig().useEmoji);
    if (questionConfig) {
      const instance = new HeaderQuestion(
        name,
        questionConfig,
        headerRuleQuestionConfig.maxLength,
        headerRuleQuestionConfig.minLength,
      );
      questions.push(instance.question);
    }
  });
  return questions;
}

const findType = function (substring: string, types: QuestionConfig['enumList'] = []) {
  return Promise.resolve(
    fuzzy
      .filter(
        substring || '',
        (types || []).map(({ value }: any) => value),
      )
      .map(({ original }: any) => (types || []).find(({ value }: any) => value === original)),
  );
};

const findScope = function (substring: string, scopes: string[]) {
  return Promise.resolve(fuzzy.filter(substring || '', scopes).map(({ original: scope }) => scope));
};

export function getQuestionConfig(name: RuleField, useEmoji?: boolean): ReturnType<typeof getRuleQuestionConfig> {
  const questionConfig = getRuleQuestionConfig(name, name === 'type' && useEmoji);

  if (questionConfig) {
    if (name === 'scope') {
      if (getPromptSettings()['enableMultipleScopes']) {
        questionConfig.multipleSelectDefaultDelimiter = getPromptSettings()['scopeEnumSeparator'];
      }
      // split scope string to segments, match commitlint rules
      questionConfig.multipleValueDelimiters = /\/|\\|,/g;
      if (Array.isArray(questionConfig.enumList)) {
        questionConfig.source = (_: any, input: string) => findScope(input, questionConfig.enumList as any);
      }
    }
    if (name === 'type') {
      questionConfig.source = (_: any, input: string) => findType(input, questionConfig.enumList as any);
    }
  }

  return questionConfig;
}
