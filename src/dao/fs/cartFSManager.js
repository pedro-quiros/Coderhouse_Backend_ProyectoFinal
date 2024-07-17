import fs from "fs";
import ProductManager from "./productFSManager.js";

class CartManager {
  constructor(path) {
    this.path = path;
    if (fs.existsSync(this.path)) {
      try {
        this.carts = JSON.parse(fs.readFileSync(this.path, "utf8"));
      } catch (error) {
        this.carts = [];
      }
    } else {
      this.carts = [];
    }
  }

  async addCart() {
    if (this.carts.length > 0) {
      const lastCart = this.carts[this.carts.length - 1];
      this.carts.push({ id: lastCart.id + 1, products: [] });
    } else {
      this.carts.push({ id: 1, products: [] });
    }
    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.carts, null, 2)
      );
      return "Cart added successfully";
    } catch (error) {
      return `Error writing file: ${error}`;
    }
  }

  async getCarts() {
    try {
      const carts = await fs.promises.readFile(this.path, "utf8");
      return JSON.parse(carts);
    } catch (error) {
      return `Error reading file: ${error}`;
    }
  }

  async getCartById(id) {
    try {
      const carts = await this.getCarts();
      const cart = carts.find((cart) => cart.id === id);
      if (!cart) {
      }
      return cart;
    } catch (error) {
      return `Error getting cart: ${error}`;
    }
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    try {
      const cart = await this.getCartById(cartId);

      if (!cart) {
        return `Cart with id "${cartId}" not found`;
      }

      const productExists = await ProductManager.getProductById(productId);

      if (productExists === "ID must be a number") {
        return `ID Product must be a number`;
      }

      if (productExists === "Product not found") {
        return `Product with id "${productId}" not found`;
      }

      const productIndex = cart.products.findIndex(
        (product) => product.product === productId
      );

      if (productIndex !== -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }

      const cartIndex = this.carts.findIndex((c) => c.id === cartId);
      this.carts[cartIndex] = cart;

      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.carts, null, 2)
      );
      return `Product ${productId} added to cart with id ${cartId} successfully`;
    } catch (error) {
      return `Error adding product to cart: ${error}`;
    }
  }
}

export default new CartManager("./src/data/carts.json");
