require("dotenv").config()
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.password,
    database: "greatBay_DB"
})

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected as ID " + connection.threadId)
    connection.query("SELECT * FROM auctions", function(err, res) {
      console.log(res)
      connection.end()
    })
  })

// use inquirer to ask user for post or bid

// once user has decided:

    // if posting, create function
        // inquire for: item name, category, starting bid
    //then create function to add item to DB

    // if bidding, update function
        //read items from DB
        //use inquire to show list in order for user to select on item to bid
        //after deciding, inquire on bid
        //update highest bid column for specific item

// return message: "Your item has been posted!"

            //or

// return message:  "You are the highest bidder!" or "Sorry, bro, try again!"


