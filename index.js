//Author: Amritpal Singh

// importing dependencies
const express = require('express');
const path = require('path');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');

// setup the database and making the connection
mongoose.connect('mongodb://localhost:27017/onlineGeneralStore', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// setup model for Orders
const Order = mongoose.model('Order', {
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    province: String,
    postalCode: String,
    cookies: Number,
    biscuits: Number,
    drink: Number,
    chips: Number,
    cupCakes: Number,
    cookiesPurchasePrice: Number,
    biscuitsPurchasePrice: Number,
    drinkPurchasePrice: Number,
    chipsPurchasePrice: Number,
    cupCakesPurchasePrice: Number,
    purchaseSubTotal: Number,
    taxPercentage: Number,
    taxAmount: Number,
    totalAmount: Number
});

// seeting-up global variables to use packages
var myApp = express();
myApp.use(express.urlencoded({ extended: true }));

// setting-up path to public folders & view folders
myApp.set('views', path.join(__dirname, 'views'));
myApp.use(express.static(__dirname + '/public'));

// setting-up EJS view engine
myApp.set('view engine', 'ejs');

// declaring constants for items' prices
const COOKIESPRICE = 5.00;
const BISCUITSPRICE = 10.00;
const DRINKSPRICE = 2.00;
const CHIPSPRICE = 4.00;
const CUPCAKESPRICE = 3.00;

// declaring sales tax for provinces
const ALBERTA_SALESTAX = 5.00;
const BRITISH_COLUMBIA_SALESTAX = 12.00;
const MANITOBA_SALESTAX = 12.00;
const NEW_BRUNSWICK_SALESTAX = 15.00;
const NEWFOUNDLAND_AND_LABRADOR_SALESTAX = 15.00;
const NORTHWEST_TERRITORIES_SALESTAX = 5.00;
const NOVASCOTIA_SALESTAX = 15.00;
const NUNAVUT_SALESTAX = 5.00
const ONTARIO_SALESTAX = 13.00;
const PRINCE_EDWARD_ISLAND_SALESTAX = 15.00;
const QUEBEC_SALESTAX = 14.975;
const SASKATCHEWAN_SALESTAX = 11.00;
const YUKON_SALESTAX = 5.00;

// setting-up regex for name, phone and postalCode
var nameRegex = /^[a-zA-Z]{1,}\s[a-zA-Z]{1,}$/
var phoneRegex = /^[1-9]{3}\-[0-9]{3}\-[0-9]{4}$/

// validation function for province dropdown
function validateProvince(value, { req }) {
    var province = req.body.province;

    if (province == "selected") {
        throw new Error('Please select a Province.')
    }
    return true;
}

// validation function for items bought
function validatePurchase(value, { req }) {
    // fetch data for sale items
    var cookies = req.body.cookies;
    var biscuits = req.body.biscuits;
    var drink = req.body.drink;
    var chips = req.body.chips;
    var cupCakes = req.body.cupCakes;

    // parse input into integer
    cookies = parseInt(cookies);
    biscuits = parseInt(biscuits);
    drink = parseInt(drink);
    chips = parseInt(chips);
    cupCakes = parseInt(cupCakes);

    // calculcate purchase cost of each item.
    var cookiesPurchasePrice = cookies * COOKIESPRICE;
    var biscuitsPurchasePrice = biscuits * BISCUITSPRICE;
    var drinkPurchasePrice = drink * DRINKSPRICE;
    var chipsPurchasePrice = chips * CHIPSPRICE;
    var cupCakesPurchasePrice = cupCakes * CUPCAKESPRICE;

    // calculate total quantity of items
    var totalQuantity = cookies + biscuits + drink + chips + cupCakes;

    // calculate sub-total before tax
    var purchaseSubTotal = cookiesPurchasePrice + biscuitsPurchasePrice + drinkPurchasePrice + chipsPurchasePrice + cupCakesPurchasePrice;

    if (isNaN(totalQuantity)) {
        throw new Error('Please enter a valid item quantity');
    }
    else if (totalQuantity == 0) {
        throw new Error('Please buy atleast 1 item');
    }
    else {
        if (totalQuantity > 0 && purchaseSubTotal < 10) {
            throw new Error('Please buy products worth $10 or more.')
        }
    }
    return true;
}

// setting-up different routes
myApp.get('/', function (req, res) {
    res.render('form');
});

myApp.post('/process', [
    check('name', 'Please enter Full Name.').matches(nameRegex),
    check('email', 'Incorrect Email format.').isEmail(),
    check('phone', 'Incorrect Phone Number format.').matches(phoneRegex),
    check('address', 'Please enter the Address.').notEmpty(),
    check('city', 'Please enter the City').notEmpty(),
    check('province', '').custom(validateProvince),
    check('cookies', '').custom(validatePurchase)
], function (req, res) {
    // check for errors
    const errors = validationResult(req);
    console.log(errors);

    if (!errors.isEmpty()) {
        res.render('form', {
            errors: errors.array()
        });
    }
    else {
        // fetch all data from fields
        var name = req.body.name;
        var email = req.body.email;
        var phone = req.body.phone;
        var address = req.body.address;
        var city = req.body.city;
        var province = req.body.province;
        var postalCode = req.body.postalCode;
        var cookies = req.body.cookies;
        var biscuits = req.body.biscuits;
        var drink = req.body.drink;
        var chips = req.body.chips;
        var cupCakes = req.body.cupCakes;

        // calculcate purchase cost of each item.
        var cookiesPurchasePrice = cookies * COOKIESPRICE;
        var biscuitsPurchasePrice = biscuits * BISCUITSPRICE;
        var drinkPurchasePrice = drink * DRINKSPRICE;
        var chipsPurchasePrice = chips * CHIPSPRICE;
        var cupCakesPurchasePrice = cupCakes * CUPCAKESPRICE;

        // calculate sub-total before tax
        var purchaseSubTotal = cookiesPurchasePrice + biscuitsPurchasePrice + drinkPurchasePrice + chipsPurchasePrice + cupCakesPurchasePrice;

        // calculate tax amount and total amount
        switch (province) {
            case 'Alberta':
                var taxPercentage = ALBERTA_SALESTAX;
                var taxAmount = (purchaseSubTotal * taxPercentage) / 100;
                var totalAmount = purchaseSubTotal + taxAmount;
                break;
            case 'British Columbia':
                var taxPercentage = BRITISH_COLUMBIA_SALESTAX;
                var taxAmount = (purchaseSubTotal * taxPercentage) / 100;
                var totalAmount = purchaseSubTotal + taxAmount;
                break;
            case 'Manitoba':
                var taxPercentage = MANITOBA_SALESTAX;
                var taxAmount = (purchaseSubTotal * taxPercentage) / 100;
                var totalAmount = purchaseSubTotal + taxAmount;
                break;
            case 'New Brunswick':
                var taxPercentage = NEW_BRUNSWICK_SALESTAX;
                var taxAmount = (purchaseSubTotal * taxPercentage) / 100;
                var totalAmount = purchaseSubTotal + taxAmount;
                break;
            case 'Newfoundland and Labrador':
                var taxPercentage = NEWFOUNDLAND_AND_LABRADOR_SALESTAX;
                var taxAmount = (purchaseSubTotal * taxPercentage) / 100;
                var totalAmount = purchaseSubTotal + taxAmount;
                break;
            case 'Northwest Territories':
                var taxPercentage = NORTHWEST_TERRITORIES_SALESTAX;
                var taxAmount = (purchaseSubTotal * taxPercentage) / 100;
                var totalAmount = purchaseSubTotal + taxAmount;
                break;
            case 'Nova Scotia':
                var taxPercentage = NOVASCOTIA_SALESTAX;
                var taxAmount = (purchaseSubTotal * taxPercentage) / 100;
                var totalAmount = purchaseSubTotal + taxAmount;
                break;
            case 'Nunavut':
                var taxPercentage = NUNAVUT_SALESTAX;
                var taxAmount = (purchaseSubTotal * taxPercentage) / 100;
                var totalAmount = purchaseSubTotal + taxAmount;
                break;
            case 'Ontario':
                var taxPercentage = ONTARIO_SALESTAX;
                var taxAmount = (purchaseSubTotal * taxPercentage) / 100;
                var totalAmount = purchaseSubTotal + taxAmount;
                break;
            case 'Prince Edward Island':
                var taxPercentage = PRINCE_EDWARD_ISLAND_SALESTAX;
                var taxAmount = (purchaseSubTotal * taxPercentage) / 100;
                var totalAmount = purchaseSubTotal + taxAmount;
                break;
            case 'Quebec':
                var taxPercentage = QUEBEC_SALESTAX;
                var taxAmount = (purchaseSubTotal * taxPercentage) / 100;
                var totalAmount = purchaseSubTotal + taxAmount;
                break;
            case 'Saskatchewan':
                var taxPercentage = SASKATCHEWAN_SALESTAX;
                var taxAmount = (purchaseSubTotal * taxPercentage) / 100;
                var totalAmount = purchaseSubTotal + taxAmount;
                break;
            case 'Yukon':
                var taxPercentage = YUKON_SALESTAX;
                var taxAmount = (purchaseSubTotal * taxPercentage) / 100;
                var totalAmount = purchaseSubTotal + taxAmount;
                break;
        }

        // object of fetched data
        var receiptData = {
            name: name,
            email: email,
            phone: phone,
            address: address,
            city: city,
            province: province,
            postalCode: postalCode,
            cookies: cookies,
            biscuits: biscuits,
            drink: drink,
            chips: chips,
            cupCakes: cupCakes,
            cookiesPurchasePrice: cookiesPurchasePrice,
            biscuitsPurchasePrice: biscuitsPurchasePrice,
            drinkPurchasePrice: drinkPurchasePrice,
            chipsPurchasePrice: chipsPurchasePrice,
            cupCakesPurchasePrice: cupCakesPurchasePrice,
            purchaseSubTotal: purchaseSubTotal,
            taxPercentage: taxPercentage,
            taxAmount: taxAmount,
            totalAmount: totalAmount
        }

        // store the receiptData to database
        var newOrder = new Order(receiptData);

        // save the order
        newOrder.save().then(function () {
            console.log('New Order Created...');
        });

        // send data to view and render it
        res.render('receipt', receiptData);
    }
});

// allOrders page
myApp.get('/allOrders', function (req, res) {
    Order.find({}).exec(function (err, orders) {
        console.log(err)
        res.render('allOrders', { orders: orders });
    });
});

// start the server and listen at port 8080
myApp.listen(8080);

// confirmation message
console.log('Execution is successful. Open website at http://localhost:8080');