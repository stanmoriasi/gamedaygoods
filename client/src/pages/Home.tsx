import { useQuery } from '@apollo/client';
import ProductList from '../components/ProductList';
import { QUERY_PRODUCTS } from '../utils/queries.ts';
//import ProductList from '../components/ProductList/index.tsx';

const Home = () => {
  const { loading, data } = useQuery(QUERY_PRODUCTS);
  
  const products = data?.products || [];
  console.log("🚀 ~ Home ~ data:", data)

  return (
    <main>
      <div className="flex-row justify-center">
      {/* <div
          className="col-12 col-md-10 mb-3 p-3"
          style={{ border: '1px dotted #1a1a1a' }}
        >
          <ProductList
            products={products}
            productName="Default Product Name"
          />
        </div> */}
        <div className="col-12 col-md-8 mb-3">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <ProductList
              products={products}
              productName="Available Products"
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
