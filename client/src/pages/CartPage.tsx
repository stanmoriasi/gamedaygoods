import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

interface cartItem {
  _id: string, 
  quantity: number, 
  productName: string, 
  price: number,
  images: string[] | []
}

const CartPage = () => {
  const [mappedProducts, setMappedProducts] = useState<cartItem[]>([]);
  
  const total = useMemo(() => {
    return mappedProducts.reduce((sum: number, item: cartItem) => sum + item.price * item.quantity, 0);
  }, [mappedProducts]);

  useEffect(()=> {
    const storedItems = localStorage.getItem('cart');
    const cart = storedItems ? JSON.parse(storedItems) : [];
    setMappedProducts(cart)
  }, [])

    const handleAddToCart = (product: cartItem, cartItems: cartItem[] , numberOfItems: number) => {
      let itemsToModify = cartItems;
      const itemToAdd = itemsToModify.findIndex((i: cartItem) => i._id === product._id);

      if(itemToAdd !== -1) {
        const quantity = itemsToModify[itemToAdd].quantity + numberOfItems;
  
        if(quantity < 1) {
          itemsToModify.splice(itemToAdd, 1)
        } else {
          itemsToModify.splice(itemToAdd, 1, {_id: product._id, quantity, productName: product.productName,  price: product.price, images: product.images ? product.images : []})
        }
      } else {
        itemsToModify.push({_id: product._id, quantity: 1, productName: product.productName, price: product.price, images: product.images ? product.images : []})
      }
    
      localStorage.setItem('cart', JSON.stringify(itemsToModify));
    
      setMappedProducts((prevItems) => {
          return prevItems.map((i) => i._id === product._id ? {...i, quantityInCart: i.quantity + numberOfItems} : i)
        })
    };
  
  return (
    <div className="container">
      <h2>Your Cart</h2>
      {mappedProducts.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="list-unstyled">
            {mappedProducts.map((product: cartItem) => (
              <li
              key={product._id}
              className="d-flex align-items-center justify-content-between border-bottom pb-2 mb-2"
              >
              <div className="d-flex  align-items-center">
                <div className="me-3">
                  <img
                  src={
                    product.images?.[0]
                    ? product.images[0]
                    : "https://cwdaust.com.au/wpress/wp-content/uploads/2015/04/placeholder-store.png"
                  }
                  alt={product.productName}
                  className="img-fluid rounded"
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                </div>
                <div>
                  <h4 className="mb-1">{product.productName}</h4>
                  <p className="mb-0">${product.price}</p>
                </div>
              </div>
              <div>
                {
                  product?.quantity > 0 ? (
                    <div className="d-flex align-items-center justify-content-center me-3">
                      <button
                        className="btn btn-outline-success me-2"
                        style={{
                          color: "green",
                          borderColor: "green",
                          backgroundColor: "white",
                        }}
                        onClick={() => handleAddToCart(product, mappedProducts, -1)}
                        disabled={product.quantity <= 0 || product.quantity <= 0}
                      >
                        –
                      </button>
                      <span className="fw-bold text-dark">{product.quantity}</span>
                      <button
                        className="btn btn-outline-success ms-2"
                        style={{
                          color: "green",
                          borderColor: "green",
                          backgroundColor: "white",
                        }}
                        onClick={() => handleAddToCart(product, mappedProducts, 1)}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn btn-success flex-grow-1 me-2"
                      onClick={() => handleAddToCart(product, mappedProducts, 1)}
                    >
                      Add to Cart
                    </button>
                  )
                }
              </div>
              </li>
            ))}
          </ul>
            <div className="d-flex justify-content-end">
            <div>
              <h3>Total: ${total.toFixed(2)}</h3>
              <Link
                  to="/checkout"
                  className="btn btn-success my-3 px-5"
              >
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