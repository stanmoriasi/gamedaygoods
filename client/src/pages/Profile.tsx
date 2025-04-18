import { Navigate, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { QUERY_USER_WITH_ORDERS, QUERY_ME_WITH_ORDERS } from "../utils/queries";
import OrderList from "../components/OrderList";
import Auth from "../utils/auth";

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
    return <div>Loading...</div>;
  }

  if (!user?.username) {
    return (
      <div className="alert alert-warning">
        <h4>Authentication Required</h4>
        <p>
          You need to be logged in to see your profile. Please sign in or create
          an account.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex-row justify-center mb-3">
        <h2 className="col-12 col-md-10 bg-dark text-light p-3 mb-5">
          Viewing {userParam ? `${user.username}'s` : "your"} profile
        </h2>

        <div className="col-12 col-md-10 mb-5">
          <h3>Account Information</h3>
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>

        <div className="col-12 col-md-10 mb-5">
          <h3>Order History</h3>
          {user.orders && user.orders.length > 0 ? (
            <OrderList orders={user.orders} />
          ) : (
            <p>No orders yet. Start shopping to see your order history!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
