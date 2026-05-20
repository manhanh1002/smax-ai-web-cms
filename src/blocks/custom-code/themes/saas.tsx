"use client";
import React, { useEffect, useRef } from "react";
import { BlockWrapper } from "../../BlockWrapper";

export function CustomCodeSaaS({ data }: { data: any }) {
  const htmlRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const js = typeof data.js === "string" ? data.js.trim() : "";
    if (!js) return;

    let script: HTMLScriptElement | null = null;

    const timer = setTimeout(() => {
      try {
        script = document.createElement("script");
        script.type = "text/javascript";
        script.text = `(function() { try { ${js} } catch(e) { console.error('Custom JS Error:', e); } })();`;
        document.head.appendChild(script);
      } catch (err) {
        console.error("Custom Code Block JS Error:", err);
      }
    }, 150);

    return () => {
      clearTimeout(timer);
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [data.js]);

  return (
    <BlockWrapper settings={data.settings}>
      <div className="w-full">
        {data.css && (
          <style dangerouslySetInnerHTML={{ __html: data.css }} />
        )}
        <div
          ref={htmlRef}
          dangerouslySetInnerHTML={{ __html: data.html || "" }}
        />
      </div>
    </BlockWrapper>
  );
}
