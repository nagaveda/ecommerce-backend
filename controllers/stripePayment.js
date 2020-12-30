const stripe = require('stripe')("sk_test_51I1uftKu3498s3qiNukj5ISrlVM3yKghaMnjq73c2ETYNB4qyai7lNTu0kfyRXvWltITTXJaJNteZPbTT8Kr3nfO007WNjRzi5");
const {v4: uuid} = require("uuid"); 

exports.makePayment = (req, res ) => {
    const {products, token} = req.body;
    console.log("PRODUCTS", products);

    let amount = 0;
    products.map(product => {
        amount = amount + product.price;
    });

    const idempotencyKey = uuid();
    return stripe.customers.create({
        email: token.email,
        source: token.id
    }).then(customer => {
        stripe.charges.create({
            amount: amount*100,
            currency: 'usd',
            customer: customer.id,
            receipt_email : token.email,
            description:"A purchase",
            shipping: {
                name: token.card.name,
                address: {
                    line1: token.card.address_line1,
                    line2: token.card.address_line2,
                    city: token.card.address_city,
                    country: token.card.address_country,
                    postal_code: token.card.address_zip 
                }
            }
            
        }, {idempotencyKey})
        .then(result => res.status(200).json(result))
        .catch(err => console.log(err));
    });
}; 