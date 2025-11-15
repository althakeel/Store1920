import React, { useState } from "react";
import Truck from "../assets/images/common/truck.png";

const TrackDeepOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [truckPosition, setTruckPosition] = useState(0);
  const [showSchedule, setShowSchedule] = useState(false);
  const [requestedDate, setRequestedDate] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [hasSearched, setHasSearched] = useState(false); // ✅ Track if user has searched

  const trackingSteps = [
    "Shipment Info Received",
    "Picked Up",
    "Arrived Facility 1",
    "With Delivery Courier",
    "Out for Delivery",
    "Delivered",
  ];

  const fetchOrder = async () => {
    if (!orderId.trim()) return;

    setHasSearched(true); // ✅ mark that user searched
    setLoading(true);
    setErrorMsg("");
    setOrderDetails(null);
    setLogs([]);
    setTruckPosition(0);
    setShowSchedule(false);
    setSuccessMsg("");

    try {
      const response = await fetch(
        "https://db.store1920.com/wp-json/custom/v1/track-c3x-reference",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ TrackingAWB: orderId.trim() }),
        }
      );

      if (!response.ok) throw new Error("C3X API error");
      const data = await response.json();

      if (data?.AirwayBillTrackList?.length) {
        const trackingData = data.AirwayBillTrackList[0];
        if (trackingData.AirWayBillNo) {
          setOrderDetails(trackingData);
          setLogs(trackingData.TrackingLogDetails || []);
          const progress = parseInt(trackingData.ShipmentProgress ?? 0);
          setTruckPosition(progress);
        } else {
          setOrderDetails(null);
        }
      } else {
        setOrderDetails(null);
      }
    } catch (err) {
      console.error("C3X Tracking Error:", err);
      setErrorMsg(
        "⚠️ Unable to fetch tracking details at the moment. Please try again later."
      );
    }

    setLoading(false);
  };

  const handleSchedule = () => {
    if (!requestedDate) {
      setErrorMsg("Please select a date first.");
      return;
    }
    setSuccessMsg(
      `✅ Delivery date request submitted for ${requestedDate}. Approval required.`
    );
    setRequestedDate("");
    setShowSchedule(false);
  };

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', sans-serif",
        padding: 20,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 800,
          background: "#fff",
          borderRadius: 16,
          padding: 25,
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#1976d2",
            marginBottom: 20,
          }}
        >
          🚚 Track & Schedule Your Order
        </h1>

        {/* Input Section */}
        <div style={{ marginBottom: 20 }}>
          <input
            type="text"
            placeholder="Enter Tracking Number"
            value={orderId}
            onChange={(e) => {
              setOrderId(e.target.value);
              setHasSearched(false); // ✅ Reset message on new input
              setErrorMsg("");
            }}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 8,
              border: "1px solid #ccc",
              marginBottom: 10,
              fontSize: 15,
            }}
          />
          <button
            onClick={fetchOrder}
            disabled={loading}
            style={{
              width: "100%",
              padding: 12,
              background: "linear-gradient(90deg, #42a5f5, #1e88e5)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 16,
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Loading..." : "Track Order"}
          </button>

          {/* Error Message */}
          {errorMsg && (
            <div
              style={{
                background: "#ffebee",
                color: "#c62828",
                padding: "12px 15px",
                borderRadius: 8,
                marginTop: 15,
                textAlign: "center",
                fontSize: 14,
                lineHeight: "1.5",
              }}
            >
              {errorMsg}
            </div>
          )}
        </div>

        {/* Show tracking details if found */}
        {orderDetails && orderDetails.AirWayBillNo && (
          <>
            {/* Tracking Progress Bar */}
            <div style={{ position: "relative", marginTop: 30, marginBottom: 30 }}>
              <div
                style={{
                  height: 12,
                  borderRadius: 6,
                  overflow: "hidden",
                  background:
                    "repeating-linear-gradient(to right, #ddd 0 10px, transparent 10px 20px)",
                  animation: "roadMove 1s linear infinite",
                }}
              ></div>

              <div
                style={{
                  position: "absolute",
                  top: -18,
                  left: `calc(${
                    (truckPosition / (trackingSteps.length - 1)) * 100
                  }% - 16px)`,
                  fontSize: 32,
                  transform: "rotate(0deg)",
                  transition: "left 1.5s ease-in-out",
                }}
              >
                <img src={Truck} style={{ width: "45px", height: "45px" }} />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 12,
                }}
              >
                {trackingSteps.map((step, idx) => {
                  const active = idx <= truckPosition;
                  return (
                    <div
                      key={idx}
                      style={{
                        textAlign: "center",
                        width: `${100 / trackingSteps.length}%`,
                      }}
                    >
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          margin: "0 auto",
                          background: active ? "#1e88e5" : "#ccc",
                          marginBottom: 6,
                        }}
                      ></div>
                      <div
                        style={{
                          fontSize: 11,
                          color: active ? "#1e88e5" : "#888",
                        }}
                      >
                        {step}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shipment Info */}
            <div style={{ marginBottom: 30 }}>
              <h2 style={{ color: "#ff6d00", marginBottom: 15 }}>
                Shipment Details
              </h2>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 14,
                }}
              >
                <tbody>
                  <tr>
                    <td style={{ padding: 8, fontWeight: "bold" }}>
                      Air Waybill
                    </td>
                    <td style={{ padding: 8 }}>
                      {orderDetails.AirWayBillNo}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: 8, fontWeight: "bold" }}>Origin</td>
                    <td style={{ padding: 8 }}>{orderDetails.Origin}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: 8, fontWeight: "bold" }}>
                      Destination
                    </td>
                    <td style={{ padding: 8 }}>{orderDetails.Destination}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: 8, fontWeight: "bold" }}>
                      Weight (kg)
                    </td>
                    <td style={{ padding: 8 }}>
                      {orderDetails.ChargeableWeight}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Activity Logs */}
            {logs.length > 0 && (
              <div style={{ marginBottom: 30 }}>
                <h2 style={{ color: "#1e88e5", marginBottom: 15 }}>
                  Tracking History
                </h2>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 13,
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          borderBottom: "1px solid #ddd",
                          padding: 8,
                          textAlign: "left",
                        }}
                      >
                        Date
                      </th>
                      <th
                        style={{
                          borderBottom: "1px solid #ddd",
                          padding: 8,
                        }}
                      >
                        Time
                      </th>
                      <th
                        style={{
                          borderBottom: "1px solid #ddd",
                          padding: 8,
                        }}
                      >
                        Location
                      </th>
                      <th
                        style={{
                          borderBottom: "1px solid #ddd",
                          padding: 8,
                        }}
                      >
                        Remarks
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log, index) => (
                      <tr key={index}>
                        <td style={{ padding: 8 }}>{log.ActivityDate}</td>
                        <td style={{ padding: 8, textAlign: "center" }}>
                          {log.ActivityTime}
                        </td>
                        <td style={{ padding: 8, textAlign: "center" }}>
                          {log.Location}
                        </td>
                        <td style={{ padding: 8 }}>{log.Remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Schedule Section */}
            <div>
              {!showSchedule ? (
                <div>
                  <button
                    onClick={() => setShowSchedule(true)}
                    style={{
                      width: "100%",
                      padding: 12,
                      background: "linear-gradient(90deg, #ff8f00, #ff6d00)",
                      color: "#fff",
                      border: "none",
                      borderRadius: 10,
                      fontSize: 16,
                      fontWeight: "bold",
                      cursor: "pointer",
                      marginBottom: 10,
                    }}
                  >
                    Request / Schedule Delivery Date
                  </button>
                  <button
                    onClick={() =>
                      (window.location.href = "mailto:support@store1920.com")
                    }
                    style={{
                      width: "100%",
                      padding: 12,
                      background: "linear-gradient(90deg, #757575, #424242)",
                      color: "#fff",
                      border: "none",
                      borderRadius: 10,
                      fontSize: 16,
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Contact Support
                  </button>
                </div>
              ) : (
                <div style={{ marginTop: 10 }}>
                  <p style={{ marginBottom: 10, color: "#1976d2" }}>
                    Select a requested delivery date (Approval required):
                  </p>
                  <input
                    type="date"
                    value={requestedDate}
                    onChange={(e) => setRequestedDate(e.target.value)}
                    style={{
                      width: "100%",
                      padding: 12,
                      borderRadius: 10,
                      border: "1px solid #ccc",
                      marginBottom: 15,
                      fontSize: 15,
                    }}
                  />
                  <button
                    onClick={handleSchedule}
                    style={{
                      width: "100%",
                      padding: 12,
                      fontSize: 16,
                      fontWeight: "bold",
                      color: "#fff",
                      background: "linear-gradient(90deg, #ff8f00, #ff6d00)",
                      border: "none",
                      borderRadius: 10,
                      cursor: "pointer",
                    }}
                  >
                    Submit Request
                  </button>
                  {successMsg && (
                    <p style={{ color: "green", marginTop: 10 }}>
                      {successMsg}
                    </p>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {/* Show no tracking details message only after search */}
        {/* Show no tracking details message only after search completes */}
{hasSearched && !loading && !orderDetails && !errorMsg && (
  <div
    style={{
      background: "#e3f2fd",
      color: "#1976d2",
      padding: "14px 16px",
      borderRadius: 8,
      marginTop: 20,
      textAlign: "center",
      fontSize: 15,
      lineHeight: "1.6",
    }}
  >
    ℹ️ Currently, we don’t have any tracking details for this shipment.
    <br />
    Details will be updated once received. Please check back again later.
  </div>
)}


        <style>
          {`
            @keyframes roadMove {
              0% { background-position: 0 0; }
              100% { background-position: 20px 0; }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default TrackDeepOrder;
