import { useState } from "react";
import "./productList.css";
import { CategoryName } from "../../types/category";

// Import your images here
import baseballBat1 from "../../assets/baseball/baseball-bat1.jpg";
import baseballBat2 from "../../assets/baseball/baseball-bat2.jpg";
import baseballBat3 from "../../assets/baseball/baseball-bat3.jpg";

import tennisRacket1 from "../../assets/tennis/tennis-racket1.jpg";
import tennisRacket2 from "../../assets/tennis/tennis-racket2.jpg";
import tennisRacket3 from "../../assets/tennis/tennis-racket3.jpg";
import tennisRacket4 from "../../assets/tennis/wilson-blade1.jpg";
import tennisRacket5 from "../../assets/tennis/wilson-blade2.jpg";
import tennisRacket6 from "../../assets/tennis/wilson-blade3.jpg";

import soccerBall1 from "../../assets/soccer/soccer-ball1.jpg";
import soccerBall2 from "../../assets/soccer/soccer-ball2.jpg";
import soccerBall3 from "../../assets/soccer/soccer-ball3.jpg";

import golfClub1 from "../../assets/golf/golf-club1.jpg";
import golfClub2 from "../../assets/golf/golf-club2.jpg";
import golfClub3 from "../../assets/golf/golf-club3.jpg";

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
  productName: string;
}

const ProductList: React.FC<ProductListProps> = ({ products, productName }) => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const handleAddToCart = (productName: string) => {
    console.log(`${productName} added to cart`);
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
                      onClick={() => handleAddToCart(product.productName)}
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
