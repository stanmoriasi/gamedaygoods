import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./cartpage.css";

interface cartItem {
  _id: string;
  quantity: number;
  productName: string;
  price: number;
  images: string[] | [];
}

const CartPage = () => {
  const [mappedProducts, setMappedProducts] = useState<cartItem[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const storedItems = localStorage.getItem("cart");
    const cart = storedItems ? JSON.parse(storedItems) : [];
    setMappedProducts(cart);
    const cartTotal = cart.reduce(
      (sum: number, b: cartItem) => sum + b.price * b.quantity,
      0
    );
    setTotal(cartTotal);
  }, []);

  const handleAddToCart = (
    product: cartItem,
    products: cartItem[],
    quantity: number
  ) => {
    const existingProduct = products.find((p) => p._id === product._id);
    let newProducts;
    if (existingProduct) {
      const newQuantity = existingProduct.quantity + quantity;
      if (newQuantity <= 0) {
        newProducts = products.filter((p) => p._id !== product._id);
      } else {
        newProducts = products.map((p) =>
          p._id === product._id ? { ...p, quantity: newQuantity } : p
        );
      }
    } else {
      newProducts = [...products, { ...product, quantity: 1 }];
    }
    setMappedProducts(newProducts);
    localStorage.setItem("cart", JSON.stringify(newProducts));
    const cartTotal = newProducts.reduce(
      (sum: number, b: cartItem) => sum + b.price * b.quantity,
      0
    );
    setTotal(cartTotal);
  };

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {mappedProducts.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <Link to="/" className="btn btn-success">
            Shop Now
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {mappedProducts.map((product: cartItem) => (
              <div key={product._id} className="cart-item">
                <div className="product-image">
                  <img
                    src={
                      product.images && product.images.length > 0
                        ? product.images[0]
                        : "https://cwdaust.com.au/wpress/wp-content/uploads/2015/04/placeholder-store.png"
                    }
                    alt={product.productName}
                  />
                </div>
                <div className="product-details">
                  <h3>{product.productName}</h3>
                  <p className="product-price">${product.price.toFixed(2)}</p>
                </div>
                <div className="quantity-controls">
                  <button
                    className="quantity-btn decrease"
                    onClick={() => handleAddToCart(product, mappedProducts, -1)}
                  >
                    -
                  </button>
                  <span className="quantity">{product.quantity}</span>
                  <button
                    className="quantity-btn increase"
                    onClick={() => handleAddToCart(product, mappedProducts, 1)}
                  >
                    +
                  </button>
                </div>
                <div className="item-total">
                  ${(product.price * product.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <Link to="/checkout" className="btn btn-success checkout-btn">
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
