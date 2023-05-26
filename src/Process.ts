import { QualifiedRules, UserPromptConfig } from '@commitlint/types';
import inquirer from 'inquirer';
import { combineCommitMessage as combineBody, getQuestions as getBodyQuestions } from './SectionBody';
import { combineCommitMessage as combineFooter, getQuestions as getFooterQuestions } from './SectionFooter';
import { combineCommitMessage as combineHeader, getQuestions as getHeaderQuestions } from './SectionHeader';
import { CzCommitConfig } from './load';
import { setCzCommitConfig } from './store/cz';
import { setPromptConfig } from './store/prompts';
import { setRules } from './store/rules';

export default async function (
  rules: QualifiedRules,
  prompts: UserPromptConfig,
  czCommitConfig: CzCommitConfig,
): Promise<string> {
  setRules(rules);
  setPromptConfig(prompts);
  setCzCommitConfig(czCommitConfig);

  const questions = [...getHeaderQuestions(), ...getBodyQuestions(), ...getFooterQuestions()];

  const answers = await inquirer.prompt(questions);
  const header = combineHeader(answers);
  const body = combineBody(answers);
  const footer = combineFooter(answers);

  const msg = [header, body, footer].filter(Boolean).join('\n');

  return msg;
}
