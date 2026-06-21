import { Reminder } from '@/types/index'

export const reminders: Reminder[] = [
  {
    id: 'r1',
    treatmentId: 't1',
    treatmentName: '光子嫩肤全脸',
    type: 'sunscreen',
    title: '防晒提醒',
    description: '治疗后3天内需严格防晒，SPF50+，每2小时补涂',
    date: '2026-06-23',
    time: '08:00',
    isCompleted: false
  },
  {
    id: 'r2',
    treatmentId: 't1',
    treatmentName: '光子嫩肤全脸',
    type: 'hydration',
    title: '补水提醒',
    description: '治疗后加强补水，每天敷1次医用面膜，连续3天',
    date: '2026-06-23',
    time: '21:00',
    isCompleted: false
  },
  {
    id: 'r3',
    treatmentId: 't1',
    treatmentName: '光子嫩肤全脸',
    type: 'followup',
    title: '复诊提醒',
    description: '下次光子嫩肤治疗日期，请提前预约',
    date: '2026-07-05',
    time: '10:00',
    isCompleted: false
  },
  {
    id: 'r4',
    treatmentId: 't3',
    treatmentName: '水光针补水',
    type: 'diet',
    title: '忌口提醒',
    description: '治疗后3天内避免辛辣刺激食物、海鲜和酒精',
    date: '2026-06-23',
    time: '12:00',
    isCompleted: false
  },
  {
    id: 'r5',
    treatmentId: 't3',
    treatmentName: '水光针补水',
    type: 'hydration',
    title: '补水提醒',
    description: '每天饮用2000ml以上温水，促进代谢',
    date: '2026-06-23',
    time: '09:00',
    isCompleted: true
  },
  {
    id: 'r6',
    treatmentId: 't5',
    treatmentName: '冷冻溶脂腰腹',
    type: 'hydration',
    title: '补水提醒',
    description: '多饮水促进脂肪代谢，每日不少于2500ml',
    date: '2026-06-23',
    time: '08:30',
    isCompleted: false
  },
  {
    id: 'r7',
    treatmentId: 't5',
    treatmentName: '冷冻溶脂腰腹',
    type: 'diet',
    title: '饮食提醒',
    description: '溶脂后一周内低脂饮食，避免高热量食物',
    date: '2026-06-23',
    time: '12:00',
    isCompleted: false
  },
  {
    id: 'r8',
    treatmentId: 't4',
    treatmentName: '超声刀面部提升',
    type: 'sunscreen',
    title: '防晒提醒',
    description: '超声刀后一周内严格防晒，避免紫外线直射',
    date: '2026-06-24',
    time: '08:00',
    isCompleted: false
  },
  {
    id: 'r9',
    treatmentId: 't4',
    treatmentName: '超声刀面部提升',
    type: 'medication',
    title: '用药提醒',
    description: '按医嘱服用修复类营养品，促进胶原新生',
    date: '2026-06-24',
    time: '09:00',
    isCompleted: false
  },
  {
    id: 'r10',
    treatmentId: 't6',
    treatmentName: '皮秒祛斑',
    type: 'followup',
    title: '复诊提醒',
    description: '皮秒祛斑第五次治疗，请提前到院',
    date: '2026-07-08',
    time: '14:00',
    isCompleted: false
  }
]
