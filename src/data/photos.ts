import { PhotoRecord, AngleTemplate } from '@/types/index'

export const angleTemplates: AngleTemplate[] = [
  {
    id: 'a1',
    name: '正面',
    angle: '0°',
    description: '面向镜头，保持自然表情',
    image: 'https://picsum.photos/id/64/200/200'
  },
  {
    id: 'a2',
    name: '左侧',
    angle: '90°',
    description: '头部向右转，露出左侧轮廓',
    image: 'https://picsum.photos/id/91/200/200'
  },
  {
    id: 'a3',
    name: '右侧',
    angle: '270°',
    description: '头部向左转，露出右侧轮廓',
    image: 'https://picsum.photos/id/177/200/200'
  },
  {
    id: 'a4',
    name: '仰角',
    angle: '45°',
    description: '微微仰头，展示下颌线条',
    image: 'https://picsum.photos/id/338/200/200'
  },
  {
    id: 'a5',
    name: '俯角',
    angle: '-45°',
    description: '微微低头，展示额头和眼周',
    image: 'https://picsum.photos/id/1027/200/200'
  }
]

export const photos: PhotoRecord[] = [
  {
    id: 'p1',
    treatmentId: 't1',
    treatmentName: '光子嫩肤全脸',
    date: '2026-03-15',
    imageUrl: 'https://picsum.photos/id/64/400/400',
    angle: '正面',
    isPrivate: false,
    visibleToDoctor: true,
    notes: '第一次治疗，轻微泛红',
    feeling: '有轻微灼热感，可以忍受',
    feelingScore: 3,
    annotations: []
  },
  {
    id: 'p2',
    treatmentId: 't1',
    treatmentName: '光子嫩肤全脸',
    date: '2026-04-15',
    imageUrl: 'https://picsum.photos/id/91/400/400',
    angle: '正面',
    isPrivate: false,
    visibleToDoctor: true,
    notes: '第二次治疗后色斑有淡化',
    feeling: '恢复很快，第二天就不红了',
    feelingScore: 4,
    annotations: [
      { id: 'an1', x: 120, y: 80, radius: 30, note: '色斑淡化明显' }
    ]
  },
  {
    id: 'p3',
    treatmentId: 't1',
    treatmentName: '光子嫩肤全脸',
    date: '2026-05-20',
    imageUrl: 'https://picsum.photos/id/177/400/400',
    angle: '正面',
    isPrivate: false,
    visibleToDoctor: true,
    notes: '第三次治疗，毛孔缩小了',
    feeling: '皮肤细腻了很多，朋友都说变好了',
    feelingScore: 5,
    annotations: []
  },
  {
    id: 'p4',
    treatmentId: 't3',
    treatmentName: '水光针补水',
    date: '2026-05-10',
    imageUrl: 'https://picsum.photos/id/338/400/400',
    angle: '正面',
    isPrivate: false,
    visibleToDoctor: true,
    notes: '第一次水光针，面部微肿',
    feeling: '注射时有点疼，但可以忍受',
    feelingScore: 2,
    annotations: []
  },
  {
    id: 'p5',
    treatmentId: 't3',
    treatmentName: '水光针补水',
    date: '2026-06-10',
    imageUrl: 'https://picsum.photos/id/1027/400/400',
    angle: '正面',
    isPrivate: true,
    visibleToDoctor: false,
    notes: '第二次补水后皮肤很水润',
    feeling: '恢复比第一次快，效果很好',
    feelingScore: 4,
    annotations: []
  },
  {
    id: 'p6',
    treatmentId: 't2',
    treatmentName: '热玛吉抗衰紧致',
    date: '2026-04-20',
    imageUrl: 'https://picsum.photos/id/64/400/400',
    angle: '左侧',
    isPrivate: false,
    visibleToDoctor: true,
    notes: '热玛吉当天，面部发红',
    feeling: '疼痛感较强，但可以忍受',
    feelingScore: 2,
    annotations: []
  },
  {
    id: 'p7',
    treatmentId: 't5',
    treatmentName: '冷冻溶脂腰腹',
    date: '2026-06-01',
    imageUrl: 'https://picsum.photos/id/91/400/400',
    angle: '正面',
    isPrivate: true,
    visibleToDoctor: true,
    notes: '第一次冷冻溶脂',
    feeling: '冷冻时有些不适，之后就好了',
    feelingScore: 3,
    annotations: []
  },
  {
    id: 'p8',
    treatmentId: 't9',
    treatmentName: '果酸焕肤',
    date: '2026-03-01',
    imageUrl: 'https://picsum.photos/id/177/400/400',
    angle: '正面',
    isPrivate: false,
    visibleToDoctor: true,
    notes: '第一次果酸焕肤',
    feeling: '有刺痛感，持续时间短',
    feelingScore: 3,
    annotations: []
  },
  {
    id: 'p9',
    treatmentId: 't9',
    treatmentName: '果酸焕肤',
    date: '2026-05-01',
    imageUrl: 'https://picsum.photos/id/338/400/400',
    angle: '正面',
    isPrivate: false,
    visibleToDoctor: true,
    notes: '第五次焕肤，肤质明显改善',
    feeling: '皮肤变得细腻光滑',
    feelingScore: 5,
    annotations: [
      { id: 'an2', x: 150, y: 100, radius: 25, note: '痘印淡化' }
    ]
  },
  {
    id: 'p10',
    treatmentId: 't6',
    treatmentName: '皮秒祛斑',
    date: '2026-06-15',
    imageUrl: 'https://picsum.photos/id/1027/400/400',
    angle: '正面',
    isPrivate: false,
    visibleToDoctor: true,
    notes: '第四次皮秒，斑点基本消失',
    feeling: '效果很满意，斑几乎看不见了',
    feelingScore: 5,
    annotations: []
  }
]
