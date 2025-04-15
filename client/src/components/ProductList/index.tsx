// Import `<Link>` component from React Router for internal hyperlinks
import { Link } from 'react-router-dom';

interface Product {
  _id: string;
  productName: string;
  category: string;
  description: string;
  price: number;
  quantity: number;
  createdAt: string;
  images: string[];

}

interface ProductListProps {
    products: Product[];
    productName: string;
    
}


const cartItems: string[] = []; // Initialize cartItems as an empty array

const handleAddToCart = (productName: string) => {
  // Logic to add the product to the cart
  //this should go to the cart component
  cartItems.push(productName);
  console.log(`${productName} added to cart`);
  console.log(cartItems); // Log the cartItems array to see its contents
};


 // Log the cartItems array to see its contents
const ProductList: React.FC<ProductListProps> = ({ products, productName }) => {
  
  if (!products.length) {
    return <h3>No products Yet</h3>;
  }

  return (
    <div >

      <h3>{productName}</h3>
      {products &&
        products.map((product) => (
          <div key={product._id} className="card mb-3 ">
            <h4 className="card-header bg-primary text-light p-2 m-0">
              {product.productName} <br />
              <span style={{ fontSize: '1rem' }}>
                had this product on {new Date(Number(product.createdAt)).toLocaleString()}
              </span>
            </h4>
            <div className="card-body bg-light p-2">
              <p>{product.description}</p>
              <p>Price: {product.price}</p>
            <p>Quantity: {product.quantity}</p>
            <div className="product-images">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.productName} - ${index + 1}`}
                  style={{
                    width: '100px',
                    height: '100px',
                    margin: '5px',

                  }}
                />
              ))}
            </div>
            <button
              className="btn btn-success mt-3"
              onClick={() => handleAddToCart(product.productName)}
            >
              Add to Cart
            </button>
                        
          </div>
            {/* Create a link to this product's page to view its comments using `<Link>` component */}
            <Link
              className="btn btn-primary btn-block btn-squared"
              to={`/products/${product._id}`}
            >
              Join the discussion on this thought.
            </Link>
          </div>
        ))}
    </div>
  );
};

export default ProductList;
