import { Router } from "express";
import {
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductsLimit,
} from "../dao/db/productDBManager.js";

const routes = Router();

routes.get("/:id", getProductById);
routes.post("/", addProduct);
routes.put("/:id", updateProduct);
routes.delete("/:id", deleteProduct);
routes.get("/", getProductsLimit);

export default routes;
