import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

function BarcodeScanner() {
  const [scannedData, setScannedData] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'reader',
      {
        fps: 10, // Frames per second for the scanning process
        qrbox: { width: 250, height: 250 }, // Scanning box size
        formatsToSupport: ['QR_CODE', 'EAN_13', 'CODE_39'], // Supported barcode formats
      },
      false
    );

    scanner.render(
      (result) => {
        setScannedData(result);
        scanner.clear(); // Stop the scanner after a successful scan
      },
      (err) => {
        setError(err.message || 'An error occurred while scanning.');
      }
    );

    // Cleanup on unmount
    return () => {
      scanner.clear();
    };
  }, []);

  return (
    <div>
      <h1>Barcode Scanner</h1>
      <div id="reader" style={{ width: '300px' }}></div>
      {scannedData && (
        <div>
          <h2>Scanned Data:</h2>
          <p>{scannedData}</p>
        </div>
      )}
      {error && (
        <div>
          <h2>Error:</h2>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

export default BarcodeScanner;
