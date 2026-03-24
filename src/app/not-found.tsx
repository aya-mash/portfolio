export default function NotFound() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0f0a1e', color: '#fff', fontFamily: 'system-ui' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 700, marginBottom: '8px' }}>404</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)' }}>Page not found</p>
      </div>
    </div>
  );
}
