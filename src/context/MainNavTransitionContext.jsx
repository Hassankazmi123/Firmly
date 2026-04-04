import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";

const MainNavTransitionContext = createContext(null);

const MAIN_PATHS = ["/dashboard", "/amalia-corner"];

const PAGE_PAD =
  "2xl:px-16 xl:px-12 lg:px-8 md:px-6 sm:px-4 px-4";

function isMainPath(p) {
  return MAIN_PATHS.includes(p);
}

export function MainNavTransitionProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [pendingLayout, setPendingLayout] = useState(null);

  const navigateMainView = useCallback(
    (path, options) => {
      if (!isMainPath(path)) {
        navigate(path, options);
        return;
      }
      if (location.pathname === path) return;
      if (isMainPath(location.pathname)) {
        setPendingLayout(path);
      }
      navigate(path, options);
    },
    [navigate, location.pathname]
  );

  useEffect(() => {
    if (!pendingLayout) return;
    const minDisplayMs = 450;
    const id = setTimeout(() => setPendingLayout(null), minDisplayMs);
    return () => clearTimeout(id);
  }, [location.pathname, pendingLayout]);

  const value = {
    navigateMainView,
    showSkeleton: pendingLayout != null,
    skeletonTarget: pendingLayout,
  };

  return (
    <MainNavTransitionContext.Provider value={value}>
      {children}
      <MainNavSkeletonOverlay />
    </MainNavTransitionContext.Provider>
  );
}

export function useMainNavTransition() {
  return useContext(MainNavTransitionContext);
}

function MainNavSkeletonOverlay() {
  const ctx = useContext(MainNavTransitionContext);
  if (!ctx?.skeletonTarget) return null;

  const target = ctx.skeletonTarget;
  if (target === "/amalia-corner") {
    return <AmaliaCornerSkeletonLayout />;
  }
  return <DashboardSkeletonLayout />;
}

