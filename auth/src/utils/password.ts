import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);
const saltLength = 8;
const keyLength = 64;

export class Password {
  static async toHash(password: string): Promise<string> {
    const salt = randomBytes(saltLength).toString("hex");
    const buf = (await scryptAsync(password, salt, keyLength)) as Buffer;

    return `${buf.toString("hex")}.${salt}`;
  }

  static async compare(storedPassword: string, suppliedPassword: string): Promise<boolean> {
    const [hash, salt] = storedPassword.split(".");

    const buf = (await scryptAsync(suppliedPassword, salt, keyLength)) as Buffer;

    return hash === buf.toString("hex");
  }
}