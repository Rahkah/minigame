export type Archetype = 'base' | 'shield' | 'burst' | 'combo';

export interface CardEffect {
  damage?: number;
  face?: number;
  draw?: number;
  energy?: number;
  selfHpLoss?: number;
  applyBreak?: number;
  applySpeechless?: number;
  /** Deals (current Face * multiplier) damage and clears Face */
  faceSlamMultiplier?: number;
  /** Deals (cardsPlayedThisTurn * perCard) damage */
  comboPerCard?: number;
  /** Exhausts for the rest of this battle */
  exhaust?: boolean;
}

export interface CardTemplate {
  id: string;
  name: string;
  archetype: Archetype;
  /** Either an image path (./assets/...) or an SVG key in CARD_SVG */
  img?: string;
  svgKey?: string;
  cost: number;
  upgradedCost?: number;
  flavor: string;
  sfx: string;
  base: CardEffect;
  upgraded: CardEffect;
}

export interface CardInstance {
  uid: string;
  templateId: string;
  upgraded: boolean;
}

export const ARCHETYPE_LABEL: Record<Archetype, string> = {
  base: '基础话术',
  shield: '🧱 厚脸皮流',
  burst: '🔥 发疯直球',
  combo: '⚡ 社恐连击',
};

export const CARD_TEMPLATES: Record<string, CardTemplate> = {
  decline: {
    id: 'decline',
    name: '婉拒了哈',
    archetype: 'base',
    img: './assets/card_decline.jpg',
    cost: 1,
    flavor: '礼貌伸手打断对方施法',
    sfx: '婉拒了哈!!',
    base: { damage: 8 },
    upgraded: { damage: 12 },
  },
  next_time: {
    id: 'next_time',
    name: '下次一定',
    archetype: 'shield',
    img: './assets/card_next_time.jpg',
    cost: 1,
    flavor: '竖起大拇指边笑边往门口撤',
    sfx: '下次一定!!',
    base: { face: 7 },
    upgraded: { face: 10 },
  },
  phone: {
    id: 'phone',
    name: '看手机装忙',
    archetype: 'combo',
    img: './assets/card_phone.jpg',
    cost: 0,
    flavor: '狂划空白桌面假装老板急找',
    sfx: '假装很忙!',
    base: { face: 3, draw: 1 },
    upgraded: { face: 5, draw: 1 },
  },
  nonsense: {
    id: 'nonsense',
    name: '已读乱回',
    archetype: 'burst',
    svgKey: 'nonsense',
    cost: 1,
    flavor: '“嗯嗯去年西瓜确实挺甜”，让对面下次受怼翻倍',
    sfx: '已读乱回! 破防!',
    base: { damage: 5, applyBreak: 1 },
    upgraded: { damage: 8, applyBreak: 1 },
  },
  drink: {
    id: 'drink',
    name: '战术喝水',
    archetype: 'shield',
    svgKey: 'drink',
    cost: 1,
    flavor: '咕嘟咕嘟拖延时间，顺便摸 1 张牌',
    sfx: '咕嘟咕嘟!',
    base: { face: 6, draw: 1 },
    upgraded: { face: 9, draw: 1 },
  },
  blessing: {
    id: 'blessing',
    name: '尊重祝福',
    archetype: 'shield',
    svgKey: 'blessing',
    cost: 1,
    flavor: '佛系合掌，加厚脸皮并让对方伤害减半',
    sfx: '尊重祝福!',
    base: { face: 5, applySpeechless: 1 },
    upgraded: { face: 8, applySpeechless: 1 },
  },
  no_shame: {
    id: 'no_shame',
    name: '我不尴尬',
    archetype: 'shield',
    svgKey: 'no_shame',
    cost: 2,
    upgradedCost: 1,
    flavor: '撕破当前全部脸皮，每 1 点脸皮化作 2 点怼伤反杀！',
    sfx: '撕破脸皮!!',
    base: { faceSlamMultiplier: 2 },
    upgraded: { faceSlamMultiplier: 2 },
  },
  borrow: {
    id: 'borrow',
    name: '借我五万',
    archetype: 'burst',
    svgKey: 'borrow',
    cost: 2,
    flavor: '星星眼直击灵魂死穴，配合🔥破防直接双倍爆头',
    sfx: '借我五万!!',
    base: { damage: 16 },
    upgraded: { damage: 22 },
  },
  pass_buck: {
    id: 'pass_buck',
    name: '反手甩锅',
    archetype: 'burst',
    svgKey: 'pass_buck',
    cost: 1,
    flavor: '把锅顺滑丢回去，顺带让对方下回合伤害减半',
    sfx: '反手甩锅!',
    base: { damage: 9, applySpeechless: 1 },
    upgraded: { damage: 13, applySpeechless: 1 },
  },
  you_right: {
    id: 'you_right',
    name: '你说的都对',
    archetype: 'burst',
    svgKey: 'you_right',
    cost: 0,
    flavor: '自扣少量心态换取大量话头与过牌，强行爆发',
    sfx: '行行你都对!',
    base: { selfHpLoss: 3, energy: 2, draw: 1 },
    upgraded: { selfHpLoss: 2, energy: 2, draw: 1 },
  },
  off_work: {
    id: 'off_work',
    name: '下班免谈',
    archetype: 'burst',
    svgKey: 'off_work',
    cost: 2,
    flavor: '戴上耳机准点开溜，攻守兼备体面退场',
    sfx: '下班免谈!!',
    base: { damage: 12, face: 8 },
    upgraded: { damage: 16, face: 11 },
  },
  uh_huh: {
    id: 'uh_huh',
    name: '嗯嗯哦哦',
    archetype: 'combo',
    svgKey: 'uh_huh',
    cost: 0,
    flavor: '0 费疯狂敷衍点头，叠连击还白嫖摸 1 张',
    sfx: '嗯嗯哦哦!',
    base: { damage: 4, draw: 1 },
    upgraded: { damage: 6, draw: 1 },
  },
  flatter: {
    id: 'flatter',
    name: '疯狂捧杀',
    archetype: 'combo',
    svgKey: 'flatter',
    cost: 1,
    flavor: '把对方捧上天，顺便抢回 1 点话头继续连招',
    sfx: '哇你好厉害!',
    base: { damage: 6, energy: 1 },
    upgraded: { damage: 9, energy: 1 },
  },
  restroom: {
    id: 'restroom',
    name: '去趟洗手间',
    archetype: 'combo',
    svgKey: 'restroom',
    cost: 1,
    flavor: '本回合每打过 1 张牌，本卡怼伤就增加！',
    sfx: '尿遁绝杀!!',
    base: { comboPerCard: 5 },
    upgraded: { comboPerCard: 7 },
  },
  no_money: {
    id: 'no_money',
    name: '我没带钱',
    archetype: 'combo',
    svgKey: 'no_money',
    cost: 0,
    flavor: '理直气壮亮出空钱包：同时挂上🔥破防与🌀语塞',
    sfx: '穷得坦荡!!',
    base: { applyBreak: 1, applySpeechless: 1, exhaust: true },
    upgraded: { applyBreak: 1, applySpeechless: 1, exhaust: false },
  },
};

export const STARTER_DECK_IDS = [
  'decline',
  'decline',
  'next_time',
  'next_time',
  'phone',
  'nonsense',
];

export const REWARD_POOL_IDS = Object.keys(CARD_TEMPLATES).filter((id) => id !== 'decline');

export function getCardCost(card: CardInstance): number {
  const tpl = CARD_TEMPLATES[card.templateId];
  if (card.upgraded && tpl.upgradedCost !== undefined) return tpl.upgradedCost;
  return tpl.cost;
}

export function getCardEffect(card: CardInstance): CardEffect {
  const tpl = CARD_TEMPLATES[card.templateId];
  return card.upgraded ? tpl.upgraded : tpl.base;
}

export function getCardDisplayName(card: CardInstance): string {
  const tpl = CARD_TEMPLATES[card.templateId];
  return card.upgraded ? `${tpl.name}+` : tpl.name;
}
