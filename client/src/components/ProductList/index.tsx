import { useState } from "react";
import "./productList.css";
import { CategoryName } from "../../types/category";

// Import your images here
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
  category: CategoryName;
  description: string;
  price: number;
  quantity: number;
  createdAt: string;
  images?: string[];
}

interface ProductListProps {
  products: Product[];
  product: Product;
  productName: string;
}

const ProductList: React.FC<ProductListProps> = ({ products, productName }) => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Cart functionality
  const handleAddToCart = (product: Product) => {
    const storedItems = localStorage.getItem("cart");
    let cart = storedItems ? JSON.parse(storedItems) : [];
    const itemToAdd = cart.findIndex(
      (i: { _id: string }) => i._id === product._id
    );
    // if(itemToAdd && itemToAdd?.quantity > product.quantity) {
    //   alert(`Only ${product.quantity} items in stock.`);
    //   return null;
    // }

    if (itemToAdd !== -1) {
      const quantity = (cart[itemToAdd].quantity += 1);
      cart.splice(itemToAdd, 1, {
        _id: product._id,
        quantity,
        productName: product.productName,
      });
    } else {
      cart.push({
        _id: product._id,
        quantity: 1,
        productName: product.productName,
        price: product.price,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const openModal = (productId: string) => setSelectedProduct(productId);
  const closeModal = () => setSelectedProduct(null);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const getProductImage = (product: Product) => {
    const name = product.productName.toLowerCase();
    if (name.includes("baseball bat")) return baseballBat1;
    if (name.includes("babolat tennis racket")) return tennisRacket1;
    if (name.includes("wilson")) return tennisRacket4;
    if (name.includes("soccer ball")) return soccerBall1;
    if (name.includes("golf club")) return golfClub1;
    if (name.includes("baseball")) return baseballBat1;
    if (name.includes("tennis")) return tennisRacket1;
    if (name.includes("soccer")) return soccerBall1;
    if (name.includes("golf")) return golfClub1;
    return baseballBat1;
  };

  const getAdditionalImages = (product: Product) => {
    const name = product.productName.toLowerCase();
    if (name.includes("wilson"))
      return [tennisRacket4, tennisRacket5, tennisRacket6];
    if (name.includes("baseball"))
      return [baseballBat1, baseballBat2, baseballBat3];
    if (name.includes("tennis"))
      return [tennisRacket1, tennisRacket2, tennisRacket3];
    if (name.includes("soccer")) return [soccerBall1, soccerBall2, soccerBall3];
    if (name.includes("golf")) return [golfClub1, golfClub2, golfClub3];
    return [baseballBat1, baseballBat2, baseballBat3];
  };

  if (!products.length) {
    return <h3 className="text-center my-4">No products yet</h3>;
  }

  return (
    <div className="product-container">
      <h3 className="text-center mb-4 brand-text">
        <span className="text-info">{productName}</span>
      </h3>

      <div className="d-flex justify-content-center mb-4">
        <select
          className="form-select w-auto"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Soccer">Soccer</option>
          <option value="Tennis">Tennis</option>
          <option value="Golf">Golf</option>
          <option value="Baseball">Baseball</option>
        </select>
      </div>

      <div className="product-grid">
        {filteredProducts.map((product) => {
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

              {selectedProduct === product._id && (
                <div className="modal fade show d-block" tabIndex={-1}>
                  <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">{product.productName}</h5>
                        <button
                          type="button"
                          className="btn-close"
                          onClick={closeModal}
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="modal-body">
                        <p>{product.description}</p>
                        <div className="additional-images d-flex justify-content-center flex-wrap">
                          {getAdditionalImages(product).map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`Additional ${idx}`}
                              className="additional-image"
                            />
                          ))}
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button
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
              )}
            </div>
          );
        })}
      </div>

      {selectedProduct && (
        <div className="modal-backdrop fade show" onClick={closeModal}></div>
      )}
    </div>
  );
};

export default ProductList;
