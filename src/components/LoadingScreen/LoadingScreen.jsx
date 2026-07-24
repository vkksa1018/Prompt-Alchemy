import "./LoadingScreen.css";
import loadingGif from "../../assets/loading_pot.gif";

export default function LoadingScreen({ fadeOut }) {
  return (
    <div className={`loading-overlay ${fadeOut ? "loading-fade-out" : ""}`}>
      <div className="loading-container">
        <div>
          <img src={loadingGif} alt="Loading..." className="w-48 h-48" />
        </div>

        <div
          className="loading-text"
          role="status"
          aria-live="polite"
          aria-label="煉製中"
        >
          <span>咕</span>
          <span>嚕</span>
          <span>咕</span>
          <span>嚕</span>
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </div>
      </div>
    </div>
  );
}
