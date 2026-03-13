export default function Reports() {
  const predictBill = () => {
    return (Math.random() * 100 + 50).toFixed(2);
  };

  const exportData = () => {
    const data = "Energy Report\nEstimated Bill: $" + predictBill();
    const blob = new Blob([data], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "report.txt";
    link.click();
  };

  return (
    <div className="card">
      <h2>📄 Monthly Prediction</h2>
      <h1>${predictBill()}</h1>
      <button onClick={exportData}>Download Report</button>
    </div>
  );
}