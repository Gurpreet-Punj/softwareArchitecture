const Items = require('../../models/Items')
const express = require('express');
const app = express();
const axios = require('axios');

//THis is the same method as Auction API call, but loading the item table in DB for JOIN query 
exports.loadItems = async (req, resq, next) => {
    axios.get('https://us.api.blizzard.com/data/wow/item-set/index?namespace=static-us&locale=en_US&access_token=USJ7qyGdGYMSvTfe1b60JzKULWssViKcqX')
        .then(res => {
            var strings = JSON.stringify(res.data)
            var items = JSON.parse(strings)

            var constructedString = ""

            let d = new Date();
            let yyyy = d.getFullYear();
            let mm = d.getMonth() + 1;
            let dd = d.getDate();
            let createdDate = `${yyyy}-${mm}-${dd}`

            let item_sets = items.item_sets
            let item = new Items(item_sets);

            //Making sure we have a simple check to make sure item ID is not empty.
            (async function loop() {
                for (var root in item_sets) {
                    if (!(isNaN(item_sets[root].id)) || (typeof item_sets[root].id !== 'undefined')) {
                        constructedString+="("+item_sets[root].id+",'"+escape(item_sets[root].name)+ "')" + ","
                    }
                }
            })();

            constructedString+="(99999,'abcde')"

            let sql = `INSERT INTO Items(itemid,typename) VALUES ${constructedString}`;
            //console.log(sql)
            try{
                item.save(sql)
            }
            catch(err){
                console.log(err)
            }
            return
        })
        .catch(err => {
            console.log('Error: ', err.message);
        });
}

//Method to delete the item table
exports.deleteItems = async (req, resp, next) => {
    Items.deleteItems();
}   
