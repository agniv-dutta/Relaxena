export default function OfflinePage() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="glass rounded-3xl p-8 max-w-lg text-center">
        <h1 className="text-3xl font-black heading-gradient">You are offline</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          You are offline. Rexi will be back when you reconnect.
        </p>
      </div>
    </main>
  );
}
