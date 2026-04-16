import { dogBreeds } from '../data/dogBreeds';
import type { DogBreed } from '../types';

interface BreedSelectorProps {
  onSelect: (breed: DogBreed) => void;
}

export function BreedSelector({ onSelect }: BreedSelectorProps) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 20px'
    }}>
      <h1 style={{
        fontSize: '3rem',
        color: '#FFF',
        marginBottom: '10px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
      }}>
        🐕 电子宠物狗
      </h1>
      <p style={{
        fontSize: '1.2rem',
        color: 'rgba(255,255,255,0.9)',
        marginBottom: '40px'
      }}>
        选择你喜欢的狗狗品种，开始你的养宠之旅
      </p>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        maxWidth: '1200px',
        width: '100%'
      }}>
        {dogBreeds.map((breed) => (
          <button
            key={breed.id}
            onClick={() => onSelect(breed)}
            style={{
              background: '#FFF',
              border: 'none',
              borderRadius: '20px',
              padding: '24px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${breed.color} 0%, ${breed.secondaryColor} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem'
              }}>
                🐕
              </div>
              <div>
                <h3 style={{
                  margin: 0,
                  fontSize: '1.3rem',
                  color: '#333',
                  fontWeight: '600'
                }}>
                  {breed.name}
                </h3>
                <p style={{
                  margin: '4px 0 0 0',
                  fontSize: '0.9rem',
                  color: '#888'
                }}>
                  {breed.nameEn}
                </p>
              </div>
            </div>
            
            <p style={{
              margin: 0,
              fontSize: '0.95rem',
              color: '#666',
              lineHeight: '1.5'
            }}>
              {breed.description}
            </p>
            
            <div style={{
              display: 'flex',
              gap: '8px',
              marginTop: '8px'
            }}>
              <span style={{
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '0.8rem',
                background: '#f0f0f0',
                color: '#666'
              }}>
                {breed.size === 'small' ? '小型犬' : breed.size === 'large' ? '大型犬' : '中型犬'}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
