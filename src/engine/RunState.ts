import {
  CARD_TEMPLATES,
  REWARD_POOL_IDS,
  STARTER_DECK_IDS,
  getCardCost,
  getCardEffect,
  type CardInstance,
} from '../data/cards';
import { ENEMIES, RELICS, RUN_STAGES, type EnemyDef, type EnemyMove } from '../data/enemies';

export type ScreenKind = 'title' | 'map' | 'battle' | 'reward' | 'rest' | 'report';

export interface StatChip {
  color: 'red' | 'blue' | 'yellow' | 'purple';
  text: string;
  boosted?: boolean;
}

export interface CardPreview {
  cost: number;
  canPlay: boolean;
  totalDamage: number;
  baseDamage: number;
  isDoubleBroken: boolean;
  faceGain: number;
  clearsFace: boolean;
  drawCount: number;
  energyGain: number;
  selfHpLoss: number;
  appliesBreak: boolean;
  appliesSpeechless: boolean;
  exhausts: boolean;
  chips: StatChip[];
  summary: string;
}

export interface BattleState {
  enemy: EnemyDef;
  enemyHp: number;
  enemyBreak: number;
  enemySpeechless: number;
  moveIndex: number;
  enemyLine: string;
  face: number;
  energy: number;
  maxEnergy: number;
  turn: number;
  cardsPlayedThisTurn: number;
  sunglassesUsed: boolean;
  drawPile: CardInstance[];
  hand: CardInstance[];
  discardPile: CardInstance[];
  exhaustPile: CardInstance[];
  selectedUid: string | null;
  sfxText: string;
  sfxSeq: number;
  enemyAnim: '' | 'hit' | 'atk';
  shakeSeq: number;
  shieldBump: boolean;
  outcome: 'ongoing' | 'won' | 'lost';
}

export interface RunStats {
  stagesCleared: number;
  totalCardsPlayed: number;
  maxSingleHit: number;
  cardPlayCounts: Record<string, number>;
  wonRun: boolean;
}

