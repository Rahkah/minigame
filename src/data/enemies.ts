export type IntentType = 'attack' | 'defend' | 'buff' | 'attack_defend';

export interface EnemyMove {
  intentType: IntentType;
  label: string;
  damage?: number;
  block?: number;
  atkBuff?: number;
  heal?: number;
  line: string;
}

export interface EnemyDef {
  id: string;
  name: string;
  tag: string;
  stageTitle: string;
  tier: 'normal' | 'elite' | 'boss';
  maxHp: number;
  img?: string;
  svgKey?: string;
  introLine: string;
  winLine: string;
  loseLine: string;
  moves: EnemyMove[];
}

export interface RelicDef {
  id: string;
  icon: string;
  name: string;
  desc: string;
}

export interface StageSlot {
  stage: number;
  kind: 'battle' | 'rest';
  title: string;
  subtitle: string;
  enemyIds?: string[];
}

export const RELICS: Record<string, RelicDef> = {
  thick_skin: {
    id: 'thick_skin',
    icon: '🧱',
    name: '祖传厚脸皮',
    desc: '回合结束最多保留 4 点脸皮',
  },
  earphones: {
    id: 'earphones',
    icon: '🎧',
    name: '降噪耳机',
    desc: '每场开局立刻获得 6 点脸皮',
  },
  iced_coffee: {
    id: 'iced_coffee',
    icon: '☕',
    name: '续命冰美式',
    desc: '每场第 1 回合额外 +1 话头',
  },
  sunglasses: {
    id: 'sunglasses',
    icon: '🕶️',
    name: '社恐墨镜',
    desc: '每场第 1 次怼人自动附加🔥破防',
  },
};

