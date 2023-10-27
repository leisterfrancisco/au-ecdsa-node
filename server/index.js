const express = require("express");
const cors = require("cors");

const { cryptoUtil } = require("./utils");

const app = express();
const port = 3042;

app.use(cors());
app.use(express.json());

// alice
// private key: 3e78355774b65079ddd3fffc1f12b5d723bf0135823b89674ee1d3c7524a42de
// public key: 02403f4987729d1fb16576791d6c18c2a0c2890bfaf7463ec0e5beac3559212c4a

// bob
// private key: 649199ebfce51ea8eba4f9111d506f5f0df00f7a7850ec9b59ea3ca531e0b9ec
// public key: 02aea9f6db6679a6ac747fa4e94d52e948cf922a3cc5105cb6b21f82c5809a5b3a

// pip
// private key: 087757b59fd9f1b94bc736ee0504c8ba9717547258e39374c45b5be3ed6619d5
// public key: 02f21c934844b156853663e54c3cc9460c804f573f25c3c42f9d0bb64cfeca7b33

const balances = {
  "02403f4987729d1fb16576791d6c18c2a0c2890bfaf7463ec0e5beac3559212c4a": 100,
  "02aea9f6db6679a6ac747fa4e94d52e948cf922a3cc5105cb6b21f82c5809a5b3a": 50,
  "02f21c934844b156853663e54c3cc9460c804f573f25c3c42f9d0bb64cfeca7b33": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;

  res.send({ balance });
});

app.post("/send", async (req, res) => {
  const { message, signature } = req.body;

  const senderPk = cryptoUtil.recoverPublicKey(message, signature);
  const recipient = message.recipient;
  const amount = message.amount;

  if (senderPk === recipient) {
    throw new Error("Sender and recipient cannot be the same");
  }

  setInitialBalance(senderPk);
  setInitialBalance(recipient);

  if (balances[senderPk] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[senderPk] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[senderPk] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
