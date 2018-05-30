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
    //then create function to add item to DB
    function postAuction() {
        // inquire for: item name, category, starting bid
        inquirer.prompt([
            {
              name: "item",
              type: "input",
              message: "What is the item you would like to submit?"
            },
            {
                name: "category",
                type: "input",
                message: "What category would you like to place your auction?"
            },
            {
              name: "startingBid",
              type: "input",
              message: "What would you like your starting bid to be?",
              valida: function(value) {
                  if(isNaN(value) === false) {
                      return true;
                  }
                  return false;
                }
            }     
    ])
    .then(function(answer) {
        // when finished prompting, insert a new item into the db with that info
        connection.query(
            "INSERT INTO auctions SET ?", {
                item_name: answer.item,
                category: answer.category,
                starting_bid: answer.startingBid,
                highest_bid: answer.startingBid
            },
            function (err) {
                if (err) throw err;
                console.log("Your auction was created successfully!");
                //once function is complete, re-prompt user input for bid or post
                startApp();
            }
        );
    });
}

function bidAuction() {
    //read items from the database
    connection.query("SELECT * FROM auctions", function(err, results) {
        if (err) throw err;
        //use inquirer to show list in order for user to select on item to bid
        inquirer.prompt([
            {
             name: "choice",
             type: "rawlist",
             choices: function() {
                 var choiceArray = [];
                 for (var i = 0; i < results.length; i++) {
                     choiceArray.push(results[i].item_name);
                 }
                 return choiceArray;
             },
             message: "What auction would you like to place a bid in?"   
            },
            {
            name: "bid",
            type: "input",
            message: "How much would you like to bid?"
            }
        ])
        .then(function(answer) {
            // get the information of the item chosen
            var chosenItem;
            for (var i = 0; i < results.length; i++) {
                if (results[i].item_name === answer.choice) {
                    chosenItem = results[i];
                }
            }
            // determine if bid was high enough
            if (chosenItem.highest_bid < parseInt(answer.bid)) {
                // bid was high enough, so update db, inform user, restart app
                connection.query(
                    "UPDATE auctions SET ? WHERE ?",
                    [
                        {
                            highest_bid: answer.bid
                        },
                        {
                            id: chosenItem.id
                        }
                    ],
                    function(error) {
                        if (error) throw err;
                        console.log("Congratulations!  You are the highest bidder!");
                        start();
                    }
                );
            }
            else {
                // bid wasn't high enough, return message and restart app                console.log("Sorry, bro.  Try again!")
                start();
            }
        });
    });
}