interface ControlPanelProps {
  onFeed: () => void;
  onPet: () => void;
  onWalk: () => void;
  isWalking: boolean;
}

export function ControlPanel({ onFeed, onPet, onWalk, isWalking }: ControlPanelProps) {
  const buttons = [
    { id: 'feed', label: '喂食', icon: '🍖', onClick: onFeed, color: '#FF6B6B' },
    { id: 'pet', label: '摸头', icon: '👋', onClick: onPet, color: '#4ECDC4' },
    { id: 'walk', label: isWalking ? '停止' : '遛狗', icon: isWalking ? '⏹️' : '🚶', onClick: onWalk, color: isWalking ? '#95A5A6' : '#45B7D1' }
  ];

  return (
    <div style={{
      display: 'flex',
      gap: '16px',
      justifyContent: 'center',
      flexWrap: 'wrap'
    }}>
      {buttons.map((btn) => (
        <button
          key={btn.id}
          onClick={btn.onClick}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            padding: '16px 32px',
            background: btn.color,
            border: 'none',
            borderRadius: '16px',
            color: '#FFF',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: `0 4px 15px ${btn.color}40`,
            minWidth: '100px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = `0 6px 20px ${btn.color}60`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = `0 4px 15px ${btn.color}40`;
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'scale(0.95)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
        >
          <span style={{ fontSize: '2rem' }}>{btn.icon}</span>
          <span style={{
            fontSize: '1rem',
            fontWeight: '600'
          }}>
            {btn.label}
          </span>
        </button>
      ))}
    </div>
  );
}
