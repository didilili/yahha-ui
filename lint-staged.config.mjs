export default {
  '*.{js,mjs,cjs,jsx,ts,tsx}': ['oxlint --fix --deny-warnings', 'prettier --write'],
  '*.{json,jsonc,css,md,yml,yaml,html}': 'prettier --write',
};
