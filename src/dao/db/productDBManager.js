import { productModel } from "../models/productModel.js";

//Add new product
export const addProduct = async (req, res) => {
  const { title, description, price, thumbnail, code, stock, category } =
    req.body;

  try {
    let prod = await productModel.create({
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      category,
    });
    res.status(200).send({ result: "Success", message: prod });
  } catch (error) {
    res.status(400).send({
      result: "Error create product",
      message: error.message,
    });
  }
};

//Update product
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    status,
    category,
  } = req.body;

  try {
    const product = await productModel.findByIdAndUpdate(id, {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
      category,
    });

    if (!product) {
      return res
        .status(404)
        .send({ result: "Error", message: "Product not found" });
    }
    res.status(200).send({ result: "OK", message: "Product updated" });
  } catch (error) {
    res.status(400).send({ result: "Error updating product", message: error });
  }
};

//Delete product
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await productModel.findByIdAndDelete(id);
    if (!product) {
      return res
        .status(404)
        .send({ result: "Error", message: "Product not found" });
    }
    res
      .status(200)
      .send({ result: "Success", message: "Product deleted", product });
  } catch (error) {
    res.status(400).send({ result: "Error deleting product", message: error });
  }
};

//Get all products
export const getProducts = async (req, res) => {
  try {
    const allProducts = await productModel.find().lean();
    res.send(allProducts);
  } catch (error) {
    res.status(500).send(`Internal server error: ${error}`);
  }
};

//Get product by id
export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.status(200).send({ result: "Success", message: product });
  } catch (error) {
    res.status(404).send({ result: "Error", message: "Not found" });
  }
};

//Get products limit and queries
export const getProductsLimit = async (req, res) => {
  const { limit, page, sort, category, available } = req.query;

  let queries = {};

  try {
    if (page) {
      const pageNumber = parseInt(page);
      if (isNaN(pageNumber) || pageNumber <= 0) {
        return res
          .status(400)
          .send({ response: "Error", message: "Invalid page number" });
      }
    }

    let options = {
      limit: parseInt(limit) || 10,
      page: parseInt(page) || 1,
    };

    if (category) {
      queries.category = category;
    }

    if (available === "true") {
      queries.stock = { $gt: 0 };
    } else if (available === "false") {
      queries.stock = 0;
    }

    if (sort === "asc") {
      options.sort = { price: 1 };
    } else if (sort === "desc") {
      options.sort = { price: -1 };
    }

    const products = await productModel.paginate(queries, options);

    if (parseInt(page) > products.totalPages) {
      return res
        .status(400)
        .send({ response: "Error", message: "Page does not exist" });
    }

    const baseUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
    const prevLink = products.hasPrevPage
      ? baseUrl.replace(`page=${products.page}`, `page=${products.prevPage}`)
      : null;
    const nextLink = products.hasNextPage
      ? baseUrl.replace(`page=${products.page}`, `page=${products.nextPage}`)
      : null;

    const response = {
      status: "Success",
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: prevLink,
      nextLink: nextLink,
    };
    res.status(200).send({ response: "ok", message: response });
  } catch (error) {
    res.status(400).send({
      response: "Error read db",
      message: error,
    });
  }
};
