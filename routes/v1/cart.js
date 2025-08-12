const express = require("express");
const router = express.Router();
const cartController = require("../../controllers/v1/cart");
const authMiddleware = require("../../middlewares/authenticated");

// 🛒 همه‌ی روت‌ها با احراز هویت محافظت شده‌اند

// اضافه کردن یک آیتم به سبد خرید
router.post("/add", authMiddleware, cartController.addToCart);

// دریافت سبد خرید کاربر جاری
router.get("/", authMiddleware, cartController.getCart);

// حذف یک آیتم از سبد خرید
router.delete("/remove/:itemId", authMiddleware, cartController.removeFromCart);

// پاک‌سازی کل سبد خرید
router.delete("/clear", authMiddleware, cartController.clearCart);

module.exports = router;
