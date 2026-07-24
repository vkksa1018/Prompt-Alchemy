const configuredMode = import.meta.env.VITE_RUN_MODE?.trim().toLowerCase();

// Only an explicit local setting enables mock/localStorage behavior.
export const RUN_MODE = configuredMode === "local" ? "local" : "online";
export const IS_LOCAL_MODE = RUN_MODE === "local";
export const IS_ONLINE_MODE = RUN_MODE === "online";
