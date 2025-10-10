const Cart = require("../../models/cart");
require("../../models/course");
// Get cart for logged-in user
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id }).populate({
      path: "items.productId",
      select: "name price cover description category level duration",
    });

    // If no cart exists, return empty cart structure
    if (!cart) {
      return res.status(200).json({
        userId: req.user._id,
        items: [],
      });
    }

    // Transform the cart items to remove productId nesting
    const transformedCart = {
      ...cart.toObject(),
      items: cart.items.map((item) => ({
        ...item.productId.toObject(),
        quantity: item.quantity,
        courseId: item.productId._id,
        _id: item._id,
      })),
    };

    res.status(200).json(transformedCart);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity)
    return res
      .status(400)
      .json({ message: "Product ID and quantity are required" });

  try {
    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      // If item exists, update quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // If item does not exist, add new one
      cart.items.push({ productId, quantity });
    }

    await cart.save();

    // Populate the cart before returning
    await cart.populate({
      path: "items.productId",
      select: "name price cover description category level duration",
    });

    // Transform the cart items to remove productId nesting
    const transformedCart = {
      ...cart.toObject(),
      items: cart.items.map((item) => ({
        ...item.productId.toObject(),
        quantity: item.quantity,
        courseId: item.productId._id,
        _id: item._id,
      })),
    };

    res.status(201).json(transformedCart);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update quantity of a specific item
const updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (!item)
      return res.status(404).json({ message: "Item not found in cart" });

    if (quantity <= 0) {
      // If quantity is 0 or negative, remove the item
      cart.items = cart.items.filter(
        (item) => item.productId.toString() !== productId
      );
    } else {
      item.quantity = quantity;
    }

    await cart.save();

    // Populate the cart before returning
    await cart.populate({
      path: "items.productId",
      select: "name price cover description category level duration",
    });

    // Transform the cart items to remove productId nesting
    const transformedCart = {
      ...cart.toObject(),
      items: cart.items.map((item) => ({
        ...item.productId.toObject(),
        quantity: item.quantity,
        courseId: item.productId._id,
        _id: item._id,
      })),
    };

    res.status(200).json(transformedCart);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  const { itemId } = req.params;

  try {
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(200).json({
        message: "Cart is already empty",
        userId: req.user._id,
        items: [],
      });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== itemId
    );

    await cart.save();

    // Populate the cart before returning
    await cart.populate({
      path: "items.productId",
      select: "name price cover description category level duration",
    });

    // Transform the cart items to remove productId nesting
    const transformedCart = {
      ...cart.toObject(),
      items: cart.items.map((item) => ({
        ...item.productId.toObject(),
        quantity: item.quantity,
        courseId: item.productId._id,
        _id: item._id,
      })),
    };

    res.status(200).json(transformedCart);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Clear all items in cart
const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      // Create empty cart if it doesn't exist
      cart = new Cart({ userId: req.user._id, items: [] });
      await cart.save();
    } else {
      cart.items = [];
      await cart.save();
    }

    res.status(200).json({ message: "Cart cleared", cart });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
