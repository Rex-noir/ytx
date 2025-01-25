export const getEnv = <K extends keyof ImportMetaEnv>(
  name: K,
  defaultValue: string | null = null,
): string | null => {
  return import.meta.env[name] || defaultValue
}
