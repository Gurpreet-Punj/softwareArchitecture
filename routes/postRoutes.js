//Routing the requets coming from the web to different methods in controller.
const express = require('express');
const auctionController = require('../controllers/mainControllers/auctionController')
const itemsController = require('../controllers/mainControllers/itemsController')
const reportController = require('../controllers/utilityControllers/reportController')
const router = express.Router({ mergeParams: true });

// @route GET && POST - /
router.route("/").get(auctionController.loadPage);
router.route("/bnetlogin").get(auctionController.BlizzardReq);
router.route("/loadAuctions").get(auctionController.loadAuctions);
router.route("/search").get(auctionController.searchDataGet);
router.route("/search").post(auctionController.searchDataPost);
router.route("/sort").get(auctionController.sorter);

router.route("/loadItems").get(itemsController.loadItems);

router.route("/greport").get(reportController.generateReport);

module.exports = router;


