import fs from "fs";

class Product {
  constructor(
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnail
  ) {
    this.id = 0;
    this.title = title;
    this.description = description;
    this.code = code;
    this.price = price;
    this.status = status;
    this.stock = stock;
    this.category = category;
    this.thumbnail = thumbnail;
  }
}

class ProductManager {
  constructor(path) {
    this.path = path;

    if (fs.existsSync(this.path)) {
      try {
        this.products = JSON.parse(fs.readFileSync(this.path, "utf8"));
      } catch (error) {
        this.products = [];
      }
    } else {
      this.products = [];
    }
  }

  async writeToFile() {
    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.products, null, 2)
      );
    } catch (error) {
      throw error;
    }
  }

  filterProductFields(product) {
    const allowedFields = [
      "title",
      "description",
      "code",
      "price",
      "status",
      "stock",
      "category",
      "thumbnail",
    ];

    const filteredProduct = {};

    for (const field of allowedFields) {
      if (product.hasOwnProperty(field)) {
        filteredProduct[field] = product[field];
      }
    }
    return filteredProduct;
  }

  async addProduct(product) {
    const filteredProduct = this.filterProductFields(product);

    if (
      !filteredProduct.title ||
      !filteredProduct.description ||
      !filteredProduct.code ||
      !filteredProduct.price ||
      !filteredProduct.status ||
      !filteredProduct.stock ||
      !filteredProduct.category
    ) {
      return "All fields are required";
    }

    // Verificar si el código del producto ya existe
    if (this.products.some((p) => p.code === filteredProduct.code)) {
      return `Code product "${filteredProduct.code}" already exist`;
    }

    // Asignar un ID al producto
    if (this.products.length > 0) {
      const lastProduct = this.products[this.products.length - 1];
      filteredProduct.id = lastProduct.id + 1;
    } else {
      filteredProduct.id = 1;
    }

    this.products.push(filteredProduct);

    try {
      await this.writeToFile();
      return `Article "${filteredProduct.title}" added successfully`;
    } catch (error) {
      return error;
    }
  }

  async getProducts() {
    return this.products;
  }

  async getProductById(id) {
    if (isNaN(Number(id))) {
      return "ID must be a number";
    }

    const findProduct = this.products.find(
      (product) => product.id === Number(id)
    );
    if (!findProduct) {
      return "Product not found";
    }
    return findProduct;
  }

  async deleteProduct(id) {
    if (isNaN(Number(id))) {
      return "ID must be a number";
    }

    const productIndex = this.products.findIndex(
      (product) => product.id === Number(id)
    );
    if (productIndex === -1) {
      return `Product "${id}" not found`;
    }
    this.products.splice(productIndex, 1);

    try {
      await this.writeToFile();
      return "Product deleted successfully";
    } catch (error) {
      return error;
    }
  }

  async updateProduct(id, product) {
    if (product.id) return "Can't update Id field, please remove it";
    if (isNaN(Number(id))) {
      return "ID must be a number";
    }

    const productIndex = this.products.findIndex(
      (product) => product.id === Number(id)
    );

    if (productIndex === -1) {
      return `Product "${id}" not found`;
    }

    const filteredProduct = this.filterProductFields(product);

    this.products[productIndex] = {
      ...this.products[productIndex],
      ...filteredProduct,
    };

    try {
      await this.writeToFile();
      return "Product updated successfully";
    } catch (error) {
      return error;
    }
  }
}

export default new ProductManager("./src/data/products.json");
