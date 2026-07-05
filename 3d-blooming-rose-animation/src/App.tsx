import { useEffect, useRef } from "react";

export default function App() {
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    // ─── Inject CSS ───────────────────────────────────────────────────────────
    const style = document.createElement("style");
    style.textContent = `
      /* ======================================================
         CINEMATIC RED ROSE — Full CSS
         ====================================================== */

      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');

      :root {
        --rose-red:    #c8001a;
        --rose-light:  #ff4466;
        --rose-dark:   #5a0008;
        --rose-velvet: #8b0015;
        --green-stem:  #1e6b0f;
        --green-light: #2d9e18;
        --green-dark:  #0d3a06;
        --glow-color:  rgba(200,0,30,0.6);
        --gold:        #ffd700;
      }

      /* ── Base ─────────────────────────────────── */
      #rose-scene {
        position: fixed; inset: 0;
        background: radial-gradient(ellipse at 50% 40%, #120005 0%, #080003 40%, #020001 100%);
        display: flex; align-items: center; justify-content: center;
        overflow: hidden; font-family: 'Cormorant Garamond', 'Georgia', serif;
        perspective: 900px; perspective-origin: 50% 40%;
      }

      /* ── Vignette ─────────────────────────────── */
      #rose-scene::after {
        content: '';
        position: absolute; inset: 0; pointer-events: none; z-index: 80;
        background: radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.85) 100%);
      }

      /* ── Stars Canvas ─────────────────────────── */
      #star-canvas {
        position: absolute; inset: 0; z-index: 1; pointer-events: none;
      }

      /* ── Fog ──────────────────────────────────── */
      #fog {
        position: absolute; bottom: 0; left: -20%; width: 140%; height: 35%;
        z-index: 3; pointer-events: none;
        background: linear-gradient(to top, rgba(20,0,5,0.9) 0%, rgba(20,0,5,0.3) 50%, transparent 100%);
        animation: fog-drift 18s ease-in-out infinite alternate;
        filter: blur(8px);
      }
      @keyframes fog-drift {
        from { transform: translateX(0) scaleX(1); }
        to   { transform: translateX(3%) scaleX(1.04); }
      }

      /* ── Bloom Button ─────────────────────────── */
      #bloom-btn-wrap {
        position: absolute; inset: 0; z-index: 50;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        transition: opacity 1.2s ease;
      }
      #bloom-btn-wrap.hidden { opacity: 0; pointer-events: none; }

      #bloom-btn {
        position: relative;
        padding: 18px 52px;
        font-family: inherit; font-size: clamp(1rem, 3vw, 1.4rem);
        font-weight: 300; letter-spacing: 0.22em; color: #ffcccc;
        background: linear-gradient(135deg, #4a0008 0%, #8b0015 40%, #c8001a 70%, #8b0015 100%);
        border: 1px solid rgba(255,100,120,0.35);
        border-radius: 60px; cursor: pointer;
        box-shadow: 0 0 30px rgba(200,0,30,0.5), 0 0 80px rgba(200,0,30,0.2), inset 0 1px 0 rgba(255,200,200,0.15);
        animation: btn-pulse 2.8s ease-in-out infinite;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        overflow: hidden;
      }
      #bloom-btn::before {
        content: '';
        position: absolute; inset: 0; border-radius: inherit;
        background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 55%);
        pointer-events: none;
      }
      #bloom-btn:hover {
        transform: scale(1.06);
        box-shadow: 0 0 50px rgba(200,0,30,0.8), 0 0 120px rgba(200,0,30,0.3), inset 0 1px 0 rgba(255,200,200,0.2);
      }
      @keyframes btn-pulse {
        0%, 100% { box-shadow: 0 0 30px rgba(200,0,30,0.5), 0 0 80px rgba(200,0,30,0.2); }
        50%       { box-shadow: 0 0 55px rgba(200,0,30,0.9), 0 0 140px rgba(200,0,30,0.35); }
      }

      #bloom-btn-tagline {
        margin-top: 20px; font-size: clamp(0.65rem, 2vw, 0.8rem);
        letter-spacing: 0.4em; text-transform: uppercase; color: rgba(255,130,140,0.5);
        animation: fade-letters 3s ease-in-out infinite alternate;
      }
      @keyframes fade-letters { from { opacity: 0.4; } to { opacity: 0.9; } }

      /* ── Stage (camera zoom) ──────────────────── */
      #stage {
        position: absolute; inset: 0; z-index: 10;
        display: flex; flex-direction: column; align-items: center; justify-content: flex-end;
        padding-bottom: 8vh;
        transform-style: preserve-3d;
        transform: scale(0.7) translateZ(-200px);
        opacity: 0;
        transition: transform 2.5s cubic-bezier(0.16,1,0.3,1), opacity 2s ease;
      }
      #stage.visible {
        transform: scale(1) translateZ(0px);
        opacity: 1;
      }
      #stage.mouse-tilt {
        transition: transform 0.08s linear;
      }

      /* ── Lens Glow ────────────────────────────── */
      #lens-glow {
        position: absolute; top: 28%; left: 50%;
        transform: translate(-50%, -50%);
        width: min(500px, 80vw); height: min(500px, 80vw);
        border-radius: 50%;
        background: radial-gradient(circle, rgba(200,0,30,0.18) 0%, rgba(140,0,20,0.07) 40%, transparent 70%);
        filter: blur(24px);
        opacity: 0; pointer-events: none; z-index: 5;
        animation: lens-breathe 5s ease-in-out infinite;
        transition: opacity 2s ease;
      }
      #lens-glow.active { opacity: 1; }
      @keyframes lens-breathe {
        0%,100% { transform: translate(-50%,-50%) scale(1); opacity: 0.7; }
        50%      { transform: translate(-50%,-50%) scale(1.12); opacity: 1; }
      }

      /* ── Light Rays ───────────────────────────── */
      #light-rays {
        position: absolute; top: 15%; left: 50%;
        transform: translateX(-50%);
        width: min(700px, 120vw); height: min(700px, 120vw);
        opacity: 0; pointer-events: none; z-index: 4;
        transition: opacity 3s ease 1s;
      }
      #light-rays.active { opacity: 1; }
      .ray {
        position: absolute; top: 50%; left: 50%;
        width: 2px; height: 50%;
        transform-origin: top center;
        background: linear-gradient(to bottom, rgba(255,100,80,0.15), transparent);
        animation: ray-spin 25s linear infinite;
        filter: blur(2px);
      }

      /* ── Flower Container ─────────────────────── */
      #flower-container {
        position: relative;
        display: flex; flex-direction: column; align-items: center;
        transform-style: preserve-3d;
        animation: gentle-sway 5s ease-in-out infinite;
        --sway-scale: 1;
      }
      @keyframes gentle-sway {
        0%   { transform: rotate(0deg) rotateY(0deg); }
        20%  { transform: rotate(0.8deg) rotateY(2deg); }
        50%  { transform: rotate(-0.5deg) rotateY(-1.5deg); }
        80%  { transform: rotate(0.6deg) rotateY(1.8deg); }
        100% { transform: rotate(0deg) rotateY(0deg); }
      }

      /* ── SVG Rose ─────────────────────────────── */
      #rose-svg {
        width: min(340px, 80vw);
        height: min(480px, 110vw);
        overflow: visible;
        filter: drop-shadow(0 0 24px rgba(200,0,30,0.4));
        position: relative; z-index: 20;
      }

      /* ── Particle Canvas ──────────────────────── */
      #particle-canvas {
        position: absolute; inset: 0; z-index: 30; pointer-events: none;
      }

      /* ── After-bloom text ─────────────────────── */
      #bloom-text {
        position: absolute;
        bottom: 3vh; left: 0; right: 0;
        text-align: center; z-index: 60; pointer-events: none;
        opacity: 0; transition: opacity 1.5s ease;
      }
      #bloom-text.visible { opacity: 1; }
      #bloom-text p {
        font-style: italic; font-size: clamp(0.8rem, 2.5vw, 1.1rem);
        letter-spacing: 0.18em; color: rgba(255,140,140,0.7);
        animation: text-breathe 4s ease-in-out infinite;
      }
      @keyframes text-breathe {
        0%,100% { opacity: 0.6; } 50% { opacity: 1; }
      }

      /* ── Falling petals ───────────────────────── */
      .drift-petal {
        position: fixed; pointer-events: none; z-index: 70;
        width: 14px; height: 20px;
        border-radius: 60% 0% 60% 0% / 80% 0% 80% 0%;
        opacity: 0;
        animation: drift-fall linear forwards;
      }
      @keyframes drift-fall {
        0%   { transform: translateY(-40px) rotate(0deg) rotateX(0deg); opacity: 0; }
        8%   { opacity: 0.7; }
        85%  { opacity: 0.5; }
        100% { transform: translateY(110vh) rotate(540deg) rotateX(180deg) translateX(80px); opacity: 0; }
      }

      /* ── Fireflies ────────────────────────────── */
      .firefly {
        position: fixed; pointer-events: none; z-index: 65;
        width: 5px; height: 5px; border-radius: 50%;
        background: radial-gradient(circle, #ffeeaa, #ffaa00 50%, transparent);
        box-shadow: 0 0 8px 4px rgba(255,200,50,0.6);
        opacity: 0;
        animation: firefly-float linear infinite;
      }
      @keyframes firefly-float {
        0%   { opacity: 0; transform: translate(0,0) scale(0.5); }
        15%  { opacity: 1; transform: translate(var(--fx1), var(--fy1)) scale(1); }
        40%  { opacity: 0.7; transform: translate(var(--fx2), var(--fy2)) scale(0.8); }
        70%  { opacity: 1; transform: translate(var(--fx3), var(--fy3)) scale(1.1); }
        85%  { opacity: 0.5; }
        100% { opacity: 0; transform: translate(var(--fx4), var(--fy4)) scale(0.4); }
      }

      /* ── Click sparks ─────────────────────────── */
      .click-spark {
        position: fixed; pointer-events: none; z-index: 90;
        width: 6px; height: 6px; border-radius: 50%;
        background: radial-gradient(circle, #fff 0%, #ff6080 50%, transparent);
        animation: spark-burst 0.8s cubic-bezier(0,0,0.2,1) forwards;
      }
      @keyframes spark-burst {
        0%   { transform: translate(0,0) scale(1); opacity: 1; }
        100% { transform: translate(var(--dx), var(--dy)) scale(0); opacity: 0; }
      }

      /* ── Heartbeat glow ring ──────────────────── */
      #heartbeat-ring {
        position: absolute; top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        width: 280px; height: 280px; border-radius: 50%;
        border: 2px solid rgba(200,0,30,0.0);
        pointer-events: none; z-index: 6; opacity: 0;
        transition: opacity 1s ease;
      }
      #heartbeat-ring.active {
        opacity: 1;
        animation: heartbeat 1.4s ease-in-out infinite;
      }
      @keyframes heartbeat {
        0%   { transform: translate(-50%,-50%) scale(0.95); border-color: rgba(200,0,30,0.0); box-shadow: 0 0 0 0 rgba(200,0,30,0); }
        20%  { transform: translate(-50%,-50%) scale(1.05); border-color: rgba(200,0,30,0.5); box-shadow: 0 0 30px 6px rgba(200,0,30,0.25); }
        40%  { transform: translate(-50%,-50%) scale(0.98); border-color: rgba(200,0,30,0.2); }
        60%  { transform: translate(-50%,-50%) scale(1.08); border-color: rgba(200,0,30,0.55); box-shadow: 0 0 50px 10px rgba(200,0,30,0.3); }
        100% { transform: translate(-50%,-50%) scale(0.95); border-color: rgba(200,0,30,0.0); box-shadow: 0 0 0 0 rgba(200,0,30,0); }
      }
    `;
    document.head.appendChild(style);

    // ─── Build DOM ───────────────────────────────────────────────────────────
    const root = document.getElementById("root")!;
    root.innerHTML = `
      <div id="rose-scene">
        <canvas id="star-canvas"></canvas>
        <div id="fog"></div>

        <!-- Bloom Button -->
        <div id="bloom-btn-wrap">
          <button id="bloom-btn">🌹 &nbsp; Tap to Bloom &nbsp; 🌹</button>
          <div id="bloom-btn-tagline">A cinematic experience</div>
        </div>

        <!-- Stage -->
        <div id="stage">
          <div id="lens-glow"></div>
          <div id="light-rays"></div>
          <div id="heartbeat-ring"></div>

          <div id="flower-container">
            <svg id="rose-svg" viewBox="0 0 340 480" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <!-- Petal gradients -->
                <radialGradient id="pg0" cx="38%" cy="25%" r="70%">
                  <stop offset="0%" stop-color="#ff9090"/>
                  <stop offset="30%" stop-color="#e8001a"/>
                  <stop offset="70%" stop-color="#8b0015"/>
                  <stop offset="100%" stop-color="#3a0008"/>
                </radialGradient>
                <radialGradient id="pg1" cx="40%" cy="22%" r="72%">
                  <stop offset="0%" stop-color="#ff7080"/>
                  <stop offset="28%" stop-color="#d80018"/>
                  <stop offset="68%" stop-color="#7a0012"/>
                  <stop offset="100%" stop-color="#2e0006"/>
                </radialGradient>
                <radialGradient id="pg2" cx="42%" cy="20%" r="75%">
                  <stop offset="0%" stop-color="#ff5570"/>
                  <stop offset="25%" stop-color="#c80016"/>
                  <stop offset="65%" stop-color="#6a000f"/>
                  <stop offset="100%" stop-color="#240005"/>
                </radialGradient>
                <radialGradient id="pg3" cx="35%" cy="18%" r="78%">
                  <stop offset="0%" stop-color="#ff4060"/>
                  <stop offset="22%" stop-color="#b80014"/>
                  <stop offset="62%" stop-color="#5a000c"/>
                  <stop offset="100%" stop-color="#1e0004"/>
                </radialGradient>
                <radialGradient id="pg4" cx="30%" cy="15%" r="80%">
                  <stop offset="0%" stop-color="#ee2050"/>
                  <stop offset="20%" stop-color="#aa0012"/>
                  <stop offset="60%" stop-color="#4a0009"/>
                  <stop offset="100%" stop-color="#180003"/>
                </radialGradient>
                <!-- Leaf gradient -->
                <radialGradient id="lg" cx="30%" cy="30%" r="80%">
                  <stop offset="0%" stop-color="#3bba1a"/>
                  <stop offset="40%" stop-color="#1e6b0f"/>
                  <stop offset="100%" stop-color="#0a2e05"/>
                </radialGradient>
                <!-- Stem gradient -->
                <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#0a2e05"/>
                  <stop offset="30%" stop-color="#1e6b0f"/>
                  <stop offset="60%" stop-color="#2d9e18"/>
                  <stop offset="100%" stop-color="#0e3808"/>
                </linearGradient>
                <!-- Center glow -->
                <radialGradient id="cg" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#ffdddd"/>
                  <stop offset="40%" stop-color="#ff6070"/>
                  <stop offset="100%" stop-color="#c8001a"/>
                </radialGradient>
                <!-- Glow filter -->
                <filter id="glow-filter" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="4" result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <filter id="soft-blur" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1.5"/>
                </filter>
                <!-- Pollen filter -->
                <filter id="pollen-glow">
                  <feGaussianBlur stdDeviation="1.2" result="b"/>
                  <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>

              <!-- ── Background aura ── -->
              <ellipse id="rose-aura" cx="170" cy="200" rx="90" ry="80"
                fill="radial-gradient(circle,rgba(200,0,30,0.3),transparent)"
                opacity="0" filter="url(#soft-blur)"/>

              <!-- ── STEM ── -->
              <g id="stem-group" opacity="0">
                <!-- Main stem -->
                <path id="stem-path"
                  d="M170,440 C168,400 166,360 168,320 C170,280 172,260 170,230"
                  stroke="url(#sg)" stroke-width="8" fill="none"
                  stroke-linecap="round" filter="url(#glow-filter)"/>
                <!-- Stem highlight -->
                <path d="M169,440 C167,400 165,360 167,320 C169,280 171,260 169,230"
                  stroke="rgba(80,180,40,0.3)" stroke-width="2" fill="none" stroke-linecap="round"/>

                <!-- ── LEFT LEAF (large) ── -->
                <g id="leaf-left-1" transform-origin="172 330" style="transform:rotate(-80deg) scaleX(0);opacity:0">
                  <path d="M172,330 C140,310 100,295 85,275 C100,285 130,300 165,318 Z"
                    fill="url(#lg)" filter="url(#glow-filter)"/>
                  <path d="M172,330 C145,318 115,308 90,295" stroke="rgba(80,200,40,0.4)" stroke-width="1" fill="none"/>
                  <!-- Leaf veins -->
                  <path d="M150,322 C135,315 120,310 108,304" stroke="rgba(100,220,50,0.3)" stroke-width="0.8" fill="none"/>
                  <path d="M138,319 C128,314 118,310 110,308" stroke="rgba(100,220,50,0.25)" stroke-width="0.6" fill="none"/>
                </g>

                <!-- ── RIGHT LEAF (large) ── -->
                <g id="leaf-right-1" transform-origin="168 350" style="transform:rotate(80deg) scaleX(0);opacity:0">
                  <path d="M168,350 C200,330 238,318 255,298 C240,308 210,325 172,342 Z"
                    fill="url(#lg)" filter="url(#glow-filter)"/>
                  <path d="M168,350 C195,337 222,326 248,312" stroke="rgba(80,200,40,0.4)" stroke-width="1" fill="none"/>
                  <path d="M188,343 C203,336 218,328 232,322" stroke="rgba(100,220,50,0.3)" stroke-width="0.8" fill="none"/>
                </g>

                <!-- ── LEFT LEAF (small) ── -->
                <g id="leaf-left-2" transform-origin="170 285" style="transform:rotate(-70deg) scaleX(0);opacity:0">
                  <path d="M170,285 C148,270 120,258 106,244 C122,254 146,265 168,278 Z"
                    fill="url(#lg)" filter="url(#glow-filter)" opacity="0.85"/>
                  <path d="M170,285 C150,276 130,268 112,258" stroke="rgba(80,200,40,0.4)" stroke-width="0.8" fill="none"/>
                </g>

                <!-- ── RIGHT LEAF (small) ── -->
                <g id="leaf-right-2" transform-origin="170 300" style="transform:rotate(70deg) scaleX(0);opacity:0">
                  <path d="M170,300 C195,283 222,272 236,258 C222,268 198,278 172,293 Z"
                    fill="url(#lg)" filter="url(#glow-filter)" opacity="0.85"/>
                  <path d="M170,300 C193,289 216,278 232,266" stroke="rgba(80,200,40,0.4)" stroke-width="0.8" fill="none"/>
                </g>

                <!-- ── Thorns ── -->
                <ellipse cx="160" cy="370" rx="10" ry="5" fill="#0d3a06" transform="rotate(-40,160,370)"/>
                <ellipse cx="178" cy="395" rx="9" ry="4" fill="#0d3a06" transform="rotate(35,178,395)"/>
              </g>

              <!-- ── ROSE HEAD ── -->
              <g id="rose-head" transform-origin="170 230" opacity="0">

                <!-- ── OUTER PETALS (Layer 5 — widest, most open) ── -->
                <g id="petals-outer" transform-origin="170 230">
                  <!-- op1 -->
                  <ellipse class="petal outer-p" id="op1" cx="170" cy="230" rx="52" ry="70"
                    fill="url(#pg4)" transform-origin="170 260" style="transform:rotate(0deg) translateY(-40px) rotateX(-8deg) scaleY(0);opacity:0" filter="url(#glow-filter)"/>
                  <!-- op2 -->
                  <ellipse class="petal outer-p" id="op2" cx="170" cy="230" rx="50" ry="68"
                    fill="url(#pg4)" transform-origin="170 260" style="transform:rotate(51deg) translateY(-40px) rotateX(-8deg) scaleY(0);opacity:0" filter="url(#glow-filter)"/>
                  <!-- op3 -->
                  <ellipse class="petal outer-p" id="op3" cx="170" cy="230" rx="50" ry="68"
                    fill="url(#pg4)" transform-origin="170 260" style="transform:rotate(102deg) translateY(-40px) rotateX(-8deg) scaleY(0);opacity:0" filter="url(#glow-filter)"/>
                  <!-- op4 -->
                  <ellipse class="petal outer-p" id="op4" cx="170" cy="230" rx="50" ry="68"
                    fill="url(#pg4)" transform-origin="170 260" style="transform:rotate(153deg) translateY(-40px) rotateX(-8deg) scaleY(0);opacity:0" filter="url(#glow-filter)"/>
                  <!-- op5 -->
                  <ellipse class="petal outer-p" id="op5" cx="170" cy="230" rx="50" ry="68"
                    fill="url(#pg4)" transform-origin="170 260" style="transform:rotate(204deg) translateY(-40px) rotateX(-8deg) scaleY(0);opacity:0" filter="url(#glow-filter)"/>
                  <!-- op6 -->
                  <ellipse class="petal outer-p" id="op6" cx="170" cy="230" rx="50" ry="68"
                    fill="url(#pg4)" transform-origin="170 260" style="transform:rotate(255deg) translateY(-40px) rotateX(-8deg) scaleY(0);opacity:0" filter="url(#glow-filter)"/>
                  <!-- op7 -->
                  <ellipse class="petal outer-p" id="op7" cx="170" cy="230" rx="48" ry="66"
                    fill="url(#pg4)" transform-origin="170 260" style="transform:rotate(306deg) translateY(-40px) rotateX(-8deg) scaleY(0);opacity:0" filter="url(#glow-filter)"/>
                </g>

                <!-- ── MID-OUTER PETALS (Layer 4) ── -->
                <g id="petals-mid-outer" transform-origin="170 230">
                  <ellipse class="petal mid-outer-p" id="mop1" cx="170" cy="230" rx="42" ry="58"
                    fill="url(#pg3)" transform-origin="170 255" style="transform:rotate(25deg) translateY(-32px) rotateX(-14deg) scaleY(0);opacity:0" filter="url(#glow-filter)"/>
                  <ellipse class="petal mid-outer-p" id="mop2" cx="170" cy="230" rx="40" ry="56"
                    fill="url(#pg3)" transform-origin="170 255" style="transform:rotate(85deg) translateY(-32px) rotateX(-14deg) scaleY(0);opacity:0" filter="url(#glow-filter)"/>
                  <ellipse class="petal mid-outer-p" id="mop3" cx="170" cy="230" rx="40" ry="56"
                    fill="url(#pg3)" transform-origin="170 255" style="transform:rotate(145deg) translateY(-32px) rotateX(-14deg) scaleY(0);opacity:0" filter="url(#glow-filter)"/>
                  <ellipse class="petal mid-outer-p" id="mop4" cx="170" cy="230" rx="40" ry="56"
                    fill="url(#pg3)" transform-origin="170 255" style="transform:rotate(205deg) translateY(-32px) rotateX(-14deg) scaleY(0);opacity:0" filter="url(#glow-filter)"/>
                  <ellipse class="petal mid-outer-p" id="mop5" cx="170" cy="230" rx="40" ry="56"
                    fill="url(#pg3)" transform-origin="170 255" style="transform:rotate(265deg) translateY(-32px) rotateX(-14deg) scaleY(0);opacity:0" filter="url(#glow-filter)"/>
                  <ellipse class="petal mid-outer-p" id="mop6" cx="170" cy="230" rx="38" ry="54"
                    fill="url(#pg3)" transform-origin="170 255" style="transform:rotate(325deg) translateY(-32px) rotateX(-14deg) scaleY(0);opacity:0" filter="url(#glow-filter)"/>
                </g>

                <!-- ── MID PETALS (Layer 3) ── -->
                <g id="petals-mid" transform-origin="170 230">
                  <ellipse class="petal mid-p" id="mp1" cx="170" cy="230" rx="32" ry="46"
                    fill="url(#pg2)" transform-origin="170 250" style="transform:rotate(0deg) translateY(-24px) rotateX(-20deg) scaleY(0);opacity:0" filter="url(#glow-filter)"/>
                  <ellipse class="petal mid-p" id="mp2" cx="170" cy="230" rx="30" ry="44"
                    fill="url(#pg2)" transform-origin="170 250" style="transform:rotate(72deg) translateY(-24px) rotateX(-20deg) scaleY(0);opacity:0" filter="url(#glow-filter)"/>
                  <ellipse class="petal mid-p" id="mp3" cx="170" cy="230" rx="30" ry="44"
                    fill="url(#pg2)" transform-origin="170 250" style="transform:rotate(144deg) translateY(-24px) rotateX(-20deg) scaleY(0);opacity:0" filter="url(#glow-filter)"/>
                  <ellipse class="petal mid-p" id="mp4" cx="170" cy="230" rx="30" ry="44"
                    fill="url(#pg2)" transform-origin="170 250" style="transform:rotate(216deg) translateY(-24px) rotateX(-20deg) scaleY(0);opacity:0" filter="url(#glow-filter)"/>
                  <ellipse class="petal mid-p" id="mp5" cx="170" cy="230" rx="30" ry="44"
                    fill="url(#pg2)" transform-origin="170 250" style="transform:rotate(288deg) translateY(-24px) rotateX(-20deg) scaleY(0);opacity:0" filter="url(#glow-filter)"/>
                </g>

                <!-- ── INNER PETALS (Layer 2) ── -->
                <g id="petals-inner" transform-origin="170 230">
                  <ellipse class="petal inner-p" id="ip1" cx="170" cy="230" rx="22" ry="35"
                    fill="url(#pg1)" transform-origin="170 245" style="transform:rotate(0deg) translateY(-16px) rotateX(-28deg) scaleY(0);opacity:0" filter="url(#glow-filter)"/>
                  <ellipse class="petal inner-p" id="ip2" cx="170" cy="230" rx="20" ry="33"
                    fill="url(#pg1)" transform-origin="170 245" style="transform:rotate(90deg) translateY(-16px) rotateX(-28deg) scaleY(0);opacity:0" filter="url(#glow-filter)"/>
                  <ellipse class="petal inner-p" id="ip3" cx="170" cy="230" rx="20" ry="33"
                    fill="url(#pg1)" transform-origin="170 245" style="transform:rotate(180deg) translateY(-16px) rotateX(-28deg) scaleY(0);opacity:0" filter="url(#glow-filter)"/>
                  <ellipse class="petal inner-p" id="ip4" cx="170" cy="230" rx="20" ry="33"
                    fill="url(#pg1)" transform-origin="170 245" style="transform:rotate(270deg) translateY(-16px) rotateX(-28deg) scaleY(0);opacity:0" filter="url(#glow-filter)"/>
                </g>

                <!-- ── BUD PETALS (Layer 1 — innermost) ── -->
                <g id="petals-bud" transform-origin="170 230">
                  <ellipse class="petal bud-p" id="bp1" cx="170" cy="230" rx="13" ry="26"
                    fill="url(#pg0)" transform-origin="170 240" style="transform:rotate(0deg) translateY(-10px) rotateX(-40deg) scaleY(0);opacity:0" filter="url(#glow-filter)"/>
                  <ellipse class="petal bud-p" id="bp2" cx="170" cy="230" rx="12" ry="24"
                    fill="url(#pg0)" transform-origin="170 240" style="transform:rotate(120deg) translateY(-10px) rotateX(-40deg) scaleY(0);opacity:0" filter="url(#glow-filter)"/>
                  <ellipse class="petal bud-p" id="bp3" cx="170" cy="230" rx="12" ry="24"
                    fill="url(#pg0)" transform-origin="170 240" style="transform:rotate(240deg) translateY(-10px) rotateX(-40deg) scaleY(0);opacity:0" filter="url(#glow-filter)"/>
                </g>

                <!-- ── Sepal (green base) ── -->
                <g id="sepal" opacity="0">
                  <path d="M155,248 C148,258 145,268 148,275 C155,268 162,262 170,260 C178,262 185,268 192,275 C195,268 192,258 185,248 C180,252 175,255 170,255 C165,255 160,252 155,248 Z"
                    fill="url(#lg)" opacity="0.9"/>
                </g>

                <!-- ── Center ── -->
                <circle id="rose-center" cx="170" cy="230" r="10"
                  fill="url(#cg)" opacity="0" filter="url(#glow-filter)"/>

                <!-- ── Pollen dots ── -->
                <g id="pollen-group" opacity="0" filter="url(#pollen-glow)">
                  <circle cx="162" cy="226" r="2" fill="#ffe080" opacity="0.9"/>
                  <circle cx="178" cy="224" r="1.8" fill="#ffd060" opacity="0.8"/>
                  <circle cx="170" cy="220" r="2.2" fill="#ffee90" opacity="0.9"/>
                  <circle cx="164" cy="222" r="1.5" fill="#ffe070" opacity="0.7"/>
                  <circle cx="176" cy="228" r="1.6" fill="#ffd050" opacity="0.8"/>
                  <circle cx="168" cy="234" r="1.4" fill="#ffee80" opacity="0.75"/>
                  <circle cx="174" cy="232" r="1.7" fill="#ffe090" opacity="0.85"/>
                </g>

                <!-- ── Petal highlights (overlay) ── -->
                <ellipse cx="162" cy="215" rx="8" ry="14"
                  fill="rgba(255,220,220,0.08)" transform="rotate(-20,162,215)" style="pointer-events:none"/>
                <ellipse cx="178" cy="218" rx="7" ry="12"
                  fill="rgba(255,220,220,0.07)" transform="rotate(15,178,218)" style="pointer-events:none"/>
              </g>
            </svg>
          </div>

          <canvas id="particle-canvas"></canvas>
        </div>

        <div id="bloom-text">
          <p>🌹 &nbsp; A rose blooms in silence &nbsp; 🌹</p>
        </div>
      </div>
    `;

    // ─── Utility ──────────────────────────────────────────────────────────────
    const $ = (id: string) => document.getElementById(id)!;
    const ease = {
      outExpo:  (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
      outBack:  (t: number) => { const c = 1.70158; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); },
      inOutCubic: (t: number) => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2,
      outElastic: (t: number) => {
        const c = (2 * Math.PI) / 4.5;
        return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10*t) * Math.sin((t*10 - 0.75)*c) + 1;
      }
    };

    function animate(duration: number, callback: (p: number) => void, easeFn = ease.outExpo, done?: () => void) {
      const start = performance.now();
      function tick(now: number) {
        const raw = Math.min((now - start) / duration, 1);
        callback(easeFn(raw));
        if (raw < 1) requestAnimationFrame(tick);
        else done?.();
      }
      requestAnimationFrame(tick);
    }

    function delay(ms: number) { return new Promise<void>(r => setTimeout(r, ms)); }

    // ─── Stars Canvas ─────────────────────────────────────────────────────────
    const starCanvas = $("star-canvas") as HTMLCanvasElement;
    const starCtx = starCanvas.getContext("2d")!;
    let stars: { x:number; y:number; r:number; a:number; speed:number; twinkle:number }[] = [];

    function resizeStarCanvas() {
      starCanvas.width = window.innerWidth;
      starCanvas.height = window.innerHeight;
      stars = Array.from({ length: 200 }, () => ({
        x: Math.random() * starCanvas.width,
        y: Math.random() * starCanvas.height * 0.8,
        r: Math.random() * 1.4 + 0.3,
        a: Math.random(),
        speed: 0.003 + Math.random() * 0.006,
        twinkle: Math.random() * Math.PI * 2,
      }));
    }
    resizeStarCanvas();
    window.addEventListener("resize", resizeStarCanvas);

    let starFrame = 0;
    function drawStars() {
      starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
      stars.forEach(s => {
        s.twinkle += s.speed;
        const alpha = s.a * (0.5 + 0.5 * Math.sin(s.twinkle));
        starCtx.beginPath();
        starCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        // Occasional reddish tint
        const reddish = Math.sin(s.twinkle * 0.7) > 0.6;
        starCtx.fillStyle = reddish ? `rgba(255,150,150,${alpha * 0.7})` : `rgba(255,255,255,${alpha})`;
        starCtx.fill();
      });
      starFrame = requestAnimationFrame(drawStars);
    }
    drawStars();

    // ─── Particle Canvas (ambient dust + pollen) ───────────────────────────────
    const pCanvas = $("particle-canvas") as HTMLCanvasElement;
    const pCtx = pCanvas.getContext("2d")!;
    interface Dust { x:number; y:number; vx:number; vy:number; r:number; a:number; color:string; }
    let dustParticles: Dust[] = [];
    let bloomPhase = false;

    function resizePCanvas() {
      const scene = $("rose-scene");
      pCanvas.width = scene.clientWidth;
      pCanvas.height = scene.clientHeight;
    }
    resizePCanvas();
    window.addEventListener("resize", resizePCanvas);

    function spawnDust(count: number) {
      const w = pCanvas.width, h = pCanvas.height;
      const colors = ["rgba(255,120,120,","rgba(255,200,100,","rgba(200,0,30,","rgba(255,255,255,","rgba(255,160,160,"];
      for (let i = 0; i < count; i++) {
        dustParticles.push({
          x: w * 0.3 + Math.random() * w * 0.4,
          y: h * 0.15 + Math.random() * h * 0.5,
          vx: (Math.random() - 0.5) * 0.4,
          vy: -0.15 - Math.random() * 0.35,
          r: 0.8 + Math.random() * 2.2,
          a: 0.6 + Math.random() * 0.4,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    }

    function drawDust() {
      pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
      dustParticles = dustParticles.filter(p => p.a > 0.01);
      dustParticles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        p.a *= 0.994; p.vy *= 0.999;
        p.vx += (Math.random()-0.5)*0.04;
        pCtx.beginPath();
        pCtx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        pCtx.fillStyle = p.color + p.a + ")";
        pCtx.fill();
      });
      if (bloomPhase && Math.random() < 0.18) spawnDust(1);
      requestAnimationFrame(drawDust);
    }
    drawDust();

    // ─── Light Rays ───────────────────────────────────────────────────────────
    const raysEl = $("light-rays");
    for (let i = 0; i < 12; i++) {
      const ray = document.createElement("div");
      ray.className = "ray";
      ray.style.transform = `rotate(${i * 30}deg)`;
      ray.style.opacity = String(0.3 + Math.random() * 0.5);
      ray.style.animationDuration = `${20 + i * 3}s`;
      ray.style.animationDirection = i % 2 === 0 ? "normal" : "reverse";
      ray.style.background = `linear-gradient(to bottom, rgba(${200+i*4},${60+i*3},${70+i*2},${0.12+i*0.01}), transparent)`;
      raysEl.appendChild(ray);
    }

    // ─── Fireflies ────────────────────────────────────────────────────────────
    function spawnFirefly() {
      const ff = document.createElement("div");
      ff.className = "firefly";
      const cx = 30 + Math.random() * 40;
      const cy = 20 + Math.random() * 60;
      ff.style.left = cx + "vw";
      ff.style.top  = cy + "vh";
      const tx = (Math.random()-0.5)*20, ty = (Math.random()-0.5)*20;
      ff.style.setProperty("--fx1", `${tx*0.3}vw`); ff.style.setProperty("--fy1", `${ty*0.3}vh`);
      ff.style.setProperty("--fx2", `${tx*0.6}vw`); ff.style.setProperty("--fy2", `${ty*0.8}vh`);
      ff.style.setProperty("--fx3", `${tx*0.9}vw`); ff.style.setProperty("--fy3", `${ty*1.1}vh`);
      ff.style.setProperty("--fx4", `${tx*1.2}vw`); ff.style.setProperty("--fy4", `${ty*1.5}vh`);
      const dur = 6 + Math.random() * 8;
      ff.style.animationDuration = dur + "s";
      ff.style.animationDelay = Math.random() * 4 + "s";
      document.getElementById("rose-scene")!.appendChild(ff);
      setTimeout(() => ff.remove(), (dur + 5) * 1000);
    }

    // ─── Drifting Petals ──────────────────────────────────────────────────────
    const petalColors = [
      ["#c8001a","#8b0015"],["#dd2030","#aa0016"],["#ee3040","#bb0018"],
      ["#ff4466","#cc0020"],["#aa0012","#6a000c"]
    ];
    function spawnDriftPetal() {
      const dp = document.createElement("div");
      dp.className = "drift-petal";
      const [c1,c2] = petalColors[Math.floor(Math.random()*petalColors.length)];
      dp.style.background = `radial-gradient(ellipse, ${c1}, ${c2})`;
      dp.style.left = (5 + Math.random()*90) + "vw";
      dp.style.top = "-30px";
      const dur = 6 + Math.random() * 8;
      dp.style.animationDuration = dur + "s";
      dp.style.animationDelay = "0s";
      dp.style.width = (10 + Math.random()*14) + "px";
      dp.style.height = (14 + Math.random()*18) + "px";
      document.getElementById("rose-scene")!.appendChild(dp);
      setTimeout(() => dp.remove(), dur * 1000 + 500);
    }

    // ─── Click sparks ─────────────────────────────────────────────────────────
    function createSparks(x: number, y: number, count = 16) {
      for (let i = 0; i < count; i++) {
        const s = document.createElement("div");
        s.className = "click-spark";
        const angle = (i / count) * Math.PI * 2;
        const dist = 30 + Math.random() * 60;
        s.style.left = x + "px"; s.style.top = y + "px";
        s.style.setProperty("--dx", `${Math.cos(angle)*dist}px`);
        s.style.setProperty("--dy", `${Math.sin(angle)*dist}px`);
        s.style.background = `radial-gradient(circle, #fff 0%, ${petalColors[Math.floor(Math.random()*petalColors.length)][0]} 50%, transparent)`;
        s.style.animationDelay = (Math.random() * 0.08) + "s";
        document.getElementById("rose-scene")!.appendChild(s);
        setTimeout(() => s.remove(), 900);
      }
    }

    // ─── SVG Petal helpers ────────────────────────────────────────────────────
    function setPetalStyle(el: Element, baseTransform: string, scaleY: number, opacity: number) {
      (el as SVGElement).style.opacity = String(opacity);
      (el as SVGElement).style.transform = `${baseTransform} scaleY(${scaleY})`;
    }

    // Store base transforms
    const petalBases: Map<string, string> = new Map();

    function savePetalBase(id: string, base: string) { petalBases.set(id, base); }
    function getPetalBase(id: string) { return petalBases.get(id) || ""; }

    // Outer petals
    const outerAngles = [0,51,102,153,204,255,306];
    outerAngles.forEach((a,i) => savePetalBase(`op${i+1}`, `rotate(${a}deg) translateY(-40px) rotateX(-8deg)`));
    // Mid-outer
    const midOuterAngles = [25,85,145,205,265,325];
    midOuterAngles.forEach((a,i) => savePetalBase(`mop${i+1}`, `rotate(${a}deg) translateY(-32px) rotateX(-14deg)`));
    // Mid
    const midAngles = [0,72,144,216,288];
    midAngles.forEach((a,i) => savePetalBase(`mp${i+1}`, `rotate(${a}deg) translateY(-24px) rotateX(-20deg)`));
    // Inner
    const innerAngles = [0,90,180,270];
    innerAngles.forEach((a,i) => savePetalBase(`ip${i+1}`, `rotate(${a}deg) translateY(-16px) rotateX(-28deg)`));
    // Bud
    const budAngles = [0,120,240];
    budAngles.forEach((a,i) => savePetalBase(`bp${i+1}`, `rotate(${a}deg) translateY(-10px) rotateX(-40deg)`));

    // ─── Main Bloom Sequence ──────────────────────────────────────────────────
    async function startBloom() {
      // 1. Fade button
      $("bloom-btn-wrap").classList.add("hidden");
      await delay(800);

      // 2. Show stage with camera zoom
      $("stage").classList.add("visible");
      await delay(600);

      // 3. Grow stem
      const stemGroup = $("stem-group");
      animate(1800, p => {
        stemGroup.setAttribute("opacity", String(p));
        // Clip via stroke-dashoffset trick — approximate with opacity
        const stemPath = document.getElementById("stem-path") as unknown as SVGPathElement | null;
        if (stemPath) {
          const len = stemPath.getTotalLength ? stemPath.getTotalLength() : 220;
          stemPath.style.strokeDasharray = String(len);
          stemPath.style.strokeDashoffset = String(len * (1-p));
        }
      }, ease.inOutCubic);
      await delay(1200);

      // 4. Grow leaves (staggered)
      const leafIds = ["leaf-left-1","leaf-right-1","leaf-left-2","leaf-right-2"];
      const leafBaseTransforms = [
        "rotate(-80deg)","rotate(80deg)","rotate(-70deg)","rotate(70deg)"
      ];
      leafIds.forEach((id, i) => {
        setTimeout(() => {
          const el = $(id);
          animate(900, p => {
            el.style.opacity = String(p);
            el.style.transform = `${leafBaseTransforms[i]} scaleX(${ease.outBack(p)})`;
          }, t => t, () => {
            // Subtle leaf wind sway
            el.style.transition = "transform 3s ease-in-out";
          });
        }, i * 200);
      });
      await delay(1000);

      // 5. Sepal
      animate(600, p => { $("sepal").setAttribute("opacity", String(p)); });
      await delay(300);

      // 6. Show rose head base
      const roseHead = $("rose-head");
      animate(500, p => { roseHead.setAttribute("opacity", String(p)); });
      await delay(400);

      // 7. Bloom bud petals (innermost first)
      async function bloomLayer(ids: string[], duration: number, stagger: number) {
        for (let i = 0; i < ids.length; i++) {
          const el = document.getElementById(ids[i])!;
          const base = getPetalBase(ids[i]);
          setTimeout(() => {
            animate(duration, p => {
              setPetalStyle(el, base, ease.outElastic(p) * 1.0, Math.min(p * 1.5, 1));
            }, t => t);
          }, i * stagger);
        }
        await delay(ids.length * stagger + duration);
      }

      await bloomLayer(["bp1","bp2","bp3"], 1200, 180);
      await bloomLayer(["ip1","ip2","ip3","ip4"], 1100, 150);
      await bloomLayer(["mp1","mp2","mp3","mp4","mp5"], 1000, 130);
      await bloomLayer(["mop1","mop2","mop3","mop4","mop5","mop6"], 950, 110);
      await bloomLayer(["op1","op2","op3","op4","op5","op6","op7"], 900, 90);

      // 8. Center + pollen appear
      animate(600, p => {
        $("rose-center").setAttribute("opacity", String(p));
        $("pollen-group").setAttribute("opacity", String(p * 0.9));
      });

      // 9. Aura glow
      animate(2000, p => { $("rose-aura").setAttribute("opacity", String(p * 0.6)); });

      // 10. Lens glow + light rays + heartbeat
      $("lens-glow").classList.add("active");
      $("light-rays").classList.add("active");
      await delay(800);
      $("heartbeat-ring").classList.add("active");

      // 11. Bloom phase particles
      bloomPhase = true;
      spawnDust(40);

      // 12. Fireflies start appearing
      for (let i = 0; i < 12; i++) {
        setTimeout(() => spawnFirefly(), i * 400);
      }
      setInterval(spawnFirefly, 3500);

      // 13. Drift petals
      await delay(1000);
      setInterval(spawnDriftPetal, 1400);
      spawnDriftPetal(); spawnDriftPetal();

      // 14. Show text
      await delay(600);
      $("bloom-text").classList.add("visible");
    }

    // ─── Button Click ─────────────────────────────────────────────────────────
    $("bloom-btn").addEventListener("click", () => {
      const wrap = $("bloom-btn-wrap");
      if (wrap.classList.contains("hidden")) return;
      createSparks(window.innerWidth/2, window.innerHeight/2, 20);
      startBloom();
    });

    // ─── Mouse / Touch 3D Tilt ────────────────────────────────────────────────
    let currentTiltX = 0, currentTiltY = 0;
    let targetTiltX = 0, targetTiltY = 0;
    let tiltRAF = 0;

    function tiltLoop() {
      currentTiltX += (targetTiltX - currentTiltX) * 0.06;
      currentTiltY += (targetTiltY - currentTiltY) * 0.06;
      const fc = $("flower-container");
      fc.style.transform = `rotateY(${currentTiltX}deg) rotateX(${currentTiltY}deg)`;
      tiltRAF = requestAnimationFrame(tiltLoop);
    }
    tiltLoop();

    window.addEventListener("mousemove", e => {
      if (!$("stage").classList.contains("visible")) return;
      const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
      targetTiltX = ((e.clientX - cx) / cx) * 10;
      targetTiltY = -((e.clientY - cy) / cy) * 7;
    });

    window.addEventListener("touchmove", e => {
      if (!$("stage").classList.contains("visible")) return;
      const t = e.touches[0];
      const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
      targetTiltX = ((t.clientX - cx) / cx) * 10;
      targetTiltY = -((t.clientY - cy) / cy) * 7;
    }, { passive: true });

    // ─── Click on rose — sparks ───────────────────────────────────────────────
    const roseScene = $("rose-scene");
    roseScene.addEventListener("click", e => {
      if ($("bloom-btn-wrap").classList.contains("hidden")) {
        createSparks(e.clientX, e.clientY, 14);
        spawnDust(8);
      }
    });

    // ─── Petal hover brightness ───────────────────────────────────────────────
    document.querySelectorAll(".petal").forEach(p => {
      p.addEventListener("mouseenter", () => {
        (p as SVGElement).style.filter = "url(#glow-filter) brightness(1.4)";
      });
      p.addEventListener("mouseleave", () => {
        (p as SVGElement).style.filter = "url(#glow-filter)";
      });
    });

    // ─── Cleanup ──────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(starFrame);
      cancelAnimationFrame(tiltRAF);
      window.removeEventListener("resize", resizeStarCanvas);
      window.removeEventListener("resize", resizePCanvas);
      document.head.removeChild(style);
    };
  }, []);

  return <div id="root-inner" />;
}
