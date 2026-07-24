import "./LoadingScreen.css";

export default function LoadingScreen() {
  return (
    <div className="loading-overlay">
      <div className="loading-container">
        {/* Track Line */}
        <div className="running-track">
          {/* Running Duck Container */}
          <div className="duck-runner">
            <svg viewBox="0 0 100 80" className="duck-svg">
              {/* Body */}
              <path
                d="M 20,50 Q 15,35 30,30 Q 55,20 70,35 Q 85,38 90,50 Q 80,68 50,68 Q 25,68 20,50 Z"
                fill="#FFEB3B"
              />
              {/* Wing */}
              <path
                d="M 30,45 Q 45,35 55,45 Q 45,55 30,45 Z"
                fill="#FDD835"
              />
              {/* Head */}
              <circle cx="70" cy="25" r="18" fill="#FFEB3B" />
              {/* Blush Cheek */}
              <circle cx="65" cy="28" r="4" fill="#FF8A80" opacity="0.7" />
              {/* Eye */}
              <circle cx="76" cy="22" r="2.5" fill="#000000" />
              <circle cx="77" cy="21" r="0.8" fill="#FFFFFF" />
              {/* Beak */}
              <path d="M 85,24 Q 95,26 92,32 Q 83,32 85,24 Z" fill="#FF9800" />
              {/* Front Foot */}
              <path
                className="duck-foot foot-front"
                d="M 45,66 Q 48,76 43,76 Q 38,76 40,66"
                stroke="#FF9800"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
              {/* Back Foot */}
              <path
                className="duck-foot foot-back"
                d="M 58,66 Q 61,76 56,76 Q 51,76 53,66"
                stroke="#FF9800"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
        </div>
        
        {/* Loading text */}
        <div className="loading-text">
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
