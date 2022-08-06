//Controller handles bulk of the work.
// Below are just imports from various areas.
const Auction = require('../../models/Auction')
const passport = require('passport');
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const BnetStrategy = require('passport-bnet').Strategy;
const app = express();
const https = require('https')
const fs = require('fs');
const axios = require('axios');
const sContext = require('../../config/strategyPattern/scontext');
const bubbleSortStrategy = require('../../config/strategyPattern/bubbleSortStrategy');
const selectionSortStrategy = require('../../config/strategyPattern/selectionSortStrategy');
const insertionSortStrategy = require('../../config/strategyPattern/insertionSortStrategy');

var pageData//this is needed to load the data into a variable which can be shared across different methods across this controller.

//GET request for searhing the data.
exports.searchDataGet = async (req, res, next) => {
    //console.log(req.query)
    var auctions;
    try {
        if (!req.query.searchid) {
            //Searching for everything in case there is no string provided to search
            auctions = await Auction.searchAuction('%')
        }
        else {
            //Searching for the string adding % as wildcard before and after.
            auctions = await Auction.searchAuction("%" + req.query.searchid.trim() + "%")
        }

        //Reading the JSON returned, parsing it and pushing to to the view using ejs templating module.
        let data = JSON.stringify(auctions)
        let parsedDa = JSON.parse(data)
        var parsedData = parsedDa[0]

        res.render("index.ejs", {
            parsedData
        })

    } catch (error) {
        next(error);
    }
}

//POST method for searching data
exports.searchDataPost = async (req, res, next) => {
    //console.log(req.query)
    var auctions;
    try {
        if (!req.params.id) {
            auctions = await Auction.searchAuction('%')
        }
        else {
            //Difference here is how the params are getting split.
            auctions = await Auction.searchAuction("%" + req.params.typename + "%")
        }

        let data = JSON.stringify(auctions)
        let parsedDa = JSON.parse(data)
        var parsedData = parsedDa[0]

        res.render("index.ejs", {
            parsedData
        })

    } catch (error) {
        next(error);
    }
}

//Loading the page data method
exports.loadPage = async (req, res, next) => {
    try {
        //Calling the method inside the model to get Auction data.
        const auctions = await Auction.getAuctionItems()

        let data = JSON.stringify(auctions)
        let parsedDa = JSON.parse(data)
        var parsedData = parsedDa[0]

        pageData = parsedData
        res.render("index.ejs", {
            parsedData
        })

    } catch (error) {
        next(error);
    }
}

//THis is the method to call the Blizzard API and authenticate the session
exports.BlizzardReq = async (req, resp, next) => {
    var BnetStrategy = require('passport-bnet').Strategy;
    var BNET_ID = '3e5c29321d774b43a90ca73beba0017d'
    var BNET_SECRET = 'qjTb4JfvMi1YBrWVkyrMYSRKiHELnM3a'
    var OAUTH_SCOPES = process.env.OAUTH_SCOPES || "wow.profile";

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (obj, done) {
        done(null, obj);
    });

    // Register the BnetStrategy within Passport.
    passport.use(
        new BnetStrategy(
            {
                clientID: BNET_ID,
                clientSecret: BNET_SECRET,
                scope: OAUTH_SCOPES,
                callbackURL: "http://localhost:8080/oauth/battlenet/callback"
            },
            function (accessToken, refreshToken, profile, done) {
                process.nextTick(function () {
                    return done(null, profile);
                });
            })
    );

    // configure Express
    app.use(cookieParser());
    app.use(session({
        secret: 'ArchitectureLab', // Change this value to a unique value for your application!
        saveUninitialized: true,
        resave: true
    }));

    // Initialize Passport! Also use passport.session() middleware, to support
    // persistent login sessions (recommended).
    app.use(passport.initialize());
    app.use(passport.session());

    passport.authenticate('bnet')
}

//This is the API call to load the JSON object and insert into the DB
exports.loadAuctions = async (req, resp, next) => {
    axios.get('https://us.api.blizzard.com/data/wow/connected-realm/121/auctions?namespace=dynamic-us&locale=en_US&access_token=USJ7qyGdGYMSvTfe1b60JzKULWssViKcqX')
        .then(res => {
            var strings = JSON.stringify(res.data)
            var auction = JSON.parse(strings)

            var constructedString = ""

            let d = new Date();
            let yyyy = d.getFullYear();
            let mm = d.getMonth() + 1;
            let dd = d.getDate();
            let createdDate = `${yyyy}-${mm}-${dd}`

            let auctionData = auction.auctions
            let a = new Auction(auctionData);
            var counter = 0;

            //Function to parse the data and build the query
            (async function loop() {
                for (var root in auctionData) {
                    if ((!(isNaN(auctionData[root].id)) || (typeof auctionData[root].id !== 'undefined'))) {
                        counter++;

                        constructedString +=
                            "(" +
                            auctionData[root].id +
                            "," +
                            auctionData[root].item.id +
                            "," +
                            auctionData[root].quantity +
                            ",'" +
                            escape(auctionData[root].time_left) +
                            "')" +
                            ","
                    }
                }
            })();

            constructedString += "(99999,999999,23,'SHORT')"

            let sql = `INSERT INTO Auction(id,itemid,quantity,time_left) VALUES ${constructedString}`;

            //Calling the method inside the model to run SQL.
            try {
                a.save(sql)
            }
            catch (err) {
                console.log(err)
            }
            return
        })
        .catch(err => {
            console.log('Error: ', err.message);
        });
}

//Simple mthod to delete all records and start afresh
exports.deleteAuctions = async (req, resp, next) => {
    Auction.deleteAuction();
}


//Below is the implementation of strategy pattern
exports.sorter = async (req, resp, next) => {
    //Creating the context object
    var sContextObj = new sContext();
    //Creating objects for different strategies below
    var bubbleSortStrategyObj = new bubbleSortStrategy();
    var selectionSortStrategyObj = new selectionSortStrategy();
    var insertionSortStrategyObj = new insertionSortStrategy();

    var data, sortedData;
    var customJSON = {};
    var key = 'customJSON'

    //Need to create a cusom JSON object as the whole JSON have unnecessary key value pairs.
    customJSON[key] = []
    for (var jsonLeaf in pageData) {
        data = {
            id: pageData[jsonLeaf].id,
            itemid: pageData[jsonLeaf].itemid,
            quantity: pageData[jsonLeaf].quantity,
            time_left: pageData[jsonLeaf].time_left
        }
        customJSON[key].push(data)
    }

    console.log(req.params.typename)
    //This is the main area where the strategy context is getting set and method is getting called. THis is where the correct execution will happen due to Polymorphism
    if (req.params.typename == "itemid") {
        sContextObj.setStratergy(bubbleSortStrategyObj)
        sortedData = sContextObj.execute(customJSON)
    }
    else if (req.params.typename == "quantity") {
        sContextObj.setStratergy(selectionSortStrategyObj)
        sortedData = sContextObj.execute(customJSON)
    }
    else {
        sContextObj.setStratergy(insertionSortStrategyObj)
        sortedData = sContextObj.execute(customJSON)
    }

    //Finally, the sorted data is sent back to page to load.
    var parsedData = sortedData.customJSON
    resp.render("index.ejs", {
        parsedData
    })
}   
