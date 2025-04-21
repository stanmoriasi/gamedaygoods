import { useMutation, gql, useApolloClient } from "@apollo/client";
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
  const client = useApolloClient();

  const [formState, setFormState] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const [errors, setErrors] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState<cartItem[]>([]);
  const [placeOrder, { error, data }] = useMutation(PLACE_ORDER);

  const validateTextField = (value: string, fieldName: string): string => {
    if (!value.trim()) {
      return `${fieldName} is required`;
    }

    if (!/^[A-Za-z\s.\-']+$/.test(value)) {
      return `${fieldName} should only contain letters`;
    }

    return "";
  };

  const validateZipCode = (value: string): string => {
    if (!value.trim()) {
      return "Zip code is required";
    }

    if (!/^\d{5}(-\d{4})?$/.test(value)) {
      return "Please enter a valid zip code (e.g., 12345 or 12345-6789)";
    }

    return "";
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });

    let errorMessage = "";

    switch (name) {
      case "street":
        errorMessage = !value.trim() ? "Street address is required" : "";
        break;
      case "city":
        errorMessage = validateTextField(value, "City");
        break;
      case "state":
        errorMessage = validateTextField(value, "State");
        break;
      case "country":
        errorMessage = validateTextField(value, "Country");
        break;
      case "zipCode":
        errorMessage = validateZipCode(value);
        break;
      default:
        break;
    }

    setErrors({
      ...errors,
      [name]: errorMessage,
    });
  };

  const validateForm = (): boolean => {
    const newErrors = {
      street: !formState.street.trim() ? "Street address is required" : "",
      city: validateTextField(formState.city, "City"),
      state: validateTextField(formState.state, "State"),
      country: validateTextField(formState.country, "Country"),
      zipCode: validateZipCode(formState.zipCode),
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error !== "");
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

    if (!validateForm()) {
      return;
    }

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
        await client.resetStore();
        console.log("Apollo cache reset after order placement");
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

      <p className="order-total">Your order total is ${total.toFixed(2)}.</p>
      <div className="card-body">
        {data ? (
          <p className="success-message">
            Order created successfully!{" "}
            <Link to="/me">Click here to see your orders!</Link>
          </p>
        ) : (
          <form onSubmit={handleFormSubmit} className="checkout-form">
            <div className="form-group">
              <input
                className={`form-input ${errors.street ? "input-error" : ""}`}
                placeholder="Street"
                name="street"
                type="text"
                required
                value={formState.street || ""}
                onChange={handleChange}
              />
              {errors.street && <p className="error-text">{errors.street}</p>}
            </div>

            <div className="form-group">
              <input
                className={`form-input ${errors.city ? "input-error" : ""}`}
                placeholder="City"
                name="city"
                type="text"
                required
                value={formState.city || ""}
                onChange={handleChange}
              />
              {errors.city && <p className="error-text">{errors.city}</p>}
            </div>

            <div className="form-group">
              <input
                className={`form-input ${errors.state ? "input-error" : ""}`}
                placeholder="State"
                name="state"
                type="text"
                required
                value={formState.state || ""}
                onChange={handleChange}
              />
              {errors.state && <p className="error-text">{errors.state}</p>}
            </div>

            <div className="form-group">
              <input
                className={`form-input ${errors.zipCode ? "input-error" : ""}`}
                placeholder="Zip Code"
                name="zipCode"
                type="text"
                required
                value={formState.zipCode || ""}
                onChange={handleChange}
              />
              {errors.zipCode && <p className="error-text">{errors.zipCode}</p>}
            </div>

            <div className="form-group">
              <input
                className={`form-input ${errors.country ? "input-error" : ""}`}
                placeholder="Country"
                name="country"
                type="text"
                required
                value={formState.country || ""}
                onChange={handleChange}
              />
              {errors.country && <p className="error-text">{errors.country}</p>}
            </div>

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
