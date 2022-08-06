const express = require('express');
const Auction = require('../../models/Auction')

//Simple method to be called to generate report based on the query in Auction Model.
exports.generateReport = async (req, resq, next) => {
    try {
        const auctions = await Auction.getReprtData()

        let data = JSON.stringify(auctions)
        let parsedDa = JSON.parse(data)

        var parsedData = parsedDa[0]

        console.log("Report with Item ID and Quantity\n")
        for(let i=0;i<parsedData.length;i++)
        {
            console.log("Item ID :" + parsedData[i].id + "  ||  Quantity: " + parsedData[i].quantity)
        }
        
        resq.render("report.ejs")
    } catch (error) {
        next(error);
    }
}