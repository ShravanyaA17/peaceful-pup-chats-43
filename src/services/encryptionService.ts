import CryptoJS from "crypto-js";

/**
 * Client-side encryption service for sensitive journal content
 * Uses AES encryption with user's password as key
 */
export class EncryptionService {
  /**
   * Encrypt text using AES with password-derived key
   */
  static encrypt(text: string, password: string): string {
    try {
      // Create a salt for additional security
      const salt = CryptoJS.lib.WordArray.random(128 / 8);

      // Derive key from password using PBKDF2
      const key = CryptoJS.PBKDF2(password, salt, {
        keySize: 256 / 32,
        iterations: 10000,
      });

      // Encrypt the text
      const encrypted = CryptoJS.AES.encrypt(text, key, {
        iv: CryptoJS.lib.WordArray.random(128 / 8),
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC,
      });

      // Combine salt and encrypted data
      const result = salt.toString() + ":" + encrypted.toString();
      return result;
    } catch (error) {
      console.error("Encryption failed:", error);
      throw new Error("Failed to encrypt journal entry");
    }
  }

  /**
   * Decrypt text using AES with password-derived key
   */
  static decrypt(encryptedText: string, password: string): string {
    try {
      // Split salt and encrypted data
      const parts = encryptedText.split(":");
      if (parts.length !== 2) {
        throw new Error("Invalid encrypted format");
      }

      const salt = CryptoJS.enc.Hex.parse(parts[0]);
      const encrypted = parts[1];

      // Derive the same key from password
      const key = CryptoJS.PBKDF2(password, salt, {
        keySize: 256 / 32,
        iterations: 10000,
      });

      // Decrypt the text
      const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC,
      });

      const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

      if (!decryptedText) {
        throw new Error("Decryption failed - wrong password");
      }

      return decryptedText;
    } catch (error) {
      console.error("Decryption failed:", error);
      throw new Error("Failed to decrypt journal entry - check your password");
    }
  }

  /**
   * Generate a strong password hash for verification
   */
  static hashPassword(password: string): string {
    return CryptoJS.SHA256(password + "peaceful_pup_salt").toString();
  }

  /**
   * Verify if the provided password matches the stored hash
   */
  static verifyPassword(password: string, storedHash: string): boolean {
    const hash = this.hashPassword(password);
    return hash === storedHash;
  }
}
