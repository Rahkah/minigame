import './styles/main.css';
import { CARD_SVG, ENEMY_SVG } from './data/art';
import {
  ARCHETYPE_LABEL,
  CARD_TEMPLATES,
  getCardCost,
  getCardDisplayName,
  type CardInstance,
} from './data/cards';
import { ENEMIES, RELICS, RUN_STAGES } from './data/enemies';
import {
  addCardToDeck,
  advanceAfterStage,
  createNewRun,
  endPlayerTurn,
  enterRestStage,
  evaluateCardPreview,
  getEffectiveEnemyDamage,
  getEnemyMove,
  getMvpCardName,
  getSurvivalRank,
  playSelectedCard,
  preparePostBattleReward,
  startBattle,
  type RunState,
} from './engine/RunState';

const root = document.getElementById('game-root');
if (!root) {
  throw new Error('Missing #game-root');
}

let run: RunState = createNewRun();

function renderCardArt(templateId: string): string {
  const tpl = CARD_TEMPLATES[templateId];
  if (tpl.img) {
    return `<img src="${tpl.img}" alt="${tpl.name}" draggable="false" />`;
  }
  if (tpl.svgKey && CARD_SVG[tpl.svgKey]) {
    return CARD_SVG[tpl.svgKey];
  }
  return '';
}

function renderEnemyArt(enemyId: string, animClass: string): string {
  const enemy = ENEMIES[enemyId];
  if (enemy.img) {
    return `<img class="enemy-figure enemy-anim ${animClass}" src="${enemy.img}" alt="${enemy.name}" draggable="false" />`;
  }
  if (enemy.svgKey && ENEMY_SVG[enemy.svgKey]) {
    return `<div class="enemy-figure-svg enemy-anim ${animClass}">${ENEMY_SVG[enemy.svgKey]}</div>`;
  }
  return '';
}

function renderTitle(): string {
  return `
    <section class="screen title-screen">
      <div>
        <div class="title-kicker">极简话术肉鸽 · 5 站完整可玩版</div>
        <h1 class="title-main"><span class="title-hi">社恐生存图鉴</span></h1>
        <div class="title-sub">看色块就能秒懂 · 守住自信心与面子</div>
      </div>

      <div class="title-hero">
        <img src="./assets/enemy_tony.jpg" alt="Tony老师" draggable="false" />
        <div class="title-bubble">办张 3000 的卡吧？</div>
      </div>

      <div class="title-actions">
        <div class="legend-strip">
          <span class="legend-pill red">🟥 怼：打气势</span>
          <span class="legend-pill blue">🟦 面子：挡伤</span>
          <span class="legend-pill yellow">🟨 话头/抽牌</span>
          <span class="legend-pill purple">🔥破防×2 · 🌀语塞÷2</span>
        </div>
        <button class="doodle-btn" data-action="start-run">开始今日 5 站社交 ▸</button>
      </div>
    </section>
  `;
}

