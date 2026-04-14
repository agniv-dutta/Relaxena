import { useEffect, useState, useRef, useCallback } from "react";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";

export function useWebSocket<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<"connecting" | "open" | "closed">("connecting");
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<number | null>(null);
  const connectRef = useRef<() => void>(() => {});

  const connect = useCallback(() => {
    try {
      const socketUrl = `${WS_URL}${path}`;
      ws.current = new WebSocket(socketUrl);

      ws.current.onopen = () => {
        setStatus("open");
        console.log(`WebSocket connected to ${path}`);
      };

      ws.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as T;
          setData(message);
        } catch {
          // Ignore heartbeat/plain-text messages like "pong".
        }
      };

      ws.current.onclose = () => {
        setStatus("closed");
        console.log(`WebSocket disconnected from ${socketUrl}`);
        reconnectTimer.current = window.setTimeout(() => {
          connectRef.current();
        }, 5000);
      };

      ws.current.onerror = () => {
        console.warn(`WebSocket error while connecting to ${socketUrl}`);
        ws.current?.close();
      };
    } catch (err) {
      console.error("Connection failed:", err);
    }
  }, [path]);

  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimer.current !== null) {
        clearTimeout(reconnectTimer.current);
      }
      ws.current?.close();
    };
  }, [connect]);

  const send = (message: unknown) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  };

  return { data, status, send };
}
