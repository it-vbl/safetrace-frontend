import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'id'], // Define in this line the possible languages for translation
  defaultLocale: 'en', // Define in this line the default language to be shown
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