function renderMap(): string {
  return `
    <section class="screen map-screen">
      <div class="map-top">
        <div class="taped-title">今日出门 5 站</div>
        <div class="map-stats">
          <span class="pill-btn" data-action="noop">❤️ ${run.playerHp}/${run.playerMaxHp}</span>
          <button class="pill-btn" data-action="toggle-deck">🃏 牌库(${run.deck.length})</button>
        </div>
      </div>

      <div class="map-relic-bar">
        <span>随身小物：</span>
        ${run.relicIds
          .map((id) => {
            const r = RELICS[id];
            return `<span class="relic-tag" title="${r.desc}">${r.icon} ${r.name}</span>`;
          })
          .join('')}
      </div>

      <div class="stage-list">
        ${RUN_STAGES.map((slot) => {
          const status =
            slot.stage < run.currentStage
              ? 'done'
              : slot.stage === run.currentStage
                ? 'current'
                : 'locked';
          const statusText = status === 'done' ? '已过关' : status === 'current' ? '当前站' : '未到达';

          let actionHtml = '';
          if (status === 'current') {
            if (slot.kind === 'rest') {
              actionHtml = `
                <div class="fork-row">
                  <button class="fork-btn" data-action="enter-rest">
                    <span class="fb-name">☕ 走进街头咖啡馆 ▸</span>
                    <span class="fb-meta">回自信心 / 升级话术 / 删废卡</span>
                  </button>
                </div>
              `;
            } else if (slot.enemyIds) {
              actionHtml = `
                <div class="fork-row">
                  ${slot.enemyIds
                    .map((eid) => {
                      const e = ENEMIES[eid];
                      return `
                        <button class="fork-btn" data-enemy="${eid}">
                          <span class="fb-name">${e.name} ▸</span>
                          <span class="fb-meta">${e.stageTitle} · 气势 ${e.maxHp}</span>
                        </button>
                      `;
                    })
                    .join('')}
                </div>
              `;
            }
          }

          return `
            <div class="stage-block ${status}">
              <div class="stage-head">
                <strong>${slot.title}</strong>
                <span>${statusText}</span>
              </div>
              <div class="stage-sub">${slot.subtitle}</div>
              ${actionHtml}
            </div>
          `;
        }).join('')}
      </div>
    </section>
  `;
}

