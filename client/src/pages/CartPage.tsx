import { useQuery, useMutation, gql } from '@apollo/client';

const GET_CART = gql`
  query GetCart {
    cart {
      _id
      products {
        _id
        productName
        price
        description
      }
      total
      createdAt
    }
  }
`;

const PLACE_ORDER = gql`
  mutation PlaceOrder($input: [ID!]!) {
    placeOrder(input: $input) {
      _id
      products {
        _id
        productName
      }
      total
    }
  }
`;

const CartPage = () => {
  const { loading, error, data } = useQuery(GET_CART);
  const [placeOrder] = useMutation(PLACE_ORDER);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading cart: {error.message}</p>;

  const cart = data?.cart;
  const productIds = cart?.products.map((p: any) => p._id);

  const handleCheckout = async () => {
    try {
      await placeOrder({ variables: { input: productIds } });
      alert('Order placed!');
    } catch (err) {
      console.error(err);
      alert('Failed to place order.');
    }
  };

  return (
    <div className="container">
      <h2>Your Cart</h2>
      {cart.products.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cart.products.map((product: any) => (
              <li key={product._id}>
                <h4>{product.productName}</h4>
                <p>${product.price}</p>
              </li>
            ))}
          </ul>
          <h3>Total: ${cart.total.toFixed(2)}</h3>
          <button onClick={handleCheckout} className="btn btn-success">
            Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default CartPage;