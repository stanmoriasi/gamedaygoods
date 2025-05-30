import { useEffect, useState } from "react";
import "./productList.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface Product {
  _id: string;
  productName: string;
  category: string;
  description: string;
  price: number;
  quantity: number;
  createdAt: string;
  images?: string[];
}
interface cartItem {
  _id: string;
  quantity: number;
  productName: string;
  price: number;
  images: string[] | [];
}
interface ProductListProps {
  products: Product[];
  product?: Product;
  productName: string;
}
const CustomSlider: any = Slider;
const ProductList: React.FC<ProductListProps> = ({ products }) => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [mappedProducts, setMappedProducts] = useState<
    (Product & { quantityInCart: number })[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const storedItems = localStorage.getItem("cart");
  const cart = storedItems ? JSON.parse(storedItems) : [];

  // Extract unique categories for dropdown
  const categories = Array.from(new Set(products.map((p) => p.category)));

  useEffect(() => {
    const modifiedProducts = products.map((prod) => {
      const itemInCart = cart.find((item: cartItem) => item._id === prod._id);
      return {
        ...prod,
        quantityInCart: itemInCart?.quantity ? itemInCart?.quantity : 0,
      };
    });
    setMappedProducts(modifiedProducts);
  }, [products]);

  const handleAddToCart = (
    product: Product,
    cartItems: cartItem[],
    numberOfItems: number
  ) => {
    let itemsToModify = cartItems;
    const itemToAdd = itemsToModify.findIndex(
      (i: cartItem) => i._id === product._id
    );

    if (itemToAdd !== -1) {
      const quantity = itemsToModify[itemToAdd].quantity + numberOfItems;

      if (quantity < 1) {
        itemsToModify.splice(itemToAdd, 1);
      } else {
        itemsToModify.splice(itemToAdd, 1, {
          _id: product._id,
          quantity,
          productName: product.productName,
          price: product.price,
          images: product.images ? product.images : [],
        });
      }
    } else {
      itemsToModify.push({
        _id: product._id,
        quantity: 1,
        productName: product.productName,
        price: product.price,
        images: product.images ? product.images : [],
      });
    }

    localStorage.setItem("cart", JSON.stringify(itemsToModify));

    setMappedProducts((prevItems) => {
      return prevItems.map((i) =>
        i._id === product._id
          ? { ...i, quantityInCart: i.quantityInCart + numberOfItems }
          : i
      );
    });
  };

  const openModal = (productId: string) => {
    setSelectedProduct(productId);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  if (!products.length) {
    return <h3 className="text-center my-4">No products Yet</h3>;
  }

  return (
    <div className="product-container">
      <h3 className="text-center mb-4 brand-text">
        <span className="text-info">Available Products</span>
      </h3>

      {/* Category Filter */}
      <div className="mb-3 d-flex justify-content-end align-items-center">
        <select
          className="form-select w-auto"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {selectedCategory !== "All" && (
          <button
            className="btn btn-outline-secondary ms-2"
            onClick={() => setSelectedCategory("All")}
          >
            Clear Filter
          </button>
        )}
      </div>

      <div className="product-grid">
        {mappedProducts &&
          mappedProducts
            .filter((product) =>
              selectedCategory === "All"
                ? true
                : product.category === selectedCategory
            )
            .map((product) => {
              return (
                <div key={product._id} className="product-item">
                  <div className="product-card h-100">
                    <div className="product-image-container">
                      <img
                        src={
                          product.images?.[0]
                            ? product.images[0]
                            : "https://cwdaust.com.au/wpress/wp-content/uploads/2015/04/placeholder-store.png"
                        }
                        alt={product.productName}
                        className="product-main-image"
                      />
                    </div>
                    <div className="card-footer">
                      <h4 className="brand-text mb-2">{product.productName}</h4>
                      <div className="d-flex justify-content-between">
                        {product?.quantityInCart > 0 ? (
                          <div className="d-flex align-items-center justify-content-center me-3">
                            <button
                              className="btn btn-outline-success me-2"
                              style={{
                                color: "lightgreen",
                                borderColor: "lightgreen",
                              }}
                              onClick={() => handleAddToCart(product, cart, -1)}
                            >
                              –
                            </button>
                            <span className="fw-bold text-light">
                              {product.quantityInCart}
                            </span>
                            <button
                              className="btn btn-outline-success ms-2"
                              style={{
                                color: "lightgreen",
                                borderColor: "lightgreen",
                              }}
                              onClick={() => handleAddToCart(product, cart, 1)}
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            className="btn btn-success flex-grow-1 me-2"
                            onClick={() => handleAddToCart(product, cart, 1)}
                            disabled={product.quantity <= 0}
                          >
                            Add to Cart
                          </button>
                        )}
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
                  <>
                    {(() => {
                      const sliderSettings = {
                        dots: true,
                        infinite: true,
                        autoplay: true,
                        speed: 500,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        arrows: true,
                        adaptiveHeight: true,
                        dotsClass: "thumbnails",
                        customPaging: function (i: number) {
                          return (
                            <a>
                              <img
                                src={
                                  product.images?.[i] ||
                                  "https://cwdaust.com.au/wpress/wp-content/uploads/2015/04/placeholder-store.png"
                                }
                                alt={`Thumbnail ${i + 1}`}
                                className="slick-thumb"
                              />
                            </a>
                          );
                        },
                      };
                      return (
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
                            display:
                              selectedProduct === product._id
                                ? "block"
                                : "none",
                          }}
                        >
                          <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h5
                                  className="modal-title brand-text"
                                  id={`productModalLabel-${product._id}`}
                                >
                                  {product.quantity <= 0 ? (
                                    <span className="text-danger">
                                      Out of Stock:{" "}
                                    </span>
                                  ) : null}
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
                                  <div className="col-12">
                                    <div className="slider-container">
                                      {product.images &&
                                      product.images.length > 0 ? (
                                        <>
                                          <CustomSlider {...sliderSettings}>
                                            {product.images.map(
                                              (image, index) => (
                                                <div
                                                  key={index}
                                                  className="slider-image-wrapper"
                                                >
                                                  <img
                                                    src={image}
                                                    alt={`${
                                                      product.productName
                                                    } ${index + 1}`}
                                                    className="slider-image"
                                                  />
                                                </div>
                                              )
                                            )}
                                          </CustomSlider>
                                          <div className="slider-nav-buttons" />
                                        </>
                                      ) : (
                                        <img
                                          src="https://cwdaust.com.au/wpress/wp-content/uploads/2015/04/placeholder-store.png"
                                          alt="No image available"
                                          className="slider-image"
                                        />
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-12">
                                    <div className="product-details">
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
                                        <strong>Category:</strong>{" "}
                                        {product.category}
                                      </p>
                                    </div>
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
                                {product?.quantityInCart > 0 ? (
                                  <div className="d-flex align-items-center justify-content-center me-3">
                                    <button
                                      className="btn btn-outline-success me-2"
                                      style={{
                                        color: "green",
                                        borderColor: "green",
                                        backgroundColor: "white",
                                      }}
                                      onClick={() =>
                                        handleAddToCart(product, cart, -1)
                                      }
                                      disabled={
                                        product.quantity <= 0 ||
                                        product.quantityInCart <= 0
                                      }
                                    >
                                      –
                                    </button>
                                    <span className="fw-bold text-dark">
                                      {product.quantityInCart}
                                    </span>
                                    <button
                                      className="btn btn-outline-success ms-2"
                                      style={{
                                        color: "green",
                                        borderColor: "green",
                                        backgroundColor: "white",
                                      }}
                                      onClick={() =>
                                        handleAddToCart(product, cart, 1)
                                      }
                                    >
                                      +
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    className="btn btn-success flex-grow-1 me-2"
                                    onClick={() =>
                                      handleAddToCart(product, cart, 1)
                                    }
                                    disabled={product.quantity <= 0}
                                  >
                                    Add to Cart
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </>
                  {/* End Modal */}
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
