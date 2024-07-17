import { productModel } from "../dao/models/productModel.js";

export default (io) => {
  io.on("connection", (socket) => {
    console.log("Client connected", socket.id);

    async function loadProducts(socket) {
      try {
        const products = await productModel.find().lean();
        socket.emit("updateProducts", products);
      } catch (error) {
        socket.emit("error to load products");
      }
    }

    loadProducts(socket);

    //Add product
    socket.on("addProduct", async (newProductData) => {
      try {
        const newProduct = await productModel.create(newProductData);
        if (newProduct !== null) {
          socket.emit("statusAddProduct", "Product added");
        } else {
          socket.emit("error to add product");
        }
        loadProducts(socket);
      } catch (error) {
        socket.emit("error to add product");
      }
    });

    //Delete product
    socket.on("deleteProduct", async (id) => {
      try {
        const deletedProduct = await productModel.findByIdAndDelete(id);
        if (deletedProduct !== null) {
          socket.emit("statusDeleteProduct", "Product deleted");
        } else {
          socket.emit("error to delete product");
        }
        loadProducts(socket);
      } catch (error) {
        socket.emit("error to delete product");
      }
    });
  });
};
