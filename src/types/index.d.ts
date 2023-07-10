export {};

declare global {
  interface Window {
    requestIdleCallback: any;
  }
}