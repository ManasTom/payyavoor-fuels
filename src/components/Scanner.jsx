import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Zap, ZapOff, RefreshCcw } from 'lucide-react';

export default function Scanner({ onScanSuccess, onScanError }) {
  const [scannerId] = useState(`qr-reader-${Math.random().toString(36).substring(7)}`);
  const [facingMode, setFacingMode] = useState('environment'); // Default to back camera
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [hasCameras, setHasCameras] = useState(false);
  
  const html5QrCodeRef = useRef(null);
  const onScanSuccessRef = useRef(onScanSuccess);
  const onScanErrorRef = useRef(onScanError);

  // Keep refs up to date
  useEffect(() => {
    onScanSuccessRef.current = onScanSuccess;
    onScanErrorRef.current = onScanError;
  }, [onScanSuccess, onScanError]);

  useEffect(() => {
    html5QrCodeRef.current = new Html5Qrcode(scannerId);

    const startScanner = async () => {
      try {
        await html5QrCodeRef.current.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1 },
          (decodedText, decodedResult) => {
            if (onScanSuccessRef.current) onScanSuccessRef.current(decodedText, decodedResult);
          },
          (error) => {
            if (onScanErrorRef.current) onScanErrorRef.current(error);
          }
        );
        setHasCameras(true);
      } catch (err) {
        console.error("Error starting scanner", err);
      }
    };

    startScanner();

    return () => {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().catch(err => console.error("Error stopping scanner", err));
      }
    };
  }, [scannerId]);

  const toggleCamera = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      const newFacingMode = facingMode === 'environment' ? 'user' : 'environment';
      
      try {
        await html5QrCodeRef.current.stop();
        setFacingMode(newFacingMode);
        setIsFlashOn(false); // Reset flash state on camera change
        
        await html5QrCodeRef.current.start(
          { facingMode: newFacingMode },
          { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1 },
          (decodedText, decodedResult) => {
            if (onScanSuccessRef.current) onScanSuccessRef.current(decodedText, decodedResult);
          },
          (error) => {
            if (onScanErrorRef.current) onScanErrorRef.current(error);
          }
        );
      } catch (err) {
        console.error("Error toggling camera", err);
      }
    }
  };

  const toggleFlash = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        // Only some devices support toggling the torch directly via constraints
        await html5QrCodeRef.current.applyVideoConstraints({
          advanced: [{ torch: !isFlashOn }]
        });
        setIsFlashOn(!isFlashOn);
      } catch (err) {
        console.error("Flashlight not supported", err);
        alert("Flashlight might not be supported on this device/camera.");
      }
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <div id={scannerId} style={{ width: '100%', borderRadius: '12px', overflow: 'hidden', minHeight: '300px', backgroundColor: '#000' }}></div>
      
      {hasCameras && (
        <div style={{ 
          position: 'absolute', 
          bottom: '20px', 
          left: '0', 
          right: '0', 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '20px',
          zIndex: 10
        }}>
          <button 
            onClick={toggleFlash}
            style={{
              backgroundColor: 'rgba(30, 41, 59, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50%',
              width: '56px',
              height: '56px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isFlashOn ? '#f59e0b' : 'white',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {isFlashOn ? <Zap size={24} /> : <ZapOff size={24} />}
          </button>
          
          <button 
            onClick={toggleCamera}
            style={{
              backgroundColor: 'rgba(30, 41, 59, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50%',
              width: '56px',
              height: '56px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <RefreshCcw size={24} />
          </button>
        </div>
      )}
    </div>
  );
}
