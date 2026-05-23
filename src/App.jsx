import { useState, useEffect, useRef, useCallback } from 'react'

function shadeColor(color, percent) {
  const num = parseInt(color.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) + amt
  const G = (num >> 8 & 0x00FF) + amt
  const B = (num & 0x0000FF) + amt
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)
}

const DOG_BREEDS = [
  { id: 'golden', name: '金毛寻回犬', emoji: '🐕', color: '#DAA520', traits: '温顺友善、聪明活泼', size: 'large' },
  { id: 'husky', name: '西伯利亚哈士奇', emoji: '🐺', color: '#708090', traits: '精力充沛、顽皮好动', size: 'medium' },
  { id: 'corgi', name: '威尔士柯基犬', emoji: '🐕', color: '#D2691E', traits: '可爱短腿、活泼开朗', size: 'small' },
  { id: 'labrador', name: '拉布拉多', emoji: '🦮', color: '#2F1810', traits: '忠诚可靠、温和聪明', size: 'large' },
  { id: 'poodle', name: '贵宾犬', emoji: '🐩', color: '#F5F5DC', traits: '优雅聪明、易于训练', size: 'medium' },
  { id: 'shiba', name: '柴犬', emoji: '🐕', color: '#CD853F', traits: '独立傲娇、表情丰富', size: 'small' },
  { id: 'german_shepherd', name: '德国牧羊犬', emoji: '🐕', color: '#8B4513', traits: '勇敢忠诚、工作能力强', size: 'large' },
  { id: 'beagle', name: '比格犬', emoji: '🐶', color: '#DEB887', traits: '友善好奇、嗅觉灵敏', size: 'medium' },
]

const SPEECH_TEXTS = {
  hungry: ['肚子好饿...', '想吃东西了~', '主人，我饿了'],
  thirsty: ['好渴啊...', '想喝水~', '嘴巴干干的'],
  tired: ['好困...', '想睡觉了~', '眼睛睁不开了'],
  bored: ['好无聊啊...', '想玩~', '主人陪我玩嘛'],
  happy: ['好开心！', '汪汪~', '最喜欢主人了！'],
  fed: ['谢谢主人！好好吃~', '吃饱啦！', '真香！'],
  watered: ['咕噜咕噜~好解渴！', '谢谢主人的水~', '清爽！'],
  petted: ['好舒服~', '再摸摸嘛~', '嘿嘿~', '最喜欢被摸头了'],
  walked: ['出去玩好开心！', '汪汪汪！', '太棒了！'],
  played: ['好玩好玩！', '再来一次！', '哈哈~'],
  sleeping: ['Zzz...', '呼噜呼噜~', '(睡得很香)'],
  wakeup: ['啊...睡得好香~', '精神满满！', '早上好~'],
}

const MOOD_EMOJIS = {
  happy: '😊',
  neutral: '😐',
  sad: '😢',
  tired: '😴',
  hungry: '😟',
  playful: '🤗',
}

