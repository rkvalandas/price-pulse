import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { deleteAlert, getAlerts } from "../../api";
import { useAuth } from "../Authenticate/AuthContext";
import AlertInfo from "../UIcomponents/AlertInfo";

// Reusable Alert Card Component
const AlertCard = React.memo(({ alert, onDelete }) => (
  <div className="card card-compact bg-base-200 border border-base-300 shadow-xl p-3 rounded-3xl">
    <div className="card-body">
      <h2 className="card-title">{alert.title}</h2>
      <p>
        <strong>Price Target:</strong> <span>&#8377;</span> {alert.threshold}
      </p>
      <div className="card-actions justify-between">
        <button
          className="btn btn-sm btn-warning rounded-2xl"
          onClick={() => onDelete(alert.id)}
        >
          Delete
        </button>
        <Link to={`/`} className="btn btn-sm btn-primary rounded-2xl">
          View Details
        </Link>
      </div>
    </div>
  </div>
));

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true); // Unified loading state
  const [error, setError] = useState(null);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const { isAuthenticated } = useAuth();

  // Fetch alerts
  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getAlerts();
      const formattedAlerts = data.alerts.map((alert) => ({
        id: alert._id,
        title: `Price drop on ${alert.title}`,
        threshold: alert.targetPrice,
      }));
      setAlerts(formattedAlerts);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load alerts");
    }
    setLoading(false);
  }, []);

  // Delete an alert
  const handleDeleteAlert = async (id) => {
    try {
      await deleteAlert(id);
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    } catch (err) {
      console.error("Error deleting alert:", err.response?.data?.message || err.message);
    }
  };

  // Handle unauthenticated users
  const handleUnauthenticated = () => {
    setShowLoginAlert(true);
    setTimeout(() => setShowLoginAlert(false), 5000);
    setLoading(false);
  };

  useEffect(() => {
    if (typeof isAuthenticated === "undefined") return;

    if (isAuthenticated) {
      fetchAlerts();
    } else {
      handleUnauthenticated();
    }
  }, [isAuthenticated, fetchAlerts]);

  // Render Loading
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // Render Error
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <button
            onClick={fetchAlerts}
            className="mt-4 btn btn-sm btn-primary rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>


      {/* Alerts Section */}
      <section className="mt-36 min-h-96">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">Your Alerts</h2>
          <p className="text-lg">Manage your price drop alerts here.</p>
        </div>

        {isAuthenticated ? (
          alerts.length === 0 ? (
            <div className="flex items-center justify-center col-span-full">
              <div role="alert" className="alert alert-info w-72">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="h-6 w-6 shrink-0 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span>No alerts created yet.</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
              {alerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} onDelete={handleDeleteAlert} />
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-600 text-lg">Please log in to view your alerts.</p>
            <Link
              to="/login"
              className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              Log In
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
