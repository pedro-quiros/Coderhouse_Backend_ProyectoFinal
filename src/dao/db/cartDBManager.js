import { cartModel } from "../models/cartModel.js";
import { productModel } from "../models/productModel.js";

//Create new cart
export const addCart = async (req, res) => {
  try {
    const cart = await cartModel.create({ products: [] });
    res.status(200).send({ result: "Success", message: cart });
  } catch (error) {
    res.status(400).send({ result: "Error", message: error });
  }
};

//Show all carts
export const showAllCarts = async (req, res) => {
  try {
    const carts = await cartModel.find().lean();
    res.status(200).json({ response: "Success", carts });
  } catch (error) {
    res.status(400).json({ response: "Error", message: error.message });
  }
};

//Show cart by id
export const showCartById = async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartModel.findById(cid).populate("products.product");
    if (!cart) {
      return res
        .status(404)
        .send({ result: "Error", message: "Cart not found" });
    }
    res.status(200).send({ result: "Success", message: cart });
  } catch (error) {
    res.status(400).send({ result: "Error consulting cart", error });
  }
};

//Add product in specific cart
export const addProductToCart = async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  try {
    const cart = await cartModel.findById(cid);
    if (!cart) {
      return res
        .status(404)
        .json({ result: "Error", message: "Cart not found" });
    }

    const product = await productModel.findById(pid);
    if (!product) {
      return res
        .status(404)
        .json({ result: "Error", message: "Product not found" });
    }

    const existingProductIndex = cart.products.findIndex(
      (prod) => prod.product.toString() === pid
    );
    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }
    await cart.save();
    res
      .status(200)
      .json({ result: "Success", message: "Product added to cart" });
  } catch (error) {
    res.status(400).json({ result: "Error", message: error.message });
  }
};

//Delete one product from cart
export const deleteProductFromCart = async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const cart = await cartModel.findById(cid);
    if (!cart) {
      return res
        .status(404)
        .json({ result: "Error", message: "Cart not found" });
    }

    const product = await productModel.findById(pid);
    if (!product) {
      return res
        .status(404)
        .json({ result: "Error", message: "Product not found" });
    }

    const existingProductIndex = cart.products.findIndex(
      (prod) => prod.product.toString() === pid
    );

    if (existingProductIndex !== -1) {
      cart.products.splice(existingProductIndex, 1);
    } else {
      return res
        .status(404)
        .send({ result: "Error", message: "Product not found in cart" });
    }
    await cart.save();
    res
      .status(200)
      .json({ result: "Success", message: "Product deleted from cart" });
  } catch (error) {
    res.status(400).json({ result: "Error", message: error.message });
  }
};

//Update cart with an array of products
export const updateCart = async (req, res) => {
  const { cid } = req.params;
  const products = req.body.products;

  try {
    const cart = await cartModel.findById(cid);
    if (!cart)
      return res
        .status(404)
        .json({ response: "Error", message: "Cart not found" });
    if (!Array.isArray(products))
      return res
        .status(400)
        .json({ response: "Error", message: "Product must be an array" });

    for (const item of products) {
      const productId = item.product;
      const quantity = item.quantity;

      // Search the product in the database
      const product = await productModel.findById(productId);
      if (!product) {
        return res.status(404).json({
          response: "Error",
          message: `Product with id ${productId} not found`,
        });
      }

      // Update cart with product and quantity
      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.product.toString() === productId
      );

      if (existingProductIndex !== -1) {
        // If the product already exists in the cart, update the quantity
        cart.products[existingProductIndex].quantity = quantity;
      } else {
        // If the product does not exist in the cart, add it
        cart.products.push({ product: productId, quantity: quantity });
      }
    }

    await cart.save();

    return res
      .status(200)
      .json({ response: "Success", message: "Cart updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ response: "Error", message: "Internal server error", error });
  }
};

//Update quantity product from cart
export const updateQuantityProduct = async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  try {
    const cart = await cartModel.findById(cid);
    if (!cart)
      return res
        .status(404)
        .json({ response: "Error", message: "Cart not found" });

    const product = await productModel.findById(pid);
    if (!product)
      return res
        .status(404)
        .json({ response: "Error", message: "Product not found" });

    //Stock control
    if (quantity > product.stock)
      return res.status(404).json({
        response: "Error",
        message: "Out of stock",
        in_stock: product.stock,
      });

    if (quantity < 1)
      return res
        .status(404)
        .json({ response: "Error", message: "Quantity cannot be less than 1" });

    const existingProductIndex = cart.products.findIndex(
      (prod) => prod.product.toString() === pid
    );
    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity = quantity;
    } else {
      return res
        .status(404)
        .json({ response: "Error", message: "Product not found in cart" });
    }
    await cart.save();
    res.status(200).json({ message: "The quantity was updated successfully" });
  } catch (error) {
    res.status(400).json({ result: "Error", message: error.message });
  }
};

//Delete all products from cart
export const deleteAllProducts = async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartModel.findById(cid);
    if (!cart)
      return res
        .status(404)
        .json({ response: "Error", message: "Cart not found" });
    cart.products = [];
    await cart.save();
    res
      .status(200)
      .json({ response: "Done", message: "All products removed from cart" });
  } catch (error) {
    res
      .status(500)
      .json({ response: "Error", message: "Internal server error", error });
  }
};
