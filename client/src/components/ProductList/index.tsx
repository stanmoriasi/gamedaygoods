import { useState } from "react";
import "./productList.css";

// Import product images
import baseballBat1 from "../../assets/products/baseball/baseball-bat-1.webp";
import baseballBat2 from "../../assets/products/baseball/baseball-bat-2.webp";
import baseballBat3 from "../../assets/products/baseball/baseball-bat-3.webp";
import tennisRacket1 from "../../assets/products/tennis/tennis-racket-1.avif";
import tennisRacket2 from "../../assets/products/tennis/tennis-racket-2.avif";
import tennisRacket3 from "../../assets/products/tennis/tennis-racket-3.avif";
import tennisRacket4 from "../../assets/products/tennis/tennis-racket-4.webp";
import tennisRacket5 from "../../assets/products/tennis/tennis-racket-5.webp";
import tennisRacket6 from "../../assets/products/tennis/tennis-racket-6.webp";
import soccerBall1 from "../../assets/products/soccer/soccer-ball-1.webp";
import soccerBall2 from "../../assets/products/soccer/soccer-ball-2.webp";
import soccerBall3 from "../../assets/products/soccer/soccer-ball-3.webp";
import golfClub1 from "../../assets/products/golf/golf-club-1.jpeg";
import golfClub2 from "../../assets/products/golf/golf-club-2.jpeg";
import golfClub3 from "../../assets/products/golf/golf-club-3.jpeg";

interface Product {
  _id: string;
  productName: string;
  category: string;
  description: string;
  price: number;
  quantity: number;
  createdAt: string;
  images?: string[]; // Make images optional
}

interface ProductListProps {
  products: Product[];
  product: Product;
  productName: string;
}

