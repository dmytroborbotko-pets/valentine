"use client";

import { useRef, useState, useCallback } from "react";
import FlowerCanvas, { FlowerCanvasHandle } from "./FlowerCanvas";

export default function ValentinePage() {
  const canvasRef = useRef<FlowerCanvasHandle>(null);
  const [fireworksTriggered, setFireworksTriggered] = useState(false);

  const handlePageClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Don't burst on button clicks
    if ((e.target as HTMLElement).closest("button")) return;
    canvasRef.current?.spawnBurst(e.clientX, e.clientY);
  }, []);

  const handleYes = useCallback(() => {
    if (fireworksTriggered) return;
    setFireworksTriggered(true);
    canvasRef.current?.triggerFireworks();
  }, [fireworksTriggered]);

  return (
    <div
      onClick={handlePageClick}
      className="relative flex h-dvh w-screen flex-col items-center justify-center overflow-hidden"
      style={{ background: "#facafa" }}
    >
      <FlowerCanvas ref={canvasRef} />

      <div className="relative z-20 flex flex-col items-center gap-8 px-6 text-center">
        {!fireworksTriggered ? (
          <>
            <h1
              className="valentine-heading font-cursive text-5xl leading-tight sm:text-7xl md:text-8xl"
              style={{ lineHeight: 1.3, paddingRight: 10, paddingLeft: 2 }}
            >
              Пані бублик, чи будете ви моїм Валентином?
            </h1>

            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
              <button
                onClick={handleYes}
                className="valentine-btn font-cursive"
              >
                ТАК
              </button>
              <button
                onClick={handleYes}
                className="valentine-btn font-cursive"
              >
                ЗВІІІСНООО
              </button>
            </div>
          </>
        ) : (
          <div className="fade-in flex flex-col items-center gap-6">
            <h1
              className="valentine-heading font-cursive text-5xl leading-tight sm:text-7xl md:text-8xl"
              style={{ lineHeight: 1.3, paddingRight: 10 }}
            >
              ХІХІХІХІ <br /> Я ЗНАВ
            </h1>
            <p
              className="valentine-heading font-cursive text-3xl sm:text-4xl md:text-5xl"
              style={{
                paddingTop: 3,
                paddingBottom: 9,
              }}
            >
              Запрошую свою любов у
            </p>

            {/* Reservation card */}
            <div
              className="mt-4 w-full rounded-3xl text-left"
              style={{
                maxWidth: "min(90vw, 32rem)",
                padding: "clamp(16px, 3vw, 28px)",
                background: "rgba(255, 215, 235, 0.8)",
                backdropFilter: "blur(14px)",
                boxShadow: "0 8px 32px rgba(214, 51, 132, 0.18)",
              }}
            >
              <h2
                className="font-bold"
                style={{
                  color: "#d63384",
                  fontSize: "clamp(18px, 3.5vw, 26px)",
                }}
              >
                KVITKOVA.Оранжерея
              </h2>
              <p
                style={{
                  marginTop: 4,
                  color: "rgba(214, 51, 132, 0.55)",
                  fontSize: "clamp(13px, 2.5vw, 16px)",
                }}
              >
                просп. Академіка Глушкова, буд. 1П28
              </p>

              <div
                className="flex flex-wrap items-center"
                style={{ marginTop: 12, gap: 8 }}
              >
                <span
                  className="rounded-full font-semibold text-white"
                  style={{
                    background: "linear-gradient(135deg, #ff6b9d, #ff3366)",
                    padding: "6px 14px",
                    fontSize: "clamp(12px, 2vw, 14px)",
                  }}
                >
                  ➤ Чекають найкращу пару у всесвіті
                </span>
                <span
                  className="rounded-full"
                  style={{
                    border: "2px solid #f0b0c8",
                    color: "#d63384",
                    padding: "6px 14px",
                    fontSize: "clamp(12px, 2vw, 14px)",
                  }}
                >
                  📅 15 лют., 19:00
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
