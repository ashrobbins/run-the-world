export function PageLoader() {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(255,255,255,0.94)" }}
    >
      <div
        className="w-10 h-10 rounded-full animate-spin"
        style={{
          border: "3px solid var(--color-accent-light)",
          borderTopColor: "var(--color-accent)",
        }}
      />
    </div>
  );
}
