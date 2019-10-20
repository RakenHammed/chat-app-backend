import fs from "fs";

export const getJwtSecret = (): string => {
  const key: string = fs.readFileSync("config/jwt.key", "utf8");
  return key;
};