function App() {
  const [gameState, setGameState] = useState('selection')
  const [selectedBreed, setSelectedBreed] = useState(null)
  const [petName, setPetName] = useState('')
  const [dogState, setDogState] = useState({
    x: 400,
    y: 300,
    targetX: 400,
    targetY: 300,
    action: 'idle',
    direction: 1,
    frame: 0,
    stats: {
      hunger: 80,
      thirst: 80,
      energy: 100,
      happiness: 70,
    },
    lastInteraction: Date.now(),
  })
  const [speechBubble, setSpeechBubble] = useState(null)
  const [isWalking, setIsWalking] = useState(false)
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const lastTimeRef = useRef(0)
  const statsUpdateRef = useRef(null)
  const dogStateRef = useRef(dogState)
  const selectedBreedRef = useRef(selectedBreed)

  useEffect(() => {
    dogStateRef.current = dogState
  }, [dogState])

  useEffect(() => {
    selectedBreedRef.current = selectedBreed
  }, [selectedBreed])

  const showSpeech = useCallback((category) => {
    const texts = SPEECH_TEXTS[category]
    if (texts) {
      const text = texts[Math.floor(Math.random() * texts.length)]
      setSpeechBubble({ text, timestamp: Date.now() })
    }
  }, [])

  const getMood = useCallback((stats) => {
    const avg = (stats.hunger + stats.thirst + stats.energy + stats.happiness) / 4
    if (stats.energy < 20) return 'tired'
    if (stats.hunger < 30) return 'hungry'
    if (avg > 70) return 'happy'
    if (avg > 40) return 'neutral'
    return 'sad'
  }, [])

  const updateStats = useCallback(() => {
    setDogState(prev => {
      const timePassed = (Date.now() - prev.lastInteraction) / 1000
      const decayRate = 0.5
      
      const newStats = {
        hunger: Math.max(0, prev.stats.hunger - decayRate * (timePassed / 60)),
        thirst: Math.max(0, prev.stats.thirst - decayRate * 1.2 * (timePassed / 60)),
        energy: Math.max(0, Math.min(100, prev.stats.energy - decayRate * 0.3 * (timePassed / 60))),
        happiness: Math.max(0, prev.stats.happiness - decayRate * 0.5 * (timePassed / 60)),
      }

      if (newStats.hunger < 20 && Math.random() < 0.1) showSpeech('hungry')
      if (newStats.thirst < 20 && Math.random() < 0.1) showSpeech('thirsty')
      if (newStats.energy < 20 && Math.random() < 0.1) showSpeech('tired')
      if (newStats.happiness < 30 && Math.random() < 0.1) showSpeech('bored')

      return {
        ...prev,
        stats: newStats,
        lastInteraction: Date.now(),
      }
    })
  }, [showSpeech])

  const moveDogRandomly = useCallback(() => {
    if (isWalking) return
    
    setDogState(prev => {
      if (prev.action !== 'idle' && prev.action !== 'walking') return prev
      
      const canvas = canvasRef.current
      if (!canvas) return prev
      
      const padding = 100
      const minX = padding
      const maxX = canvas.width - padding
      const minY = 250
      const maxY = canvas.height - 120
      
      const newX = minX + Math.random() * (maxX - minX)
      const newY = minY + Math.random() * (maxY - minY)
      
      return {
        ...prev,
        targetX: newX,
        targetY: newY,
        action: 'walking',
        direction: newX > prev.x ? 1 : -1,
      }
    })
  }, [isWalking])

  const drawDog = useCallback((ctx, x, y, breed, action, direction, frame) => {
    ctx.save()
    ctx.translate(x, y)
    if (direction === -1) {
      ctx.scale(-1, 1)
    }

    const sizeMultiplier = breed.size === 'large' ? 1.4 : breed.size === 'small' ? 0.75 : 1
    const baseSize = 45 * sizeMultiplier
    const bodyColor = breed.color
    const darkerColor = shadeColor(breed.color, -20)
    const lighterColor = shadeColor(breed.color, 30)

    const bobOffset = action === 'walking' ? Math.sin(frame * 0.3) * 4 : 0
    const tailWag = Math.sin(frame * 0.15) * 25
    const legMove = action === 'walking' ? Math.sin(frame * 0.4) * 8 : 0

    ctx.fillStyle = bodyColor
    ctx.beginPath()
    ctx.ellipse(-baseSize * 0.1, bobOffset, baseSize * 0.7, baseSize * 0.45, 0, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = lighterColor
    ctx.beginPath()
    ctx.ellipse(-baseSize * 0.2, bobOffset + baseSize * 0.1, baseSize * 0.35, baseSize * 0.25, 0, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = bodyColor
    ctx.beginPath()
    ctx.ellipse(baseSize * 0.55, bobOffset - baseSize * 0.15, baseSize * 0.4, baseSize * 0.35, 0.1, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = darkerColor
    ctx.beginPath()
    ctx.ellipse(baseSize * 0.75, bobOffset - baseSize * 0.05, baseSize * 0.15, baseSize * 0.12, 0.3, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = bodyColor
    ctx.beginPath()
    ctx.ellipse(baseSize * 0.35, bobOffset - baseSize * 0.55, baseSize * 0.32, baseSize * 0.28, -0.1, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = darkerColor
    ctx.beginPath()
    ctx.ellipse(baseSize * 0.85, bobOffset - baseSize * 0.5, baseSize * 0.12, baseSize * 0.08, 0.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(baseSize * 0.7, bobOffset - baseSize * 0.65, baseSize * 0.08, baseSize * 0.06, -0.3, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = bodyColor
    ctx.beginPath()
    ctx.moveTo(baseSize * 0.5, bobOffset - baseSize * 0.35)
    ctx.quadraticCurveTo(baseSize * 0.7, bobOffset - baseSize * 0.5, baseSize * 0.9, bobOffset - baseSize * 0.3)
    ctx.quadraticCurveTo(baseSize * 0.7, bobOffset - baseSize * 0.25, baseSize * 0.5, bobOffset - baseSize * 0.35)
    ctx.fill()

    ctx.fillStyle = '#1a1a1a'
    ctx.beginPath()
    ctx.ellipse(baseSize * 0.95, bobOffset - baseSize * 0.4, baseSize * 0.05, baseSize * 0.06, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(baseSize * 0.75, bobOffset - baseSize * 0.45, baseSize * 0.05, baseSize * 0.06, 0, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#2a1810'
    ctx.beginPath()
    ctx.ellipse(baseSize * 0.85, bobOffset - baseSize * 0.28, baseSize * 0.06, baseSize * 0.04, 0.2, 0, Math.PI * 2)
    ctx.fill()

    if (action === 'sleeping') {
      ctx.strokeStyle = '#333'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(baseSize * 0.92, bobOffset - baseSize * 0.38, baseSize * 0.03, 0, Math.PI, true)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(baseSize * 0.72, bobOffset - baseSize * 0.43, baseSize * 0.03, 0, Math.PI, true)
      ctx.stroke()
      
      ctx.font = `bold ${14 * sizeMultiplier}px Arial`
      ctx.fillStyle = '#666'
      ctx.fillText('Z', baseSize * 0.5, bobOffset - baseSize * 0.9)
      ctx.font = `bold ${10 * sizeMultiplier}px Arial`
      ctx.fillText('z', baseSize * 0.7, bobOffset - baseSize * 1.1)
    } else {
      ctx.fillStyle = '#fff'
      ctx.beginPath()
      ctx.arc(baseSize * 0.93, bobOffset - baseSize * 0.42, baseSize * 0.015, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(baseSize * 0.73, bobOffset - baseSize * 0.47, baseSize * 0.015, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.fillStyle = '#3a2820'
    ctx.beginPath()
    ctx.ellipse(baseSize * 0.88, bobOffset - baseSize * 0.18, baseSize * 0.04, baseSize * 0.025, 0.1, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#ffb6c1'
    ctx.beginPath()
    ctx.ellipse(baseSize * 0.88, bobOffset - baseSize * 0.12, baseSize * 0.025, baseSize * 0.015, 0, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = bodyColor
    const legY = bobOffset + baseSize * 0.35
    ctx.beginPath()
    ctx.ellipse(-baseSize * 0.35, legY + legMove, baseSize * 0.1, baseSize * 0.2, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(-baseSize * 0.05, legY - legMove, baseSize * 0.1, baseSize * 0.2, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(baseSize * 0.15, legY + legMove * 0.5, baseSize * 0.1, baseSize * 0.18, 0, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = darkerColor
    ctx.beginPath()
    ctx.ellipse(-baseSize * 0.35, legY + legMove + baseSize * 0.15, baseSize * 0.08, baseSize * 0.06, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(-baseSize * 0.05, legY - legMove + baseSize * 0.15, baseSize * 0.08, baseSize * 0.06, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(baseSize * 0.15, legY + legMove * 0.5 + baseSize * 0.13, baseSize * 0.07, baseSize * 0.05, 0, 0, Math.PI * 2)
    ctx.fill()

    ctx.save()
    ctx.translate(-baseSize * 0.5, bobOffset - baseSize * 0.2)
    ctx.rotate((tailWag * Math.PI) / 180)
    ctx.fillStyle = bodyColor
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.quadraticCurveTo(-baseSize * 0.2, -baseSize * 0.3, -baseSize * 0.15, -baseSize * 0.5)
    ctx.quadraticCurveTo(-baseSize * 0.1, -baseSize * 0.3, baseSize * 0.1, 0)
    ctx.closePath()
    ctx.fill()
    ctx.restore()

    if (action === 'happy' || action === 'playing') {
      ctx.fillStyle = '#FFD700'
      ctx.font = `${16 * sizeMultiplier}px Arial`
      ctx.fillText('✨', baseSize * 0.3, bobOffset - baseSize * 0.8)
      ctx.fillText('✨', baseSize * 0.8, bobOffset - baseSize * 0.6)
    }

    ctx.restore()
  }, [])

  const drawScene = useCallback((ctx, canvas) => {
    const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.6)
    skyGradient.addColorStop(0, '#87CEEB')
    skyGradient.addColorStop(0.5, '#B0E0E6')
    skyGradient.addColorStop(1, '#E0F7FA')
    ctx.fillStyle = skyGradient
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.6)

    const grassGradient = ctx.createLinearGradient(0, canvas.height * 0.5, 0, canvas.height)
    grassGradient.addColorStop(0, '#90EE90')
    grassGradient.addColorStop(0.3, '#7CCD7C')
    grassGradient.addColorStop(1, '#228B22')
    ctx.fillStyle = grassGradient
    ctx.fillRect(0, canvas.height * 0.5, canvas.width, canvas.height * 0.5)

    ctx.fillStyle = '#8B4513'
    ctx.fillRect(0, canvas.height - 30, canvas.width, 30)
    ctx.fillStyle = '#654321'
    for (let i = 0; i < canvas.width; i += 40) {
      ctx.fillRect(i, canvas.height - 30, 2, 30)
    }

    ctx.fillStyle = '#8B4513'
    ctx.beginPath()
    ctx.moveTo(100, canvas.height - 30)
    ctx.lineTo(100, canvas.height - 150)
    ctx.lineTo(250, canvas.height - 150)
    ctx.lineTo(250, canvas.height - 30)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = '#A0522D'
    ctx.beginPath()
    ctx.moveTo(80, canvas.height - 150)
    ctx.lineTo(175, canvas.height - 200)
    ctx.lineTo(270, canvas.height - 150)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = '#654321'
    ctx.beginPath()
    ctx.ellipse(175, canvas.height - 110, 50, 40, 0, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#FFD700'
    ctx.beginPath()
    ctx.arc(canvas.width - 80, 80, 35, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.fillStyle = '#FFF8DC'
    ctx.beginPath()
    ctx.arc(canvas.width - 90, 70, 8, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#FFFFFF'
    ctx.beginPath()
    ctx.ellipse(150, 60, 40, 20, 0.3, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(200, 50, 30, 15, -0.2, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(600, 80, 35, 18, 0.1, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#228B22'
    ctx.beginPath()
    ctx.moveTo(canvas.width - 150, canvas.height - 30)
    ctx.lineTo(canvas.width - 150, canvas.height - 100)
    ctx.lineTo(canvas.width - 140, canvas.height - 100)
    ctx.lineTo(canvas.width - 140, canvas.height - 30)
    ctx.fill()
    
    ctx.fillStyle = '#32CD32'
    ctx.beginPath()
    ctx.arc(canvas.width - 145, canvas.height - 120, 40, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(canvas.width - 170, canvas.height - 100, 30, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(canvas.width - 120, canvas.height - 100, 30, 0, Math.PI * 2)
    ctx.fill()
  }, [])

  const gameLoop = useCallback((timestamp) => {
    if (!canvasRef.current || gameState !== 'playing') return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    if (timestamp - lastTimeRef.current > 16) {
      lastTimeRef.current = timestamp
      
      const state = dogStateRef.current
      const breedId = selectedBreedRef.current
      const breed = DOG_BREEDS.find(b => b.id === breedId)
      
      if (!breed) return
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawScene(ctx, canvas)
      
      let newX = state.x
      let newY = state.y
      let newAction = state.action
      let newDirection = state.direction
      let newFrame = state.frame + 1
      
      if (state.action === 'walking') {
        const dx = state.targetX - state.x
        const dy = state.targetY - state.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        
        if (dist > 5) {
          const speed = 3
          newX = state.x + (dx / dist) * speed
          newY = state.y + (dy / dist) * speed
        } else {
          newAction = 'idle'
        }
      }
      
      if (state.action === 'idle' && Math.random() < 0.008) {
        const padding = 100
        const minX = padding
        const maxX = canvas.width - padding
        const minY = 250
        const maxY = canvas.height - 120
        
        const targetX = minX + Math.random() * (maxX - minX)
        const targetY = minY + Math.random() * (maxY - minY)
        
        newAction = 'walking'
        newDirection = targetX > state.x ? 1 : -1
        
        setDogState(prev => ({
          ...prev,
          targetX,
          targetY,
          action: 'walking',
          direction: targetX > prev.x ? 1 : -1,
        }))
      }
      
      dogStateRef.current = {
        ...state,
        x: newX,
        y: newY,
        action: newAction,
        direction: newDirection,
        frame: newFrame,
      }
      
      drawDog(ctx, newX, newY, breed, newAction, newDirection, newFrame)
      
      if (newAction !== state.action || newX !== state.x || newY !== state.y) {
        setDogState(prev => ({
          ...prev,
          x: newX,
          y: newY,
          action: newAction,
          direction: newDirection,
          frame: newFrame,
        }))
      }
    }
    
    animationRef.current = requestAnimationFrame(gameLoop)
  }, [gameState, drawScene, drawDog])

  useEffect(() => {
    if (gameState === 'playing') {
      const canvas = canvasRef.current
      if (canvas) {
        canvas.width = 800
        canvas.height = 450
        
        setDogState(prev => ({
          ...prev,
          x: canvas.width / 2,
          y: canvas.height - 150,
          targetX: canvas.width / 2,
          targetY: canvas.height - 150,
        }))
        
        animationRef.current = requestAnimationFrame(gameLoop)
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [gameState, gameLoop])

  useEffect(() => {
    if (gameState === 'playing') {
      statsUpdateRef.current = setInterval(updateStats, 3000)
    }
    return () => {
      if (statsUpdateRef.current) {
        clearInterval(statsUpdateRef.current)
      }
    }
  }, [gameState, updateStats])

  useEffect(() => {
    if (speechBubble) {
      const timer = setTimeout(() => {
        setSpeechBubble(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [speechBubble])

  const handleFeed = () => {
    setDogState(prev => ({
      ...prev,
      action: 'eating',
      stats: {
        ...prev.stats,
        hunger: Math.min(100, prev.stats.hunger + 30),
        happiness: Math.min(100, prev.stats.happiness + 5),
      },
    }))
    showSpeech('fed')
    setTimeout(() => {
      setDogState(prev => ({ ...prev, action: 'idle' }))
    }, 2000)
  }

  const handleWater = () => {
    setDogState(prev => ({
      ...prev,
      action: 'drinking',
      stats: {
        ...prev.stats,
        thirst: Math.min(100, prev.stats.thirst + 35),
        happiness: Math.min(100, prev.stats.happiness + 5),
      },
    }))
    showSpeech('watered')
    setTimeout(() => {
      setDogState(prev => ({ ...prev, action: 'idle' }))
    }, 2000)
  }

  const handlePet = () => {
    setDogState(prev => ({
      ...prev,
      action: 'happy',
      stats: {
        ...prev.stats,
        happiness: Math.min(100, prev.stats.happiness + 20),
        energy: Math.max(0, prev.stats.energy - 5),
      },
    }))
    showSpeech('petted')
    setTimeout(() => {
      setDogState(prev => ({ ...prev, action: 'idle' }))
    }, 2000)
  }

  const handleWalk = () => {
    setIsWalking(true)
    setDogState(prev => ({
      ...prev,
      action: 'walking',
      stats: {
        ...prev.stats,
        energy: Math.max(0, prev.stats.energy - 15),
        happiness: Math.min(100, prev.stats.happiness + 25),
        hunger: Math.max(0, prev.stats.hunger - 10),
        thirst: Math.max(0, prev.stats.thirst - 15),
      },
    }))
    showSpeech('walked')
    
    setTimeout(() => {
      setIsWalking(false)
      setDogState(prev => ({ ...prev, action: 'idle' }))
    }, 5000)
  }

  const handlePlay = () => {
    setDogState(prev => ({
      ...prev,
      action: 'playing',
      stats: {
        ...prev.stats,
        happiness: Math.min(100, prev.stats.happiness + 30),
        energy: Math.max(0, prev.stats.energy - 20),
        hunger: Math.max(0, prev.stats.hunger - 5),
      },
    }))
    showSpeech('played')
    setTimeout(() => {
      setDogState(prev => ({ ...prev, action: 'idle' }))
    }, 3000)
  }

  const handleSleep = () => {
    setDogState(prev => ({
      ...prev,
      action: 'sleeping',
    }))
    showSpeech('sleeping')
    
    setTimeout(() => {
      setDogState(prev => ({
        ...prev,
        action: 'idle',
        stats: {
          ...prev.stats,
          energy: Math.min(100, prev.stats.energy + 40),
        },
      }))
      showSpeech('wakeup')
    }, 5000)
  }

  const startGame = () => {
    if (selectedBreed) {
      const breed = DOG_BREEDS.find(b => b.id === selectedBreed)
      setPetName(breed.name)
      setGameState('playing')
    }
  }

  const resetGame = () => {
    setGameState('selection')
    setSelectedBreed(null)
    setPetName('')
    setDogState({
      x: 400,
      y: 300,
      targetX: 400,
      targetY: 300,
      action: 'idle',
      direction: 1,
      frame: 0,
      stats: {
        hunger: 80,
        thirst: 80,
        energy: 100,
        happiness: 70,
      },
      lastInteraction: Date.now(),
    })
    setSpeechBubble(null)
  }

  const mood = getMood(dogState.stats)

  return (
    <div className="app-container">
      {gameState === 'selection' ? (
        <div className="breed-selection">
          <h2>选择你的狗狗伙伴 🐕</h2>
          <div className="breed-grid">
            {DOG_BREEDS.map(breed => (
              <div
                key={breed.id}
                className={`breed-card ${selectedBreed === breed.id ? 'selected' : ''}`}
                onClick={() => setSelectedBreed(breed.id)}
              >
                <div className="breed-emoji">{breed.emoji}</div>
                <div className="breed-name">{breed.name}</div>
                <div className="breed-traits">{breed.traits}</div>
              </div>
            ))}
          </div>
          <button
            className="start-btn"
            onClick={startGame}
            disabled={!selectedBreed}
          >
            开始游戏 🎮
          </button>
        </div>
      ) : (
        <div className="game-container">
          <div className="header">
            <h1>🐕 电子宠物狗</h1>
            <p>照顾好你的小伙伴吧！</p>
          </div>
          
          <div className="canvas-container">
            <canvas ref={canvasRef}></canvas>
            {speechBubble && (
              <div
                className="speech-bubble"
                style={{
                  left: `${(dogState.x / 800) * 100}%`,
                  top: `${((dogState.y - 80) / 450) * 100}%`,
                }}
              >
                {speechBubble.text}
              </div>
            )}
          </div>
          
          <div className="status-bar">
            <div className="status-item">
              <span className="status-icon">🍖</span>
              <div className="status-info">
                <div className="status-label">饱食度</div>
                <div className="status-bar-fill">
                  <div
                    className="status-bar-inner hunger"
                    style={{ width: `${dogState.stats.hunger}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="status-item">
              <span className="status-icon">💧</span>
              <div className="status-info">
                <div className="status-label">口渴度</div>
                <div className="status-bar-fill">
                  <div
                    className="status-bar-inner thirst"
                    style={{ width: `${dogState.stats.thirst}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="status-item">
              <span className="status-icon">⚡</span>
              <div className="status-info">
                <div className="status-label">精力值</div>
                <div className="status-bar-fill">
                  <div
                    className="status-bar-inner energy"
                    style={{ width: `${dogState.stats.energy}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="status-item">
              <span className="status-icon">💖</span>
              <div className="status-info">
                <div className="status-label">快乐值</div>
                <div className="status-bar-fill">
                  <div
                    className="status-bar-inner happiness"
                    style={{ width: `${dogState.stats.happiness}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="actions-bar">
            <button className="action-btn" onClick={handleFeed} disabled={dogState.action !== 'idle'}>
              <span className="icon">🍖</span>
              <span className="label">喂食</span>
            </button>
            <button className="action-btn" onClick={handleWater} disabled={dogState.action !== 'idle'}>
              <span className="icon">💧</span>
              <span className="label">喂水</span>
            </button>
            <button className="action-btn" onClick={handlePet} disabled={dogState.action !== 'idle'}>
              <span className="icon">🤚</span>
              <span className="label">摸头</span>
            </button>
            <button className="action-btn" onClick={handleWalk} disabled={dogState.action !== 'idle' || isWalking}>
              <span className="icon">🦮</span>
              <span className="label">遛狗</span>
            </button>
            <button className="action-btn" onClick={handlePlay} disabled={dogState.action !== 'idle'}>
              <span className="icon">🎾</span>
              <span className="label">玩耍</span>
            </button>
            <button className="action-btn" onClick={handleSleep} disabled={dogState.action !== 'idle'}>
              <span className="icon">😴</span>
              <span className="label">休息</span>
            </button>
          </div>
          
          <div className="pet-info">
            <div className="pet-name">{petName}</div>
            <div className="pet-mood">
              <span className="mood-emoji">{MOOD_EMOJIS[mood]}</span>
              <span>心情: {mood === 'happy' ? '开心' : mood === 'neutral' ? '一般' : mood === 'sad' ? '难过' : mood === 'tired' ? '疲惫' : mood === 'hungry' ? '饥饿' : '想玩'}</span>
            </div>
            <button className="reset-btn" onClick={resetGame}>重新选择</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
