import process from './Process';
import load, { CommitLintConfig } from './load';

export type { CommitLintConfig };

/**
 * Entry point for commitizen
 * @param  _ instance passed by commitizen, unused
 * @param commit callback to execute with complete commit message
 * @return {void}
 */
export function prompter(_: any, commit: (message: string) => void): void {
  load().then(({ rules, prompt = {}, czCommitConfig }) => {
    process(rules, prompt, czCommitConfig).then(commit);
  });
}
