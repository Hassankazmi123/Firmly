export const clearAppCache = async () => {
  try {
    if (typeof caches !== "undefined" && caches.keys) {
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      } catch (e) {
        console.warn("caches.clear failed:", e);
      }
    }

    if (
      typeof navigator !== "undefined" &&
      navigator.serviceWorker &&
      navigator.serviceWorker.getRegistrations
    ) {
      try {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((r) => r.unregister()));
      } catch (e) {
        console.warn("unregister service workers failed:", e);
      }
    }
  } catch (e) {
    console.warn("clearAppCache unexpected error:", e);
  }
};

if (typeof window !== "undefined") {
  window.clearAppCache = clearAppCache;
}

export default clearAppCache;
