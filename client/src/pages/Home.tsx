import { useQuery } from "@apollo/client";
import ProductList from "../components/ProductList";
import { QUERY_PRODUCTS } from "../utils/queries.ts";

const Home = () => {
  const { loading, data } = useQuery(QUERY_PRODUCTS);
  const products = data?.products || [];
  console.log("🚀 ~ Home ~ data:", data);

  return (
    <main>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12">
            {loading ? (
              <div className="text-center my-5">
                <div className="spinner-border text-info" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading products...</p>
              </div>
            ) : (
              <ProductList
                products={products}
                productName="Available Products"
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
