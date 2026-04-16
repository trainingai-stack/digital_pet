export type DogBreed = 'golden' | 'labrador' | 'poodle' | 'husky' | 'bulldog' | 'beagle';

export type DogAction = 'idle' | 'walking' | 'sitting' | 'sleeping' | 'eating' | 'drinking' | 'playing' | 'petting' | 'running';

export interface DogStats {
  hunger: number;
  thirst: number;
  energy: number;
  happiness: number;
  fun: number;
}

export interface DogState {
  breed: DogBreed;
  name: string;
  stats: DogStats;
  position: { x: number; y: number };
  action: DogAction;
  direction: 'left' | 'right';
  speed: number;
}

export interface Message {
  id: number;
  text: string;
  type: 'happy' | 'hungry' | 'thirsty' | 'tired' | 'bored' | 'love' | 'playing' | 'sleeping';
  timestamp: number;
}

export const BREEDS: { breed: DogBreed; name: string; color: string; bodyColor: string }[] = [
  { breed: 'golden', name: '金毛寻回犬', color: '#DAA520', bodyColor: '#F4D03F' },
  { breed: 'labrador', name: '拉布拉多', color: '#2C3E50', bodyColor: '#34495E' },
  { breed: 'poodle', name: '贵宾犬', color: '#ECF0F1', bodyColor: '#BDC3C7' },
  { breed: 'husky', name: '哈士奇', color: '#95A5A6', bodyColor: '#7F8C8D' },
  { breed: 'bulldog', name: '斗牛犬', color: '#A0522D', bodyColor: '#CD853F' },
  { breed: 'beagle', name: '比格犬', color: '#8B4513', bodyColor: '#D2691E' },
];

export const MESSAGES = {
  happy: [
    '好舒服呀～谢谢主人！🥰',
    '主人最好啦！❤️',
    '好开心呀！汪汪汪！🐕',
    '最喜欢主人摸头！💕',
    '嘿嘿，好幸福～😊',
  ],
  hungry: [
    '肚子咕咕叫...饿饿🥺',
    '主人，我想吃好吃的！🤤',
    '什么时候开饭呀～🍖',
    '闻着好香呀～👃',
  ],
  thirsty: [
    '渴渴...要喝水💧',
    '主人，水！水！🥤',
    '舌头好干...👅',
  ],
  tired: [
    '好累呀，想睡觉😴',
    '休息一下...💤',
    '眼皮好重...😪',
  ],
  bored: [
    '好无聊，陪我玩嘛🥎',
    '想出去走走～🚶',
    '来玩丢球球吧！⚽',
  ],
  love: [
    '主人主人！😍',
    '爱你哟😘',
    '摇尾巴～💗',
  ],
  eating: [
    '好好吃！😋',
    '谢谢主人的大餐！🍗',
    '太美味啦～🤤',
    '再来一碗！🍽️',
  ],
  drinking: [
    '咕咚咕咚...💧',
    '好好喝！😌',
    '解渴啦～🥤',
  ],
  playing: [
    '好耶！出去玩！🏃',
    '跑跑跑！🐕💨',
    '太开心啦！🎾',
    '追球球！⚽',
  ],
  sleeping: [
    '晚安主人😴',
    '做个好梦...💭',
    '呼噜呼噜～💤',
  ],
};
