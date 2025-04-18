import { Navigate, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { QUERY_USER_WITH_ORDERS, QUERY_ME_WITH_ORDERS } from "../utils/queries";
import OrderList from "../components/OrderList";
import Auth from "../utils/auth";
import "./Profile.css"; // You'll need to create this CSS file

const Profile = () => {
  const { username: userParam } = useParams();

  const { loading, data, error } = useQuery(
    userParam ? QUERY_USER_WITH_ORDERS : QUERY_ME_WITH_ORDERS,
    {
      variables: userParam ? { username: userParam } : {},
      fetchPolicy: "network-only",
    }
  );

  console.log("Query loading:", loading);
  console.log("Query data:", data);
  console.log("Query error:", error);

  const user = data?.me || data?.user || {};
  console.log("User object:", user);

  if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Navigate to="/me" />;
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="loading-text">Loading your profile...</p>
      </div>
    );
  }

  if (!user?.username) {
    return (
      <div className="alert alert-warning auth-alert">
        <h4>Authentication Required</h4>
        <p>
          You need to be logged in to see your profile. Please sign in or create
          an account.
        </p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="account-section">
          <div className="section-header">
            <h3>Account Information</h3>
          </div>
          <div className="account-details">
            <div className="detail-item">
              <span className="detail-label">Username:</span>
              <span className="detail-value">{user.username}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{user.email}</span>
            </div>
          </div>
        </div>

        <div className="orders-section">
          <div className="section-header">
            <h3>Order History</h3>
          </div>
          {user.orders && user.orders.length > 0 ? (
            <OrderList orders={user.orders} />
          ) : (
            <div className="no-orders-message">
              <p>No orders yet. Start shopping to see your order history!</p>
              <a href="/" className="btn btn-primary shop-now-btn">
                Shop Now
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
