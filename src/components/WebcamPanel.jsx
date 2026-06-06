import { useState, useEffect, useRef } from 'react';
import Card from './common/Card';
import Button from './common/Button';

export default function WebcamPanel({
  isActive,
  isPaused,
  onStart,
  reps,
  statusMsg,
  accuracy,
  exercise,
  isCalibrated,
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [hasWebcam, setHasWebcam] = useState(null);
  const [stream, setStream] = useState(null);
  
  // Track animation time so it can freeze on pause
  const animTimeRef = useRef(0);
  const lastFrameTimeRef = useRef(0);

  // ─── Webcam Stream Management ──────────────────────────────────────────────
  useEffect(() => {
    let activeStream = null;

    if (isActive) {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user',
          },
        })
        .then((s) => {
          setHasWebcam(true);
          activeStream = s;
          setStream(s);
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          console.warn('[WebcamPanel] MediaDevices getUserMedia failed:', err);
          setHasWebcam(false);
        });
    } else {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
      setHasWebcam(null);
    }

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isActive]);

  // ─── Skeletal Joint Animation & Rendering Loop ─────────────────────────────
  useEffect(() => {
    if (!isActive) return;

    let animId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

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
      let statusColor = '#00f3ff'; // cyan (normal/idle)
      let glowColor = 'rgba(0, 243, 255, 0.8)';
      if (isCalibrated) {
        if (accuracy >= 88) {
          statusColor = '#00e676'; // green (excellent)
          glowColor = 'rgba(0, 230, 118, 0.8)';
        } else if (accuracy >= 75) {
          statusColor = '#ffb300'; // amber (caution)
          glowColor = 'rgba(255, 179, 0, 0.8)';
        } else {
          statusColor = '#ff1744'; // red (correction needed)
          glowColor = 'rgba(255, 23, 68, 0.8)';
        }
      }

      // Draw a subtle digital scanline overlay
      ctx.fillStyle = 'rgba(0, 243, 255, 0.02)';
      for (let i = 0; i < canvas.height; i += 4) {
        ctx.fillRect(0, i, canvas.width, 1);
      }

      // ─── Calibration Guide Overlay ─────────────────────────────────────────
      if (!isCalibrated) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 2;
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
        ctx.strokeStyle = 'rgba(0, 243, 255, 0.4)';
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(320, 240, 140 * pulse, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = 'rgba(0, 243, 255, 0.8)';
        ctx.font = 'bold 16px Inter, system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('ALIGN BODY IN THE CENTER', 320, 410);
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Inter, system-ui';
        ctx.fillText('Please stand 6-8 feet away from the camera.', 320, 430);
        ctx.restore();
      }

      // ─── Calculate Joints Coordinates ─────────────────────────────────────
      // Let's create an animated model of joints
      const t = (animTimeRef.current % 4500) / 4500; // 0 to 1 cycle
      const phase = t < 0.5 ? t * 2 : (1 - t) * 2; // Triangle wave 0 -> 1 -> 0

      // Base skeletal coordinates
      let head = { x: 320, y: 110 };
      let neck = { x: 320, y: 160 };
      let lShoulder = { x: 260, y: 170 };
      let rShoulder = { x: 380, y: 170 };
      let lHip = { x: 280, y: 300 };
      let rHip = { x: 360, y: 300 };

      let lElbow = { x: 220, y: 230 };
      let rElbow = { x: 420, y: 230 };
      let lWrist = { x: 210, y: 300 };
      let rWrist = { x: 430, y: 300 };

      let lKnee = { x: 280, y: 370 };
      let rKnee = { x: 360, y: 370 };
      let lAnkle = { x: 280, y: 440 };
      let rAnkle = { x: 360, y: 440 };

      let leftAngle = null;
      let rightAngle = null;
      let targetJointLabel = '';

      const exName = exercise?.name || '';
      
      if (exName.toLowerCase().includes('squat')) {
        // Squat: Hips go down, knees bend outwards, ankles fixed
        targetJointLabel = 'Knee Flexion';
        const hipDrop = phase * 45;
        const kneeOut = phase * 20;

        lHip.y += hipDrop;
        rHip.y += hipDrop;
        lHip.x -= kneeOut * 0.3;
        rHip.x += kneeOut * 0.3;

        lKnee.y += hipDrop * 0.4;
        rKnee.y += hipDrop * 0.4;
        lKnee.x -= kneeOut;
        rKnee.x += kneeOut;

        // Neck & Head follow hips slightly
        neck.y += hipDrop * 0.7;
        head.y += hipDrop * 0.7;
        lShoulder.y += hipDrop * 0.7;
        rShoulder.y += hipDrop * 0.7;
        lElbow.y += hipDrop * 0.7;
        rElbow.y += hipDrop * 0.7;
        lWrist.y += hipDrop * 0.7;
        rWrist.y += hipDrop * 0.7;

        // Angle goes from ~170 deg to ~92 deg
        leftAngle = Math.round(175 - phase * 83);
        rightAngle = leftAngle;
      } 
      else if (exName.toLowerCase().includes('curl') || exName.toLowerCase().includes('bicep')) {
        // Bicep Curl: Elbow bends, hand wrist moves up towards shoulder
        targetJointLabel = 'Elbow Angle';
        
        // Left arm curls
        lElbow = { x: 230, y: 240 };
        const leftCurlY = phase * 90;
        const leftCurlX = phase * 25;
        lWrist.x = lElbow.x - 10 + leftCurlX;
        lWrist.y = lElbow.y + 60 - leftCurlY;

        // Right arm curls
        rElbow = { x: 410, y: 240 };
        const rightCurlY = phase * 90;
        const rightCurlX = phase * 25;
        rWrist.x = rElbow.x + 10 - rightCurlX;
        rWrist.y = rElbow.y + 60 - rightCurlY;

        // Angle goes from 165 down to 50
        leftAngle = Math.round(165 - phase * 115);
        rightAngle = leftAngle;
      } 
      else if (exName.toLowerCase().includes('press') || exName.toLowerCase().includes('shoulder')) {
        // Shoulder Press: Elbows extend outwards & upwards, hands push skyward
        targetJointLabel = 'Shoulder Extension';
        
        // Start position: elbow bent at side, hand at shoulder height
        // End position: hand fully straight overhead
        const ext = phase; // 0 (start/bent) -> 1 (full press)
        
        lElbow = { x: 210 + ext * 35, y: 220 - ext * 50 };
        rElbow = { x: 430 - ext * 35, y: 220 - ext * 50 };
        
        lWrist = { x: 210 + ext * 60, y: 150 - ext * 90 };
        rWrist = { x: 430 - ext * 60, y: 150 - ext * 90 };

        // Angle goes from 80 deg (start) to 175 deg (finish)
        leftAngle = Math.round(80 + ext * 95);
        rightAngle = leftAngle;
      }
      else {
        // Default idle sway
        const sway = Math.sin(now / 500) * 8;
        head.x += sway * 0.5;
        neck.x += sway * 0.5;
        lWrist.y += sway;
        rWrist.y -= sway;
        leftAngle = 175;
        rightAngle = 175;
        targetJointLabel = 'Joint Align';
      }

      // ─── Draw Skeleton Lines (Bones) ──────────────────────────────────────
      ctx.save();
      ctx.strokeStyle = statusColor;
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 12;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Face/Head mesh
      ctx.beginPath();
      ctx.arc(head.x, head.y, 25, 0, Math.PI * 2);
      ctx.stroke();

      // Spine & Shoulders
      ctx.beginPath();
      ctx.moveTo(head.x, head.y + 25);
      ctx.lineTo(neck.x, neck.y); // head to neck
      ctx.lineTo(lShoulder.x, lShoulder.y); // neck to left shoulder
      ctx.moveTo(neck.x, neck.y);
      ctx.lineTo(rShoulder.x, rShoulder.y); // neck to right shoulder
      ctx.stroke();

      // Torso
      ctx.beginPath();
      ctx.moveTo(lShoulder.x, lShoulder.y);
      ctx.lineTo(lHip.x, lHip.y);
      ctx.moveTo(rShoulder.x, rShoulder.y);
      ctx.lineTo(rHip.x, rHip.y);
      ctx.moveTo(lHip.x, lHip.y);
      ctx.lineTo(rHip.x, rHip.y);
      ctx.stroke();

      // Arms
      ctx.beginPath();
      ctx.moveTo(lShoulder.x, lShoulder.y);
      ctx.lineTo(lElbow.x, lElbow.y);
      ctx.lineTo(lWrist.x, lWrist.y);
      
      ctx.moveTo(rShoulder.x, rShoulder.y);
      ctx.lineTo(rElbow.x, rElbow.y);
      ctx.lineTo(rWrist.x, rWrist.y);
      ctx.stroke();

      // Legs
      ctx.beginPath();
      ctx.moveTo(lHip.x, lHip.y);
      ctx.lineTo(lKnee.x, lKnee.y);
      ctx.lineTo(lAnkle.x, lAnkle.y);

      ctx.moveTo(rHip.x, rHip.y);
      ctx.lineTo(rKnee.x, rKnee.y);
      ctx.lineTo(rAnkle.x, rAnkle.y);
      ctx.stroke();
      ctx.restore();

      // ─── Draw Joint Nodes (Landmarks) ─────────────────────────────────────
      const joints = [
        head, neck,
        lShoulder, rShoulder,
        lElbow, rElbow,
        lWrist, rWrist,
        lHip, rHip,
        lKnee, rKnee,
        lAnkle, rAnkle,
      ];

      joints.forEach((joint) => {
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = statusColor;
        ctx.lineWidth = 3;
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 8;
        
        ctx.beginPath();
        ctx.arc(joint.x, joint.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      });

      // ─── Draw Angle Readouts and Arcs ──────────────────────────────────────
      if (leftAngle !== null && isCalibrated) {
        ctx.save();
        ctx.fillStyle = statusColor;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1.5;
        
        // Draw Left joint indicator box & text
        let indicatorX = 0;
        let indicatorY = 0;
        
        if (exName.toLowerCase().includes('squat')) {
          indicatorX = lKnee.x - 70;
          indicatorY = lKnee.y;
          // Draw arc at knee
          ctx.beginPath();
          ctx.arc(lKnee.x, lKnee.y, 25, 0.7 * Math.PI, 1.3 * Math.PI);
          ctx.stroke();
        } else if (exName.toLowerCase().includes('press')) {
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
        ctx.fillStyle = 'rgba(11, 28, 48, 0.85)';
        ctx.strokeStyle = statusColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(indicatorX - 10, indicatorY - 22, 68, 32, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px Courier New, monospace';
        ctx.fillText(`${leftAngle}°`, indicatorX - 4, indicatorY - 8);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '7px Inter, sans-serif';
        ctx.fillText(targetJointLabel.toUpperCase(), indicatorX - 4, indicatorY + 4);

        // Draw Right joint indicator box
        let indicatorRX = 0;
        let indicatorRY = 0;
        
        if (exName.toLowerCase().includes('squat')) {
          indicatorRX = rKnee.x + 12;
          indicatorRY = rKnee.y;
          ctx.beginPath();
          ctx.arc(rKnee.x, rKnee.y, 25, 1.7 * Math.PI, 0.3 * Math.PI);
          ctx.stroke();
        } else if (exName.toLowerCase().includes('press')) {
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
        ctx.fillStyle = 'rgba(11, 28, 48, 0.85)';
        ctx.strokeStyle = statusColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(indicatorRX, indicatorRY - 22, 68, 32, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px Courier New, monospace';
        ctx.fillText(`${rightAngle}°`, indicatorRX + 6, indicatorRY - 8);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '7px Inter, sans-serif';
        ctx.fillText(targetJointLabel.toUpperCase(), indicatorRX + 6, indicatorRY + 4);

        ctx.restore();
      }

      // ─── Paused frosted layout ─────────────────────────────────────────────
      if (isPaused) {
        ctx.fillStyle = 'rgba(11, 28, 48, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Inter, system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
        
        ctx.font = '14px Inter, system-ui';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillText('Click Resume to continue tracking.', canvas.width / 2, (canvas.height / 2) + 30);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isActive, isPaused, accuracy, exercise, isCalibrated]);

  return (
    <Card
      padding="0"
      className="flex-grow-1 overflow-hidden position-relative bg-inverse-surface d-flex flex-column align-items-center justify-content-center border-0 shadow-lg"
      style={{
        minHeight: '520px',
        borderRadius: 'var(--radius-xl)',
        background: '#0a121d',
      }}
    >
      {/* Outer Glowing Neon Frame */}
      <div
        className="position-absolute inset-0 border"
        style={{
          borderRadius: 'var(--radius-xl)',
          borderWidth: '2px',
          borderColor: isActive
            ? isPaused
              ? 'rgba(255, 179, 0, 0.3)'
              : accuracy > 88
              ? 'rgba(0, 230, 118, 0.3)'
              : 'rgba(0, 243, 255, 0.3)'
            : 'rgba(255, 255, 255, 0.05)',
          boxShadow:
            isActive && !isPaused
              ? accuracy > 88
                ? '0 0 20px rgba(0, 230, 118, 0.15) inset'
                : '0 0 20px rgba(0, 243, 255, 0.15) inset'
              : 'none',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />

      {isActive ? (
        <div className="position-relative w-100 h-100 d-flex align-items-center justify-content-center overflow-hidden" style={{ minHeight: '520px' }}>
          {/* Webcam Video Layer */}
          {hasWebcam !== false ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="position-absolute w-100 h-100"
              style={{
                objectFit: 'cover',
                transform: 'scaleX(-1)', // Mirror webcam for normal user intuition
                opacity: 0.75,
              }}
            />
          ) : (
            // Futuristic Grid Backdrop (fallback if webcam permission denied or missing)
            <div
              className="position-absolute inset-0 w-100 h-100"
              style={{
                background: 'radial-gradient(circle at center, #112235 0%, #060b13 100%)',
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
                  backgroundSize: '30px 30px',
                  backgroundPosition: 'center',
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
              pointerEvents: 'none',
              transform: hasWebcam !== false ? 'scaleX(-1)' : 'none', // Mirror coordinate drawing to match mirrored video
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
                background: 'rgba(11, 28, 48, 0.8)',
                borderColor: isPaused
                  ? 'rgba(255, 179, 0, 0.4)'
                  : 'rgba(0, 243, 255, 0.4)',
              }}
            >
              <div
                className="ai-pulse-dot"
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: isPaused ? '#ffb300' : '#00f3ff',
                  boxShadow: isPaused
                    ? '0 0 10px #ffb300'
                    : '0 0 10px #00f3ff',
                }}
              />
              <span
                className="text-label-md font-bold"
                style={{
                  color: isPaused ? '#ffb300' : '#00f3ff',
                  fontSize: '12px',
                  letterSpacing: '0.5px',
                }}
              >
                {isPaused ? 'SESSION PAUSED' : isCalibrated ? 'AI ACCURACY METRICS ACTIVE' : 'CALIBRATING POSE'}
              </span>
            </div>

            {hasWebcam === false && (
              <div
                className="backdrop-blur rounded-pill px-3 py-1.5 d-flex align-items-center gap-2 border"
                style={{
                  background: 'rgba(255, 23, 68, 0.15)',
                  borderColor: 'rgba(255, 23, 68, 0.4)',
                }}
              >
                <span className="material-symbols-outlined text-danger text-label-md">videocam_off</span>
                <span className="text-danger font-bold" style={{ fontSize: '11px' }}>
                  Webcam Simulated Overlay
                </span>
              </div>
            )}
          </div>

          {/* Bottom Floating Posture Status Message */}
          <div
            className="position-absolute bottom-0 start-50 translate-middle-x pb-4 w-100 px-4"
            style={{ zIndex: 4, maxWidth: '440px' }}
          >
            <div
              className="backdrop-blur rounded-4 p-3 shadow-lg border text-center"
              style={{
                background: 'rgba(11, 28, 48, 0.85)',
                borderColor: isPaused
                  ? 'rgba(255, 179, 0, 0.3)'
                  : accuracy >= 88
                  ? 'rgba(0, 230, 118, 0.3)'
                  : accuracy >= 75
                  ? 'rgba(255, 179, 0, 0.3)'
                  : 'rgba(255, 23, 68, 0.3)',
              }}
            >
              <div
                className="font-bold text-headline-sm mb-1"
                style={{
                  color: isPaused
                    ? '#ffb300'
                    : accuracy >= 88
                    ? '#00e676'
                    : accuracy >= 75
                    ? '#ffb300'
                    : '#ff1744',
                  fontSize: '16px',
                }}
              >
                {statusMsg}
              </div>
              {isCalibrated && !isPaused && (
                <div className="progress bg-dark-subtle mx-auto" style={{ height: '5px', maxWidth: '180px' }}>
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{
                      width: `${accuracy}%`,
                      transition: 'width 0.4s ease',
                      backgroundColor:
                        accuracy >= 88
                          ? '#00e676'
                          : accuracy >= 75
                          ? '#ffb300'
                          : '#ff1744',
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
        <div className="text-center p-5 z-1" style={{ maxWidth: '420px' }}>
          <div
            className="d-inline-flex align-items-center justify-content-center mb-4 rounded-circle"
            style={{
              width: '80px',
              height: '80px',
              background: 'rgba(0, 78, 159, 0.1)',
              border: '2px stroke rgba(0, 78, 159, 0.2)',
            }}
          >
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '42px' }}>
              videocam
            </span>
          </div>
          <h3 className="text-white font-bold mb-2" style={{ fontSize: '22px' }}>
            Ready to Begin?
          </h3>
          <p className="text-on-surface-variant mb-4" style={{ fontSize: '14px', lineHeight: '1.5' }}>
            Position your camera so your entire torso and joints are clearly visible in the frame.
          </p>
          <Button size="lg" icon="videocam" onClick={onStart} className="px-5 py-3 shadow-primary">
            Enable Camera & Start
          </Button>
        </div>
      )}
    </Card>
  );
}
