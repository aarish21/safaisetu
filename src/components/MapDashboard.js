import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Marker Cluster
import "leaflet.markercluster";

// Heatmap
import "leaflet.heat";

// Fix marker path issue in React
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Status-based marker icons
const statusIcons = {
  Pending: new L.Icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
    iconSize: [32, 32],
  }),
  "Pending Verification": new L.Icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
    iconSize: [32, 32],
  }),
  Resolved: new L.Icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
    iconSize: [32, 32],
  }),
};

function MapDashboard() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetch("https://safai-setu-backend.onrender.com/api/report")
      .then((res) => res.json())
      .then((data) => setReports(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (reports.length === 0) return;

    // Create the map with scroll disabled
    const map = L.map("dashboardMap", {
      scrollWheelZoom: false,
    }).setView([22.97, 78.65], 5);

    map.on("click", () => map.scrollWheelZoom.enable());
    map.on("mouseout", () => map.scrollWheelZoom.disable());

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
    }).addTo(map);

    // Cluster Group
    const markers = L.markerClusterGroup();

    // Heatmap points
    const heatPoints = [];

    reports.forEach((report) => {
      const lat = parseFloat(report.latitude);
      const lon = parseFloat(report.longitude);

      if (!isNaN(lat) && !isNaN(lon)) {
        heatPoints.push([lat, lon, 1]);

        const marker = L.marker([lat, lon], {
          icon: statusIcons[report.status] || statusIcons["Pending"],
        }).bindPopup(
          `<b>${report.heading}</b><br/>
           Status: ${report.status}<br/>
           <i>${report.address}</i>`
        );

        markers.addLayer(marker);
      }
    });

    map.addLayer(markers);

    L.heatLayer(heatPoints, { radius: 25 }).addTo(map);

    return () => map.remove();
  }, [reports]);

  return (
    <div style={{ width: "100%", marginTop: "40px" }}>
      <h2 className="text-center fw-bold mb-3" style={{ color: "white" }}>
        Report Heat Map
      </h2>

      <div
        id="dashboardMap"
        style={{
          height: "650px",
          width: "100%",
          borderRadius: "15px",
          overflow: "hidden",
          border: "3px solid white",
        }}
      ></div>
    </div>
  );
}

export default MapDashboard;
