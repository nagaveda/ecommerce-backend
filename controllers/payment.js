const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "t96vswdp2vd5vdy9",
  publicKey: "zjfzd6k8wddfxdbc",
  privateKey: "27a8e74d24b808236c064b7bb1350a1d"
});

exports.getToken = (req, res) => {
    gateway.clientToken.generate({}, (err, response) => {
        // pass clientToken to your front-end
        if (err){
            res.status(500).send(err);
        }
        else{
            res.send(response);
        }
    });
};

exports.processPayment = (req, res) => {
    let  nonceFromTheClient = req.body.paymentMethodNonce;
    let amountFromTheClient = req.body.amount;

    gateway.transaction.sale({
        amount: amountFromTheClient,
        paymentMethodNonce: nonceFromTheClient,
        options: {
          submitForSettlement: true
        }
      }, (err, result) => {
          if(err){
              res.status(500).json(error);
          }
          else{
              res.json(result);
          }
    });
};