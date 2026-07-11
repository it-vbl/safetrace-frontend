const env = {
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  NEXT_PUBLIC_IMAGE_DOMAIN: process.env.NEXT_PUBLIC_IMAGE_DOMAIN,
};

// Validasi environment variable yang wajib ada
const requiredVars = ['NEXT_PUBLIC_BASE_URL', 'NEXT_PUBLIC_IMAGE_DOMAIN'];

for (const key of requiredVars) {
  if (!env[key]) {
    throw new Error(`[Environment Error]: ${key} is required but was not provided. Please check your .env file.`);
  }
}

export default env;