function renderBattle(): string {
  const b = run.battle;
  if (!b) return '';

  const move = getEnemyMove(b);
  const rawDmg = move.damage;
  const effDmg = getEffectiveEnemyDamage(b);
  const weakened = b.enemySpeechless > 0;

  const selectedCard = b.selectedUid ? b.hand.find((c) => c.uid === b.selectedUid) ?? null : null;
  const selectedPreview = selectedCard ? evaluateCardPreview(selectedCard, b) : null;

  const enemyPct = Math.max(0, (b.enemyHp / b.enemy.maxHp) * 100);
  const previewDmg = selectedPreview && selectedPreview.canPlay ? selectedPreview.totalDamage : 0;
  const projectedEnemyHp = Math.max(0, b.enemyHp - previewDmg);
  const projectedPct = Math.max(0, (projectedEnemyHp / b.enemy.maxHp) * 100);
  const cutWidthPct = Math.max(0, enemyPct - projectedPct);

  const playerPct = Math.max(0, (run.playerHp / run.playerMaxHp) * 100);
  const previewFaceGain = selectedPreview && selectedPreview.canPlay ? selectedPreview.faceGain : 0;
  const displayedFace =
    selectedPreview && selectedPreview.canPlay && selectedPreview.clearsFace
      ? 0
      : b.face + previewFaceGain;

  const handCount = b.hand.length;

  return `
    <section class="screen battle-screen ${b.shakeSeq > 0 ? 'shake' : ''}" data-action="deselect">
      <div class="battle-top">
        <div class="stage-tape">${b.enemy.stageTitle} · ${b.enemy.tag}</div>
        <div class="relic-row">
          ${run.relicIds
            .map((id) => {
              const r = RELICS[id];
              return `<button class="relic-dot" data-relic="${id}" title="${r.name}：${r.desc}">${r.icon}</button>`;
            })
            .join('')}
        </div>
        <div class="enemy-statuses">
          ${b.enemyBreak > 0 ? `<span class="status-badge break">🔥破防×2</span>` : ''}
          ${b.enemySpeechless > 0 ? `<span class="status-badge speechless">🌀语塞÷2</span>` : ''}
        </div>
      </div>

      <div class="enemy-zone">
        <div class="intent-cluster">
          <div class="intent-burst ${weakened ? 'weakened' : ''}">
            <span class="ib-t">${move.label}${move.heal ? '+回气' : ''}</span>
            <span class="ib-n">
              ${weakened ? `<span class="ib-old">${rawDmg}</span>` : ''}${effDmg}
            </span>
          </div>
          <div class="speech-cloud">${b.enemyLine}</div>
        </div>

        <div class="enemy-figure-wrap">
          ${renderEnemyArt(b.enemy.id, b.enemyAnim)}
          ${b.sfxSeq > 0 ? `<div class="sfx-pop show" data-sfx="${b.sfxSeq}">${b.sfxText}</div>` : ''}
        </div>

        <div class="enemy-hp-block">
          <div class="enemy-hp-row">
            <span>${b.enemy.name} · 气势 ${b.enemyHp}/${b.enemy.maxHp}</span>
            ${
              previewDmg > 0
                ? `<span class="preview-dmg-tag">预计 -${previewDmg}${projectedEnemyHp === 0 ? ' 斩杀!' : ''}</span>`
                : ''
            }
          </div>
          <div class="scribble-bar">
            <div class="scribble-fill" style="width: ${enemyPct}%;"></div>
            ${
              cutWidthPct > 0
                ? `<div class="scribble-preview-cut" style="left: ${projectedPct}%; width: ${cutWidthPct}%;"></div>`
                : ''
            }
          </div>
        </div>
      </div>

      <div class="hud-bar">
        <div class="energy-circle">
          <strong>${b.energy}/${b.maxEnergy}</strong>
          <span>话头</span>
        </div>

        <div class="hp-wrap">
          <div class="hp-label">
            <span>自信心 ${run.playerHp}/${run.playerMaxHp}</span>
            ${b.cardsPlayedThisTurn > 0 ? `<span>连击 ${b.cardsPlayedThisTurn}</span>` : ''}
          </div>
          <div class="scribble-bar">
            <div class="scribble-fill" style="width: ${playerPct}%;"></div>
          </div>
        </div>

        <div class="shield-badge ${b.shieldBump ? 'bump' : ''} ${previewFaceGain > 0 ? 'previewing' : ''}">
          <span>面子</span>
          <strong>${displayedFace}</strong>
        </div>

        <button class="end-btn" data-action="end-turn">
          ${b.outcome === 'won' ? '领奖励▸' : b.outcome === 'lost' ? '看战报' : '结束回合'}
        </button>
      </div>

      <div class="preview-tip ${selectedCard ? 'active' : ''}">
        ${
          selectedCard && selectedPreview
            ? `【${getCardDisplayName(selectedCard)}】${selectedPreview.summary} · ${
                selectedPreview.canPlay ? '再点一次 / 上滑打出' : '当前不可打出'
              }`
            : b.outcome === 'won'
              ? '🎉 对方已词穷退场！点击右侧「领奖励▸」继续行程'
              : '👆 点一下卡牌预览效果，再点一次或向上滑出牌'
        }
      </div>

      <div class="hand-fan">
        ${b.hand
          .map((card, idx) => {
            const p = evaluateCardPreview(card, b);
            const isSelected = b.selectedUid === card.uid;
            const spread = handCount > 1 ? (idx - (handCount - 1) / 2) * 3.8 : 0;
            const liftY = Math.abs(idx - (handCount - 1) / 2) * 3;
            return `
              <div
                class="meme-card ${isSelected ? 'selected' : ''} ${!p.canPlay ? 'disabled' : ''} ${card.upgraded ? 'upgraded' : ''}"
                style="transform: rotate(${spread}deg) translateY(${liftY}px); z-index: ${idx + 1};"
                data-card-uid="${card.uid}"
              >
                <div class="card-head">
                  <div class="cost-dot ${p.cost === 0 ? 'free' : ''}">${p.cost}</div>
                  <div class="card-title-hi">${getCardDisplayName(card)}</div>
                </div>
                <div class="card-art-box">${renderCardArt(card.templateId)}</div>
                <div class="chip-row">
                  ${p.chips
                    .map(
                      (ch) =>
                        `<span class="stat-chip ${ch.color} ${ch.boosted ? 'boosted' : ''}">${ch.text}</span>`,
                    )
                    .join('')}
                </div>
              </div>
            `;
          })
          .join('')}
      </div>

      <div class="battle-foot">
        <button class="foot-btn" data-action="toggle-deck">📚 抽牌 ${b.drawPile.length} / 总 ${run.deck.length}</button>
        <span>第 ${b.turn} 回合</span>
        <span>🗑️ 弃牌 ${b.discardPile.length}</span>
      </div>
    </section>
  `;
}

