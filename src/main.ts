import './styles/main.css';
import {
  ENEMY_TONY,
  RELICS,
  REWARD_CARDS,
  ROUTE_NODES,
  STARTER_CARDS,
  STYLE_INFO,
  type CardDef,
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
  deckBonus: CardDef[];
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
  playerHp: 50,
  playerMaxHp: 60,
  face: 8,
  energy: 3,
  maxEnergy: 3,
  enemyHp: 40,
  enemyMaxHp: ENEMY_TONY.maxHp,
  turn: 0,
  enemyLine: ENEMY_TONY.intents[0].line,
  playedMask: [false, false, false],
  discard: 2,
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
  state.playerHp = 50;
  state.face = 8;
  state.energy = 3;
  state.enemyHp = 40;
  state.turn = 0;
  state.enemyLine = ENEMY_TONY.intents[0].line;
  state.playedMask = [false, false, false];
  state.discard = 2;
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
    state.enemyLine = '“行行行算你狠，头发吹好了慢走不送！”';
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

  const intent = ENEMY_TONY.intents[state.turn % ENEMY_TONY.intents.length];
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
    triggerSfx(`面子裂开!! 自信 -${remain}`);
  } else {
    triggerSfx('面子硬扛住了!!');
  }

  if (state.playerHp <= 0) {
    state.enemyLine = '“哈哈刷卡成功！欢迎成为尊贵黑金会员！”（社死！）';
    render();
    return;
  }

  state.turn += 1;
  const nextIntent = ENEMY_TONY.intents[state.turn % ENEMY_TONY.intents.length];
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
        <div class="title-kicker">手绘魔性线条版 · UI 原型</div>
        <h1 class="title-main"><span class="title-highlight">社恐生存图鉴</span></h1>
        <div class="title-sub">用离谱话术守住自信心与面子</div>
      </div>

      <div class="title-hero">
        <img src="${ENEMY_TONY.art}" alt="Tony老师" />
        <div class="title-bubble">办张 3000 的卡吧？</div>
      </div>

      <div class="title-actions">
        <button class="doodle-btn" data-screen="map">开始今日社交 ▸</button>
        <button class="doodle-btn secondary" data-screen="battle">直接试玩理发店遭遇战</button>
      </div>
    </section>
  `;
}

function renderMap(): string {
  return `
    <section class="screen map-screen">
      <div class="map-header">
        <div class="taped-label">今日社恐行程表</div>
        <div class="map-hp-pill">❤️ ${state.playerHp}/${state.playerMaxHp} · 🃏 ${STARTER_CARDS.length + state.deckBonus.length}</div>
      </div>

      <div class="map-list">
        ${ROUTE_NODES.map(
          (node) => `
          <div class="route-card ${node.status}" ${node.status === 'current' ? 'data-screen="battle"' : ''}>
            <div class="route-dot">${node.icon}</div>
            <div class="route-meta">
              <div class="route-title">第 ${node.floor} 站 · ${node.title}</div>
              <div class="route-sub">${node.subtitle}</div>
            </div>
            ${node.status === 'current' ? '<span class="route-go">挑战▸</span>' : ''}
          </div>
        `,
        ).join('')}
      </div>

      <button class="doodle-btn" data-screen="battle">进入第 2 站 · 理发店 ▸</button>
    </section>
  `;
}

function renderBattle(): string {
  const intent = ENEMY_TONY.intents[state.turn % ENEMY_TONY.intents.length];
  const enemyPct = Math.max(0, (state.enemyHp / state.enemyMaxHp) * 100);
  const playerPct = Math.max(0, (state.playerHp / state.playerMaxHp) * 100);

  return `
    <section class="screen battle-screen ${state.shakeSeq > 0 ? 'shake' : ''}" data-shake="${state.shakeSeq}">
      <div class="battle-top">
        <div class="stage-tape">${ENEMY_TONY.stageTag}</div>
        <div class="relic-row">
          ${RELICS.map(
            (r, i) => `<button class="relic-dot" data-relic="${i}" title="${r.name}：${r.tip}">${r.icon}</button>`,
          ).join('')}
        </div>
        <div class="mood-doodle" data-mood="1">
          <div class="mood-face">😅</div>
          <span>${ENEMY_TONY.mood}</span>
        </div>
      </div>

      <div class="enemy-zone">
        <div class="intent-cluster">
          <div class="intent-burst">
            <span class="ib-t">${intent.label}</span>
            <span class="ib-n">${intent.damage}</span>
          </div>
          <div class="speech-cloud">${state.enemyLine}</div>
        </div>

        <div class="enemy-figure-wrap">
          <img class="enemy-figure ${state.enemyAnim}" src="${ENEMY_TONY.art}" alt="${ENEMY_TONY.name}" />
          ${
            state.sfxSeq > 0
              ? `<div class="sfx-pop show" data-sfx="${state.sfxSeq}">${state.sfxText}</div>`
              : ''
          }
        </div>

        <div class="enemy-hp-block">
          <div class="enemy-hp-title">
            ${state.enemyHp <= 0 ? '🎉 成功脱身！Tony 无话可说' : `推销气势 ${state.enemyHp}/${state.enemyMaxHp}`}
          </div>
          <div class="scribble-bar">
            <div class="scribble-fill" style="width: ${enemyPct}%;"></div>
          </div>
        </div>
      </div>

      <div class="hud-bar">
        <div class="energy-circle">
          <strong>${state.energy}/${state.maxEnergy}</strong>
          <span>话头</span>
        </div>

        <div class="hp-wrap">
          <div class="hp-label">自信心 ${state.playerHp}/${state.playerMaxHp}</div>
          <div class="scribble-bar">
            <div class="scribble-fill" style="width: ${playerPct}%;"></div>
          </div>
        </div>

        <div class="shield-badge ${state.shieldBump ? 'bump' : ''}">
          <span>面子</span>
          <strong>${state.face}</strong>
        </div>

        <button class="end-btn" data-action="end-turn">
          ${state.playerHp <= 0 ? '重开' : state.enemyHp <= 0 ? '领奖' : '结束回合'}
        </button>
      </div>

      <div class="hand-fan">
        ${STARTER_CARDS.map((c, idx) => {
          const played = state.playedMask[idx];
          const disabled = !played && (c.cost > state.energy || state.enemyHp <= 0 || state.playerHp <= 0);
          return `
            <div class="meme-card ${played ? 'played' : ''} ${disabled ? 'disabled' : ''}" data-card="${idx}">
              <div class="card-head">
                <div class="cost-dot">${c.cost}</div>
                <div class="card-title-hi">${c.name}</div>
              </div>
              <img class="card-img" src="${c.art}" alt="${c.name}" />
              <div class="stat-swipe ${c.badgeColor}">${c.statLabel}</div>
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
        <div class="reward-stamp">体面脱身！新话术三选一</div>
        <div class="reward-sub">挑一张塞进你的社交牌库（视觉演示）</div>
      </div>

      <div class="reward-list">
        ${REWARD_CARDS.map(
          (card, idx) => `
          <div class="reward-row" data-reward="${idx}">
            <img src="${card.art}" alt="${card.name}" />
            <div class="reward-info">
              <h4>[${card.cost}费] ${card.name} · <span class="stat-swipe ${card.badgeColor}">${card.statLabel}</span></h4>
              <p>${card.desc}</p>
            </div>
          </div>
        `,
        ).join('')}
      </div>

      <button class="doodle-btn secondary" data-screen="map">跳过奖励，返回行程表</button>
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
    triggerSfx('氛围：社恐尴尬中…');
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
