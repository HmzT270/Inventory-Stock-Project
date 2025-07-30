import React, { useState } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

export default function BarcodeReader({ onDetected }) {
  const [data, setData] = useState("");

  return (
    <div style={{ textAlign: "center", margin: "20px 0" }}>
      <BarcodeScannerComponent
        width={350}
        height={250}
        onUpdate={(err, result) => {
          if (result) {
            setData(result.text);
            if (onDetected) onDetected(result.text);
          }
        }}
        stopStream={false}
      />
      <p>
        {data
          ? `Okunan Barkod: ${data}`
          : "Kameraya barkodu gösterin..."}
      </p>
    </div>
  );
}
