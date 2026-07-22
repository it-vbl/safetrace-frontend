import manifest from '@/assets/image-manifest.json';

const getImage = (fileName: string) => {
  const ext = (manifest as Record<string, string>)[fileName];
  if (!ext) {
    console.warn(`[Assets] Image "${fileName}" not found in public directory.`);
    return `/${fileName}.png`; // fallback
  }
  return `/${fileName}.${ext}`;
};

const assets = {
  navbar: {
    logo: getImage('safetrace'),
    logoMobile: getImage('safetrace'),
    logoCompact: getImage('safetrace'),
  },
  login: {
    logo: getImage('safetrace'),
    background: getImage('login-bg'),
    partnership: getImage('partnership'),
  },
  sidebar: {
    institutionalLogos: [
      getImage('logos/logo1'),
      getImage('logos/logo2'),
      getImage('logos/logo3'),
    ],
  },
};

export default assets;