function renderCardChoiceRow(
  card: CardInstance,
  attrName: string,
  attrVal: string,
  showUpgradeDiff = false,
): string {
  const tpl = CARD_TEMPLATES[card.templateId];
  const preview = evaluateCardPreview(card, null);
  const upPreview = showUpgradeDiff
    ? evaluateCardPreview({ ...card, upgraded: true }, null)
    : null;

  return `
    <div class="choice-row" ${attrName}="${attrVal}">
      <div class="choice-art">${renderCardArt(card.templateId)}</div>
      <div class="choice-meta">
        <div class="choice-top">
          <strong>[${getCardCost(card)}费] ${getCardDisplayName(card)}</strong>
          <span class="arch-tag">${ARCHETYPE_LABEL[tpl.archetype]}</span>
        </div>
        <div class="choice-chips">
          ${preview.chips.map((ch) => `<span class="stat-chip ${ch.color}">${ch.text}</span>`).join('')}
          ${
            upPreview
              ? `<span style="font-size:11px;font-weight:900;">→</span>` +
                upPreview.chips
                  .map((ch) => `<span class="stat-chip ${ch.color} boosted">${ch.text}</span>`)
                  .join('')
              : ''
          }
        </div>
        <div class="choice-flavor">${tpl.flavor}</div>
      </div>
    </div>
  `;
}

function renderReward(): string {
  const upgradable = run.deck.filter((c) => !c.upgraded);
  const relic = run.rewardRelicId ? RELICS[run.rewardRelicId] : null;

  if (run.rewardMode === 'upgrade') {
    return `
      <section class="screen choice-screen">
        <div class="banner-box">
          <div class="stamp-title">选择 1 张话术升级 +</div>
          <div class="stamp-sub">小牌库精炼构筑，上手更快！</div>
        </div>
        <div class="card-choice-list">
          ${upgradable
            .map((c) => renderCardChoiceRow(c, 'data-upgrade-uid', c.uid, true))
            .join('')}
        </div>
        <button class="doodle-btn secondary" data-action="reward-back">← 返回三选一新卡</button>
      </section>
    `;
  }

  return `
    <section class="screen choice-screen">
      <div class="banner-box">
        <div class="stamp-title">体面脱身！战利品三选一</div>
        <div class="stamp-sub">挑一张新话术，或把旧卡升级保持牌库精简</div>
      </div>

      ${
        relic
          ? `<div class="relic-drop">🎁 精英掉落小物：${relic.icon} ${relic.name}（${relic.desc}）</div>`
          : ''
      }

      <div class="card-choice-list">
        ${run.rewardChoices
          .map((id) =>
            renderCardChoiceRow({ uid: id, templateId: id, upgraded: false }, 'data-pick-card', id),
          )
          .join('')}
      </div>

      <div style="display:flex;gap:8px;">
        ${
          upgradable.length > 0
            ? `<button class="doodle-btn secondary" data-action="reward-to-upgrade">⬆ 改为升级 1 张旧卡</button>`
            : ''
        }
        <button class="doodle-btn secondary" data-action="skip-reward">跳过 ▸</button>
      </div>
    </section>
  `;
}

