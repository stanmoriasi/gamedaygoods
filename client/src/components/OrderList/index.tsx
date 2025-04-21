import { useQuery } from "@apollo/client";
import { QUERY_PRODUCT_BY_ID } from "../../utils/queries";
import "./orderList.css";

// Define interfaces for our data structures
interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface ProductItem {
  productId: string;
  quantity: number;
}

interface Order {
  _id: string;
  products: ProductItem[];
  amount: number;
  address?: Address;
  status: string;
  createdAt: string;
}

interface ProductData {
  _id: string;
  productName: string;
  description?: string;
  price: number;
  quantity: number;
  images?: string[];
  category?: string;
}

// Component props interfaces
interface OrderItemProps {
  order: Order;
}

interface ProductDetailProps {
  productId: string;
  quantity: number;
}

interface OrderListProps {
  orders: Order[];
}

const OrderItem: React.FC<OrderItemProps> = ({ order }) => {
  const formatDate = (timestamp: string): string => {
    return new Date(parseInt(timestamp)).toLocaleDateString();
  };

  return (
    <div className="card mb-3">
      <div className="card-header">
        <div className="d-flex justify-content-between">
          <div>
            <h4>Order ID: {order._id.slice(18)}</h4>
            <p className="mb-0">Order Date: {formatDate(order.createdAt)}</p>
          </div>
          {order.address && (
            <div className="col-md-4 border-start">
              <h4>Shipping Address:</h4>
              <p className="mb-0">{order.address.street}</p>
              <p className="mb-0">
                {order.address.city}, {order.address.state}{" "}
                {order.address.zipCode}
              </p>
              <p>{order.address.country}</p>
            </div>
          )}
          <div>
            <span
              className={`badge ${
                order.status === "delivered"
                  ? "bg-success"
                  : order.status === "shipped"
                  ? "bg-info"
                  : order.status === "cancelled"
                  ? "bg-danger"
                  : "bg-warning"
              }`}
            >
              {order.status}
            </span>
          </div>
        </div>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-8">
            <h5>Products:</h5>
            {order.products.map((item, index: number) => (
              <ProductDetail
                key={index}
                productId={item.productId}
                quantity={item.quantity}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="card-footer">
        <h5 className="text-end text-white">
          Total: ${order.amount.toFixed(2)}
        </h5>
      </div>
    </div>
  );
};

const ProductDetail: React.FC<ProductDetailProps> = ({
  productId,
  quantity,
}) => {
  const { loading, error, data } = useQuery(QUERY_PRODUCT_BY_ID, {
    variables: { productId },
  });

  if (loading) return <p>Loading product...</p>;
  if (error) return <p>Error loading product details</p>;

  const product = data?.product as ProductData | undefined;
  if (!product) return <p>Product not found</p>;

  return (
    <div className="d-flex align-items-center mb-2">
      {product.images && product.images.length > 0 && (
        <img
          src={product.images[0]}
          alt={product.productName}
          style={{
            width: "50px",
            height: "50px",
            objectFit: "cover",
            marginRight: "10px",
          }}
        />
      )}
      <div>
        <p className="mb-0">
          <strong>{product.productName}</strong> - ${product.price.toFixed(2)} x{" "}
          {quantity}
        </p>
        <p className="small text-muted mb-0">
          {product.description && product.description.substring(0, 100)}
        </p>
      </div>
    </div>
  );
};

const OrderList: React.FC<OrderListProps> = ({ orders }) => {
  if (!orders || orders.length === 0) {
    return <p>No orders found.</p>;
  }

  return (
    <div>
      {orders.map((order) => (
        <OrderItem key={order._id} order={order} />
      ))}
    </div>
  );
};

export default OrderList;