const ProductList: React.FC<ProductListProps> = ({ products, productName }) => {
  // State to track which product modal is open
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  // Cart functionality
  const handleAddToCart = (product: Product) => {
    const storedItems = localStorage.getItem('cart');
    let cart = storedItems ? JSON.parse(storedItems) : [];
    const itemToAdd = cart.findIndex((i: {_id: string}) => i._id === product._id);
    // if(itemToAdd && itemToAdd?.quantity > product.quantity) {
    //   alert(`Only ${product.quantity} items in stock.`);
    //   return null;
    // }

    if(itemToAdd !== -1) {
      const quantity = cart[itemToAdd].quantity += 1;
      cart.splice(itemToAdd, 1, {_id: product._id, quantity, productName: product.productName})
    } else {
      cart.push({_id: product._id, quantity: 1, productName: product.productName, price: product.price})
    }

    localStorage.setItem('cart', JSON.stringify(cart));
  };

  // Modal open handler
  const openModal = (productId: string) => {
    setSelectedProduct(productId);
  };

  // Modal close handler
  const closeModal = () => {
    setSelectedProduct(null);
  };

  // Function to get the appropriate image based on product name
  const getProductImage = (product: Product) => {
    const name = product.productName.toLowerCase();

    // Match specific product names first
    if (name.includes("baseball bat")) {
      return baseballBat1;
    } else if (name.includes("babolat tennis racket")) {
      return tennisRacket1;
    } else if (
      name.includes("wilson tennis racket") ||
      name.includes("wilson")
    ) {
      return tennisRacket4; // Use image 4 for Wilson tennis racket
    } else if (name.includes("soccer ball")) {
      return soccerBall1;
    } else if (name.includes("golf club")) {
      return golfClub1;
    }

    // Then try to match by category
    if (name.includes("baseball") || name.includes("bat")) {
      return baseballBat1;
    } else if (name.includes("tennis") || name.includes("racket")) {
      return tennisRacket1;
    } else if (name.includes("soccer") || name.includes("ball")) {
      return soccerBall1;
    } else if (name.includes("golf") || name.includes("club")) {
      return golfClub1;
    }

    // Default image if no match
    return baseballBat1;
  };

  // Function to get additional images for the modal
  const getAdditionalImages = (product: Product) => {
    const name = product.productName.toLowerCase();

    // Match specific product names first
    if (name.includes("wilson tennis racket") || name.includes("wilson")) {
      return [tennisRacket4, tennisRacket5, tennisRacket6]; // Use images 4, 5, 6 for Wilson
    }

    // Match by product category
    if (name.includes("baseball") || name.includes("bat")) {
      return [baseballBat1, baseballBat2, baseballBat3];
    } else if (name.includes("tennis") || name.includes("racket")) {
      return [tennisRacket1, tennisRacket2, tennisRacket3];
    } else if (name.includes("soccer") || name.includes("ball")) {
      return [soccerBall1, soccerBall2, soccerBall3];
    } else if (name.includes("golf") || name.includes("club")) {
      return [golfClub1, golfClub2, golfClub3];
    }

    // Default images if no match
    return [baseballBat1, baseballBat2, baseballBat3];
  };

  if (!products.length) {
    return <h3 className="text-center my-4">No products Yet</h3>;
  }

  return (
    <div className="product-container">
      <h3 className="text-center mb-4 brand-text">
        <span className="text-info">{productName}</span>
      </h3>

      <div className="product-grid">
        {products &&
          products.map((product) => {
            // Get the appropriate image for this product
            const productImage = getProductImage(product);

            return (
              <div key={product._id} className="product-item">
                <div className="product-card h-100">
                  <div className="product-image-container">
                    <img
                      src={productImage}
                      alt={product.productName}
                      className="product-main-image"
                    />
                  </div>
                  <div className="card-footer">
                    <h4 className="brand-text mb-2">{product.productName}</h4>
                    <div className="d-flex justify-content-between">
                      <button
                        className="btn btn-success flex-grow-1 me-2"
                        onClick={() => handleAddToCart(product)}
                        disabled={product.quantity <= 0}
                      >
                        Add to Cart
                      </button>
                      <button
                        className="btn btn-info text-white flex-grow-1"
                        onClick={() => openModal(product._id)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>

                {/* Product Detail Modal */}
                <div
                  className={`modal fade ${
                    selectedProduct === product._id ? "show" : ""
                  }`}
                  id={`productModal-${product._id}`}
                  tabIndex={-1}
                  role="dialog"
                  aria-labelledby={`productModalLabel-${product._id}`}
                  aria-hidden={selectedProduct !== product._id}
                  style={{
                    display: selectedProduct === product._id ? "block" : "none",
                    backgroundColor: "rgba(0,0,0,0.5)",
                  }}
                >
                  <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5
                          className="modal-title brand-text"
                          id={`productModalLabel-${product._id}`}
                        >
                          {product.productName}
                        </h5>
                        <button
                          type="button"
                          className="btn-close"
                          onClick={closeModal}
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="modal-body">
                        <div className="row">
                          <div className="col-md-6">
                            <img
                              src={productImage}
                              alt={product.productName}
                              className="img-fluid rounded mb-3"
                            />
                            <div className="product-thumbnails">
                              {getAdditionalImages(product).map(
                                (image, index) => (
                                  <img
                                    key={index}
                                    src={image}
                                    alt={`${product.productName} - view ${
                                      index + 1
                                    }`}
                                    className="thumbnail-image"
                                  />
                                )
                              )}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <p className="mb-2">
                              <small className="text-muted">
                                Added on{" "}
                                {new Date(
                                  Number(product.createdAt)
                                ).toLocaleDateString()}
                              </small>
                            </p>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <span className="price-tag text-info fw-bold">
                                ${product.price.toFixed(2)}
                              </span>
                              <span className="quantity-badge bg-warning text-dark px-2 py-1 rounded">
                                {product.quantity} in stock
                              </span>
                            </div>
                            <p>{product.description}</p>
                            <p>
                              <strong>Category:</strong> {product.category}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={closeModal}
                        >
                          Close
                        </button>
                        <button
                          type="button"
                          className="btn btn-success"
                          onClick={() => handleAddToCart(product)}
                          disabled={product.quantity <= 0}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* End Modal */}
              </div>
            );
          })}
      </div>

      {/* Backdrop for modal */}
      {selectedProduct && (
        <div className="modal-backdrop fade show" onClick={closeModal}></div>
      )}
    </div>
  );
};

export default ProductList;
