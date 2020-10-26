const {Order, ProductCart} = require('../models/order');

exports.getOrderById = (req, res, next, id) => {
    Order.findById(id)
    .populate("products.product", "name price")
    .exec((err, order) => {
        if(err){
            return res.status(400).json({
                error: "No order found in DB..."
            });
        }
        req.order = order;
        next();
    });
};

exports.createOrder = (req, res) => {
    req.body.order.user = req.profile;
    const order = new Order(req.body.order);
    order.save((err, order) => {
        if(err){
            return res.status(400).json({
                error: "Failed to save the order in DB"
            });
        }
        res.json(order);
    });
};

exports.getAllOrders = (req, res) => {
    Order.find()
    .populate("user", "_id name")
    .exec((err, orders) => {
        if(err){
            return res.status(400).json({
                error: "No Orders Found in DB"
            });
        }
        res.json(orders);
    });
};

exports.getOrderStatus = (req, res) => {
    res.json(Order.schema.path("status").enumValues);
};

exports.updateStatus = (req, res) => {
    Order.update(
        {_id:req.body.orderId},
        {$set: {status: req.body.status}},
        (err, order) => {
            if(err){
                return res.status(400).json({
                    error: "Error updating Order Status.."
                });
            }
            res.json(order);
        }
    );
};