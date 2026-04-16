interface StatusBarProps {
  label: string;
  value: number;
  color: string;
  icon: string;
}

export function StatusBar({ label, value, color, icon }: StatusBarProps) {
  const percentage = Math.max(0, Math.min(100, value));
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      background: '#FFF',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    }}>
      <span style={{ fontSize: '1.5rem' }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '6px'
        }}>
          <span style={{
            fontSize: '0.85rem',
            color: '#666',
            fontWeight: '500'
          }}>
            {label}
          </span>
          <span style={{
            fontSize: '0.85rem',
            color: '#888'
          }}>
            {Math.round(percentage)}%
          </span>
        </div>
        <div style={{
          width: '100%',
          height: '8px',
          background: '#f0f0f0',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${percentage}%`,
            height: '100%',
            background: color,
            borderRadius: '4px',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>
    </div>
  );
}
