import { useMutation, gql } from "@apollo/client";
import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import "./checkout.css";

const PLACE_ORDER = gql`
  mutation PlaceOrder($order: OrderInput!) {
    placeOrder(order: $order) {
      products {
        productId
        quantity
      }
      address {
        city
        country
        state
        street
        zipCode
      }
    }
  }
`;

interface cartItem {
  _id: string;
  quantity: number;
  productName: string;
  price: number;
  images: string[] | [];
}

const Checkout = () => {
  const [formState, setFormState] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState<cartItem[]>([]);
  const [placeOrder, { error, data }] = useMutation(PLACE_ORDER);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  useEffect(() => {
    const storedItems = localStorage.getItem("cart");
    const cart = storedItems ? JSON.parse(storedItems) : [];
    const cartTotal = cart.reduce(
      (sum: number, b: cartItem) => sum + b.price * b.quantity,
      0
    );
    setProducts(cart);
    setTotal(cartTotal);
  }, []);

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const mappedProducts = products.map((prod) => ({
      productId: prod._id,
      quantity: prod.quantity,
    }));
    const order = { products: mappedProducts, address: formState };

    try {
      const { data } = await placeOrder({
        variables: { order },
      });
      if (data) {
        localStorage.removeItem("cart");
      }
    } catch (err) {
      console.error(JSON.stringify(err));
    }

    setFormState({
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    });
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
        <div className="col-12 col-lg-10">
            <p>Your Order total is ${total.toFixed(2)}</p>
            <div className="card-body">
                {data ? (
                <p>
                    Order created Successfully{' '}
                    <Link to="/">back to the homepage.</Link>
                </p>
                ) : (
                <form onSubmit={handleFormSubmit}>
                    <input
                      className="form-input"
                      placeholder="Street"
                      name="street"
                      type="text"
                      required
                      value={formState.street || ''}
                      onChange={handleChange}
                    />
                    <input
                      className="form-input"
                      placeholder="City"
                      name="city"
                      type="text"
                      required
                      value={formState.city || ''}
                      onChange={handleChange}
                    />
                    <input
                      className="form-input"
                      placeholder="State"
                      name="state"
                      type="text"
                      required
                      value={formState.state || ''}
                      onChange={handleChange}
                    />
                    <input
                      className="form-input"
                      placeholder="Zip"
                      name="zipCode"
                      type="text"
                      required
                      value={formState.zipCode || ''}
                      onChange={handleChange}
                    />
                    <input
                      className="form-input"
                      placeholder="Country"
                      name="country"
                      type="text"
                      required
                      value={formState.country || ''}
                      onChange={handleChange}
                    />
                    <button
                      className="btn btn-success my-3 px-5"
                      style={{ cursor: 'pointer' }}
                      type="submit"
                    >
                       Complete Checkout
                    </button>
                </form>
                )}
    
                {error && (
                <div className="my-3 p-3 bg-danger text-white">
                    {error.message}
                </div>
                )}
            </div>
            </div>
        <div className="d-flex justify-content-end">
        </div>
      <p className="order-total">Your Order total is ${total}</p>
      <div className="card-body">
        {data ? (
          <p className="success-message">
            Order created successfully!{" "}
            <Link to="/">Back to the homepage.</Link>
          </p>
        ) : (
          <form onSubmit={handleFormSubmit} className="checkout-form">
            <input
              className="form-input"
              placeholder="Street"
              name="street"
              type="text"
              required
              value={formState.street || ""}
              onChange={handleChange}
            />
            <input
              className="form-input"
              placeholder="City"
              name="city"
              type="text"
              required
              value={formState.city || ""}
              onChange={handleChange}
            />
            <input
              className="form-input"
              placeholder="State"
              name="state"
              type="text"
              required
              value={formState.state || ""}
              onChange={handleChange}
            />
            <input
              className="form-input"
              placeholder="Zip Code"
              name="zipCode"
              type="text"
              required
              value={formState.zipCode || ""}
              onChange={handleChange}
            />
            <input
              className="form-input"
              placeholder="Country"
              name="country"
              type="text"
              required
              value={formState.country || ""}
              onChange={handleChange}
            />
            <button
              className="btn btn-success"
              style={{ cursor: "pointer" }}
              type="submit"
            >
              Complete Checkout
            </button>
          </form>
        )}

        {error && <div className="error-message">{error.message}</div>}
      </div>
    </div>
  );
};

export default Checkout;
