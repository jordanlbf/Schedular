import Header from "@/app/layout/Header";

export default function ColorDemo() {
  return (
    <div className="home-wrap">
      <Header title="Color Scheme Demo" />
      <main className="page">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          
          {/* Red Metric */}
          <div className="data-metric">
            <div className="data-value">85<span className="data-unit">%</span></div>
            <div className="data-label">Primary Red</div>
            <div style={{ marginTop: '16px' }}>
              <span className="status-indicator on">Active</span>
            </div>
          </div>

          {/* Cyan Metric */}
          <div className="data-metric cyan">
            <div className="data-value">72<span className="data-unit" style={{ color: 'var(--accent-cyan)' }}>km/h</span></div>
            <div className="data-label">Cyan Accent</div>
            <div style={{ marginTop: '16px' }}>
              <span className="status-indicator" style={{ background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-cyan)' }}>Running</span>
            </div>
          </div>

          {/* Blue/Grey Metric */}
          <div className="data-metric blue">
            <div className="data-value">42<span className="data-unit" style={{ color: 'var(--accent-secondary)' }}>°C</span></div>
            <div className="data-label">Secondary Color</div>
            <div style={{ marginTop: '16px' }}>
              <span className="status-indicator off">Standby</span>
            </div>
          </div>

        </div>

        {/* Your Custom Color Scheme Display */}
        <div className="panel" style={{ padding: '32px', marginBottom: '32px' }}>
          <h3 style={{ margin: '0 0 24px', color: 'var(--text)' }}>Your Custom Dark Theme</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                background: '#202123', 
                border: '2px solid var(--border)',
                borderRadius: '12px', 
                margin: '0 auto 12px'
              }}></div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>Background</div>
              <div style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>#202123</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                background: '#272728', 
                border: '2px solid var(--border)',
                borderRadius: '12px', 
                margin: '0 auto 12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.35)'
              }}></div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>Surface</div>
              <div style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>#272728</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                background: '#565E63', 
                border: '2px solid var(--border)',
                borderRadius: '12px', 
                margin: '0 auto 12px'
              }}></div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>Primary</div>
              <div style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>#565E63</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                background: '#282C2E', 
                border: '2px solid var(--border)',
                borderRadius: '12px', 
                margin: '0 auto 12px'
              }}></div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>Secondary</div>
              <div style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>#282C2E</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                background: '#EBF3F7', 
                border: '2px solid var(--border)',
                borderRadius: '12px', 
                margin: '0 auto 12px'
              }}></div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>Text Primary</div>
              <div style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>#EBF3F7</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                background: '#AAB6BE', 
                border: '2px solid var(--border)',
                borderRadius: '12px', 
                margin: '0 auto 12px'
              }}></div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>Text Muted</div>
              <div style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>#AAB6BE</div>
            </div>

          </div>
        </div>

        {/* Background Color Display */}
        <div className="panel" style={{ padding: '32px', marginBottom: '32px' }}>
          <h3 style={{ margin: '0 0 24px', color: 'var(--text)' }}>Background Colors</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                background: 'var(--bg)', 
                border: '2px solid var(--border)',
                borderRadius: '12px', 
                margin: '0 auto 12px'
              }}></div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>Background</div>
              <div style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>Light grey base</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                background: 'var(--panel)', 
                border: '2px solid var(--border)',
                borderRadius: '12px', 
                margin: '0 auto 12px',
                boxShadow: 'var(--shadow-glass)'
              }}></div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>Panels</div>
              <div style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>Clean white/dark</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                background: 'var(--panel-elev)', 
                border: '2px solid var(--border)',
                borderRadius: '12px', 
                margin: '0 auto 12px'
              }}></div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>Elevated</div>
              <div style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>Subtle contrast</div>
            </div>

          </div>
        </div>

        {/* Color Palette Display */}
        <div className="panel" style={{ padding: '32px', marginBottom: '32px' }}>
          <h3 style={{ margin: '0 0 24px', color: 'var(--text)' }}>Color Palette</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                background: 'var(--accent-primary)', 
                borderRadius: '12px', 
                margin: '0 auto 12px',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
              }}></div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>Primary Red</div>
              <div style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>#ef4444</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                background: 'var(--accent-cyan)', 
                borderRadius: '12px', 
                margin: '0 auto 12px',
                boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)'
              }}></div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>Cyan</div>
              <div style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>#06b6d4</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                background: 'var(--accent-secondary)', 
                borderRadius: '12px', 
                margin: '0 auto 12px',
                boxShadow: 'var(--shadow-glass)'
              }}></div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>Secondary</div>
              <div style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>Blue/Grey</div>
            </div>

          </div>
        </div>

        {/* Button Examples */}
        <div className="panel" style={{ padding: '32px' }}>
          <h3 style={{ margin: '0 0 24px', color: 'var(--text)' }}>Button Examples</h3>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button className="btn btn-primary">Primary Button</button>
            <button className="btn" style={{ background: 'var(--accent-cyan)', color: 'white', borderColor: 'var(--accent-cyan)' }}>
              Cyan Button
            </button>
            <button className="btn btn-soft">Soft Button</button>
            <button className="btn btn-ghost">Ghost Button</button>
          </div>
        </div>

      </main>
    </div>
  );
}