export interface RunState {
  screen: ScreenKind;
  currentStage: number; // 1..5
  playerHp: number;
  playerMaxHp: number;
  deck: CardInstance[];
  relicIds: string[];
  battle: BattleState | null;
  rewardChoices: string[];
  rewardRelicId: string | null;
  rewardMode: 'pick' | 'upgrade';
  restMode: 'menu' | 'upgrade' | 'remove';
  showDeckOverlay: boolean;
  stats: RunStats;
  uidCounter: number;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function createNewRun(): RunState {
  let counter = 1;
  const deck: CardInstance[] = STARTER_DECK_IDS.map((templateId) => ({
    uid: `c_${counter++}`,
    templateId,
    upgraded: false,
  }));

  return {
    screen: 'title',
    currentStage: 1,
    playerHp: 60,
    playerMaxHp: 60,
    deck,
    relicIds: ['thick_skin'],
    battle: null,
    rewardChoices: [],
    rewardRelicId: null,
    rewardMode: 'pick',
    restMode: 'menu',
    showDeckOverlay: false,
    stats: {
      stagesCleared: 0,
      totalCardsPlayed: 0,
      maxSingleHit: 0,
      cardPlayCounts: {},
      wonRun: false,
    },
    uidCounter: counter,
  };
}

export function addCardToDeck(run: RunState, templateId: string, upgraded = false): CardInstance {
  const card: CardInstance = {
    uid: `c_${run.uidCounter++}`,
    templateId,
    upgraded,
  };
  run.deck.push(card);
  return card;
}

export function getEnemyMove(battle: BattleState): EnemyMove {
  return battle.enemy.moves[battle.moveIndex % battle.enemy.moves.length];
}

export function getEffectiveEnemyDamage(battle: BattleState): number {
  const raw = getEnemyMove(battle).damage;
  if (battle.enemySpeechless > 0) {
    return Math.floor(raw / 2);
  }
  return raw;
}

export function evaluateCardPreview(
  card: CardInstance,
  battle: BattleState | null,
): CardPreview {
  const cost = getCardCost(card);
  const eff = getCardEffect(card);

  let baseDamage = eff.damage ?? 0;
  if (eff.faceSlamMultiplier && battle) {
    baseDamage = battle.face * eff.faceSlamMultiplier;
  } else if (eff.comboPerCard && battle) {
    baseDamage = battle.cardsPlayedThisTurn * eff.comboPerCard;
  }

  const hasBreak = Boolean(battle && battle.enemyBreak > 0);
  const isDoubleBroken = hasBreak && baseDamage > 0;
  const totalDamage = isDoubleBroken ? baseDamage * 2 : baseDamage;
  const faceGain = eff.face ?? 0;
  const drawCount = eff.draw ?? 0;
  const energyGain = eff.energy ?? 0;
  const selfHpLoss = eff.selfHpLoss ?? 0;
  const appliesBreak = Boolean(eff.applyBreak);
  const appliesSpeechless = Boolean(eff.applySpeechless);
  const clearsFace = Boolean(eff.faceSlamMultiplier);
  const exhausts = Boolean(eff.exhaust);

  const canPlay = Boolean(
    battle &&
      battle.outcome === 'ongoing' &&
      cost <= battle.energy &&
      (!clearsFace || battle.face > 0),
  );

  // Build ultra-clean max-2 chips so players read every card in <1 second
  const chips: StatChip[] = [];

  if (eff.faceSlamMultiplier) {
    if (battle && battle.face > 0) {
      chips.push({
        color: 'red',
        text: isDoubleBroken ? `⚔️怼 ${totalDamage}!` : `⚔️怼 ${totalDamage}`,
        boosted: true,
      });
    } else {
      chips.push({ color: 'red', text: `🛡️脸皮×${eff.faceSlamMultiplier}` });
    }
  } else if (eff.comboPerCard) {
    if (battle && battle.cardsPlayedThisTurn > 0) {
      chips.push({
        color: 'red',
        text: isDoubleBroken ? `⚔️怼 ${totalDamage}!` : `⚔️怼 ${totalDamage}`,
        boosted: true,
      });
    } else {
      chips.push({ color: 'red', text: `⚡连击×${eff.comboPerCard}` });
    }
  } else if (baseDamage > 0) {
    chips.push({
      color: 'red',
      text: isDoubleBroken ? `⚔️怼 ${totalDamage}!` : `⚔️怼 ${totalDamage}`,
      boosted: isDoubleBroken,
    });
  }

  if (faceGain > 0) {
    chips.push({ color: 'blue', text: `🛡️脸皮+${faceGain}` });
  }

  if (appliesBreak && chips.length < 2) {
    chips.push({ color: 'purple', text: '🔥破防' });
  }
  if (appliesSpeechless && chips.length < 2) {
    chips.push({ color: 'purple', text: '🌀语塞' });
  }
  if (energyGain > 0 && chips.length < 2) {
    chips.push({ color: 'yellow', text: `⚡话头+${energyGain}` });
  }
  if (drawCount > 0 && chips.length < 2) {
    chips.push({ color: 'yellow', text: `🃏抽 ${drawCount}` });
  }

  // Human-readable 1-line preview summary when selected
  const parts: string[] = [];
  if (clearsFace) {
    if (battle && battle.face > 0) {
      parts.push(`撕破 ${battle.face} 点脸皮 → 怼 ${totalDamage} 伤`);
    } else {
      parts.push('需要先叠【🛡️脸皮】才能反杀！');
    }
  } else if (eff.comboPerCard) {
    parts.push(
      `本回合已出 ${battle?.cardsPlayedThisTurn ?? 0} 张牌 → 怼 ${totalDamage} 伤（每张+${eff.comboPerCard}）`,
    );
  } else if (totalDamage > 0) {
    parts.push(isDoubleBroken ? `🔥破防翻倍！怼 ${totalDamage} 伤` : `⚔️怼 ${totalDamage} 伤`);
  }

  if (faceGain > 0) parts.push(`🛡️脸皮 +${faceGain}`);
  if (appliesBreak) parts.push('挂🔥破防(下次怼伤×2)');
  if (appliesSpeechless) parts.push('挂🌀语塞(对方下击÷2)');
  if (energyGain > 0) parts.push(`⚡话头 +${energyGain}`);
  if (drawCount > 0) parts.push(`摸 ${drawCount} 张牌`);
  if (selfHpLoss > 0) parts.push(`自扣 ${selfHpLoss} 心态`);
  if (exhausts) parts.push('本场仅用1次');

  return {
    cost,
    canPlay,
    totalDamage,
    baseDamage,
    isDoubleBroken,
    faceGain,
    clearsFace,
    drawCount,
    energyGain,
    selfHpLoss,
    appliesBreak,
    appliesSpeechless,
    exhausts,
    chips,
    summary: parts.join(' · '),
  };
}

function drawCards(battle: BattleState, count: number): void {
  for (let i = 0; i < count; i += 1) {
    if (battle.hand.length >= 6) break;
    if (battle.drawPile.length === 0) {
      if (battle.discardPile.length === 0) break;
      battle.drawPile = shuffle(battle.discardPile);
      battle.discardPile = [];
    }
    const next = battle.drawPile.pop();
    if (next) battle.hand.push(next);
  }
}

export function startBattle(run: RunState, enemyId: string): void {
  const enemy = ENEMIES[enemyId];
  if (!enemy) return;

  const startFace = run.relicIds.includes('earphones') ? 6 : 0;
  const turnOneBonus = run.relicIds.includes('iced_coffee') ? 1 : 0;

  const battle: BattleState = {
    enemy,
    enemyHp: enemy.maxHp,
    enemyBreak: 0,
    enemySpeechless: 0,
    moveIndex: 0,
    enemyLine: enemy.introLine,
    face: startFace,
    energy: 3 + turnOneBonus,
    maxEnergy: 3,
    turn: 1,
    cardsPlayedThisTurn: 0,
    sunglassesUsed: false,
    drawPile: shuffle([...run.deck]),
    hand: [],
    discardPile: [],
    exhaustPile: [],
    selectedUid: null,
    sfxText: startFace > 0 ? '🎧 降噪耳机 脸皮+6' : '',
    sfxSeq: startFace > 0 ? 1 : 0,
    enemyAnim: '',
    shakeSeq: 0,
    shieldBump: false,
    outcome: 'ongoing',
  };

  drawCards(battle, 4);
  run.battle = battle;
  run.screen = 'battle';
}

export function enterRestStage(run: RunState): void {
  run.restMode = 'menu';
  run.screen = 'rest';
}

export function playSelectedCard(run: RunState, uid: string): {
  played: boolean;
  wonNow: boolean;
  lostNow: boolean;
} {
  const battle = run.battle;
  if (!battle || battle.outcome !== 'ongoing') {
    return { played: false, wonNow: false, lostNow: false };
  }

  const idx = battle.hand.findIndex((c) => c.uid === uid);
  if (idx === -1) return { played: false, wonNow: false, lostNow: false };

  const card = battle.hand[idx];
  const tpl = CARD_TEMPLATES[card.templateId];
  const preview = evaluateCardPreview(card, battle);

  if (preview.cost > battle.energy) {
    battle.sfxText = '话头不够了!';
    battle.sfxSeq += 1;
    return { played: false, wonNow: false, lostNow: false };
  }
  if (preview.clearsFace && battle.face <= 0) {
    battle.sfxText = '先叠点脸皮再用!';
    battle.sfxSeq += 1;
    return { played: false, wonNow: false, lostNow: false };
  }

  // Spend energy & move card out of hand
  battle.energy -= preview.cost;
  battle.hand.splice(idx, 1);
  battle.selectedUid = null;
  battle.cardsPlayedThisTurn += 1;
  run.stats.totalCardsPlayed += 1;
  run.stats.cardPlayCounts[card.templateId] = (run.stats.cardPlayCounts[card.templateId] ?? 0) + 1;

  if (preview.exhausts) {
    battle.exhaustPile.push(card);
  } else {
    battle.discardPile.push(card);
  }

  if (preview.selfHpLoss > 0) {
    run.playerHp = Math.max(1, run.playerHp - preview.selfHpLoss);
  }

  if (preview.clearsFace) {
    battle.face = 0;
  }

  if (preview.faceGain > 0) {
    battle.face += preview.faceGain;
    battle.shieldBump = true;
  }

  if (preview.energyGain > 0) {
    battle.energy += preview.energyGain;
  }

  const sfxParts: string[] = [tpl.sfx];

  if (preview.totalDamage > 0) {
    battle.enemyHp = Math.max(0, battle.enemyHp - preview.totalDamage);
    if (preview.isDoubleBroken) {
      battle.enemyBreak = Math.max(0, battle.enemyBreak - 1);
      sfxParts.push(`×2暴击 -${preview.totalDamage}`);
    } else {
      sfxParts.push(`-${preview.totalDamage}`);
    }
    if (preview.totalDamage > run.stats.maxSingleHit) {
      run.stats.maxSingleHit = preview.totalDamage;
    }
    battle.enemyAnim = 'hit';
    battle.shakeSeq += 1;

    // Sunglasses relic: first attack card each battle applies 1 🔥破防
    if (run.relicIds.includes('sunglasses') && !battle.sunglassesUsed) {
      battle.sunglassesUsed = true;
      battle.enemyBreak += 1;
      sfxParts.push('🕶️破防!');
    }
  } else if (preview.faceGain > 0) {
    sfxParts.push(`脸皮+${preview.faceGain}`);
  }

  if (preview.appliesBreak) {
    battle.enemyBreak += 1;
  }
  if (preview.appliesSpeechless) {
    battle.enemySpeechless += 1;
  }

  if (preview.drawCount > 0) {
    drawCards(battle, preview.drawCount);
  }

  battle.sfxText = sfxParts.join(' ');
  battle.sfxSeq += 1;

  // Check enemy defeat
  if (battle.enemyHp <= 0) {
    battle.outcome = 'won';
    battle.enemyLine = battle.enemy.winLine;
    run.stats.stagesCleared = Math.max(run.stats.stagesCleared, run.currentStage);
    return { played: true, wonNow: true, lostNow: false };
  }

  return { played: true, wonNow: false, lostNow: false };
}

export function endPlayerTurn(run: RunState): { lostNow: boolean } {
  const battle = run.battle;
  if (!battle || battle.outcome !== 'ongoing') return { lostNow: false };

  battle.selectedUid = null;

  // Discard remaining hand
  while (battle.hand.length > 0) {
    const c = battle.hand.pop();
    if (c) battle.discardPile.push(c);
  }

  // Execute enemy move
  const move = getEnemyMove(battle);
  const incoming = getEffectiveEnemyDamage(battle);
  const wasWeakened = battle.enemySpeechless > 0;
  battle.enemySpeechless = Math.max(0, battle.enemySpeechless - 1);

  if (move.heal && battle.enemyHp > 0) {
    battle.enemyHp = Math.min(battle.enemy.maxHp, battle.enemyHp + move.heal);
  }

  let remain = incoming;
  if (battle.face > 0) {
    const blocked = Math.min(battle.face, remain);
    battle.face -= blocked;
    remain -= blocked;
  }

  battle.enemyAnim = 'atk';
  battle.shakeSeq += 1;

  if (remain > 0) {
    run.playerHp = Math.max(0, run.playerHp - remain);
    battle.sfxText = wasWeakened ? `语塞减半! 心态 -${remain}` : `脸皮磨破!! 心态 -${remain}`;
  } else {
    battle.sfxText = wasWeakened ? '对方语塞 · 轻松挡住!' : '脸皮够厚 · 硬扛住了!!';
  }
  battle.sfxSeq += 1;

  if (run.playerHp <= 0) {
    battle.outcome = 'lost';
    battle.enemyLine = battle.enemy.loseLine;
    run.stats.wonRun = false;
    return { lostNow: true };
  }

  // Advance to next turn
  battle.turn += 1;
  battle.moveIndex += 1;
  const nextMove = getEnemyMove(battle);
  battle.enemyLine = nextMove.line;
  battle.cardsPlayedThisTurn = 0;

  // Relic: thick_skin retains up to 4 Face
  battle.face = run.relicIds.includes('thick_skin') ? Math.min(battle.face, 4) : 0;
  battle.energy = battle.maxEnergy;
  drawCards(battle, 4);

  return { lostNow: false };
}

export function preparePostBattleReward(run: RunState): void {
  if (run.currentStage >= RUN_STAGES.length) {
    run.stats.wonRun = true;
    run.screen = 'report';
    return;
  }

  // Pick 3 distinct reward cards spanning different archetypes when possible
  const byArch = {
    shield: shuffle(REWARD_POOL_IDS.filter((id) => CARD_TEMPLATES[id].archetype === 'shield')),
    burst: shuffle(REWARD_POOL_IDS.filter((id) => CARD_TEMPLATES[id].archetype === 'burst')),
    combo: shuffle(REWARD_POOL_IDS.filter((id) => CARD_TEMPLATES[id].archetype === 'combo')),
  };
  const choices: string[] = [];
  if (byArch.shield[0]) choices.push(byArch.shield[0]);
  if (byArch.burst[0]) choices.push(byArch.burst[0]);
  if (byArch.combo[0]) choices.push(byArch.combo[0]);

  run.rewardChoices = choices;
  run.rewardMode = 'pick';

  // Award a new relic on Elite stages (stage 2 & stage 4)
  run.rewardRelicId = null;
  if (run.battle?.enemy.tier === 'elite') {
    const unowned = Object.keys(RELICS).filter((id) => !run.relicIds.includes(id));
    if (unowned.length > 0) {
      const granted = unowned[Math.floor(Math.random() * unowned.length)];
      run.relicIds.push(granted);
      run.rewardRelicId = granted;
    }
  }

  run.screen = 'reward';
}

export function advanceAfterStage(run: RunState): void {
  run.battle = null;
  run.currentStage += 1;
  if (run.currentStage > RUN_STAGES.length) {
    run.stats.wonRun = true;
    run.screen = 'report';
  } else {
    run.screen = 'map';
  }
}

export function getMvpCardName(run: RunState): string {
  let bestId = 'decline';
  let bestCount = -1;
  for (const [id, count] of Object.entries(run.stats.cardPlayCounts)) {
    if (count > bestCount) {
      bestCount = count;
      bestId = id;
    }
  }
  return CARD_TEMPLATES[bestId]?.name ?? '婉拒了哈';
}

export function getSurvivalRank(run: RunState): { grade: string; title: string } {
  if (!run.stats.wonRun) {
    if (run.stats.stagesCleared >= 3) return { grade: 'B', title: '体面惜败打工人' };
    return { grade: 'C', title: '连夜扛火车逃跑' };
  }
  if (run.playerHp >= 45) return { grade: 'S', title: '铜墙铁壁 · 社交悍匪' };
  if (run.playerHp >= 25) return { grade: 'A', title: '游刃有余 · 嘴替大师' };
  return { grade: 'B', title: '险胜脱身 · 强撑体面' };
}