function renderRest(): string {
  if (run.restMode === 'upgrade') {
    const upgradable = run.deck.filter((c) => !c.upgraded);
    return `
      <section class="screen choice-screen">
        <div class="banner-box">
          <div class="stamp-title">☕ 复盘话术 · 选 1 张升级</div>
          <div class="stamp-sub">点击任意未升级卡牌立即强化</div>
        </div>
        <div class="card-choice-list">
          ${
            upgradable.length > 0
              ? upgradable.map((c) => renderCardChoiceRow(c, 'data-rest-upgrade', c.uid, true)).join('')
              : '<div style="text-align:center;font-weight:900;padding:24px;">所有卡牌均已满级！</div>'
          }
        </div>
        <button class="doodle-btn secondary" data-action="rest-back">← 返回咖啡馆菜单</button>
      </section>
    `;
  }

  if (run.restMode === 'remove') {
    return `
      <section class="screen choice-screen">
        <div class="banner-box">
          <div class="stamp-title">🗑️ 忘掉尴尬 · 删 1 张牌</div>
          <div class="stamp-sub">删掉基础牌，让核心连招每回合必上手</div>
        </div>
        <div class="card-choice-list">
          ${run.deck.map((c) => renderCardChoiceRow(c, 'data-rest-remove', c.uid)).join('')}
        </div>
        <button class="doodle-btn secondary" data-action="rest-back">← 返回咖啡馆菜单</button>
      </section>
    `;
  }

  return `
    <section class="screen choice-screen">
      <div class="banner-box">
        <div class="stamp-title">☕ 第 3 站 · 咖啡馆喘口气</div>
        <div class="stamp-sub">当前自信心 ${run.playerHp}/${run.playerMaxHp} · 牌库 ${run.deck.length} 张</div>
      </div>

      <div class="card-choice-list">
        <button class="rest-option" data-action="rest-heal">
          <strong>🧋 猛喝一杯冰美式</strong>
          <span>立刻恢复 24 点自信心（最高回满至 ${run.playerMaxHp}）</span>
        </button>
        <button class="rest-option" data-action="rest-to-upgrade">
          <strong>📝 悄悄复盘话术</strong>
          <span>挑选牌库里 1 张卡升级为 + 版，伤害/面子大幅提升</span>
        </button>
        <button class="rest-option" data-action="rest-to-remove">
          <strong>🧹 删掉 1 张尴尬旧卡</strong>
          <span>精简牌库，加速厚脸皮/破防/连击核心卡循环</span>
        </button>
      </div>
    </section>
  `;
}

function renderReport(): string {
  const rank = getSurvivalRank(run);
  const mvp = getMvpCardName(run);
  return `
    <section class="screen report-screen">
      <div class="banner-box">
        <div class="stamp-title">${run.stats.wonRun ? '🎉 今日社交大获全胜！' : '💀 自信心归零 · 社死逃回家'}</div>
        <div class="stamp-sub">手绘社恐生存体检报告</div>
      </div>

      <div class="report-sheet">
        <div class="rank-stamp">${rank.grade}</div>
        <div style="font-size:12px;font-weight:900;color:#5a5952;">综合评定</div>
        <div style="font-size:21px;font-weight:900;margin-top:2px;">${rank.title}</div>

        <div class="report-grid">
          <div class="report-cell">
            <span>闯过站数</span>
            <strong>${run.stats.stagesCleared} / 5 站</strong>
          </div>
          <div class="report-cell">
            <span>剩余自信心</span>
            <strong>❤️ ${run.playerHp} / ${run.playerMaxHp}</strong>
          </div>
          <div class="report-cell">
            <span>最高单发怼伤</span>
            <strong>🔥 ${run.stats.maxSingleHit} 点</strong>
          </div>
          <div class="report-cell">
            <span>MVP 话术卡</span>
            <strong>🃏 ${mvp}</strong>
          </div>
          <div class="report-cell">
            <span>总计甩出话术</span>
            <strong>${run.stats.totalCardsPlayed} 张</strong>
          </div>
          <div class="report-cell">
            <span>最终牌库规模</span>
            <strong>${run.deck.length} 张</strong>
          </div>
        </div>
      </div>

      <button class="doodle-btn" data-action="restart-run">再来一局 · 试试新流派 ▸</button>
    </section>
  `;
}

