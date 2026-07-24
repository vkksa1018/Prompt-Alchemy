import { StrictMode, Profiler } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./routes/index.jsx";
import "./styles/global.css";

const onRender = (id, phase, actualDuration) => {
  // 記錄渲染時間，方便在 Console 觀察效能瓶頸
  console.log(`[React Profiler] ${id} (${phase}) - Render time: ${actualDuration.toFixed(2)}ms`);
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Profiler id="AppRouter" onRender={onRender}>
      <RouterProvider router={router} />
    </Profiler>
  </StrictMode>,
);

