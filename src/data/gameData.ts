export interface CardDef {
  id: string;
  name: string;
  cost: number;
  kind: 'def' | 'atk' | 'skill';
  art: string;
  statLabel: string;
  badgeColor: 'blue' | 'red' | 'yellow';
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
  code: '方案 2',
  name: '魔性极简线条表情包风',
  branch: 'style/doodle-meme',
};

export const RELICS = [
  { icon: '🎧', name: '降噪耳机', tip: '开局 +4 面子（假装听不见）' },
  { icon: '☕', name: '冰美式', tip: '续命神器，保持礼貌微笑' },
  { icon: '🧱', name: '祖传厚脸皮', tip: '回合结束最多保留 4 点面子' },
];

export const ROUTE_NODES: RouteNode[] = [
  { id: 'n1', floor: 1, title: '电梯偶遇半熟同事', subtitle: '“吃了吗？天气不错哈”', status: 'done', icon: '✓' },
  { id: 'n2', floor: 2, title: '理发店 · Tony 老师', subtitle: '推销办卡修罗场（可体验）', status: 'current', icon: '✂️' },
  { id: 'n3', floor: 3, title: '过年客厅 · 查户口二姨', subtitle: '工资 + 对象连环追问', status: 'locked', icon: '🍉' },
  { id: 'n4', floor: 4, title: 'Boss · 同学聚会大饭局', subtitle: '全员凡尔赛终极考验', status: 'locked', icon: '👑' },
];

export const ENEMY_TONY = {
  name: '推销办卡 Tony 老师',
  stageTag: '理发店 · 第2局',
  mood: '尴尬',
  maxHp: 50,
  art: './assets/enemy_tony.jpg',
  intents: [
    {
      label: '推销暴击',
      damage: 14,
      line: '“宝，发质太干了，办张 3000 的卡吧？”',
    },
    {
      label: '店长特批',
      damage: 16,
      line: '“今天店长刚好在，给你留个内部名额 2888！”',
    },
    {
      label: '情感绑架',
      damage: 12,
      line: '“哥给你剪这么帅，不办张卡我都心疼你头发！”',
    },
  ] as EnemyIntent[],
};

export const STARTER_CARDS: CardDef[] = [
  {
    id: 'next-time',
    name: '下次一定',
    cost: 1,
    kind: 'def',
    art: './assets/card_next_time.jpg',
    statLabel: '面子 +7',
    badgeColor: 'blue',
    desc: '竖起大拇指边笑边往门口退',
    face: 7,
    sfx: '下次一定!! +7面子',
    enemyReact: '“别下次啊宝！今天充值还送护发素呢！”',
  },
  {
    id: 'decline',
    name: '婉拒了哈',
    cost: 1,
    kind: 'atk',
    art: './assets/card_decline.jpg',
    statLabel: '语塞 9',
    badgeColor: 'red',
    desc: '礼貌伸手打断施法，气势 -9',
    damage: 9,
    sfx: '婉拒了哈!! -9',
    enemyReact: '“呃…你这人怎么油盐不进呢？”',
  },
  {
    id: 'phone',
    name: '看手机装忙',
    cost: 0,
    kind: 'skill',
    art: './assets/card_phone.jpg',
    statLabel: '话头 +1',
    badgeColor: 'yellow',
    desc: '狂刷空白桌面，面子 +3 话头 +1',
    face: 3,
    energyGain: 1,
    sfx: '假装很忙! +1话头',
    enemyReact: '“行行你先回消息，回完看看咱 VIP 权益表！”',
  },
];

export const REWARD_CARDS: CardDef[] = [
  {
    id: 'r1',
    name: '我没带钱',
    cost: 1,
    kind: 'atk',
    art: './assets/card_decline.jpg',
    statLabel: '语塞 14',
    badgeColor: 'red',
    desc: '理直气壮展示两位数字余额，直击推销死穴',
    damage: 14,
    sfx: '穷得坦荡!! -14',
    enemyReact: '“啊…那要不咱花呗分期？”',
  },
  {
    id: 'r2',
    name: '已读乱回',
    cost: 1,
    kind: 'def',
    art: './assets/card_next_time.jpg',
    statLabel: '面子 +10',
    badgeColor: 'blue',
    desc: '“嗯嗯对对去年西瓜确实甜”，硬撑 10 面子',
    face: 10,
    sfx: '已读乱回! +10面子',
    enemyReact: '“哈？咱俩聊的是同一个话题吗？”',
  },
  {
    id: 'r3',
    name: '老板急电',
    cost: 0,
    kind: 'skill',
    art: './assets/card_phone.jpg',
    statLabel: '话头 +2',
    badgeColor: 'yellow',
    desc: '定个闹钟假装接电话，立刻回 2 点话头',
    energyGain: 2,
    sfx: '马上回来改PPT!',
    enemyReact: '“大周末还加班啊？行那你先忙…”',
  },
];
