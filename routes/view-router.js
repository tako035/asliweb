const express = require("express");
const viewsController = require("../controllers/viewsController");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).render("base");
});

router.get("/blogoverview", viewsController.getBlogOverview);

router.get("/blog/:slug", viewsController.getBlog);

module.exports = router;
