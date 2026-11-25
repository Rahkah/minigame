import './styles/main.css';
import {
  ENEMY_CLASSMATE,
  RELICS,
  REWARD_CARDS,
  ROUTE_NODES,
  STARTER_CARDS,
  STYLE_INFO,
  type StreetCard,
} from './data/gameData';

type ScreenMode = 'title' | 'map' | 'battle' | 'reward';

interface AppState {
  screen: ScreenMode;
  playerHp: number;
  playerMaxHp: number;
  face: number;
  energy: number;
  maxEnergy: number;
  enemyHp: number;
  enemyMaxHp: number;
  turn: number;
  enemyLine: string;
  playedMask: boolean[];
  discard: number;
  deckBonus: StreetCard[];
  sfxText: string;
  sfxSeq: number;
  enemyAnim: '' | 'hit' | 'atk';
  shakeSeq: number;
  shieldBump: boolean;
}

const root = document.getElementById('game-root');
if (!root) {
  throw new Error('Missing #game-root');
}

const state: AppState = {
  screen: 'battle',
  playerHp: 46,
  playerMaxHp: 60,
  face: 10,
  energy: 3,
  maxEnergy: 3,
  enemyHp: 55,
  enemyMaxHp: ENEMY_CLASSMATE.maxHp,
  turn: 0,
  enemyLine: ENEMY_CLASSMATE.intents[0].line,
  playedMask: [false, false, false],
  discard: 4,
  deckBonus: [],
  sfxText: '',
  sfxSeq: 0,
  enemyAnim: '',
  shakeSeq: 0,
  shieldBump: false,
};

function triggerSfx(text: string): void {
  state.sfxText = text;
  state.sfxSeq += 1;
}

function resetBattle(): void {
  state.playerHp = 46;
  state.face = 10;
  state.energy = 3;
  state.enemyHp = 55;
  state.turn = 0;
  state.enemyLine = ENEMY_CLASSMATE.intents[0].line;
  state.playedMask = [false, false, false];
  state.discard = 4;
  state.enemyAnim = '';
  triggerSfx('重新开局!');
  render();
}

function playCard(idx: number): void {
  const card = STARTER_CARDS[idx];
  if (!card || state.playedMask[idx] || state.enemyHp <= 0 || state.playerHp <= 0) return;
  if (card.cost > state.energy) {
    triggerSfx('话头不够了!');
    render();
    return;
  }

  state.energy -= card.cost;
  state.playedMask[idx] = true;
  state.discard += 1;

  if (card.face) {
    state.face += card.face;
    state.shieldBump = true;
    setTimeout(() => {
      state.shieldBump = false;
      render();
    }, 220);
  }
  if (card.energyGain) {
    state.energy += card.energyGain;
  }
  if (card.damage) {
    state.enemyHp = Math.max(0, state.enemyHp - card.damage);
    state.enemyAnim = 'hit';
    state.shakeSeq += 1;
    setTimeout(() => {
      state.enemyAnim = '';
      render();
    }, 320);
  }

  state.enemyLine = card.enemyReact;
  triggerSfx(card.sfx);

  if (state.enemyHp <= 0) {
    state.enemyLine = '“那个…我代驾到了，先撤一步下次再聚！”';
    setTimeout(() => {
      if (state.screen === 'battle' && state.enemyHp <= 0) {
        state.screen = 'reward';
        render();
      }
    }, 950);
  }

  render();
}

function endTurn(): void {
  if (state.enemyHp <= 0) {
    state.screen = 'reward';
    render();
    return;
  }
  if (state.playerHp <= 0) {
    resetBattle();
    return;
  }

  const intent = ENEMY_CLASSMATE.intents[state.turn % ENEMY_CLASSMATE.intents.length];
  let remain = intent.damage;
  if (state.face > 0) {
    const blocked = Math.min(state.face, remain);
    state.face -= blocked;
    remain -= blocked;
  }

  state.enemyAnim = 'atk';
  state.shakeSeq += 1;
  setTimeout(() => {
    state.enemyAnim = '';
    render();
  }, 340);

  if (remain > 0) {
    state.playerHp = Math.max(0, state.playerHp - remain);
    triggerSfx(`破防打击!! 自信 -${remain}`);
  } else {
    triggerSfx('面子硬扛凡尔赛!!');
  }

  if (state.playerHp <= 0) {
    state.enemyLine = '“别灰心，以后跟我混！”（自信心归零！）';
    render();
    return;
  }

  state.turn += 1;
  const nextIntent = ENEMY_CLASSMATE.intents[state.turn % ENEMY_CLASSMATE.intents.length];
  state.enemyLine = nextIntent.line;
  state.face = Math.min(state.face, 4);
  state.energy = state.maxEnergy;
  state.playedMask = [false, false, false];
  render();
}

