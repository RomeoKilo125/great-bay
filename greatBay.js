require("dotenv").config()
var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.password,
    database: "greatBay_DB"
});

connection.connect(function (err) {
    if (err) throw err;
    //TESTING CONNECTION
    //console.log("Connected as ID " + connection.threadId)
    //connection.query("SELECT * FROM auctions", function (err, res) {
    //console.log(res)
    //createProduct();
    startApp();
});
// use inquirer to ask user for post or bid
function startApp() {
    inquirer
        .prompt({
            name: "postOrBid",
            type: "rawlist",
            message: "Would you like to [POST] an auction or [BID] on an auction?",
            choices: ["POST", "BID"]
        })
        // once user has decided:
        .then(function(answer) {
    // if posting, create function
            if (answer.postOrBid.toUpperCase() === "POST") {
                postAuction();
            }
            else {
                bidAuction();
            }
        });
    }
    // inquire for: item name, category, starting bid
    //then create function to add item to DB
    function postAuction() {
        console.log("Inserting a new bid...\n");
        var query = connection.query(
            "INSERT INTO auctions SET ?", {
                item_name: "Nintendo Switch",
                category: "Video Games",
                starting_bid: 0,
                highest_bid: 0
            },
            function (err, res) {
                console.log(res.affectedRows + " product inserted!\n");
                readProducts();
            }
        );

        console.log(query.sql);
    }

    function readProducts() {
        console.log("Selecting all products..\n");
        connection.query("SELECT * FROM auctions", function (err, res) {
            if (err) throw err;
            console.log(res);
            connection.end();
        });
    };
    
// if bidding, update function
//read items from DB
//use inquire to show list in order for user to select on item to bid
//after deciding, inquire on bid
//update highest bid column for specific item

// return message: "Your item has been posted!"

//or

// return message:  "You are the highest bidder!" or "Sorry, bro, try again!"