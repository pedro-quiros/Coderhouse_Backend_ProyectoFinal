const newProduct = document.getElementById("newProduct");
const statusAddProduct = document.getElementById("statusAddProduct");
const deleteProduct = document.getElementById("deleteProduct");
const statusDeleteProduct = document.getElementById("statusDeleteProduct");

const socket = io();

socket.on("updateProducts", (newProducts) => {
  // Update the list of products in the view
  const productList = document.getElementById("realTimeProductList");
  productList.innerHTML = "";
  newProducts.forEach((product) => {
    const listItem = document.createElement("li");
    listItem.className = "box_container";
    listItem.innerHTML = `
            <h2>${product.title}</h2>
            <p>Description: ${product.description}</p>
            <p>Price: $${product.price}</p>
            <p>Code Prod.: ${product.code}</p>
            <p>Stock: ${product.stock}</p>
            <p>ID: ${product._id}</p>
        `;
    productList.appendChild(listItem);
  });
});

//Status Add Product
socket.on("statusAddProduct", (newProduct) => {
  statusAddProduct.innerHTML = newProduct;
});
//Status Delete Product
socket.on("statusDeleteProduct", (newProduct) => {
  statusDeleteProduct.innerHTML = newProduct;
});

//Add new product
newProduct.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const price = document.getElementById("price").value;
  const thumbnail = document.getElementById("thumbnail").value;
  const code = document.getElementById("code").value;
  const stock = document.getElementById("stock").value;
  const status = document.getElementById("status").value;
  const category = document.getElementById("category").value;

  const newProductData = {
    title,
    description,
    price: parseInt(price),
    thumbnail,
    code,
    stock: parseInt(stock),
    status,
    category,
  };

  socket.emit("addProduct", newProductData);
});

deleteProduct.addEventListener("submit", (event) => {
  event.preventDefault();
  const inputNum = document.getElementById("inputNum");
  socket.emit("deleteProduct", inputNum.value);
});
