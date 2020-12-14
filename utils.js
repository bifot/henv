const crypto = require("crypto");

const encrypt = (text, password) => {
  let cipher = crypto.createCipher("aes256", password);
  let encrypted = cipher.update(text, "utf8", "base64");

  encrypted += cipher.final("base64");

  return encrypted;
};

const decrypt = (encrypted, password) => {
  let decipher = crypto.createDecipher("aes256", password);
  let decrypted = decipher.update(encrypted, "base64", "utf8");

  decrypted += decipher.final("utf8");

  return decrypted;
};

module.exports = {
  encrypt,
  decrypt
};