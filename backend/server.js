import https from "https"; // Для HTTPS
import http from "http"; // Для HTTP редиректа
import fs from "fs"; // Для работы с сертификатами
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { config as dotenvConfig } from "dotenv";
import userController from "./controllers/userController.js";
import statusController from "./controllers/statusController.js";
import multer from "multer";
import path from "path";
import moderatorController from "./controllers/moderatorController.js";
import reviewController from "./controllers/reviewController.js";
import orderController from "./controllers/orderController.js";
import categoryController from "./controllers/categoryController.js";
import artistRequestController from "./controllers/artistRequestController.js";
import customerRequestController from "./controllers/customerRequestController.js";
import subscriptionController from "./controllers/subscriptionController.js";
import tarifController from "./controllers/tarifController.js";
import promoController from "./controllers/promoController.js";
import paymentController from "./controllers/paymentController.js";
import VideoPreviewController from "./controllers/previewController.js"

dotenvConfig();

const app = express();

// === Перенесённое вперёд промежуточное ПО (пример логирования) ===
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Настройка лимитов и CORS до объявления маршрутов
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

// Настройка хранения загружаемых файлов
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "media/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 },
});

// Делаем статическую раздачу после CORS и до роутов
app.use("/media", express.static("media"));

// Подключение к базе данных
mongoose
  .connect(process.env.NODE_DB_URL)
  .then(() => console.log("DB OK"))
  .catch((err) => console.log("DB error", err));

// Чтение сертификатов
const privateKey = fs.readFileSync("key.pem", "utf8");
const certificate = fs.readFileSync("cert.pem", "utf8");

// Если потребуется цепочка сертификатов, добавьте сюда ca:
// const ca = fs.readFileSync("/path/to/ca_bundle.crt", "utf8");
// const credentials = { key: privateKey, cert: certificate, ca };

const credentials = { key: privateKey, cert: certificate };

const HTTP_PORT = process.env.PORT || 80;
const HTTPS_PORT = process.env.HTTPS_PORT || 443;

// Настройка HTTP сервера для редиректа на HTTPS
http.createServer((req, res) => {
  res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
  res.end();
}).listen(HTTP_PORT, (err) => {
  if (err) {
    console.error("Failed to start HTTP redirect server:", err);
    return;
  }
  console.log(`HTTP Server is redirecting to HTTPS on port ${HTTP_PORT}`);
});

// Настройка HTTPS сервера
https.createServer(credentials, app).listen(HTTPS_PORT, (err) => {
  if (err) {
    console.error("Failed to start HTTPS server:", err);
    return;
  }
  console.log(`HTTPS Server is running on port ${HTTPS_PORT}`);
});

// GET
app.get("/", async (req, res) => {
  res.json({ message: "nice" });
});

app.get("/user", userController.getUser);
app.get("/status", statusController.getStatus);
app.get("/moderator", moderatorController.getModerator);
app.get("/review", reviewController.getReview); // если передаём artistId, то получим все отзывы артиста, если reviewId — конкретный отзыв
app.get("/order", orderController.getOrder); // если передаём в query orderId — то получим заказ, если artistId — все заказы артиста, если customerId — все заказы заказчика
app.get("/category", categoryController.getCategory);
app.get("/artist-request", artistRequestController.getArtistRequest);
// если передаём requestId, то получим конкретный request, если artistId — его requests, если categoryId — все заявки по категории
app.get("/customer-requests", customerRequestController.getCustomerRequest);
// если передаём requestId, то получим конкретный request, если customer — его requests, если categoryId — все заявки по категории
app.get("/subscription", subscriptionController.getSubscription);
app.get("/tarif", tarifController.getTarif);
app.get("/promo", promoController.getPromo);

// POST
app.post("/upload", upload.array("files"), async (req, res) => {
  try {
    const fileUrls = req.files.map((file) => "/media/" + file.filename);
    res.status(201).json({ filenames: fileUrls });
  } catch (err) {
    console.error("Failed to upload photo", err);
    res.status(500).json({ error: "Failed to upload photo" });
  }
});

app.post("/promo", promoController.addPromo);
app.post("/status", statusController.addStatus);
app.post("/moderator", moderatorController.addModerator);
app.post("/tarif", tarifController.addTarif);
app.post("/review", reviewController.addReview);
app.post("/order", orderController.addOrder);
app.post("/category", categoryController.addCategory);
app.post("/artist-request", artistRequestController.addArtistRequest);
app.post("/customer-request", customerRequestController.addCustomerRequest);
app.post("/subscription", subscriptionController.addSubscription);
app.post("/payment/webhook", paymentController.handleWebhook);

// PATCH
app.patch("/user", userController.updateUser);
app.patch("/promo", promoController.updatePromo);
app.patch("/review", reviewController.updateReview);
app.patch("/order", orderController.updateOrder);
app.patch("/artist-request", artistRequestController.updateArtistRequest);
app.patch("/customer-request", customerRequestController.updateCustomerRequest);
app.patch("/selectcity", userController.updateSelectCity);

// DELETE
app.delete("/status", statusController.deleteStatus);
app.delete("/moderator", moderatorController.deleteModerator);
app.delete("/review", reviewController.deleteReview);
app.delete("/order", orderController.deleteOrder);
app.delete("/category", categoryController.deleteCategory);
app.delete("/artist-request", artistRequestController.deleteArtistRequest);
app.delete("/customer-request", customerRequestController.deleteCustomerRequest);

app.post("/image_preview", VideoPreviewController.savePreview);