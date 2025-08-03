import React, { useState, useRef, useEffect } from "react";

interface HandUploadProps {
  onImageUpload: (file: File) => void;
}

const HandUpload: React.FC<HandUploadProps> = ({ onImageUpload }) => {
  const [showModal, setShowModal] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraStatus, setCameraStatus] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
      setShowModal(false);
    }
  };

  const startCamera = async () => {
    try {
      setCameraStatus("Checking camera support...");
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser');
      }

      setCameraStatus("Requesting camera permissions...");
      
      // Request camera permissions with better error handling
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      setCameraStatus("Camera connected successfully!");
      setStream(mediaStream);
      setShowCamera(true);
      
              if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.muted = true; // Required for autoplay
          
          // Ensure video plays
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch((error) => {
              console.error("Error playing video:", error);
              setCameraStatus("Error: Could not start video playback");
            });
          };
          
          // Handle video errors
          videoRef.current.onerror = (error) => {
            console.error("Video error:", error);
            setCameraStatus("Error: Video stream failed");
          };
        }
    } catch (error: any) {
      console.error('Error accessing camera:', error);
      
      let errorMessage = 'Unable to access camera. ';
      
      if (error.name === 'NotAllowedError') {
        errorMessage += 'Camera permission was denied. Please allow camera access and try again.';
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'No camera found on this device.';
      } else if (error.name === 'NotSupportedError') {
        errorMessage += 'Camera not supported in this browser.';
      } else if (error.name === 'NotReadableError') {
        errorMessage += 'Camera is already in use by another application.';
      } else {
        errorMessage += 'Please upload an image instead.';
      }
      
      setCameraStatus(`Error: ${errorMessage}`);
      alert(errorMessage);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
            onImageUpload(file);
            stopCamera();
            setShowModal(false);
          }
        }, 'image/jpeg', 0.8);
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    if (showCamera) {
      stopCamera();
    }
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Ensure video element is properly set up when camera view is shown
  useEffect(() => {
    if (showCamera && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.muted = true;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play().catch((error) => {
          console.error("Error playing video:", error);
          setCameraStatus("Error: Could not start video playback");
        });
      };
    }
  }, [showCamera, stream]);

  return (
    <div className="luxury-upload">
      <button 
        className="luxury-upload-label"
        onClick={() => setShowModal(true)}
      >
        <div className="flex flex-col items-center">
          <div className="text-4xl mb-2">📸</div>
          <div className="text-lg font-medium mb-1">Upload or Take Photo</div>
          <div className="text-sm text-gray-500">Click to open camera or upload image</div>
        </div>
      </button>

      {showModal && (
        <div className="camera-modal-overlay" onClick={closeModal}>
          <div className="camera-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="camera-modal-header">
              <h3 className="camera-modal-title">Choose Photo Source</h3>
              <button className="camera-modal-close" onClick={closeModal}>×</button>
            </div>
            
            {!showCamera ? (
              <div className="camera-modal-options">
                <button 
                  className="camera-option-button"
                  onClick={startCamera}
                >
                  <div className="camera-option-icon">📷</div>
                  <div className="camera-option-text">Take Photo with Camera</div>
                </button>
                
                <div className="camera-upload-section">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    id="hand-upload-modal"
                    className="hidden"
                  />
                  <label htmlFor="hand-upload-modal" className="camera-option-button">
                    <div className="camera-option-icon">📁</div>
                    <div className="camera-option-text">Upload from Gallery</div>
                  </label>
                </div>
              </div>
            ) : (
              <div className="camera-view">
                {cameraStatus && (
                  <div className="camera-status">
                    {cameraStatus}
                  </div>
                )}
                                 <video 
                   ref={videoRef} 
                   autoPlay 
                   playsInline
                   muted
                   className="camera-video"
                   style={{
                     width: '100%',
                     maxWidth: '100%',
                     height: 'auto',
                     border: '2px solid #ccc',
                     borderRadius: '8px',
                     backgroundColor: '#000',
                     objectFit: 'cover'
                   }}
                 />
                <canvas ref={canvasRef} className="hidden" />
                <div className="camera-controls">
                  <button 
                    className="camera-capture-button"
                    onClick={takePhoto}
                    disabled={!stream}
                  >
                    📸 Take Photo
                  </button>
                  <button 
                    className="camera-cancel-button"
                    onClick={stopCamera}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HandUpload;