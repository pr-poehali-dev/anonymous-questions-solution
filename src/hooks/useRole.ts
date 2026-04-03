import { useState } from "react";

export type Role = "admin" | "user";

let globalRole: Role = "user";
const listeners: Array<() => void> = [];

export function setGlobalRole(role: Role) {
  globalRole = role;
  listeners.forEach((fn) => fn());
}

export function useRole() {
  const [role, setRole] = useState<Role>(globalRole);

  const subscribe = () => {
    const fn = () => setRole(globalRole);
    listeners.push(fn);
    return () => {
      const idx = listeners.indexOf(fn);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  };

  if (!listeners.some(() => true)) {
    // no-op
  }

  // Subscribe on mount via useState initializer trick
  useState(() => {
    const unsub = subscribe();
    return unsub;
  });

  const toggle = () => {
    const next: Role = role === "admin" ? "user" : "admin";
    setGlobalRole(next);
    setRole(next);
  };

  return { role, toggle, isAdmin: role === "admin" };
}
