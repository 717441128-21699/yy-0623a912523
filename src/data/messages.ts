import { Message, UserInfo } from '@/types/index'

export const messages: Message[] = [
  {
    id: 'm1',
    treatmentId: 't1',
    treatmentName: '光子嫩肤全脸',
    content: '今天治疗后脸上有些红，是正常现象吗？',
    type: 'question',
    status: 'replied',
    createdAt: '2026-06-20 14:30',
    reply: '您好，光子嫩肤后轻微泛红是正常的，一般24-48小时内会消退。请注意防晒和补水。',
    replyAt: '2026-06-20 15:10'
  },
  {
    id: 'm2',
    treatmentId: 't3',
    treatmentName: '水光针补水',
    content: '打完水光针第二天脸上出现了小红点，需要处理吗？',
    type: 'abnormal',
    status: 'replied',
    createdAt: '2026-06-11 09:20',
    reply: '小红点是针眼引起的，一般3-5天会自然消退。避免用手触碰，继续敷医用面膜即可。',
    replyAt: '2026-06-11 10:05'
  },
  {
    id: 'm3',
    treatmentId: 't5',
    treatmentName: '冷冻溶脂腰腹',
    content: '冷冻溶脂后腰部有些肿胀，多久能恢复正常？',
    type: 'question',
    status: 'sent',
    createdAt: '2026-06-22 20:15'
  },
  {
    id: 'm4',
    treatmentId: 't1',
    treatmentName: '光子嫩肤全脸',
    content: '下次光子嫩肤可以和果酸焕肤一起做吗？',
    type: 'general',
    status: 'replied',
    createdAt: '2026-06-15 16:00',
    reply: '建议两种治疗间隔至少2周，避免皮肤过度刺激。具体方案建议到院面诊后确定。',
    replyAt: '2026-06-15 16:45'
  },
  {
    id: 'm5',
    treatmentId: 't4',
    treatmentName: '超声刀面部提升',
    content: '超声刀做完后面部有轻微红肿，发现异常红肿怎么办？',
    type: 'abnormal',
    status: 'replied',
    createdAt: '2026-06-02 21:30',
    reply: '轻微红肿是正常反应。如果红肿超过72小时未消退或加重，请立即到院检查。',
    replyAt: '2026-06-02 22:00',
    photos: ['https://picsum.photos/id/338/200/200']
  },
  {
    id: 'm6',
    treatmentId: 't3',
    treatmentName: '水光针补水',
    content: '水光针的补水效果大概能维持多久？',
    type: 'followup',
    status: 'replied',
    createdAt: '2026-06-12 11:00',
    reply: '单次效果一般维持1-2个月，建议按疗程进行4次，效果更持久。您目前疗程进展良好。',
    replyAt: '2026-06-12 11:30'
  },
  {
    id: 'm7',
    treatmentId: 't6',
    treatmentName: '皮秒祛斑',
    content: '皮秒治疗后结痂了，多久能掉？',
    type: 'question',
    status: 'sent',
    createdAt: '2026-06-18 10:00'
  },
  {
    id: 'm8',
    treatmentId: 't9',
    treatmentName: '果酸焕肤',
    content: '果酸焕肤后皮肤有些脱皮，是正常的吗？',
    type: 'question',
    status: 'replied',
    createdAt: '2026-06-08 19:20',
    reply: '是的，轻微脱皮是正常的代谢过程，请勿手撕，保持保湿即可，一般2-3天恢复。',
    replyAt: '2026-06-08 20:00'
  },
  {
    id: 'm9',
    treatmentId: 't1',
    treatmentName: '光子嫩肤全脸',
    content: '想咨询一下光子嫩肤和超皮秒的区别',
    type: 'general',
    status: 'replied',
    createdAt: '2026-05-28 13:00',
    reply: '光子嫩肤主要改善整体肤色和肤质，超皮秒针对色素问题更精准。可以到院做皮肤检测后给您专业建议。',
    replyAt: '2026-05-28 14:20'
  },
  {
    id: 'm10',
    treatmentId: 't7',
    treatmentName: '射频溶脂大腿',
    content: '射频溶脂后腿部有轻微淤青，需要特别处理吗？',
    type: 'abnormal',
    status: 'sent',
    createdAt: '2026-06-22 08:30'
  }
]

export const userInfo: UserInfo = {
  name: '小雅',
  avatar: 'https://picsum.photos/id/64/200/200',
  phone: '138****6789',
  memberId: 'VIP20260315'
}
