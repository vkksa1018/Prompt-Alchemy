export const RUN_MODE = import.meta.env.VITE_RUN_MODE || "online";
export const IS_LOCAL_MODE = RUN_MODE === "local";
export const IS_ONLINE_MODE = RUN_MODE === "online";