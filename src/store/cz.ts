import { CzCommitConfig } from '../load';

const storeKey = Symbol('czCommitConfig');

const store: {
  [storeKey]: CzCommitConfig;
} = {
  [storeKey]: {} as CzCommitConfig,
};

export const setCzCommitConfig = (config: CzCommitConfig) => {
  Object.assign(store[storeKey], config);
};

export const getCzCommitConfig = () => store[storeKey];
