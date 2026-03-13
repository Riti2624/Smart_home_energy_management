import { useState } from "react";

export default function Devices() {
  const [devices, setDevices] = useState([
    { name: "AC", status: false },
    { name: "Lights", status: true },
    { name: "Washing Machine", status: false }
  ]);

  const toggle = (index) => {
    const updated = [...devices];
    updated[index].status = !updated[index].status;
    setDevices(updated);
  };

  return (
    <div>
      {devices.map((device, index) => (
        <div key={index} className="card">
          <h3>{device.name}</h3>
          <p>Status: {device.status ? "ON" : "OFF"}</p>
          <button onClick={() => toggle(index)}>
            Toggle
          </button>
        </div>
      ))}
    </div>
  );
}