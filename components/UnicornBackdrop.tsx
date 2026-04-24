"use client";

import { useEffect, useId } from "react";

declare global {
  interface Window {
    UnicornStudio?: {
      init?: () => void;
      isInitialized?: boolean;
    };
  }
}

const sdkUrl = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.9/dist/unicornStudio.umd.js";

export function UnicornBackdrop() {
  const reactId = useId();
  const elementId = `unicorn-${reactId.replace(/:/g, "")}`;

  useEffect(() => {
    const init = () => window.UnicornStudio?.init?.();

    if (window.UnicornStudio?.init) {
      init();
      return;
    }

    let script = document.querySelector<HTMLScriptElement>('script[data-unicorn-studio="true"]');
    if (!script) {
      script = document.createElement("script");
      script.src = sdkUrl;
      script.async = true;
      script.dataset.unicornStudio = "true";
      script.onload = init;
      document.head.appendChild(script);
      return;
    }

    script.addEventListener("load", init, { once: true });
    return () => script?.removeEventListener("load", init);
  }, []);

  return (
    <div className="unicorn-backdrop" aria-hidden="true">
      <div id={elementId} data-us-project="cBSzAia5WoBGsnDZu69W" />
    </div>
  );
}
