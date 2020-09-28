const cors = require("cors");
const express = require("express");
const stripe = require("stripe")(
  "sk_test_51HM7HFEUwirnzbs9M06pJcRFYWSRSFjetixK9FgIbIPj30qcUsqRjyqjsNFnuDVJlsCN2J1NfuMMe3BMs81l70sK00UqlsiCfm"
);

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("App is running on port 8080");
});

app.post("/payment", (req, res) => {
  let { product, token } = req.body;

  const idempontencyKey = uuid();

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges.create(
        {
          amount: product.price * 100,
          currency: "usd",
          customer: customer.id,
          receipt_email: token.email,
          description: product.name,
          shipping: {
            name: token.card.name,
            address: {
              country: token.card.address_country,
            },
          },
        },
        { idempontencyKey }
      );
    })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      console.log("This is error in stripe :: ", error);
    });
});

app.listen(8080, () => {
  console.log("App is running");
});
