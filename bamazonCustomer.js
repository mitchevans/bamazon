var mysql = require("mysql");
const table = require("console.table");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "123abc",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    preStart();
});

var itemID = "";
var itemQuantity = "";
var cartTotal = 0;
var cart = [];

function preStart() {
    connection.query("SELECT * FROM products", function (err, results) {
        console.table(results);
        startProgram();
    });
}
function startProgram() {

    inquirer
        .prompt([
            {
                name: "productID",
                type: "input",
                message: "Please enter the product id of the item you would like to purchase."
            },
            {
                name: "quantity",
                type: "input",
                message: "How many would you like to buy?"
            }
        ])
        .then(function (answer) {
            itemID = parseInt(answer.productID);
            itemQuantity = parseInt(answer.quantity);
            checkInventory();
        });

}
function checkInventory() {

    connection.query("SELECT product_name, stock_quantity, price, item_id FROM products WHERE ?", { item_id: itemID }, function (err, results) {
        if (err) throw err;
        if (itemQuantity <= results[0].stock_quantity) {
            console.log("Your items are available and in your cart.")
            console.log(cartTotal += results[0].price * itemQuantity);
            cart.push(itemQuantity + " " + results[0].product_name + "(s)");
            updateInventory(results[0]);
        }
        else {
            console.log("Sorry, there are only " + results[0].stock_quantity + " in stock.");
            anotherItem();
        };
    });

}

function updateInventory(results) {

    connection.query("UPDATE products SET ? WHERE ?",
        [
            { stock_quantity: results.stock_quantity - itemQuantity },
            { item_id: results.item_id }
        ]
        , function (err) {
            if (err) throw err;

            anotherItem();
        });

}

function anotherItem() {
    inquirer
        .prompt([
            {
                name: "another",
                type: "rawlist",
                message: "Would you like to purchase anything else?",
                choices: ["yes", "no"]
            },

        ])
        .then(function (answer) {
            switch (answer.another) {
                case "yes":
                    // itemID = "";
                    //itemQuantity = "";
                    startProgram();
                    break;

                case "no":
                    console.log("Items purchased: " + cart)
                    console.log("Your total is " + cartTotal + ".")
                    console.log("Thank you for your purchase.")
                    break;

            }
        });

}