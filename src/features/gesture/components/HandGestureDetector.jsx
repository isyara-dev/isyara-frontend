import { useState, useEffect, useRef, useCallback, memo } from "react";
import * as tf from "@tensorflow/tfjs";

// Memoize component to prevent unnecessary rerenders
const HandGestureDetector = memo(
  ({ onGestureDetected, showDebugInfo = false, active = true }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const modelRef = useRef(null);
    const handsRef = useRef(null);
    const cameraRef = useRef(null);
    const activeRef = useRef(active);
    const [isLoading, setIsLoading] = useState(true);
    const [detectedGesture, setDetectedGesture] = useState(null);
    const [confidence, setConfidence] = useState(null);
    const [debugInfo, setDebugInfo] = useState({});

    // Sync states - FIXED: Add more granular control
    const canvasSyncedRef = useRef(false);
    const videoMetadataReadyRef = useRef(false);
    const syncAttemptCountRef = useRef(0);
    const maxSyncAttempts = 10;
    const initialSyncDoneRef = useRef(false); // NEW: Prevent unnecessary re-syncs

    const isInitializedRef = useRef(false);
    const lastDetectionTimeRef = useRef(0);
    const wasHandVisibleRef = useRef(false);

    // Update activeRef when active prop changes
    useEffect(() => {
      activeRef.current = active;
    }, [active]);

    // Gesture classes mapping
    const labelMap = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const CONFIDENCE_THRESHOLD = 0.7;
    const DETECTION_COOLDOWN = 1000;

    // FIXED: Only sync once initially, then only on container resize
    const syncCanvasWithVideoStream = useCallback(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const container = containerRef.current;

      if (!video || !canvas || !container) {
        console.warn("syncCanvasWithVideoStream: Missing refs");
        return false;
      }

      // FIXED: If initial sync is done and canvas is already synced, don't re-sync
      if (initialSyncDoneRef.current && canvasSyncedRef.current) {
        return true;
      }

      // Check if we've exceeded max attempts
      if (syncAttemptCountRef.current >= maxSyncAttempts) {
        console.warn("Max sync attempts reached, using fallback");
        return useFallbackCanvasSize();
      }

      syncAttemptCountRef.current++;

      // Get actual video stream dimensions
      const actualVideoWidth = video.videoWidth;
      const actualVideoHeight = video.videoHeight;

      // Debug info update
      const currentDebugInfo = {
        attempt: syncAttemptCountRef.current,
        videoReady: video.readyState,
        videoWidth: actualVideoWidth,
        videoHeight: actualVideoHeight,
        containerWidth: container.clientWidth,
        containerHeight: container.clientHeight,
      };

      if (showDebugInfo) {
        setDebugInfo(currentDebugInfo);
      }

      // Check if video metadata is available
      if (
        !actualVideoWidth ||
        !actualVideoHeight ||
        actualVideoWidth === 0 ||
        actualVideoHeight === 0
      ) {
        console.warn(
          `Video metadata not ready (attempt ${syncAttemptCountRef.current}):`,
          {
            width: actualVideoWidth,
            height: actualVideoHeight,
            readyState: video.readyState,
          }
        );

        // Retry after a delay if video is loading
        if (
          video.readyState < 2 &&
          syncAttemptCountRef.current < maxSyncAttempts
        ) {
          setTimeout(() => {
            syncCanvasWithVideoStream();
          }, 100);
        } else {
          // Use fallback if video not ready after multiple attempts
          return useFallbackCanvasSize();
        }
        return false;
      }

      // Canvas maintains video aspect ratio - CSS handles cropping
      const videoAspectRatio = actualVideoWidth / actualVideoHeight;

      // Set canvas to maintain video aspect ratio for accurate coordinates
      const baseCanvasWidth = Math.max(actualVideoWidth, 640);
      const baseCanvasHeight = baseCanvasWidth / videoAspectRatio;

      // Ensure minimum dimensions for model processing
      const minWidth = 320;
      const minHeight = 240;

      let canvasWidth = baseCanvasWidth;
      let canvasHeight = baseCanvasHeight;

      if (canvasWidth < minWidth || canvasHeight < minHeight) {
        console.warn("Calculated canvas size too small, adjusting");
        const scale = Math.max(
          minWidth / canvasWidth,
          minHeight / canvasHeight
        );
        canvasWidth *= scale;
        canvasHeight *= scale;
      }

      // Final safety check
      if (
        canvasWidth <= 0 ||
        canvasHeight <= 0 ||
        !isFinite(canvasWidth) ||
        !isFinite(canvasHeight)
      ) {
        console.error("Invalid canvas dimensions calculated:", {
          canvasWidth,
          canvasHeight,
        });
        return useFallbackCanvasSize();
      }

      // Apply calculated dimensions (maintains video aspect ratio)
      canvas.width = Math.round(canvasWidth);
      canvas.height = Math.round(canvasHeight);

      canvasSyncedRef.current = true;
      videoMetadataReadyRef.current = true;
      initialSyncDoneRef.current = true; // FIXED: Mark initial sync as done

      console.log("✅ Canvas-Video sync successful:", {
        videoSize: `${actualVideoWidth}x${actualVideoHeight}`,
        videoAspectRatio: videoAspectRatio.toFixed(3),
        containerSize: `${container.clientWidth}x${container.clientHeight}`,
        canvasInternalSize: `${canvas.width}x${canvas.height}`,
        attempt: syncAttemptCountRef.current,
      });

      if (showDebugInfo) {
        setDebugInfo((prev) => ({
          ...prev,
          synced: true,
          videoAspectRatio: videoAspectRatio.toFixed(3),
          canvasWidth: canvas.width,
          canvasHeight: canvas.height,
          cssMode: true,
        }));
      }

      return true;
    }, [showDebugInfo]);

    // Fallback function for when video metadata fails
    const useFallbackCanvasSize = useCallback(() => {
      const canvas = canvasRef.current;
      const container = containerRef.current;

      if (!canvas || !container) return false;

      console.warn("Using fallback canvas sizing");

      // Use standard video dimensions as fallback
      canvas.width = 640;
      canvas.height = 480;

      canvasSyncedRef.current = true;
      initialSyncDoneRef.current = true; // FIXED: Mark as done

      if (showDebugInfo) {
        setDebugInfo((prev) => ({
          ...prev,
          fallback: true,
          canvasWidth: canvas.width,
          canvasHeight: canvas.height,
          cssMode: true,
        }));
      }

      return true;
    }, [showDebugInfo]);

    // FIXED: Only handle container resize, not every frame
    useEffect(() => {
      if (!containerRef.current) return;

      const resizeObserver = new ResizeObserver(() => {
        // FIXED: Only re-sync on significant size changes
        if (videoMetadataReadyRef.current && initialSyncDoneRef.current) {
          console.log("Container resized, re-syncing canvas");
          canvasSyncedRef.current = false;
          syncAttemptCountRef.current = 0;
          syncCanvasWithVideoStream();
        }
      });

      resizeObserver.observe(containerRef.current);

      // Handle orientation change
      const handleOrientationChange = () => {
        if (videoMetadataReadyRef.current && initialSyncDoneRef.current) {
          setTimeout(() => {
            console.log("Orientation changed, re-syncing canvas");
            canvasSyncedRef.current = false;
            syncAttemptCountRef.current = 0;
            syncCanvasWithVideoStream();
          }, 100);
        }
      };

      window.addEventListener("orientationchange", handleOrientationChange);
      window.addEventListener("resize", handleOrientationChange);

      return () => {
        resizeObserver.disconnect();
        window.removeEventListener(
          "orientationchange",
          handleOrientationChange
        );
        window.removeEventListener("resize", handleOrientationChange);
      };
    }, [syncCanvasWithVideoStream]);

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

          // 2. Set up MediaPipe Hands
          const Hands = window.Hands;
          const Camera = window.Camera;

          if (!Hands || !Camera) {
            throw new Error(
              "MediaPipe libraries not loaded. Make sure to include the script tags."
            );
          }

          // 3. Initialize video element with event listeners
          if (!videoRef.current) return;

          const video = videoRef.current;
          video.width = 640;
          video.height = 480;

          // FIXED: Only sync once when metadata loads, not repeatedly
          video.addEventListener("loadedmetadata", () => {
            console.log("📹 Video metadata loaded");
            videoMetadataReadyRef.current = true;
            if (!initialSyncDoneRef.current) {
              syncCanvasWithVideoStream();
            }
          });

          video.addEventListener("canplay", () => {
            console.log("📹 Video can play");
            if (!initialSyncDoneRef.current && !canvasSyncedRef.current) {
              syncCanvasWithVideoStream();
            }
          });

          // 4. Initialize canvas
          if (!canvasRef.current) return;
          const ctx = canvasRef.current.getContext("2d");

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

            const canvas = canvasRef.current;
            const video = videoRef.current;

            // FIXED: Only skip frame if initial sync isn't done yet
            if (!initialSyncDoneRef.current || !canvasSyncedRef.current) {
              // Try to sync only if not done yet
              if (!initialSyncDoneRef.current && video.readyState >= 2) {
                syncCanvasWithVideoStream();
              }
              return;
            }

            // Clear canvas and draw video frame
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Check if hand is visible
            const handVisible =
              results.multiHandLandmarks &&
              results.multiHandLandmarks.length > 0;

            // If hand was visible before but not now, immediately clear the gesture
            if (wasHandVisibleRef.current && !handVisible) {
              console.log("Hand disappeared, clearing detected gesture");
              setDetectedGesture(null);
              setConfidence(null);

              if (onGestureDetected && activeRef.current) {
                onGestureDetected(null, 0);
              }
            }

            // Update hand visibility state for next frame
            wasHandVisibleRef.current = handVisible;

            // If no hand is visible, exit early
            if (!handVisible) return;

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

            // Process landmarks for prediction
            if (fullHandVisible && modelRef.current) {
              const now = Date.now();

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

                      setDetectedGesture(gesture);
                      setConfidence(confidenceValue);

                      if (onGestureDetected && activeRef.current) {
                        lastDetectionTimeRef.current = now;
                        onGestureDetected(gesture, confidenceValue);
                      }
                    } else {
                      setDetectedGesture(null);
                      setConfidence(null);
                      if (onGestureDetected && activeRef.current) {
                        onGestureDetected(null, 0);
                      }
                    }

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
              // FIXED: Only try to sync on first few frames if not done yet
              if (!initialSyncDoneRef.current && video.readyState >= 2) {
                syncCanvasWithVideoStream();
              }

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

      // Helper functions
      function normalizeLandmarks(landmarks, wrist) {
        return landmarks.map((lm) => [
          lm.x - wrist.x,
          lm.y - wrist.y,
          lm.z - wrist.z,
        ]);
      }

      function processLandmarks(landmarks) {
        let features = [];

        if (landmarks.length === 1) {
          const leftHand = Array(63).fill(0);
          features.push(...leftHand);

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

        if (features.length !== 126) {
          features = Array(126).fill(0);
        }

        return tf.tensor2d([features], [1, 126]);
      }

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

      loadResources();

      return () => {
        console.log("HandGestureDetector: UNMOUNTING! Shutting down camera.");
        isMounted = false;

        if (cameraRef.current) {
          try {
            cameraRef.current.stop();
          } catch (e) {
            console.error("Error stopping camera:", e);
          }
        }

        if (tf.getBackend()) {
          try {
            tf.disposeVariables();
          } catch (e) {
            console.error("Error disposing TensorFlow variables:", e);
          }
        }
      };
    }, [syncCanvasWithVideoStream, useFallbackCanvasSize]);

    function isFullHandVisible(handLandmarks) {
      if (!handLandmarks || handLandmarks.length === 0) return false;

      for (const landmarks of handLandmarks) {
        if (landmarks.length !== 21) return false;

        const margin = 0.05;
        const keyPoints = [0, 4, 8, 12, 16, 20];

        for (const idx of keyPoints) {
          const landmark = landmarks[idx];
          if (!landmark) return false;

          if (
            landmark.x < margin ||
            landmark.x > 1 - margin ||
            landmark.y < margin ||
            landmark.y > 1 - margin ||
            landmark.z < -0.5
          ) {
            return false;
          }
        }

        const palmLandmarks = [0, 5, 9, 13, 17];
        for (const idx of palmLandmarks) {
          if (!landmarks[idx]) return false;
        }
      }

      return true;
    }

    return (
      <div ref={containerRef} className="canvas-container">
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

        <canvas ref={canvasRef} className="responsive-canvas" />

        {/* Add required CSS styles */}
        <style jsx>{`
          .canvas-container {
            position: relative;
            width: 100%;
            height: 100%;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 0.75rem;
            background: transparent;
          }

          .responsive-canvas {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transform: scale(-1, 1);
            border-radius: 0.75rem;
          }
        `}</style>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.active === nextProps.active &&
      prevProps.showDebugInfo === nextProps.showDebugInfo
    );
  }
);

export default HandGestureDetector;
