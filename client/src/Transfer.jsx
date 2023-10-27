import { useState } from "react";
import { utf8ToBytes } from "ethereum-cryptography/utils";

import cryptoUtil from "./utils/crypto.util";

import server from "./server";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    if (!privateKey) {
      alert("Private key is required");
      return;
    }

    if (address === recipient) {
      alert("Sender and recipient cannot be the same");
      return;
    }

    const message = { amount: parseInt(sendAmount), recipient };
    const signature = await cryptoUtil.signMessage(privateKey, message);

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        signature: { hex: signature.toDERHex(), recovery: signature.recovery },
        message,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
