import resolveConfig from 'tailwindcss/resolveConfig';

import tailwindConfig from '../../tailwind.config.ts';

const fullConfig = resolveConfig(tailwindConfig);

const theme = fullConfig?.theme;

export default theme;
