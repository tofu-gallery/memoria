// Added by Tofu on 2026-10-28 (AGPL-3.0 section 13): the address of this app's source code,
// which the "Source code" links on the home page and in Settings open.
// VITE_SOURCE_URL is read when the app is built; Tofu's gallery sets it on each copy to the
// exact commit that copy runs. Without it, the links open the version this fork pins.
const PINNED_SOURCE = "https://github.com/tofu-gallery/memoria/tree/pin/2026-10-28";

const configured = (import.meta.env.VITE_SOURCE_URL ?? "").trim();

export const sourceCodeUrl = /^https?:\/\//i.test(configured)
  ? configured
  : PINNED_SOURCE;
