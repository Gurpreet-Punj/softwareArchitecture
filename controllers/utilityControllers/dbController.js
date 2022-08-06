const Auction = require('../../models/Auction')

exports.inputData = async (req, res, next) => {
    try {
        const auctions = await Auction.getAuctionItems()

        let data = JSON.stringify(auctions)
        let parsedDa = JSON.parse(data)

        var counter = 0;
        var parsedData = parsedDa[0]

        res.render("index.ejs", {
            parsedData
        })

    } catch (error) {
        next(error);
    }
}