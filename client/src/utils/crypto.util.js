import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes } from "ethereum-cryptography/utils";
import { toHex } from "ethereum-cryptography/utils";

function hashMessage(message) {
  const bMesage = utf8ToBytes(message);
  const hMessage = keccak256(bMesage);

  return hMessage;
}

async function signMessage(privateKey, msg) {
  const hashedMessage = hashMessage(msg.toString());

  return secp256k1.sign(hashedMessage, privateKey);
}

function getPublicKey(privateKey) {
  return toHex(secp256k1.getPublicKey(privateKey));
}

export default { signMessage, hashMessage, getPublicKey };