function NavRowSkeleton() {
  return (
    <div className={`flex items-center justify-between ${PAGE_PAD} py-2`}>
      <div className="h-7 w-24 rounded bg-white/25 animate-pulse" />
      <div className="hidden md:flex items-center gap-3">
        <div className="h-9 w-28 rounded-xl bg-[#7d7cd9]/90 border border-white/20 animate-pulse" />
        <div className="h-9 w-36 rounded-xl bg-white/15 animate-pulse" />
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden sm:block h-5 w-20 rounded bg-white/20 animate-pulse" />
        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-[#7d7cd9] border border-white/20 animate-pulse" />
      </div>
    </div>
  );
}

/** Mirrors Dashboard: DashboardHeader (nav + Hero) + Grow & Glow + Leadership Pathway */
function DashboardSkeletonLayout() {
  return (
    <div
      className="fixed inset-0 z-[10000] flex flex-col min-h-screen cursor-wait overflow-y-auto bg-[#f5f5f5]"
      aria-busy="true"
      aria-live="polite"
    >
      <header className="bg-[#6664D3] rounded-b-3xl relative overflow-hidden shrink-0">
        <div className="absolute top-0 left-0 w-[613px] h-[515px] bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-b-3xl" />
        <NavRowSkeleton />
        <div className={`relative z-10 ${PAGE_PAD} lg:py-8 py-4 pb-8`}>
          <div className="h-9 sm:h-11 w-56 max-w-[85%] rounded-lg bg-white/20 animate-pulse mb-2" />
          <div className="h-4 w-full max-w-2xl rounded bg-white/15 animate-pulse mb-1" />
          <div className="h-4 w-full max-w-xl rounded bg-white/10 animate-pulse mb-4" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-start mt-6 lg:mt-7">
            <div className="flex flex-col items-center justify-center">
              <div className="flex gap-4 mb-4 self-start">
                <div className="h-3 w-16 rounded-full bg-white/20 animate-pulse" />
              </div>
              <div className="w-full max-w-md aspect-square max-h-[350px] lg:max-h-[450px] rounded-full border border-white/15 bg-white/10 animate-pulse" />
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/20 bg-[#7d7cd9]/90 p-4 lg:p-5 animate-pulse min-h-[120px]" />
              <div className="rounded-2xl border border-white/20 bg-[#7d7cd9]/90 p-4 lg:p-5 animate-pulse min-h-[200px]" />
            </div>
          </div>
        </div>
      </header>

      <div className={`flex-1 ${PAGE_PAD}`}>
        <section className="py-8 lg:py-12">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="h-8 w-44 rounded bg-[#6664D3]/12 animate-pulse" />
              <div className="h-4 w-full max-w-md rounded bg-[#3D3D3D]/10 animate-pulse" />
            </div>
            <div className="h-11 w-48 rounded-xl bg-[#3D3D3D]/15 animate-pulse hidden sm:block" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="min-h-[180px] lg:min-h-[250px] rounded-2xl border border-[#0000000A] bg-gray-200/70 animate-pulse" />
            <div className="min-h-[180px] lg:min-h-[250px] rounded-2xl border border-[#0000000A] bg-gray-200/70 animate-pulse" />
          </div>
        </section>

        <section className="py-8 lg:py-12 px-4 sm:px-6 lg:px-8 border border-[#E8E8E8] rounded-2xl mb-8">
          <div className="h-8 w-52 rounded bg-gray-300/50 animate-pulse mb-2" />
          <div className="h-4 w-72 max-w-full rounded bg-gray-300/35 animate-pulse mb-10 sm:mb-12" />
          <div className="mb-8 max-w-4xl">
            <div className="flex justify-between items-end px-1 sm:px-2 mb-0 relative z-10">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-7 h-7 lg:w-10 lg:h-10 rounded-full bg-white border-2 border-[#E5E5E5] shadow-sm shrink-0 animate-pulse"
                />
              ))}
            </div>
            <div className="relative h-2 lg:h-4 rounded-full bg-[#E5E5E5] -mt-3 lg:-mt-5 mx-2 sm:mx-4">
              <div className="absolute left-0 top-0 h-full w-[25%] rounded-full bg-[#5C91E0]/70 animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-2xl border-2 border-[#f7f7f7] bg-white p-4 md:p-5 min-h-[180px] animate-pulse"
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function AmaliaNavRowSkeleton() {
  return (
    <div className={`flex items-center justify-between h-16 ${PAGE_PAD}`}>
      <div className="h-7 w-24 rounded bg-white/25 animate-pulse" />
      <div className="hidden md:flex items-center gap-3">
        <div className="h-9 w-28 rounded-xl bg-[#7d7cd9]/90 border border-white/20 animate-pulse" />
        <div className="h-9 w-36 rounded-xl bg-white/15 animate-pulse" />
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden sm:block h-5 w-20 rounded bg-white/20 animate-pulse" />
        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-[#7d7cd9] border border-white/20 animate-pulse" />
      </div>
    </div>
  );
}

/** Mirrors AmaliaCorner: Header2 + sidebar + main chat card */
function AmaliaCornerSkeletonLayout() {
  return (
    <div
      className="fixed inset-0 z-[10000] flex flex-col h-screen overflow-hidden cursor-wait bg-[#f5f5f5]"
      aria-busy="true"
      aria-live="polite"
    >
      <header className="bg-[#6664D3] shrink-0 shadow-md sticky top-0 z-50">
        <AmaliaNavRowSkeleton />
      </header>

      <div className={`flex-1 min-h-0 py-6 ${PAGE_PAD}`}>
        <div className="flex flex-col md:flex-row h-full min-h-0 gap-0 md:gap-4">
          <aside className="hidden md:flex w-full md:w-1/4 lg:w-1/5 max-w-[260px] shrink-0 flex-col bg-white rounded-2xl border border-[#ECECEC] p-4 overflow-hidden">
            <div className="h-8 w-[85%] rounded bg-[#6664D3]/10 animate-pulse mb-4" />
            <div className="h-11 w-full rounded-xl border border-[#ECECEC] bg-[#F5F5F5]/80 animate-pulse mb-4" />
            <div className="text-[10px] uppercase tracking-wide text-black/20 mb-2 px-1">
              Recent
            </div>
            <div className="flex-1 space-y-2 overflow-hidden">
              <div className="h-[72px] rounded-xl border border-[#ECECEC] bg-[#F5F5F5] animate-pulse" />
              <div className="h-12 rounded-xl border border-[#ECECEC] bg-[#F5F5F5] ml-4 animate-pulse" />
              <div className="h-12 rounded-xl border border-[#ECECEC] bg-[#F5F5F5] ml-4 animate-pulse" />
              <div className="h-12 rounded-xl border border-[#ECECEC] bg-[#F5F5F5] ml-4 animate-pulse" />
            </div>
          </aside>

          <div className="flex-1 flex flex-col min-h-0 bg-white rounded-2xl border border-[#ECECEC] overflow-hidden">
            <div className="p-4 flex items-center gap-4 shrink-0 border-b border-[#ECECEC]/60">
              <div className="md:hidden w-10 h-10 rounded-lg bg-gray-100 animate-pulse" />
              <div className="h-8 w-52 max-w-[70%] rounded-md bg-[#6664D3]/10 animate-pulse" />
            </div>
            <div className="flex-1 min-h-0 overflow-hidden p-4 space-y-5">
              <div className="flex gap-3 max-w-5xl mx-auto w-full">
                <div className="w-9 h-9 rounded-full bg-[#6664D3]/20 shrink-0 animate-pulse" />
                <div className="flex-1 h-24 max-w-lg rounded-2xl bg-[#F5F5F5] border border-[#ECECEC] animate-pulse" />
              </div>
              <div className="flex gap-3 flex-row-reverse max-w-5xl mx-auto w-full">
                <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0 animate-pulse" />
                <div className="flex-1 h-16 max-w-sm rounded-2xl bg-[#6664D3]/8 border border-[#6664D3]/10 animate-pulse" />
              </div>
              <div className="h-20 max-w-3xl rounded-xl bg-gray-100/90 animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl w-full">
                <div className="h-36 rounded-2xl bg-[#378C78]/20 border border-[#378C78]/15 animate-pulse" />
                <div className="h-36 rounded-2xl bg-[#C56A55]/20 border border-[#C56A55]/15 animate-pulse" />
              </div>
            </div>
            <div className="p-3 px-4 border-t border-[#ECECEC] shrink-0">
              <div className="h-12 w-full rounded-xl bg-[#F5F5F5] border border-[#ECECEC] animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
