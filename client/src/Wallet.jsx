import server from "./server";

import cryptoUtil from "./utils/crypto.util";

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  privateKey,
  setPrivateKey,
}) {
  async function onChange(evt) {
    const privateKey = evt.target.value;

    try {
      const addr = cryptoUtil.getPublicKey(privateKey);

      setPrivateKey(privateKey);
      setAddress(addr);

      if (addr) {
        const {
          data: { balance },
        } = await server.get(`balance/${addr}`);

        setBalance(balance);
      } else {
        setBalance(0);
      }
    } catch (error) {}
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input
          placeholder="Type in a private key"
          value={privateKey}
          onChange={onChange}
        ></input>
      </label>
      <label>
        Address: 0x{address.slice(0, 3)}...
        {address.slice(address.length - 4, address.length)}
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