export const ENEMIES: Record<string, EnemyDef> = {
  colleague: {
    id: 'colleague',
    name: '电梯半熟同事',
    tag: '第1站 · 热身',
    stageTitle: '写字楼电梯',
    tier: 'normal',
    maxHp: 34,
    svgKey: 'colleague',
    introLine: '“呀好巧！吃了吗？今天天气真不错哈…”',
    winLine: '“叮——我先出去了，回头联系哈！”',
    loseLine: '“对了周末有空帮我看看这个PPT吗？”（心态崩了！）',
    moves: [
      { intentType: 'attack', label: '尬聊寒暄', damage: 8, line: '“呀好巧！吃了吗？今天天气真不错哈…”' },
      { intentType: 'defend', label: '盯楼层装忙', block: 8, line: '“咳咳…这电梯今天怎么走得这么慢呀…”' },
      { intentType: 'buff', label: '清清嗓子', atkBuff: 3, line: '“对了突然想起来，有件大事得问问你！”' },
      { intentType: 'attack', label: '打听绩效', damage: 10, line: '“你们组今年年终奖发得早不早呀？”' },
    ],
  },
  flyer: {
    id: 'flyer',
    name: '街头传单小哥',
    tag: '第1站 · 热身',
    stageTitle: '地铁口',
    tier: 'normal',
    maxHp: 36,
    svgKey: 'flyer',
    introLine: '“帅哥美女了解一下！游泳健身免费体验！”',
    winLine: '“行行行那我发下一位，祝您发财！”',
    loseLine: '“来来扫个码领小礼品顺便留个电话！”（心态崩了！）',
    moves: [
      { intentType: 'attack', label: '强塞传单', damage: 9, line: '“了解一下！游泳健身新店开业大促！”' },
      { intentType: 'buff', label: '激情喊麦', atkBuff: 3, line: '“今天最后十个名额！听我给你算笔账！”' },
      { intentType: 'attack_defend', label: '贴身拦路', damage: 9, block: 6, line: '“我就跟您走十米！只要一分钟！”' },
    ],
  },
  tony: {
    id: 'tony',
    name: '办卡 Tony 老师',
    tag: '第2站 · 精英',
    stageTitle: '理发店',
    tier: 'elite',
    maxHp: 52,
    img: './assets/enemy_tony.jpg',
    introLine: '“宝，发质太干了，办张 3000 的卡吧？”',
    winLine: '“行行行算你狠，头发吹好了慢走不送！”',
    loseLine: '“刷卡成功！欢迎成为尊贵黑金会员！”（心态崩了！）',
    moves: [
      { intentType: 'attack', label: '推销暴击', damage: 12, line: '“宝，发质太干了，办张 3000 的卡吧？”' },
      { intentType: 'defend', label: '搬出店长', block: 12, line: '“我也是为你好呀，咱店长亲自批的折扣！”' },
      { intentType: 'buff', label: '吹嘘发质', atkBuff: 4, line: '“再不做护理，你这头皮马上要告急啦！”' },
      { intentType: 'attack', label: '内部特批', damage: 14, line: '“今天给你留个内部名额，2888 拿下！”' },
    ],
  },
  auntie: {
    id: 'auntie',
    name: '查户口二姨',
    tag: '第4站 · 修罗场',
    stageTitle: '过年客厅',
    tier: 'elite',
    maxHp: 64,
    svgKey: 'auntie',
    introLine: '“听说表哥年薪五十万，你今年涨薪没？”',
    winLine: '“行了行了厨房饺子好了，二姨去看看火！”',
    loseLine: '“明早九点公园相亲角，二姨给你约好了！”（心态崩了！）',
    moves: [
      { intentType: 'attack', label: '灵魂拷问', damage: 14, line: '“今年涨薪没？年终奖发了几个数呀？”' },
      { intentType: 'buff', label: '嗑瓜子蓄力', atkBuff: 4, heal: 5, line: '“别光喝水呀，二姨这儿还有一堆亲戚要夸呢！”' },
      { intentType: 'attack_defend', label: '催婚连击', damage: 15, block: 10, line: '“隔壁王阿姨女儿都二胎了，二姨都是为你好！”' },
    ],
  },
  boss_pie: {
    id: 'boss_pie',
    name: '画大饼老板',
    tag: '第4站 · 修罗场',
    stageTitle: '公司会议室',
    tier: 'elite',
    maxHp: 66,
    svgKey: 'boss_pie',
    introLine: '“年轻人别只看钱，我看好你的成长！”',
    winLine: '“嗯…方案你先按你想法推，我还有个会！”',
    loseLine: '“周末大家一起冲刺一下，下季度给你画更大的饼！”',
    moves: [
      { intentType: 'buff', label: '画大饼赋能', atkBuff: 4, heal: 5, line: '“公司上市了一定不会亏待老员工！”' },
      { intentType: 'attack', label: '绩效施压', damage: 15, line: '“咱们要对齐颗粒度、打通底层逻辑！”' },
      { intentType: 'defend', label: '甩给HR', block: 14, line: '“涨薪流程在走审批，你先专注产出！”' },
    ],
  },
  versailles: {
    id: 'versailles',
    name: '凡尔赛之王',
    tag: '第5站 · 关底Boss',
    stageTitle: '同学聚会',
    tier: 'boss',
    maxHp: 88,
    svgKey: 'versailles',
    introLine: '“哎呀也就随便赚了点小钱，真羡慕你清闲～”',
    winLine: '“咳！代驾到了我先撤，今晚这桌AA哈！”',
    loseLine: '“别灰心，以后跟我混，给你留个副总位置！”',
    moves: [
      { intentType: 'attack_defend', label: '凡尔赛开场', damage: 13, block: 10, line: '“哎呀也就随便赚了点小钱，真羡慕你清闲～”' },
      { intentType: 'buff', label: '晒表炫富', atkBuff: 5, heal: 6, line: '“这表走得不太准，修一下又要十几万真烦！”' },
      { intentType: 'attack', label: '帕拉梅拉暴击', damage: 18, line: '“刚提了辆帕拉梅拉，就是小区车位有点窄！”' },
      { intentType: 'defend', label: '接跨国电话', block: 16, line: '“稍等啊，我先接个几个亿的海外电话…”' },
    ],
  },
};

export const RUN_STAGES: StageSlot[] = [
  {
    stage: 1,
    kind: 'battle',
    title: '第 1 站 · 出门热身',
    subtitle: '选一条路避开（或硬刚）日常尬聊',
    enemyIds: ['colleague', 'flyer'],
  },
  {
    stage: 2,
    kind: 'battle',
    title: '第 2 站 · 精英考验',
    subtitle: '击败 Tony 老师可获得 1 件随身小物',
    enemyIds: ['tony'],
  },
  {
    stage: 3,
    kind: 'rest',
    title: '第 3 站 · 咖啡馆喘口气',
    subtitle: '回心态 / 升级话术 / 删废卡三选一',
  },
  {
    stage: 4,
    kind: 'battle',
    title: '第 4 站 · 熟人修罗场',
    subtitle: '过年二姨 vs 画大饼老板（赢了送小物）',
    enemyIds: ['auntie', 'boss_pie'],
  },
  {
    stage: 5,
    kind: 'battle',
    title: '第 5 站 · 关底大 Boss',
    subtitle: '同学聚会终极反矫情决战',
    enemyIds: ['versailles'],
  },
];
