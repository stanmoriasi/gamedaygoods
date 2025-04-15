import { useMutation, gql } from '@apollo/client';
import { useEffect, useState } from 'react';

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

interface cartItem {
  _id: string, 
  quantity: number, 
  productName: string, 
  price: number
}

const CartPage = () => {
  const [placeOrder] = useMutation(PLACE_ORDER);
  const [total, setTotal] = useState(0);

  const storedItems = localStorage.getItem('cart');
  const cart = storedItems ? JSON.parse(storedItems) : [];

  useEffect(()=> {
    setTotal(cart.reduce((sum: number, b: cartItem) => sum + (b.price * b.quantity), 0))
  }, [cart])

  const productIds = cart?.map((p: any) => p._id);

  const handleCheckout = async () => {
    console.log(cart)
    // try {
    //   await placeOrder({ variables: { input: productIds } });
    //   alert('Order placed!');
    // } catch (err) {
    //   console.error(err);
    //   alert('Failed to place order.');
    // }
  };

  return (
    <div className="container">
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cart.map((product: any) => (
              <li key={product._id}>
                <h4>{product.productName}</h4>
                <p>${product.price}</p>
              </li>
            ))}
          </ul>
          <h3>Total: ${total?.toFixed(2)}</h3>
          <button onClick={handleCheckout} className="btn btn-success">
            Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default CartPage;