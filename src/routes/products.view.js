import { Router } from "express";
import { getProducts } from "../dao/db/productDBView.js";

const router = Router();

//View products through handlebars
router.get("/", getProducts);

//View products through socket.io in real-time
router.get("/realtimeproducts", async (req, res) => {
  try {
    res.render("realtimeproducts", {
      title: "Real time products",
    });
  } catch (error) {
    res.status(500).send(`Internal server error: ${error}`);
  }
});

export default router;
