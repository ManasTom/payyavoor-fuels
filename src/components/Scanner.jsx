import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';

export default function Scanner({ onScanSuccess, onScanError }) {
  const [scannerId] = useState(`qr-reader-${Math.random().toString(36).substring(7)}`);

  useEffect(() => {
    const html5QrcodeScanner = new Html5QrcodeScanner(
      scannerId,
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 }, 
        aspectRatio: 1,
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
      },
      /* verbose= */ false
    );

    html5QrcodeScanner.render(
      (decodedText, decodedResult) => {
        onScanSuccess(decodedText, decodedResult);
      },
      (error) => {
        if (onScanError) onScanError(error);
      }
    );

    return () => {
      try {
        html5QrcodeScanner.clear().catch(error => {
          console.error("Failed to clear html5QrcodeScanner. ", error);
        });
      } catch (e) {
        // Fallback for synchronous clear failure
      }
    };
  }, [scannerId, onScanSuccess, onScanError]);

  return <div id={scannerId}></div>;
}
