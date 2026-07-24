import "./LoadingScreen.css";

export default function LoadingScreen({ fadeOut }) {
  return (
    <div className={`loading-overlay ${fadeOut ? "loading-fade-out" : ""}`}>
      <div className="loading-container">
        <div className="cauldron-wrapper">
          <svg
            viewBox="0 0 200 205"
            className="cauldron-svg"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* ── 漸層 ── */}
              <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#262626" />
                <stop offset="100%" stopColor="#0c0c0c" />
              </linearGradient>

              <radialGradient id="liquidGrad" cx="40%" cy="35%" r="62%">
                <stop offset="0%"   stopColor="#aeff55" stopOpacity="1"   />
                <stop offset="55%"  stopColor="#39FF14" stopOpacity="0.92"/>
                <stop offset="100%" stopColor="#0a4a00" stopOpacity="0.7" />
              </radialGradient>

              <linearGradient id="ladleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#aaa" />
                <stop offset="45%"  stopColor="#eee" />
                <stop offset="100%" stopColor="#888" />
              </linearGradient>

              {/* ── 把勺子剪裁到鍋身內部 ── */}
              <clipPath id="cauldronInterior">
                <path d="M 42,90 Q 38,178 100,181 Q 162,178 158,90 Z" />
              </clipPath>

              {/* ── 鍋沿環形遮罩（中空圓環） ── */}
              <mask id="rimDonut">
                <ellipse cx="100" cy="90" rx="60" ry="15" fill="white" />
                <ellipse cx="100" cy="90" rx="52" ry="10" fill="black"  />
              </mask>
            </defs>

            {/* ─── 煙霧 ─── */}
            <path className="smoke smoke-l" d="M 78,78 Q 66,63 74,49 Q 82,35 70,22"
              stroke="#9fc99f" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.5" />
            <path className="smoke smoke-m" d="M 100,73 Q 88,57 100,43 Q 112,29 100,15"
              stroke="#b8ddb8" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.6" />
            <path className="smoke smoke-r" d="M 122,78 Q 134,63 126,49 Q 118,35 130,22"
              stroke="#9fc99f" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.5" />

            {/* ─── 鍋腳 ─── */}
            <rect x="73"  y="177" width="11" height="20" rx="4" fill="#1c1c1c" />
            <rect x="116" y="177" width="11" height="20" rx="4" fill="#1c1c1c" />

            {/* ─── 鍋身 ─── */}
            <path d="M 42,90 Q 38,178 100,181 Q 162,178 158,90 Z" fill="url(#bodyGrad)" />
            {/* 側面高光 */}
            <path d="M 54,102 Q 51,160 82,170"
              stroke="#383838" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />

            {/* ─── 攪拌勺（用 clipPath 限制在鍋內，animateTransform 旋轉）─── */}
            {/*
                勺頭初始位置在 (100, 116)，距旋轉圓心 (100, 90) = 26px。
                clipPath 讓勺子只在 y≥90 的鍋身內部顯示。
                液體表面畫在上方，蓋住勺子「背面」行程，產生立體深度感。
            */}
            <g clipPath="url(#cauldronInterior)">
              <g>
                {/* 勺柄 */}
                <rect x="96.5" y="90" width="7" height="26" rx="3.5" fill="url(#ladleGrad)" />
                {/* 勺頭外緣 */}
                <ellipse cx="100" cy="118" rx="13" ry="9" fill="url(#ladleGrad)" />
                {/* 勺頭內凹陰影 → 立體感 */}
                <ellipse cx="100" cy="119" rx="8"  ry="5.5" fill="#082208" opacity="0.65" />

                {/* SVG 原生旋轉，圓心固定在鍋口中心 (100, 90) */}
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 100 90"
                  to="360 100 90"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </g>
            </g>

            {/* ─── 液體表面（畫在勺子上方，蓋住「背面」行程） ─── */}
            <ellipse
              className="liquid-surface"
              cx="100" cy="90" rx="52" ry="10"
              fill="url(#liquidGrad)"
            />

            {/* ─── 氣泡（錯開時序，從液面往上冒） ─── */}
            <circle className="bubble bubble-1" cx="86"  cy="90" r="3"   fill="#39FF14" opacity="0.9"  />
            <circle className="bubble bubble-2" cx="112" cy="90" r="2"   fill="#90ff50" opacity="0.75" />
            <circle className="bubble bubble-3" cx="99"  cy="90" r="4"   fill="#39FF14" opacity="0.85" />
            <circle className="bubble bubble-4" cx="120" cy="90" r="2.5" fill="#c0ff80" opacity="0.65" />
            <circle className="bubble bubble-5" cx="78"  cy="90" r="2"   fill="#39FF14" opacity="0.6"  />

            {/* ─── 鍋沿環圈（壓在液體與勺子上方，增加 3D 深度） ─── */}
            <ellipse cx="100" cy="90" rx="60" ry="15" fill="#3a3a3a" mask="url(#rimDonut)" />
            {/* 鍋沿高光線 */}
            <ellipse cx="100" cy="88" rx="57" ry="12"
              fill="none" stroke="#545454" strokeWidth="1.5" opacity="0.55" />

            {/* ─── 兩側把手 ─── */}
            <path d="M 40,90 Q 20,82 22,70 Q 24,60 42,64"
              stroke="#383838" strokeWidth="9" strokeLinecap="round" fill="none" />
            <path d="M 160,90 Q 180,82 178,70 Q 176,60 158,64"
              stroke="#383838" strokeWidth="9" strokeLinecap="round" fill="none" />
          </svg>
        </div>

        {/* ─── 文字 ─── */}
        <div className="loading-text" role="status" aria-live="polite" aria-label="煉製中">
          <span>煉</span>
          <span>製</span>
          <span>中</span>
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </div>
      </div>
    </div>
  );
}