function renderDeckModal(): string {
  if (!run.showDeckOverlay) return '';
  return `
    <div class="modal-backdrop" data-action="close-deck">
      <div class="modal-sheet" data-stop="1">
        <div class="modal-head">
          <strong>📚 我的话术牌库（共 ${run.deck.length} 张）</strong>
          <button class="foot-btn" data-action="close-deck">关闭 ✕</button>
        </div>
        <div class="card-choice-list">
          ${run.deck.map((c) => renderCardChoiceRow(c, 'data-inspect', c.uid)).join('')}
        </div>
      </div>
    </div>
  `;
}

function handlePlay(uid: string): void {
  const res = playSelectedCard(run, uid);
  render();

  const b = run.battle;
  if (!b) return;

  if (b.shieldBump) {
    setTimeout(() => {
      if (run.battle) {
        run.battle.shieldBump = false;
        render();
      }
    }, 220);
  }
  if (b.enemyAnim) {
    setTimeout(() => {
      if (run.battle) {
        run.battle.enemyAnim = '';
        render();
      }
    }, 300);
  }
  if (res.wonNow) {
    setTimeout(() => {
      if (run.screen === 'battle' && run.battle?.outcome === 'won') {
        preparePostBattleReward(run);
        render();
      }
    }, 950);
  }
}

function bindCardGestures(): void {
  root!.querySelectorAll<HTMLElement>('[data-card-uid]').forEach((el) => {
    const uid = el.dataset.cardUid;
    if (!uid) return;

    let startY = 0;
    let moved = false;

    el.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      startY = e.clientY;
      moved = false;
      el.setPointerCapture?.(e.pointerId);
    });

    el.addEventListener('pointermove', (e) => {
      if (startY === 0) return;
      const dy = e.clientY - startY;
      if (dy < -12) {
        moved = true;
        const clamped = Math.max(-80, dy);
        el.style.transform = `rotate(0deg) translateY(${clamped - 18}px) scale(1.1)`;
        el.style.zIndex = '30';
      }
    });

    el.addEventListener('pointerup', (e) => {
      e.stopPropagation();
      const dy = e.clientY - startY;
      startY = 0;

      const b = run.battle;
      if (!b || b.outcome !== 'ongoing') return;

      // Swipe up > 42px plays immediately in one thumb flick!
      if (moved && dy < -42) {
        handlePlay(uid);
        return;
      }

      // Tap once = preview, tap again = play!
      if (b.selectedUid === uid) {
        handlePlay(uid);
      } else {
        b.selectedUid = uid;
        render();
      }
    });
  });
}

