import { useState, useEffect, useRef, useCallback, memo } from "react";
import * as tf from "@tensorflow/tfjs";

// Memoize component to prevent unnecessary rerenders
const HandGestureDetector = memo(
  ({ onGestureDetected, showDebugInfo = false, active = true }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const modelRef = useRef(null);
    const handsRef = useRef(null);
    const cameraRef = useRef(null);
    const activeRef = useRef(active);
    const [isLoading, setIsLoading] = useState(true);
    const [detectedGesture, setDetectedGesture] = useState(null);
    const [confidence, setConfidence] = useState(null);
    const isInitializedRef = useRef(false);
    const lastDetectionTimeRef = useRef(0);
    const noHandFrameCountRef = useRef(0); // Count frames with no hand
    const MAX_NO_HAND_FRAMES = 5; // Reset after this many frames without a hand
    const wasHandVisibleRef = useRef(false);

    // State untuk menyimpan dimensi canvas yang akan disesuaikan dengan video stream
    const [canvasDimensions, setCanvasDimensions] = useState({
      width: 640,
      height: 480,
    });

    // Update activeRef when active prop changes
    useEffect(() => {
      activeRef.current = active;
    }, [active]);

    // Gesture classes mapping
    const labelMap = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const CONFIDENCE_THRESHOLD = 0.7;
    const DETECTION_COOLDOWN = 1000; // 1 second cooldown between detections

    // Function untuk menentukan canvas dimensions berdasarkan video stream dimensions
    const calculateCanvasDimensions = useCallback((videoWidth, videoHeight) => {
      if (!videoWidth || !videoHeight) {
        return { width: 640, height: 480 }; // default landscape
      }

      const videoAspectRatio = videoWidth / videoHeight;

      if (videoAspectRatio < 1) {
        // Portrait video (tinggi > lebar) - untuk mobile portrait
        return { width: 480, height: 640 };
      } else {
        // Landscape video (lebar >= tinggi) - untuk desktop dan mobile landscape
        return { width: 640, height: 480 };
      }
    }, []);

    // Initialize once on mount
    useEffect(() => {
      if (isInitializedRef.current) return;

      let isMounted = true;
      console.log("Initializing HandGestureDetector");

      const loadResources = async () => {
        if (!isMounted) return;

        try {
          setIsLoading(true);

          // 1. Load TensorFlow model
          try {
            modelRef.current = await tf.loadGraphModel("/Model/model.json");
            console.log("✅ Model loaded successfully!");
          } catch (error) {
            console.error("❌ Failed to load model:", error);
          }

          // 2. Set up MediaPipe Hands (using CDN approach)
          const Hands = window.Hands;
          const Camera = window.Camera;

          if (!Hands || !Camera) {
            throw new Error(
              "MediaPipe libraries not loaded. Make sure to include the script tags."
            );
          }

          // === PERUBAHAN 3: UPDATE VIDEO ELEMENT INITIALIZATION ===
          // 3. Initialize video element dengan handler untuk metadata
          if (!videoRef.current) return;

          // Setup video dimensions update handler untuk mendeteksi dimensi video stream
          videoRef.current.addEventListener("loadedmetadata", () => {
            const { videoWidth, videoHeight } = videoRef.current;
            console.log(
              `Video stream dimensions: ${videoWidth}x${videoHeight}`
            );

            // Calculate new canvas dimensions berdasarkan video stream
            const newDimensions = calculateCanvasDimensions(
              videoWidth,
              videoHeight
            );
            console.log(
              `Setting canvas dimensions to: ${newDimensions.width}x${newDimensions.height}`
            );
            setCanvasDimensions(newDimensions);

            // Update canvas internal dimensions secara langsung
            if (canvasRef.current) {
              canvasRef.current.width = newDimensions.width;
              canvasRef.current.height = newDimensions.height;
              console.log(
                `Canvas internal dimensions updated: ${canvasRef.current.width}x${canvasRef.current.height}`
              );
            }
          });

          // Set initial video size (akan diupdate otomatis setelah metadata loaded)
          videoRef.current.width = 640;
          videoRef.current.height = 480;
          // === AKHIR PERUBAHAN 3 ===

          // 4. Initialize canvas dengan dimensi dari state
          if (!canvasRef.current) return;
          const ctx = canvasRef.current.getContext("2d");
          // Canvas dimensions akan diset ulang setelah video metadata loaded
          // Set default dimensions dari state dulu
          canvasRef.current.width = canvasDimensions.width;
          canvasRef.current.height = canvasDimensions.height;

          // 5. Initialize MediaPipe Hands
          handsRef.current = new Hands({
            locateFile: (file) =>
              `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
          });

          handsRef.current.setOptions({
            maxNumHands: 2,
            modelComplexity: 1,
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.5,
            smoothLandmarks: true,
          });

          // 6. Set up results handler
          handsRef.current.onResults((results) => {
            if (!canvasRef.current || !isMounted) return;

            // Clear canvas dengan dimensi yang benar
            ctx.clearRect(
              0,
              0,
              canvasRef.current.width,
              canvasRef.current.height
            );

            // Draw video ke canvas dengan proper mapping dari source ke destination
            // Source: video dimensions (videoWidth x videoHeight)
            // Destination: canvas dimensions (canvas.width x canvas.height)
            ctx.drawImage(
              videoRef.current,
              0,
              0,
              videoRef.current.videoWidth || canvasRef.current.width,
              videoRef.current.videoHeight || canvasRef.current.height, // source rectangle
              0,
              0,
              canvasRef.current.width,
              canvasRef.current.height // destination rectangle
            );

            // Check if hand is visible - simplified check for any landmarks
            const handVisible =
              results.multiHandLandmarks &&
              results.multiHandLandmarks.length > 0;

            // If hand was visible before but not now, immediately clear the gesture
            if (wasHandVisibleRef.current && !handVisible) {
              console.log("Hand disappeared, clearing detected gesture");
              setDetectedGesture(null);
              setConfidence(null);

              // Notify parent component that hand is no longer visible
              if (onGestureDetected && activeRef.current) {
                onGestureDetected(null, 0);
              }
            }

            // Update hand visibility state for next frame
            wasHandVisibleRef.current = handVisible;

            // If no hand is visible, exit early
            if (!handVisible) {
              return;
            }

            // Check if the full hand is visible for drawing and prediction
            const fullHandVisible = isFullHandVisible(
              results.multiHandLandmarks
            );

            // Draw hand landmarks if the full hand is visible
            if (fullHandVisible) {
              for (const landmarks of results.multiHandLandmarks) {
                drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
                  color: "#7F00FF",
                  lineWidth: 2,
                });
                drawLandmarks(ctx, landmarks, {
                  color: "#0000FF",
                  lineWidth: 1,
                  radius: 0,
                });
              }
            }

            // Process landmarks for prediction only if the full hand is visible
            if (fullHandVisible && modelRef.current) {
              const now = Date.now();

              // Only process if we're past the cooldown period
              if (now - lastDetectionTimeRef.current > DETECTION_COOLDOWN) {
                const inputTensor = processLandmarks(
                  results.multiHandLandmarks
                );

                if (inputTensor) {
                  try {
                    const output = modelRef.current.predict(inputTensor);
                    const predictions = output.arraySync()[0];

                    const maxPrediction = Math.max(...predictions);
                    const predictedClass = predictions.indexOf(maxPrediction);
                    const confidenceValue = maxPrediction;

                    if (maxPrediction > CONFIDENCE_THRESHOLD) {
                      const gesture = labelMap[predictedClass];

                      // Always update to ensure parent component gets latest confidence
                      setDetectedGesture(gesture);
                      setConfidence(confidenceValue);

                      // Call the callback function with the detected gesture
                      if (onGestureDetected && activeRef.current) {
                        lastDetectionTimeRef.current = now; // Update last detection time
                        onGestureDetected(gesture, confidenceValue);
                      }
                    } else {
                      // If confidence is too low, treat as no gesture
                      console.log(
                        "Confidence too low, clearing detected gesture"
                      );
                      setDetectedGesture(null);
                      setConfidence(null);
                      if (onGestureDetected && activeRef.current) {
                        onGestureDetected(null, 0);
                      }
                    }

                    // Clean up tensors
                    inputTensor.dispose();
                    tf.dispose(output);
                  } catch (error) {
                    console.error("Prediction error:", error);
                  }
                }
              }
            }
          });

          // 7. Start camera
          cameraRef.current = new Camera(videoRef.current, {
            onFrame: async () => {
              if (handsRef.current && isMounted) {
                try {
                  await handsRef.current.send({ image: videoRef.current });
                } catch (e) {
                  console.error("Error in camera frame processing:", e);
                }
              }
            },
            width: 640,
            height: 480,
          });

          await cameraRef.current.start();
          isInitializedRef.current = true;

          if (isMounted) {
            setIsLoading(false);
          }
        } catch (error) {
          console.error("Error initializing hand detection:", error);
          if (isMounted) {
            setIsLoading(false);
          }
        }
      };

      // Helper function to normalize landmarks
      function normalizeLandmarks(landmarks, wrist) {
        return landmarks.map((lm) => [
          lm.x - wrist.x,
          lm.y - wrist.y,
          lm.z - wrist.z,
        ]);
      }

      // Helper function to process landmarks
      function processLandmarks(landmarks) {
        let features = [];

        if (landmarks.length === 1) {
          // Fill left hand with 0 first
          const leftHand = Array(63).fill(0);
          features.push(...leftHand);

          // Continue with right hand
          const rightHand = normalizeLandmarks(landmarks[0], landmarks[0][0]);
          rightHand.forEach((coord) => features.push(...coord));
        } else if (landmarks.length === 2) {
          const sortedHands = landmarks.sort((a, b) => a[0].x - b[0].x);
          const leftHand = normalizeLandmarks(
            sortedHands[0],
            sortedHands[0][0]
          );
          const rightHand = normalizeLandmarks(
            sortedHands[1],
            sortedHands[1][0]
          );

          leftHand.forEach((coord) => features.push(...coord));
          rightHand.forEach((coord) => features.push(...coord));
        }

        // If feature length is not 126, fill all with 0
        if (features.length !== 126) {
          features = Array(126).fill(0);
        }

        return tf.tensor2d([features], [1, 126]);
      }

      // Helper function to draw connectors
      function drawConnectors(ctx, landmarks, connections, options) {
        const { color = "white", lineWidth = 1 } = options || {};
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;

        for (const connection of connections) {
          const [i, j] = connection;
          const from = landmarks[i];
          const to = landmarks[j];

          if (from && to) {
            ctx.beginPath();
            ctx.moveTo(from.x * ctx.canvas.width, from.y * ctx.canvas.height);
            ctx.lineTo(to.x * ctx.canvas.width, to.y * ctx.canvas.height);
            ctx.stroke();
          }
        }
      }

      // Helper function to draw landmarks
      function drawLandmarks(ctx, landmarks, options) {
        const { color = "red", lineWidth = 1, radius = 3 } = options || {};
        ctx.fillStyle = color;
        ctx.strokeStyle = "white";
        ctx.lineWidth = lineWidth;

        for (const landmark of landmarks) {
          ctx.beginPath();
          ctx.arc(
            landmark.x * ctx.canvas.width,
            landmark.y * ctx.canvas.height,
            radius,
            0,
            2 * Math.PI
          );
          ctx.fill();
          ctx.stroke();
        }
      }

      // Define hand connections
      const HAND_CONNECTIONS = [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4], // Thumb
        [0, 5],
        [5, 6],
        [6, 7],
        [7, 8], // Index finger
        [0, 9],
        [9, 10],
        [10, 11],
        [11, 12], // Middle finger
        [0, 13],
        [13, 14],
        [14, 15],
        [15, 16], // Ring finger
        [0, 17],
        [17, 18],
        [18, 19],
        [19, 20], // Pinky
        [0, 5],
        [5, 9],
        [9, 13],
        [13, 17], // Palm
      ];

      // Load resources when component mounts
      loadResources();

      // Clean up when component unmounts
      return () => {
        isMounted = false;

        if (cameraRef.current) {
          try {
            cameraRef.current.stop();
          } catch (e) {
            console.error("Error stopping camera:", e);
          }
        }

        // Clean up any tensors
        if (tf.getBackend()) {
          try {
            tf.disposeVariables();
          } catch (e) {
            console.error("Error disposing TensorFlow variables:", e);
          }
        }
      };
    }, []); // Empty dependency array - initialize only once

    // Helper function to check if the full hand is visible
    function isFullHandVisible(handLandmarks) {
      if (!handLandmarks || handLandmarks.length === 0) return false;

      // We need all landmarks to be present and visible
      for (const landmarks of handLandmarks) {
        // Check if we have all 21 landmarks for a complete hand
        if (landmarks.length !== 21) return false;

        // Check if all landmarks are within the visible frame
        // Using a stricter margin to ensure the full hand is visible
        const margin = 0.05;

        // Check if wrist and all fingertips are visible
        const keyPoints = [0, 4, 8, 12, 16, 20]; // wrist, thumb tip, and all finger tips

        for (const idx of keyPoints) {
          const landmark = landmarks[idx];
          if (!landmark) return false;

          if (
            landmark.x < margin ||
            landmark.x > 1 - margin ||
            landmark.y < margin ||
            landmark.y > 1 - margin ||
            landmark.z < -0.5 // Check depth as well
          ) {
            return false;
          }
        }

        // Additional check: make sure the hand is facing the camera
        // by checking if the palm landmarks are visible
        const palmLandmarks = [0, 5, 9, 13, 17]; // wrist and knuckles
        for (const idx of palmLandmarks) {
          if (!landmarks[idx]) return false;
        }
      }

      return true;
    }

    return (
      <div className="relative w-full h-full">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-purple-700 rounded-xl">
            <p className="text-white">Loading camera and model...</p>
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover rounded-xl"
          style={{ display: "none" }}
        />

        {/* Canvas dengan style yang diupdate untuk handle responsive dimensions */}
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full object-cover rounded-xl" // Ganti object-cover menjadi object-contain
          style={{
            transform: "scale(-1, 1)", // Mirror tetap untuk efek cermin
            objectFit: "cover",
          }}
        />
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison function to prevent unnecessary rerenders
    return (
      prevProps.active === nextProps.active &&
      prevProps.showDebugInfo === nextProps.showDebugInfo
    );
  }
);

export default HandGestureDetector;
