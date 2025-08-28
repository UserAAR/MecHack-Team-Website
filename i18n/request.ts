import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => {
  const lng = (locale ?? "en").split("-")[0];
  return {
    locale: lng,
    messages: (await import(`../messages/${lng}.json`)).default,
  } as const;
}); 