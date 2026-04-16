import type { DogBreed } from '../types';

export const dogBreeds: DogBreed[] = [
  {
    id: 'golden-retriever',
    name: '金毛寻回犬',
    nameEn: 'Golden Retriever',
    color: '#D4A574',
    secondaryColor: '#F5DEB3',
    size: 'large',
    description: '温顺友善，聪明伶俐的家庭伴侣'
  },
  {
    id: 'labrador',
    name: '拉布拉多',
    nameEn: 'Labrador',
    color: '#2F1810',
    secondaryColor: '#4A3728',
    size: 'large',
    description: '活泼好动，忠诚可靠的优秀犬种'
  },
  {
    id: 'corgi',
    name: '柯基',
    nameEn: 'Corgi',
    color: '#D2691E',
    secondaryColor: '#F4A460',
    size: 'small',
    description: '短腿可爱，性格开朗的皇家宠物'
  },
  {
    id: 'husky',
    name: '哈士奇',
    nameEn: 'Husky',
    color: '#4A5568',
    secondaryColor: '#E2E8F0',
    size: 'medium',
    description: '帅气迷人，精力旺盛的雪地精灵'
  },
  {
    id: 'shiba',
    name: '柴犬',
    nameEn: 'Shiba Inu',
    color: '#D2691E',
    secondaryColor: '#F5DEB3',
    size: 'medium',
    description: '独立自主，表情包界的网红犬'
  },
  {
    id: 'poodle',
    name: '贵宾犬',
    nameEn: 'Poodle',
    color: '#F5F5DC',
    secondaryColor: '#FFF8DC',
    size: 'medium',
    description: '优雅高贵，智商超群的卷毛犬'
  },
  {
    id: 'french-bulldog',
    name: '法国斗牛犬',
    nameEn: 'French Bulldog',
    color: '#2F1810',
    secondaryColor: '#F5DEB3',
    size: 'small',
    description: '呆萌可爱，性格温和的城市伴侣'
  },
  {
    id: 'beagle',
    name: '比格犬',
    nameEn: 'Beagle',
    color: '#D2691E',
    secondaryColor: '#2F1810',
    size: 'medium',
    description: '嗅觉灵敏，活泼好动的猎兔犬'
  }
];

export const bubbleMessages = {
  feed: ['好好吃！谢谢主人！', ' yummy！', '主人最好了！', '吃饱饱~', '美味的食物！'],
  pet: ['好舒服~', '最喜欢主人了！', '好幸福~', '再多摸摸~', '主人的手好温暖'],
  walk: ['好开心！', '外面的世界好大！', '喜欢散步！', '跑起来！', '和主人一起最棒了！'],
  idle: ['好无聊啊...', '主人在哪里？', '想出去玩...', '有点饿了...', '好困啊...'],
  sleep: ['呼噜呼噜...', '做个好梦...', 'Zzz...', '好舒服...'],
  play: ['太好玩了！', '再来一次！', '最喜欢玩耍了！', '好开心！'],
  lowHunger: ['好饿啊...', '想吃东西...', '肚子咕咕叫...'],
  lowThirst: ['好渴啊...', '想喝水...', '喉咙好干...'],
  lowEnergy: ['好累啊...', '想睡觉...', '没力气了...'],
  lowHappiness: ['好无聊...', '想玩...', '主人陪我玩...']
};