function renderTopNav(): string {
  const tabs: Array<{ id: ScreenMode; label: string }> = [
    { id: 'title', label: '封面' },
    { id: 'map', label: '行程' },
    { id: 'battle', label: '战斗' },
    { id: 'reward', label: '选牌' },
  ];

  return `
    <nav class="preview-nav" aria-label="界面预览切换">
      <div class="preview-tabs">
        ${tabs
          .map(
            (t) =>
              `<button class="nav-chip ${state.screen === t.id ? 'active' : ''}" data-screen="${t.id}">${t.label}</button>`,
          )
          .join('')}
      </div>
      <span class="branch-tag">${STYLE_INFO.code}</span>
    </nav>
  `;
}

function renderTitle(): string {
  return `
    <section class="screen title-screen">
      <div>
        <div class="title-kicker">暗底潮流涂鸦版 · UI 原型</div>
        <h1 class="title-main">社恐生存图鉴</h1>
        <div class="title-sub">反矫情 · 守面子 · 话术构筑肉鸽</div>
      </div>

      <div class="title-hero-frame">
        <div class="title-quote">也就随便赚了点小钱～</div>
        <img src="${ENEMY_CLASSMATE.art}" alt="凡尔赛老同学" />
      </div>

      <div class="title-actions">
        <button class="street-btn" data-screen="map">开启今夜修罗场 ▸</button>
        <button class="street-btn secondary" data-screen="battle">直奔第 4 局 · 同学聚会</button>
      </div>
    </section>
  `;
}

function renderMap(): string {
  return `
    <section class="screen map-screen">
      <div class="map-header">
        <div class="neon-tag">今夜社交修罗场</div>
        <div class="map-stat">❤️ ${state.playerHp}/${state.playerMaxHp} · 🃏 ${STARTER_CARDS.length + state.deckBonus.length}</div>
      </div>

      <div class="map-list">
        ${ROUTE_NODES.map(
          (node) => `
          <div class="route-item ${node.status}" ${node.status === 'current' ? 'data-screen="battle"' : ''}>
            <div class="route-badge">${node.icon}</div>
            <div class="route-info">
              <h4>第 ${node.floor} 局 · ${node.title}</h4>
              <p>${node.subtitle}</p>
            </div>
            ${node.status === 'current' ? '<span class="go-pill">开怼▸</span>' : ''}
          </div>
        `,
        ).join('')}
      </div>

      <button class="street-btn" data-screen="battle">迎战第 4 局 · 同学聚会 ▸</button>
    </section>
  `;
}

