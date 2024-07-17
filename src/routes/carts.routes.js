import { Router } from "express";
import {
  addCart,
  showAllCarts,
  showCartById,
  addProductToCart,
  deleteProductFromCart,
  updateCart,
  updateQuantityProduct,
  deleteAllProducts,
} from "../dao/db/cartDBManager.js";

const router = Router();

router.post("/", addCart);
router.get("/", showAllCarts);
router.get("/:cid", showCartById);
router.post("/:cid/products/:pid", addProductToCart);
router.delete("/:cid/products/:pid", deleteProductFromCart);
router.put("/:cid", updateCart);
router.put("/:cid/products/:pid", updateQuantityProduct);
router.delete("/:cid", deleteAllProducts);

export default router;