function render(): void {
  let html = '';
  if (run.screen === 'title') html = renderTitle();
  else if (run.screen === 'map') html = renderMap();
  else if (run.screen === 'battle') html = renderBattle();
  else if (run.screen === 'reward') html = renderReward();
  else if (run.screen === 'rest') html = renderRest();
  else html = renderReport();

  root!.innerHTML = html + renderDeckModal();

  // Prevent modal clicks from closing
  root!.querySelectorAll<HTMLElement>('[data-stop]').forEach((el) => {
    el.addEventListener('click', (e) => e.stopPropagation());
  });

  // Bind swipe + tap-to-preview cards in battle
  bindCardGestures();

  // Enemy selection on map
  root!.querySelectorAll<HTMLElement>('[data-enemy]').forEach((el) => {
    el.addEventListener('click', () => {
      const enemyId = el.dataset.enemy;
      if (enemyId) {
        startBattle(run, enemyId);
        render();
      }
    });
  });

  // Relic tooltip toast in battle
  root!.querySelectorAll<HTMLElement>('[data-relic]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = el.dataset.relic;
      const relic = id ? RELICS[id] : null;
      if (relic && run.battle) {
        run.battle.sfxText = `${relic.icon} ${relic.desc}`;
        run.battle.sfxSeq += 1;
        render();
      }
    });
  });

  // Reward card pick
  root!.querySelectorAll<HTMLElement>('[data-pick-card]').forEach((el) => {
    el.addEventListener('click', () => {
      const id = el.dataset.pickCard;
      if (id) addCardToDeck(run, id);
      advanceAfterStage(run);
      render();
    });
  });

  // Reward upgrade pick
  root!.querySelectorAll<HTMLElement>('[data-upgrade-uid]').forEach((el) => {
    el.addEventListener('click', () => {
      const uid = el.dataset.upgradeUid;
      const target = run.deck.find((c) => c.uid === uid);
      if (target) target.upgraded = true;
      advanceAfterStage(run);
      render();
    });
  });

  // Rest upgrade / remove
  root!.querySelectorAll<HTMLElement>('[data-rest-upgrade]').forEach((el) => {
    el.addEventListener('click', () => {
      const uid = el.dataset.restUpgrade;
      const target = run.deck.find((c) => c.uid === uid);
      if (target) target.upgraded = true;
      run.stats.stagesCleared = Math.max(run.stats.stagesCleared, run.currentStage);
      advanceAfterStage(run);
      render();
    });
  });

  root!.querySelectorAll<HTMLElement>('[data-rest-remove]').forEach((el) => {
    el.addEventListener('click', () => {
      const uid = el.dataset.restRemove;
      if (run.deck.length > 3) {
        run.deck = run.deck.filter((c) => c.uid !== uid);
      }
      run.stats.stagesCleared = Math.max(run.stats.stagesCleared, run.currentStage);
      advanceAfterStage(run);
      render();
    });
  });

  // General actions
  root!.querySelectorAll<HTMLElement>('[data-action]').forEach((el) => {
    el.addEventListener('click', (e) => {
      const action = el.dataset.action;
      if (action !== 'deselect') e.stopPropagation();

      switch (action) {
        case 'start-run':
          run.screen = 'map';
          render();
          break;
        case 'restart-run':
          run = createNewRun();
          run.screen = 'map';
          render();
          break;
        case 'enter-rest':
          enterRestStage(run);
          render();
          break;
        case 'deselect':
          if (run.battle && run.battle.selectedUid) {
            run.battle.selectedUid = null;
            render();
          }
          break;
        case 'toggle-deck':
          run.showDeckOverlay = !run.showDeckOverlay;
          render();
          break;
        case 'close-deck':
          run.showDeckOverlay = false;
          render();
          break;
        case 'end-turn': {
          if (!run.battle) break;
          if (run.battle.outcome === 'won') {
            preparePostBattleReward(run);
            render();
            break;
          }
          if (run.battle.outcome === 'lost') {
            run.screen = 'report';
            render();
            break;
          }
          const res = endPlayerTurn(run);
          render();
          setTimeout(() => {
            if (run.battle) {
              run.battle.enemyAnim = '';
              render();
            }
          }, 320);
          if (res.lostNow) {
            setTimeout(() => {
              if (run.screen === 'battle' && run.battle?.outcome === 'lost') {
                run.screen = 'report';
                render();
              }
            }, 1100);
          }
          break;
        }
        case 'reward-to-upgrade':
          run.rewardMode = 'upgrade';
          render();
          break;
        case 'reward-back':
          run.rewardMode = 'pick';
          render();
          break;
        case 'skip-reward':
          advanceAfterStage(run);
          render();
          break;
        case 'rest-heal':
          run.playerHp = Math.min(run.playerMaxHp, run.playerHp + 24);
          run.stats.stagesCleared = Math.max(run.stats.stagesCleared, run.currentStage);
          advanceAfterStage(run);
          render();
          break;
        case 'rest-to-upgrade':
          run.restMode = 'upgrade';
          render();
          break;
        case 'rest-to-remove':
          run.restMode = 'remove';
          render();
          break;
        case 'rest-back':
          run.restMode = 'menu';
          render();
          break;
        default:
          break;
      }
    });
  });
}

render();