function renderBattle(): string {
  const intent = ENEMY_CLASSMATE.intents[state.turn % ENEMY_CLASSMATE.intents.length];
  const enemyPct = Math.max(0, (state.enemyHp / state.enemyMaxHp) * 100);
  const playerPct = Math.max(0, (state.playerHp / state.playerMaxHp) * 100);

  return `
    <section class="screen battle-screen ${state.shakeSeq > 0 ? 'shake' : ''}" data-shake="${state.shakeSeq}">
      <div class="top-strip">
        <div class="stage-cutout">${ENEMY_CLASSMATE.stageTag}</div>
        <div class="relic-strip">
          ${RELICS.map(
            (r, i) => `<button class="relic-chip" data-relic="${i}" title="${r.name}：${r.tip}">${r.icon}</button>`,
          ).join('')}
        </div>
        <button class="mood-sticker" data-mood="1">${ENEMY_CLASSMATE.mood}</button>
      </div>

      <div class="comic-box">
        <div class="enemy-top-overlay">
          <div class="sharp-bubble">${state.enemyLine}</div>
          <div class="intent-jagged">
            <span class="ij-t">▲ ${intent.label}</span>
            <span class="ij-n">${intent.damage}</span>
          </div>
        </div>

        <div class="portrait-wrap">
          <img class="enemy-portrait ${state.enemyAnim}" src="${ENEMY_CLASSMATE.art}" alt="${ENEMY_CLASSMATE.name}" />
          ${
            state.sfxSeq > 0
              ? `<div class="sfx-boom show" data-sfx="${state.sfxSeq}">${state.sfxText}</div>`
              : ''
          }
        </div>

        <div class="enemy-bar-plate">
          <div class="enemy-bar-fill" style="width: ${enemyPct}%;"></div>
          <div class="enemy-bar-txt">
            ${state.enemyHp <= 0 ? '⚡ 装逼失败，光速溜走！' : `装逼气势 ${state.enemyHp}/${state.enemyMaxHp}`}
          </div>
        </div>
      </div>

      <div class="hud-strip">
        <div class="bolt-energy">
          <strong>${state.energy}/${state.maxEnergy}</strong>
          <span>话头</span>
        </div>

        <div class="player-hp-plate">
          <div class="player-hp-fill" style="width: ${playerPct}%;"></div>
          <div class="player-hp-txt">自信心 ${state.playerHp}/${state.playerMaxHp}</div>
        </div>

        <div class="cyan-shield ${state.shieldBump ? 'bump' : ''}">
          <span>面子</span>
          <strong>${state.face}</strong>
        </div>

        <button class="hazard-btn" data-action="end-turn">
          <span>${state.playerHp <= 0 ? '重开' : state.enemyHp <= 0 ? '领奖' : '结束回合'}</span>
        </button>
      </div>

      <div class="hand-fan">
        ${STARTER_CARDS.map((c, idx) => {
          const played = state.playedMask[idx];
          const disabled = !played && (c.cost > state.energy || state.enemyHp <= 0 || state.playerHp <= 0);
          return `
            <div class="street-card ${c.theme} ${played ? 'played' : ''} ${disabled ? 'disabled' : ''}" data-card="${idx}">
              <div class="sc-head">
                <div class="sc-cost">${c.cost}</div>
                <div class="sc-name">${c.name}</div>
              </div>
              <img class="sc-art" src="${c.art}" alt="${c.name}" />
              <div class="sc-stat">${c.statLabel}</div>
            </div>
          `;
        }).join('')}
      </div>

      <div class="battle-foot">
        <span>牌库 ${8 + state.deckBonus.length}</span>
        <button class="mini-reset" data-action="reset">↺ 重置本局</button>
        <span>弃牌 ${state.discard}</span>
      </div>
    </section>
  `;
}

function renderReward(): string {
  return `
    <section class="screen reward-screen">
      <div class="reward-banner">
        <div class="reward-stamp">全场反杀！战利品三选一</div>
        <div class="reward-sub">挑选一张高能反矫话术加入卡组</div>
      </div>

      <div class="reward-list">
        ${REWARD_CARDS.map(
          (card, idx) => `
          <div class="reward-item" data-reward="${idx}">
            <img src="${card.art}" alt="${card.name}" />
            <div class="reward-info">
              <h4>[${card.cost}费] ${card.name} · ${card.statLabel}</h4>
              <p>${card.desc}</p>
            </div>
          </div>
        `,
        ).join('')}
      </div>

      <button class="street-btn secondary" data-screen="map">跳过奖励，返回行程图</button>
    </section>
  `;
}

function render(): void {
  let body = '';
  if (state.screen === 'title') body = renderTitle();
  else if (state.screen === 'map') body = renderMap();
  else if (state.screen === 'reward') body = renderReward();
  else body = renderBattle();

  root!.innerHTML = renderTopNav() + body;

  root!.querySelectorAll<HTMLElement>('[data-screen]').forEach((el) => {
    el.addEventListener('click', () => {
      const next = el.dataset.screen as ScreenMode | undefined;
      if (!next) return;
      state.screen = next;
      render();
    });
  });

  root!.querySelectorAll<HTMLElement>('[data-card]').forEach((el) => {
    el.addEventListener('click', () => {
      const idx = Number(el.dataset.card);
      playCard(idx);
    });
  });

  root!.querySelectorAll<HTMLElement>('[data-relic]').forEach((el) => {
    el.addEventListener('click', () => {
      const r = RELICS[Number(el.dataset.relic)];
      if (!r) return;
      triggerSfx(`${r.icon} ${r.name}`);
      render();
    });
  });

  root!.querySelector('[data-mood]')?.addEventListener('click', () => {
    triggerSfx('凡尔赛浓度 100%!!');
    render();
  });

  root!.querySelector('[data-action="end-turn"]')?.addEventListener('click', () => {
    endTurn();
  });

  root!.querySelector('[data-action="reset"]')?.addEventListener('click', () => {
    resetBattle();
  });

  root!.querySelectorAll<HTMLElement>('[data-reward]').forEach((el) => {
    el.addEventListener('click', () => {
      const card = REWARD_CARDS[Number(el.dataset.reward)];
      if (card) state.deckBonus.push(card);
      resetBattle();
      state.screen = 'map';
      render();
    });
  });
}

render();
