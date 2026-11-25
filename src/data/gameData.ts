export interface StreetCard {
  id: string;
  name: string;
  cost: number;
  theme: 'yellow' | 'cyan' | 'pink';
  art: string;
  statLabel: string;
  desc: string;
  damage?: number;
  face?: number;
  energyGain?: number;
  sfx: string;
  enemyReact: string;
}

export interface EnemyIntent {
  label: string;
  damage: number;
  line: string;
}

export interface RouteNode {
  id: string;
  floor: number;
  title: string;
  subtitle: string;
  status: 'done' | 'current' | 'locked';
  icon: string;
}

export const STYLE_INFO = {
  code: '方案 4',
  name: '暗底潮流涂鸦漫画风',
  branch: 'style/dark-street-comic',
};

export const RELICS = [
  { icon: '🕶️', name: '防炫光墨镜', tip: '免疫表盘反光，开局 +4 面子' },
  { icon: '⚡', name: '反矫达人', tip: '每次打断凡尔赛额外提神' },
  { icon: '🧱', name: '厚脸皮护盾', tip: '回合结束保留最多 4 点面子' },
];

export const ROUTE_NODES: RouteNode[] = [
  { id: 'n1', floor: 1, title: '早高峰地铁挤位战', subtitle: '已通关 · 抢到角落扶手', status: 'done', icon: '✓' },
  { id: 'n2', floor: 2, title: '茶水间八卦狙击', subtitle: '已通关 · 装傻全身而退', status: 'done', icon: '✓' },
  { id: 'n3', floor: 3, title: '理发店办卡修罗场', subtitle: '已通关 · 一句下次一定脱身', status: 'done', icon: '✓' },
  { id: 'n4', floor: 4, title: '同学聚会 · 凡尔赛老同学', subtitle: '高能遭遇战（可体验）', status: 'current', icon: '⚡' },
];

export const ENEMY_CLASSMATE = {
  name: '凡尔赛老同学',
  stageTag: '同学聚会 · 第4局',
  mood: '凡尔赛现场',
  maxHp: 70,
  art: './assets/enemy_classmate.jpg',
  intents: [
    {
      label: '凡尔赛暴击',
      damage: 15,
      line: '“哎呀也就随便赚了点小钱，真羡慕你清闲～”',
    },
    {
      label: '晒表炫富',
      damage: 17,
      line: '“刚提了辆帕拉梅拉，就是小区车位有点窄！”',
    },
    {
      label: '降维打击',
      damage: 13,
      line: '“其实年薪百万压力挺大的，还是你轻松自在！”',
    },
  ] as EnemyIntent[],
};

export const STARTER_CARDS: StreetCard[] = [
  {
    id: 'flatter',
    name: '疯狂捧杀',
    cost: 1,
    theme: 'yellow',
    art: './assets/card_flatter.jpg',
    statLabel: '语塞 12',
    desc: '高情商鼓掌把他捧上天，反手降气势 12',
    damage: 12,
    sfx: '疯狂捧杀!! -12',
    enemyReact: '“诶别别别…我也就一般般，今晚这顿先别让我全包啊！”',
  },
  {
    id: 'blessing',
    name: '尊重祝福',
    cost: 1,
    theme: 'cyan',
    art: './assets/card_blessing.jpg',
    statLabel: '面子 +9',
    desc: '佛系合掌精神隔离，立刻获得 9 面子',
    face: 9,
    sfx: '尊重祝福! +9面子',
    enemyReact: '“你这淡定表情搞得我像在演独角戏…”',
  },
  {
    id: 'borrow',
    name: '借我五万',
    cost: 2,
    theme: 'pink',
    art: './assets/card_borrow.jpg',
    statLabel: '破防 18',
    desc: '星星眼精准打击凡尔赛死穴，暴击 18 破防！',
    damage: 18,
    sfx: '借我五万!! 破防 -18',
    enemyReact: '“咳咳！其实钱全买基金套牢了，我突然想起家里煤气没关！”',
  },
];

export const REWARD_CARDS: StreetCard[] = [
  {
    id: 'r1',
    name: '问他借车开',
    cost: 1,
    theme: 'pink',
    art: './assets/card_borrow.jpg',
    statLabel: '破防 15',
    desc: '“正好明天搬家借你帕拉梅拉拉货”，造成 15 破防',
    damage: 15,
    sfx: '借车拉货!! -15',
    enemyReact: '“车…车刚好拿去保养了！”',
  },
  {
    id: 'r2',
    name: '群发砍一刀',
    cost: 0,
    theme: 'yellow',
    art: './assets/card_flatter.jpg',
    statLabel: '话头 +1',
    desc: '反手发一条砍价链接，面子 +4 且话头 +1',
    face: 4,
    energyGain: 1,
    sfx: '帮我砍一刀!',
    enemyReact: '“这链接我真点不了…”',
  },
  {
    id: 'r3',
    name: '已读不回',
    cost: 1,
    theme: 'cyan',
    art: './assets/card_blessing.jpg',
    statLabel: '面子 +12',
    desc: '开启静音免打扰，直接叠加 12 点面子',
    face: 12,
    sfx: '免打扰启动!',
    enemyReact: '“怎么突然不回消息了？”',
  },
];
