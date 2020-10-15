const Product = require("../models/product");
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs')

exports.getProductById = (req, res, next, id) => {
    Product.findById(id)
    .populate("category")
    .exec((err, product) => {
        if(err){
            return res.status(400).json({
                error: "Product not found"
            }); 
        }
        req.product = product;
        next();
    });
};

exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                error: "Error with the image"
            });
        }
        //Destructure the fields
        const {name, description, price, category, stock} = fields;

        if (
            !name||
            !description ||
            !price || 
            !category || 
            !stock
        ){
            return res.json(400).json({
                error: 'Please include all the fields..'
            });

        }

        
         let product = new Product(fields);

         //handle file here
         if(file.photo){
             if(file.photo.size > 3000000){
                 return res.status(400).json({
                     error: "File size too big"
                 });
             }
             product.photo.data = file.photo.path;
             product.photo.contentType = file.photo.type;

         }

         //save to the DB
         product.save((err, product) => {
             if(err){
                 return res.status(400).json({
                     error: "Error saving product to DB"
                 });
             }
             res.json(product);
         })
    })
};