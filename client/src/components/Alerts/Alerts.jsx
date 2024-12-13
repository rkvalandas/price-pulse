import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { deleteAlert, getAlerts } from "../../api";
import AlertInfo from "../UIcomponents/AlertInfo";

export default function Alerts() {
  // Sample data for alerts
  const [alerts, setAlerts] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  const handleDeleteAlert = async (id) => {
    await deleteAlert(id);
    setAlerts(alerts.filter((alert) => alert.id !== id));
  };

  // Function to add a new alert
  const addNewAlert = (newAlert) => {
    setAlerts((prevAlerts) => [
      ...prevAlerts, // Keep the existing alerts
      newAlert, // Add the new alert
    ]);
  };
  
  // Function to add an array of new alerts
  const handleAlerts = (newAlerts) => {
    newAlerts.forEach((alert) => {
      addNewAlert({
        id: alert._id,
        title: `Price drop on ${alert.title}`,
        threshold: alert.targetPrice,
      });
    });
  };

  const triggerAlert = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000); // Hide alert after 5 seconds
  };

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const { data } = await getAlerts();
        handleAlerts(data.alerts);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    fetchAlerts();
  }, []);

  return (
    <div>
      {showAlert && <AlertInfo message="Login to create alerts" type="info" />}
      {/* Alerts Section */}
      <section className="mt-36 min-h-96">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">Your Alerts</h2>
          <p className="text-lg">Manage your price drop alerts here.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
          {alerts.length === 0 ? (
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
            alerts.map((alert) => (
              <div
                key={alert.id}
                className="card card-compact bg-base-200 border border-base-300 shadow-xl p-3 rounded-3xl"
              >
                <div className="card-body">
                  <h2 className="card-title">{alert.title}</h2>
                  <p>
                    <strong>Price Target: </strong> <span>&#8377;</span> 
                    {alert.threshold}
                  </p>
                  <div className="card-actions justify-between">
                    <button
                      className="btn btn-sm btn-warning rounded-2xl"
                      onClick={() => handleDeleteAlert(alert.id)}
                    >
                      Delete
                    </button>
                    <Link
                      to={`/`}
                      className="btn btn-sm btn-primary rounded-2xl"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
      <div className="mb-28"></div>
    </div>
  );
}
