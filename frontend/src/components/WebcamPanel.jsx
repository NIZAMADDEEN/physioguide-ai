import { useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "../hooks/useSession";
import { processFrame } from "../services/sessionService";
import Button from "./common/Button";
import Card from "./common/Card";

export default function WebcamPanel({
  isActive,
  isPaused,
  reps,
  statusMsg,
  accuracy,
  exercise,
  isCalibrated,
  handleEndSession,
  cameraMode,
  startDemo,
  startLive,
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const offscreenCanvasRef = useRef(document.createElement("canvas"));
  const [hasWebcam, setHasWebcam] = useState(null);
  const [lastCVResult, setLastCVResult] = useState(null);
  const cvProcessingRef = useRef(false);

  const { handleFrameResult, activeSession } = useSession();

  // Track animation time so it can freeze on pause
  const animTimeRef = useRef(0);
  const lastFrameTimeRef = useRef(0);

  const currentVideoUrl = useMemo(() => {
    return exercise?.id + ".mp4";
  }, [exercise?.id]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const stopStream = () => {
      if (video.srcObject) {
        video.srcObject.getTracks().forEach((track) => track.stop());
        video.srcObject = null;
      }

      video.pause();
      video.removeAttribute("src");
      video.load();
    };

    const setupVideo = async () => {
      if (!isActive) {
        stopStream();
        setHasWebcam(null);
        return;
      }

      setHasWebcam(true);

      if (cameraMode === "webcam") {
        video.srcObject = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
      } else {
        video.src = currentVideoUrl;
      }

      if (!isPaused) {
        video.play().catch(console.warn);
      }
    };

    setupVideo();

    return stopStream;
  }, [isActive, cameraMode, currentVideoUrl, isPaused]);

  // Handle Play/Pause programmatic triggers coming from upper panels
  useEffect(() => {
    if (!videoRef.current || !isActive) return;

    if (isPaused) {
      videoRef.current.pause();
    } else {
      videoRef.current
        .play()
        .catch((err) => console.warn("[WebcamPanel] Play trigger error:", err));
    }
  }, [isPaused, isActive]);

  // ─── Frame Extraction & Processing Loop ─────────────────────────────────────
  useEffect(() => {
    if (!isActive || isPaused || hasWebcam === false) return;

    const interval = setInterval(async () => {
      if (cvProcessingRef.current) return;
      const video = videoRef.current;
      if (!video || video.readyState !== 4) return;

      try {
        cvProcessingRef.current = true;

        const canvas = offscreenCanvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
        const base64Str = dataUrl.split(",")[1];

        if (activeSession?.sessionId && exercise?.id) {
          const result = await processFrame(
            activeSession.sessionId,
            exercise.id,
            base64Str,
          );
          setLastCVResult(result);
          handleFrameResult(result);
        }
      } catch (err) {
        console.warn("CV processing error:", err);
      } finally {
        cvProcessingRef.current = false;
      }
    }, 150); // ~6.6 FPS

    return () => clearInterval(interval);
  }, [
    isActive,
    isPaused,
    hasWebcam,
    activeSession,
    exercise,
    handleFrameResult,
  ]);

  // ─── Skeletal Joint Animation & Rendering Loop ─────────────────────────────
  useEffect(() => {
    if (!isActive) return;

    let animId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Make canvas resolution independent
    canvas.width = 640;
    canvas.height = 480;

    lastFrameTimeRef.current = performance.now();

    const render = (now) => {
      const delta = now - lastFrameTimeRef.current;
      lastFrameTimeRef.current = now;

      // Accumulate time only if not paused
      if (!isPaused) {
        animTimeRef.current += delta;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Define standard styling color based on accuracy
      let statusColor = "#00f3ff"; // cyan (normal/idle)
      let glowColor = "rgba(0, 243, 255, 0.8)";
      if (isCalibrated) {
        if (accuracy >= 88) {
          statusColor = "#00e676"; // green (excellent)
          glowColor = "rgba(0, 230, 118, 0.8)";
        } else if (accuracy >= 75) {
          statusColor = "#ffb300"; // amber (caution)
          glowColor = "rgba(255, 179, 0, 0.8)";
        } else {
          statusColor = "#ff1744"; // red (correction needed)
          glowColor = "rgba(255, 23, 68, 0.8)";
        }
      }

      // Draw a subtle digital scanline overlay
      ctx.fillStyle = "rgba(0, 243, 255, 0.02)";
      for (let i = 0; i < canvas.height; i += 4) {
        ctx.fillRect(0, i, canvas.width, 1);
      }

      // ─── Calibration Guide Overlay ─────────────────────────────────────────
      if (!isCalibrated) {
        ctx.save();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 0.3;
        ctx.setLineDash([8, 12]);

        // Human silhouette guide bounding box
        ctx.beginPath();
        ctx.ellipse(320, 160, 50, 60, 0, 0, Math.PI * 2); // head
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(320, 220);
        ctx.lineTo(320, 320); // torso spine
        ctx.moveTo(270, 240);
        ctx.lineTo(370, 240); // shoulder line
        ctx.moveTo(280, 320);
        ctx.lineTo(360, 320); // hips line
        ctx.stroke();

        // Pulsing radar circles
        const pulse = 1 + Math.sin(now / 300) * 0.05;
        ctx.strokeStyle = "rgba(0, 243, 255, 0.4)";
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(320, 240, 140 * pulse, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = "rgba(0, 243, 255, 0.8)";
        ctx.font = "bold 16px Inter, system-ui";
        ctx.textAlign = "center";
        ctx.fillText("ALIGN BODY IN THE CENTER", 320, 410);
        ctx.fillStyle = "#ffffff";
        ctx.font = "12px Inter, system-ui";
        ctx.fillText("Please stand 6-8 feet away from the camera.", 320, 430);
        ctx.restore();
      }

      // ─── Calculate Joints Coordinates ─────────────────────────────────────
      let head,
        neck,
        lShoulder,
        rShoulder,
        lElbow,
        rElbow,
        lWrist,
        rWrist,
        lHip,
        rHip,
        lKnee,
        rKnee,
        lAnkle,
        rAnkle;
      let leftAngle = null;
      let rightAngle = null;
      let targetJointLabel = "Joint Align";

      const landmarks = lastCVResult?.landmarks;
      if (landmarks && lastCVResult.poseDetected) {
        const getPt = (lm) =>
          lm ? { x: lm.x * canvas.width, y: lm.y * canvas.height } : null;

        head = getPt(landmarks["NOSE"]);
        lShoulder = getPt(landmarks["LEFT_SHOULDER"]);
        rShoulder = getPt(landmarks["RIGHT_SHOULDER"]);
        if (lShoulder && rShoulder) {
          neck = {
            x: (lShoulder.x + rShoulder.x) / 2,
            y: (lShoulder.y + rShoulder.y) / 2,
          };
        }

        lElbow = getPt(landmarks["LEFT_ELBOW"]);
        rElbow = getPt(landmarks["RIGHT_ELBOW"]);
        lWrist = getPt(landmarks["LEFT_WRIST"]);
        rWrist = getPt(landmarks["RIGHT_WRIST"]);
        lHip = getPt(landmarks["LEFT_HIP"]);
        rHip = getPt(landmarks["RIGHT_HIP"]);
        lKnee = getPt(landmarks["LEFT_KNEE"]);
        rKnee = getPt(landmarks["RIGHT_KNEE"]);
        lAnkle = getPt(landmarks["LEFT_ANKLE"]);
        rAnkle = getPt(landmarks["RIGHT_ANKLE"]);

        const angles = lastCVResult?.angles || {};
        const exId = exercise?.id || "";
        if (exId.includes("squat") || exId.includes("flexion")) {
          leftAngle = angles["left_knee"]
            ? Math.round(angles["left_knee"])
            : null;
          rightAngle = angles["right_knee"]
            ? Math.round(angles["right_knee"])
            : null;
          targetJointLabel = "Knee Flexion";
        } else if (exId.includes("curl") || exId.includes("bicep")) {
          leftAngle = angles["left_elbow"]
            ? Math.round(angles["left_elbow"])
            : null;
          rightAngle = angles["right_elbow"]
            ? Math.round(angles["right_elbow"])
            : null;
          targetJointLabel = "Elbow Angle";
        } else if (
          exId.includes("press") ||
          exId.includes("shoulder") ||
          exId.includes("raise") ||
          exId.includes("abduction")
        ) {
          leftAngle = angles["left_shoulder"]
            ? Math.round(angles["left_shoulder"])
            : null;
          rightAngle = angles["right_shoulder"]
            ? Math.round(angles["right_shoulder"])
            : null;
          targetJointLabel = "Shoulder Angle";
        } else {
          const key = Object.keys(angles)[0];
          if (key) {
            leftAngle = Math.round(angles[key]);
            rightAngle = leftAngle;
            targetJointLabel = key.replace("_", " ").toUpperCase();
          }
        }
      } else {
        // Fallback/idle (when no pose is detected)
        head = { x: 320, y: 110 };
        neck = { x: 320, y: 160 };
        lShoulder = { x: 260, y: 170 };
        rShoulder = { x: 380, y: 170 };
        lElbow = { x: 260, y: 250 };
        rElbow = { x: 380, y: 250 };
        lWrist = { x: 260, y: 320 };
        rWrist = { x: 380, y: 320 };
        lHip = { x: 280, y: 300 };
        rHip = { x: 360, y: 300 };
        lKnee = { x: 280, y: 400 };
        rKnee = { x: 360, y: 400 };
        lAnkle = { x: 280, y: 460 };
        rAnkle = { x: 360, y: 460 };
      }

      // ─── Draw Skeleton Lines (Bones) ──────────────────────────────────────
      ctx.save();
      ctx.strokeStyle = statusColor;
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 12;
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const drawLine = (pt1, pt2) => {
        if (pt1 && pt2) {
          ctx.beginPath();
          ctx.moveTo(pt1.x, pt1.y);
          ctx.lineTo(pt2.x, pt2.y);
          ctx.stroke();
        }
      };

      if (head) {
        ctx.beginPath();
        ctx.arc(head.x, head.y, 25, 0, Math.PI * 2);
        ctx.stroke();
      }

      drawLine(head, neck);
      drawLine(neck, lShoulder);
      drawLine(neck, rShoulder);

      drawLine(lShoulder, lHip);
      drawLine(rShoulder, rHip);
      drawLine(lHip, rHip);

      drawLine(lShoulder, lElbow);
      drawLine(lElbow, lWrist);
      drawLine(rShoulder, rElbow);
      drawLine(rElbow, rWrist);

      drawLine(lHip, lKnee);
      drawLine(lKnee, lAnkle);
      drawLine(rHip, rKnee);
      drawLine(rKnee, rAnkle);

      ctx.restore();

      // ─── Draw Joint Nodes (Landmarks) ─────────────────────────────────────
      const joints = [
        head,
        neck,
        lShoulder,
        rShoulder,
        lElbow,
        rElbow,
        lWrist,
        rWrist,
        lHip,
        rHip,
        lKnee,
        rKnee,
        lAnkle,
        rAnkle,
      ];

      joints.forEach((joint) => {
        if (joint) {
          ctx.save();
          ctx.fillStyle = "#ffffff";
          ctx.strokeStyle = statusColor;
          ctx.lineWidth = 2;
          ctx.shadowColor = glowColor;
          ctx.shadowBlur = 8;

          ctx.beginPath();
          ctx.arc(joint.x, joint.y, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        }
      });

      // ─── Draw Angle Readouts and Arcs ──────────────────────────────────────
      if (leftAngle !== null && isCalibrated) {
        ctx.save();
        ctx.fillStyle = statusColor;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.lineWidth = 0.3;

        const exIdStr = exercise?.id || "";

        // Draw Left joint indicator box & text
        let indicatorX = 0;
        let indicatorY = 0;

        if (exIdStr.includes("squat")) {
          indicatorX = lKnee.x - 70;
          indicatorY = lKnee.y;
          ctx.beginPath();
          ctx.arc(lKnee.x, lKnee.y, 25, 0.7 * Math.PI, 1.3 * Math.PI);
          ctx.stroke();
        } else if (exIdStr.includes("press")) {
          indicatorX = lElbow.x - 70;
          indicatorY = lElbow.y;
          ctx.beginPath();
          ctx.arc(lElbow.x, lElbow.y, 22, 0.3 * Math.PI, 0.9 * Math.PI);
          ctx.stroke();
        } else {
          indicatorX = lElbow.x - 70;
          indicatorY = lElbow.y;
          ctx.beginPath();
          ctx.arc(lElbow.x, lElbow.y, 22, 0.8 * Math.PI, 1.4 * Math.PI);
          ctx.stroke();
        }

        // Draw overlay box
        ctx.fillStyle = "rgba(11, 28, 48, 0.85)";
        ctx.strokeStyle = statusColor;
        ctx.lineWidth = 0.3;
        ctx.beginPath();
        ctx.roundRect(indicatorX - 10, indicatorY - 22, 68, 32, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 11px Courier New, monospace";
        ctx.fillText(`${leftAngle}°`, indicatorX - 4, indicatorY - 8);
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.font = "7px Inter, sans-serif";
        ctx.fillText(
          targetJointLabel.toUpperCase(),
          indicatorX - 4,
          indicatorY + 4,
        );

        // Draw Right joint indicator box
        let indicatorRX = 0;
        let indicatorRY = 0;

        if (exIdStr.includes("squat")) {
          indicatorRX = rKnee.x + 12;
          indicatorRY = rKnee.y;
          ctx.beginPath();
          ctx.arc(rKnee.x, rKnee.y, 25, 1.7 * Math.PI, 0.3 * Math.PI);
          ctx.stroke();
        } else if (exIdStr.includes("press")) {
          indicatorRX = rElbow.x + 12;
          indicatorRY = rElbow.y;
          ctx.beginPath();
          ctx.arc(rElbow.x, rElbow.y, 22, 0.1 * Math.PI, 0.7 * Math.PI);
          ctx.stroke();
        } else {
          indicatorRX = rElbow.x + 12;
          indicatorRY = rElbow.y;
          ctx.beginPath();
          ctx.arc(rElbow.x, rElbow.y, 22, 1.6 * Math.PI, 0.2 * Math.PI);
          ctx.stroke();
        }

        // Draw overlay box
        ctx.fillStyle = "rgba(11, 28, 48, 0.85)";
        ctx.strokeStyle = statusColor;
        ctx.lineWidth = 0.3;
        ctx.beginPath();
        ctx.roundRect(indicatorRX, indicatorRY - 22, 68, 32, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 11px Courier New, monospace";
        ctx.fillText(`${rightAngle}°`, indicatorRX + 6, indicatorRY - 8);
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.font = "7px Inter, sans-serif";
        ctx.fillText(
          targetJointLabel.toUpperCase(),
          indicatorRX + 6,
          indicatorRY + 4,
        );

        ctx.restore();
      }

      // ─── Paused frosted layout ─────────────────────────────────────────────
      if (isPaused) {
        ctx.fillStyle = "rgba(11, 28, 48, 0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 24px Inter, system-ui";
        ctx.textAlign = "center";
        ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2);

        ctx.font = "14px Inter, system-ui";
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.fillText(
          "Click Resume to continue tracking.",
          canvas.width / 2,
          canvas.height / 2 + 30,
        );
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isActive, isPaused, accuracy, exercise, isCalibrated, lastCVResult]);

  // ─── Video End Detection ─────────────────────────────────────────────────────
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !isActive) return;

    const handleVideoEnded = () => {
      if (handleEndSession) {
        handleEndSession();
      }
    };

    if (cameraMode === "video") {
      videoElement.addEventListener("ended", handleVideoEnded);
    }

    return () => {
      if (cameraMode === "video") {
        videoElement.removeEventListener("ended", handleVideoEnded);
      }
    };
  }, [isActive, handleEndSession]);

  return (
    <Card
      padding="0"
      className="flex-grow-1 overflow-hidden position-relative bg-inverse-surface d-flex flex-column align-items-center justify-content-center border-0 shadow-lg"
      style={{
        minHeight: "920px",
        borderRadius: "var(--radius-xl)",
        background: "#0a121d",
      }}
    >
      {/* Outer Glowing Neon Frame */}
      <div
        className="position-absolute inset-0 border"
        style={{
          borderRadius: "var(--radius-xl)",
          borderWidth: "2px",
          borderColor: isActive
            ? isPaused
              ? "rgba(255, 179, 0, 0.3)"
              : accuracy > 88
                ? "rgba(0, 230, 118, 0.3)"
                : "rgba(0, 243, 255, 0.3)"
            : "rgba(255, 255, 255, 0.05)",
          boxShadow:
            isActive && !isPaused
              ? accuracy > 88
                ? "0 0 20px rgba(0, 230, 118, 0.15) inset"
                : "0 0 20px rgba(0, 243, 255, 0.15) inset"
              : "none",
          pointerEvents: "none",
          zIndex: 5,
        }}
      />

      {isActive ? (
        <div
          className="position-relative w-100 h-full d-flex align-items-center justify-content-center overflow-hidden"
          style={{ minHeight: "920px" }}
        >
          {/* Webcam Video Layer */}
          {hasWebcam !== false ? (
            <video
              ref={videoRef}
              src={currentVideoUrl}
              autoPlay
              muted
              playsInline
              crossOrigin="anonymous"
              className="position-absolute w-100 h-full"
              style={{
                objectFit: "cover",
                transform: "scaleX(-1)", // Mirror webcam for normal user intuition
                opacity: 0.75,
              }}
            />
          ) : (
            // Futuristic Grid Backdrop (fallback if webcam permission denied or missing)
            <div
              className="position-absolute inset-0 w-100 h-100"
              style={{
                background:
                  "radial-gradient(circle at center, #112235 0%, #060b13 100%)",
              }}
            >
              {/* Animated scanning lines and grid nodes */}
              <div
                className="w-100 h-100 position-absolute opacity-10"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(0, 243, 255, 0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0, 243, 255, 0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: "30px 30px",
                  backgroundPosition: "center",
                }}
              />
            </div>
          )}

          {/* Skeletal Pose Coordinate Overlay Canvas */}
          <canvas
            ref={canvasRef}
            className="position-absolute w-100 h-100"
            style={{
              zIndex: 3,
              pointerEvents: "none",
              transform: hasWebcam !== false ? "scaleX(-1)" : "none", // Mirror coordinate drawing to match mirrored video
            }}
          />

          {/* Top Floating Badges */}
          <div
            className="position-absolute top-0 start-0 w-100 p-4 d-flex justify-content-between align-items-start"
            style={{ zIndex: 4 }}
          >
            <div
              className="backdrop-blur rounded-pill px-3 py-1.5 d-flex align-items-center gap-2 border"
              style={{
                background: "rgba(11, 28, 48, 0.8)",
                borderColor: isPaused
                  ? "rgba(255, 179, 0, 0.4)"
                  : "rgba(0, 243, 255, 0.4)",
              }}
            >
              <div
                className="ai-pulse-dot"
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: isPaused ? "#ffb300" : "#00f3ff",
                  boxShadow: isPaused ? "0 0 10px #ffb300" : "0 0 10px #00f3ff",
                }}
              />
              <span
                className="text-label-md font-bold"
                style={{
                  color: isPaused ? "#ffb300" : "#00f3ff",
                  fontSize: "12px",
                  letterSpacing: "0.5px",
                }}
              >
                {isPaused
                  ? "SESSION PAUSED"
                  : isCalibrated
                    ? "AI ACCURACY METRICS ACTIVE"
                    : "CALIBRATING POSE"}
              </span>
            </div>

            {hasWebcam === false && (
              <div
                className="backdrop-blur rounded-pill px-3 py-1.5 d-flex align-items-center gap-2 border"
                style={{
                  background: "rgba(255, 23, 68, 0.15)",
                  borderColor: "rgba(255, 23, 68, 0.4)",
                }}
              >
                <span className="material-symbols-outlined text-danger text-label-md">
                  videocam_off
                </span>
                <span
                  className="text-danger font-bold"
                  style={{ fontSize: "11px" }}
                >
                  Webcam Simulated Overlay
                </span>
              </div>
            )}
          </div>

          {/* Bottom Floating Posture Status Message */}
          <div
            className="position-absolute bottom-0 start-50 translate-middle-x pb-4 w-100 px-4"
            style={{ zIndex: 4, maxWidth: "440px" }}
          >
            <div
              className="backdrop-blur rounded-4 p-3 shadow-lg border text-center"
              style={{
                background: "rgba(11, 28, 48, 0.85)",
                borderColor: isPaused
                  ? "rgba(255, 179, 0, 0.3)"
                  : accuracy >= 88
                    ? "rgba(0, 230, 118, 0.3)"
                    : accuracy >= 75
                      ? "rgba(255, 179, 0, 0.3)"
                      : "rgba(255, 23, 68, 0.3)",
              }}
            >
              <div
                className="font-bold text-headline-sm mb-1"
                style={{
                  color: isPaused
                    ? "#ffb300"
                    : accuracy >= 88
                      ? "#00e676"
                      : accuracy >= 75
                        ? "#ffb300"
                        : "#ff1744",
                  fontSize: "16px",
                }}
              >
                {statusMsg}
              </div>
              {isCalibrated && !isPaused && (
                <div
                  className="progress bg-dark-subtle mx-auto"
                  style={{ height: "5px", maxWidth: "180px" }}
                >
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{
                      width: `${accuracy}%`,
                      transition: "width 0.4s ease",
                      backgroundColor:
                        accuracy >= 88
                          ? "#00e676"
                          : accuracy >= 75
                            ? "#ffb300"
                            : "#ff1744",
                    }}
                    aria-valuenow={accuracy}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Start Overlay (Camera Offline)
        <div className="text-center p-5 z-1" style={{ maxWidth: "420px" }}>
          <div
            className="d-inline-flex align-items-center justify-content-center mb-4 rounded-circle"
            style={{
              width: "80px",
              height: "80px",
              background: "rgba(0, 78, 159, 0.1)",
              border: "2px stroke rgba(0, 78, 159, 0.2)",
            }}
          >
            <span
              className="material-symbols-outlined text-primary"
              style={{ fontSize: "42px" }}
            >
              movie
            </span>
          </div>
          <h3 className="font-bold mb-2" style={{ fontSize: "22px" }}>
            Ready to Begin?
          </h3>
          <p
            className="text-on-surface-variant mb-4"
            style={{ fontSize: "14px", lineHeight: "1.5" }}
          >
            Choose Demo Video to play the sample exercise, or Live Webcam to
            perform the exercise using your own camera.
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              size="lg"
              variant="primary"
              icon="movie"
              onClick={startDemo}
              className="px-4 whitespace-nowrap"
            >
              Demo Video
            </Button>

            <Button
              size="lg"
              variant="primary"
              icon="videocam"
              onClick={startLive}
              className="px-4  whitespace-nowrap"
            >
              Live Webcam
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
