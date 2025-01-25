import "dotenv/config";

export const getNodeEnv = (
  name: string,
  defaultValue: string | null = null
) => {
  return process.env[name] ?? defaultValue;
};
