const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");

function hashMessage(message) {
  const bMesage = utf8ToBytes(message);
  const hMessage = keccak256(bMesage);

  return hMessage;
}

function recoverPublicKey(message, signature) {
  const signatureInstance = secp256k1.Signature.fromDER(
    signature.hex
  ).addRecoveryBit(signature.recovery);
  const publicKey = signatureInstance.recoverPublicKey(
    hashMessage(message.toString())
  );

  return publicKey.toHex();
}

module.exports = { recoverPublicKey };
