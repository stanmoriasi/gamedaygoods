import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
    <div className="container">
      <h1 className="mb-4 mt-3">Your Cart</h1>
      {mappedProducts.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items-container pt-2">
            <ul className="list-unstyled">
              {mappedProducts.map((product: cartItem) => (
                <li
                  key={product._id}
                  className="d-flex align-items-center justify-content-between border-bottom pb-2 mb-2"
                >
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <img
                        src={
                          product.images?.[0]
                            ? product.images[0]
                            : "https://cwdaust.com.au/wpress/wp-content/uploads/2015/04/placeholder-store.png"
                        }
                        alt={product.productName}
                        className="img-fluid rounded"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "scale-down",
                        }}
                      />
                    </div>
                    <div>
                      <h4 className="mb-1">{product.productName}</h4>
                      <p className="mb-0">${product.price}</p>
                    </div>
                  </div>
                  <div>
                    {product?.quantity > 0 ? (
                      <div className="d-flex align-items-center justify-content-center me-3">
                        <button
                          className="btn btn-outline-success me-2"
                          style={{
                            color: "green",
                            borderColor: "green",
                            backgroundColor: "white",
                          }}
                          onClick={() =>
                            handleAddToCart(product, mappedProducts, -1)
                          }
                          disabled={
                            product.quantity <= 0 || product.quantity <= 0
                          }
                        >
                          –
                        </button>
                        <span className="fw-bold text-dark">
                          {product.quantity}
                        </span>
                        <button
                          className="btn btn-outline-success ms-2"
                          style={{
                            color: "green",
                            borderColor: "green",
                            backgroundColor: "white",
                          }}
                          onClick={() =>
                            handleAddToCart(product, mappedProducts, 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        className="btn btn-success flex-grow-1 me-2"
                        onClick={() =>
                          handleAddToCart(product, mappedProducts, 1)
                        }
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="d-flex justify-content-end">
            <div>
              <h3>Total: ${total.toFixed(2)}</h3>
              <Link to="/checkout" className="btn btn-success my-3 px-5">
                Checkout
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
