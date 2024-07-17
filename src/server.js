import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import productsRoutes from "./routes/products.routes.js";
import cartsRoutes from "./routes/carts.routes.js";
import productsView from "./routes/products.view.js";
import __dirname from "./dirname.js";
import path from "path";
import websocket from "./websocket/ws.products.js";

const app = express();
const PORT = 8080;

mongoose
  .connect("mongodb://localhost:27017/entrega-final")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "../public")));

app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);
app.use("/", productsView);

app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    defaultLayout: "main",
  })
);

app.set("view engine", "hbs");
app.set("views", `${__dirname}/views`);

const httpserver = app.listen(PORT, () =>
  console.log(`Server running on port http://localhost:${PORT}`)
);

const io = new Server(httpserver);
websocket(io);
