import type { NextIntlConfig } from "next-intl";
import { locales, defaultLocale } from "./lib/i18n/config";

const config: NextIntlConfig = {
  locales: [...locales],
  defaultLocale
};

export default config;
