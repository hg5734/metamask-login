const express = require("express");
const app = express();
const port = 3001;
const cors = require('cors');
const ethUtil = require('ethereumjs-util')
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser());

app.get("/token", (req, res) => {
  let nonce = Math.floor(Math.random() * 1000000).toString(); // in a real life scenario we would random this after each login and fetch it from the db as well
  return res.send(nonce);
});
app.post("/auth", (req, res) => {
  try {
    const { address, signature, nonce } = req.body;
    // in real life we will fetch nonce from db and update nonce value for next login
    let message = `login${nonce}`
    const messageHash = ethUtil.hashPersonalMessage(ethUtil.toBuffer(Buffer.from(message, 'utf8')));
    const signatureParams = ethUtil.fromRpcSig(ethUtil.toBuffer(signature));
    const publicKey = ethUtil.ecrecover(
      messageHash,
      signatureParams.v,
      signatureParams.r,
      signatureParams.s
    );
    const addressBuffer = ethUtil.publicToAddress(publicKey);
    const recoveredAddress = (ethUtil.bufferToHex(addressBuffer)).toLowerCase();
    if (recoveredAddress !== address.toLowerCase()) {
      return res.status(401).send({message: 'unauthorized'});
    }
    //signature verified 
    res.send({message :"Hello World!"});
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message)
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
