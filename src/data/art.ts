/**
 * Hand-drawn black felt-tip marker SVG doodles matching Style 2 (魔性极简线条表情包风).
 * Pure black ink (#141414) + selective highlighter pops (#FFE600, #FF3B30, #2563EB).
 */

export const ENEMY_SVG: Record<string, string> = {
  colleague: `<svg width="220" height="190" viewBox="0 0 220 190" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g stroke="#141414" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
      <!-- Suit shoulders -->
      <path d="M52 184C54 146 72 132 110 132C148 132 166 146 168 184" fill="#FFFFFF"/>
      <path d="M96 132L110 156L124 132" fill="#FFFFFF"/>
      <path d="M110 156L105 184M110 156L115 184" stroke="#2563EB" stroke-width="6"/>
      <!-- Head -->
      <circle cx="110" cy="78" r="46" fill="#FFFFFF"/>
      <!-- Neat parting hair -->
      <path d="M68 62C74 34 102 26 128 32C148 36 156 52 154 64C138 52 112 46 68 62Z" fill="#141414"/>
      <!-- Awkward squinting eyes -->
      <path d="M84 78H100M120 78H136" stroke-width="4.5"/>
      <circle cx="92" cy="83" r="3" fill="#141414"/>
      <circle cx="128" cy="83" r="3" fill="#141414"/>
      <!-- Stiff forced smile -->
      <path d="M92 102C102 108 118 108 128 102"/>
      <!-- Awkward sweat drops -->
      <path d="M164 52C164 52 172 64 166 70C160 74 156 64 164 52Z" fill="#2563EB"/>
      <!-- Holding coffee cup -->
      <rect x="150" y="130" width="28" height="36" rx="4" fill="#FFE600"/>
      <path d="M148 130H180" stroke-width="6"/>
      <path d="M158 118C160 112 164 114 166 108M168 118C170 112 174 114 176 108" stroke-width="3.5"/>
    </g>
  </svg>`,

  flyer: `<svg width="220" height="190" viewBox="0 0 220 190" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g stroke="#141414" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
      <!-- Body leaning forward -->
      <path d="M62 184C66 142 84 128 114 128C144 128 164 142 168 184" fill="#FFFFFF"/>
      <!-- Cap + Head -->
      <circle cx="112" cy="78" r="42" fill="#FFFFFF"/>
      <path d="M70 64C76 34 112 28 148 44L174 52L144 64H70Z" fill="#FFE600"/>
      <!-- Over-eager sparkly eyes -->
      <circle cx="96" cy="76" r="6" fill="#141414"/>
      <circle cx="126" cy="76" r="6" fill="#141414"/>
      <circle cx="98" cy="74" r="2" fill="#FFFFFF" stroke="none"/>
      <circle cx="128" cy="74" r="2" fill="#FFFFFF" stroke="none"/>
      <!-- Huge salesman grin -->
      <path d="M90 95C102 110 124 110 134 95Z" fill="#FFFFFF"/>
      <!-- Shoving giant flyer forward -->
      <rect x="26" y="96" width="54" height="68" rx="4" transform="rotate(-12 26 96)" fill="#FFE600"/>
      <path d="M40 114L68 108M43 128L71 122M46 142L66 138" stroke="#FF3B30" stroke-width="4.5"/>
      <!-- Excitement lines -->
      <path d="M168 28L180 18M178 44L194 40M40 42L26 32" stroke="#FF3B30" stroke-width="4.5"/>
    </g>
  </svg>`,

  auntie: `<svg width="220" height="190" viewBox="0 0 220 190" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g stroke="#141414" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
      <!-- Curly perm cloud hair -->
      <path d="M52 94C36 82 38 56 54 48C54 26 80 18 100 26C116 14 146 20 156 38C178 42 184 68 170 86C182 100 172 122 152 120L66 120C48 122 40 106 52 94Z" fill="#141414"/>
      <!-- Floral sweater -->
      <path d="M48 186C52 142 74 128 110 128C146 128 168 142 172 186" fill="#FF3B30"/>
      <circle cx="80" cy="158" r="8" fill="#FFE600"/>
      <circle cx="142" cy="162" r="8" fill="#FFE600"/>
      <!-- Face -->
      <ellipse cx="110" cy="86" rx="42" ry="40" fill="#FFFFFF"/>
      <!-- Mischievous eyebrows -->
      <path d="M80 68L102 74M140 68L118 74" stroke-width="5"/>
      <!-- Glinting round glasses -->
      <circle cx="92" cy="84" r="14" fill="#FFFFFF"/>
      <circle cx="128" cy="84" r="14" fill="#FFFFFF"/>
      <line x1="106" y1="84" x2="114" y2="84"/>
      <circle cx="95" cy="84" r="3.5" fill="#141414"/>
      <circle cx="131" cy="84" r="3.5" fill="#141414"/>
      <path d="M84 78L90 74M120 78L126 74" stroke="#2563EB" stroke-width="3.5"/>
      <!-- Smug gossipy grin -->
      <path d="M92 104C104 116 120 116 130 102Z" fill="#FF3B30"/>
      <!-- Pointing finger + melon seeds -->
      <path d="M62 156L76 116C79 109 88 112 86 120L80 156" fill="#FFFFFF"/>
      <ellipse cx="152" cy="146" rx="6" ry="10" transform="rotate(24 152 146)" fill="#141414"/>
      <ellipse cx="164" cy="152" rx="6" ry="10" transform="rotate(-18 164 152)" fill="#141414"/>
    </g>
  </svg>`,

  boss_pie: `<svg width="220" height="190" viewBox="0 0 220 190" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g stroke="#141414" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
      <!-- Giant glowing golden flatbread ("大饼") floating behind boss -->
      <ellipse cx="144" cy="64" rx="58" ry="34" transform="rotate(-14 144 64)" fill="#FFE600"/>
      <circle cx="124" cy="58" r="3" fill="#141414" stroke="none"/>
      <circle cx="148" cy="48" r="3" fill="#141414" stroke="none"/>
      <circle cx="168" cy="62" r="3" fill="#141414" stroke="none"/>
      <circle cx="142" cy="72" r="3" fill="#141414" stroke="none"/>
      <path d="M196 22L204 12M204 42L214 40M92 22L86 12" stroke="#FF3B30" stroke-width="4"/>
      <!-- Polo shirt body -->
      <path d="M46 186C50 144 70 130 104 130C138 130 158 144 162 186" fill="#FFFFFF"/>
      <path d="M88 130L104 150L120 130"/>
      <!-- Boss head -->
      <circle cx="104" cy="84" r="40" fill="#FFFFFF"/>
      <!-- Slick comb-over hair -->
      <path d="M66 72C70 42 104 36 140 54C144 60 144 68 142 74C122 58 88 58 66 72Z" fill="#141414"/>
      <!-- Smug squinting boss eyes -->
      <path d="M82 82C88 78 94 78 98 82M112 82C118 78 124 78 128 82"/>
      <path d="M86 102C98 110 114 110 124 100"/>
      <!-- Thermos cup in hand -->
      <rect x="134" y="132" width="26" height="44" rx="5" fill="#2563EB"/>
      <rect x="132" y="126" width="30" height="10" rx="3" fill="#FFFFFF"/>
    </g>
  </svg>`,

  versailles: `<svg width="220" height="190" viewBox="0 0 220 190" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g stroke="#141414" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
      <!-- Dramatic flash rays -->
      <path d="M22 46L44 58M198 46L176 58M32 104L52 102M188 104L168 102M110 8V24" stroke="#FFE600" stroke-width="5.5"/>
      <!-- Boss suit -->
      <path d="M44 186C48 142 70 128 110 128C150 128 172 142 176 186" fill="#141414"/>
      <path d="M94 128L110 162L126 128" fill="#FFFFFF"/>
      <!-- Head -->
      <circle cx="110" cy="78" r="42" fill="#FFFFFF"/>
      <!-- Dramatic slick pompadour hair -->
      <path d="M68 68C64 36 96 18 134 28C152 34 156 54 152 68C136 48 96 46 68 68Z" fill="#141414"/>
      <!-- Cool dark sunglasses -->
      <rect x="76" y="66" width="30" height="18" rx="4" fill="#141414"/>
      <rect x="114" y="66" width="30" height="18" rx="4" fill="#141414"/>
      <line x1="106" y1="74" x2="114" y2="74"/>
      <line x1="82" y1="72" x2="90" y2="78" stroke="#FFFFFF" stroke-width="3"/>
      <line x1="120" y1="72" x2="128" y2="78" stroke="#FFFFFF" stroke-width="3"/>
      <!-- Cocky smirk -->
      <path d="M94 100C108 108 124 104 132 95"/>
      <!-- Giant sparkling gold watch flexed in front -->
      <circle cx="152" cy="144" r="22" fill="#FFE600"/>
      <circle cx="152" cy="144" r="14" fill="#FFFFFF"/>
      <path d="M152 136V144L159 148" stroke-width="4"/>
      <!-- Bling sparkles -->
      <path d="M180 122L184 112L188 122L198 126L188 130L184 140L180 130L170 126Z" fill="#FF3B30" stroke-width="3"/>
    </g>
  </svg>`,
};

export const CARD_SVG: Record<string, string> = {
  nonsense: `<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g stroke="#141414" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="60" cy="66" r="32" fill="#FFFFFF"/>
      <!-- Swirly dizzy eyes -->
      <circle cx="47" cy="60" r="8" fill="#FFE600"/>
      <circle cx="73" cy="60" r="8" fill="#FFE600"/>
      <circle cx="47" cy="60" r="2.5" fill="#141414"/>
      <circle cx="73" cy="60" r="2.5" fill="#141414"/>
      <path d="M46 80Q60 72 74 80"/>
      <!-- Chaotic speech bubble -->
      <path d="M18 14H102V40H66L56 48L54 40H18V14Z" fill="#FFFFFF"/>
      <text x="60" y="33" text-anchor="middle" font-size="16" font-weight="900" fill="#FF3B30" stroke="none">?!@#</text>
    </g>
  </svg>`,

  drink: `<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g stroke="#141414" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="54" cy="56" r="30" fill="#FFFFFF"/>
      <path d="M40 50L48 54L40 58M62 50L54 54L62 58"/>
      <!-- Glass tilted to mouth -->
      <path d="M62 60L96 44L104 68L70 84Z" fill="#2563EB"/>
      <path d="M74 60L96 50" stroke="#FFFFFF" stroke-width="3.5"/>
      <!-- Sweat drop -->
      <path d="M24 38C24 38 30 48 25 52C20 55 17 48 24 38Z" fill="#2563EB"/>
      <path d="M36 92V112M72 92V112"/>
    </g>
  </svg>`,

  blessing: `<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g stroke="#141414" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round">
      <!-- Golden halo -->
      <ellipse cx="60" cy="20" rx="26" ry="8" fill="#FFE600"/>
      <!-- Serene deadpan head -->
      <circle cx="60" cy="58" r="28" fill="#FFFFFF"/>
      <path d="M44 56H54M66 56H76"/>
      <path d="M52 70H68"/>
      <!-- Pressing palms together -->
      <path d="M50 112L56 80L60 80L60 112M70 112L64 80L60 80" fill="#FFFFFF"/>
      <path d="M20 50L28 50M92 50L100 50" stroke="#2563EB"/>
    </g>
  </svg>`,

  no_shame: `<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g stroke="#141414" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 24L28 34M108 24L92 34M12 88L28 78M108 88L92 78" stroke="#FF3B30" stroke-width="5"/>
      <circle cx="60" cy="60" r="34" fill="#FFE600"/>
      <!-- Cool pixel/comic sunglasses -->
      <rect x="34" y="48" width="23" height="14" rx="2" fill="#141414"/>
      <rect x="63" y="48" width="23" height="14" rx="2" fill="#141414"/>
      <line x1="57" y1="54" x2="63" y2="54"/>
      <path d="M44 74C52 84 68 84 76 74"/>
    </g>
  </svg>`,

  borrow: `<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g stroke="#141414" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="60" cy="48" r="28" fill="#FFFFFF"/>
      <!-- Giant starry puppy eyes -->
      <circle cx="48" cy="46" r="8" fill="#141414"/>
      <circle cx="72" cy="46" r="8" fill="#141414"/>
      <circle cx="46" cy="43" r="3" fill="#FFE600" stroke="none"/>
      <circle cx="70" cy="43" r="3" fill="#FFE600" stroke="none"/>
      <path d="M52 60C56 66 64 66 68 60"/>
      <!-- Two open begging hands stretched forward -->
      <path d="M18 96C18 82 34 80 44 88L46 106H20Z" fill="#FFE600"/>
      <path d="M102 96C102 82 86 80 76 88L74 106H100Z" fill="#FFE600"/>
      <text x="60" y="102" text-anchor="middle" font-size="22" font-weight="900" fill="#FF3B30" stroke="none">¥</text>
    </g>
  </svg>`,

  pass_buck: `<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g stroke="#141414" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round">
      <!-- Flying black frying pan ("锅") -->
      <ellipse cx="82" cy="36" rx="22" ry="14" transform="rotate(-18 82 36)" fill="#141414"/>
      <line x1="62" y1="44" x2="46" y2="54" stroke-width="6"/>
      <path d="M26 30Q50 14 70 20" stroke="#FF3B30" stroke-dasharray="6 5"/>
      <!-- Smug guy tossing it -->
      <circle cx="40" cy="76" r="22" fill="#FFFFFF"/>
      <path d="M32 72H40M46 72H54"/>
      <path d="M34 84C40 88 46 88 50 84"/>
      <path d="M58 84L88 68"/>
    </g>
  </svg>`,

  you_right: `<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g stroke="#141414" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="60" cy="60" r="32" fill="#FFFFFF"/>
      <!-- Dead-inside blank eyes -->
      <circle cx="48" cy="54" r="7" fill="#FFFFFF"/>
      <circle cx="72" cy="54" r="7" fill="#FFFFFF"/>
      <circle cx="48" cy="54" r="2" fill="#141414"/>
      <circle cx="72" cy="54" r="2" fill="#141414"/>
      <path d="M46 72C54 78 66 78 74 72"/>
      <!-- Lightning energy sparks -->
      <path d="M96 20L86 40H98L88 60" stroke="#FFE600" stroke-width="5"/>
      <path d="M26 22L20 34" stroke="#FF3B30" stroke-width="4"/>
    </g>
  </svg>`,

  off_work: `<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g stroke="#141414" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round">
      <!-- Doorway -->
      <rect x="68" y="18" width="38" height="86" fill="#FFE600"/>
      <circle cx="76" cy="64" r="3" fill="#141414"/>
      <!-- Guy with headphones striding out -->
      <circle cx="44" cy="44" r="18" fill="#FFFFFF"/>
      <path d="M26 44C26 24 62 24 62 44" stroke="#2563EB" stroke-width="5"/>
      <path d="M44 62V88M44 70L24 80M44 70L64 78M44 88L28 108M44 88L60 108"/>
    </g>
  </svg>`,

  uh_huh: `<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g stroke="#141414" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="56" cy="64" r="30" fill="#FFFFFF"/>
      <path d="M42 58H52M62 58H72"/>
      <circle cx="56" cy="76" r="5" fill="#141414"/>
      <!-- Floating nodding arrows -->
      <path d="M96 34V62M90 56L96 64L102 56" stroke="#2563EB" stroke-width="4.5"/>
      <path d="M96 34L90 42M96 34L102 42" stroke="#2563EB" stroke-width="4.5"/>
      <circle cx="24" cy="30" r="10" fill="#FFE600"/>
    </g>
  </svg>`,

  flatter: `<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g stroke="#141414" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="60" cy="48" r="26" fill="#FFFFFF"/>
      <path d="M46 44L54 48L46 52M74 44L66 48L74 52"/>
      <path d="M46 58C54 68 66 68 74 58Z" fill="#FF3B30"/>
      <!-- Clapping hands -->
      <ellipse cx="44" cy="92" rx="12" ry="16" transform="rotate(-24 44 92)" fill="#FFE600"/>
      <ellipse cx="76" cy="92" rx="12" ry="16" transform="rotate(24 76 92)" fill="#FFE600"/>
      <path d="M60 72V82M22 30L30 36M98 30L90 36" stroke="#FF3B30" stroke-width="4"/>
    </g>
  </svg>`,

  restroom: `<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g stroke="#141414" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round">
      <!-- Speed dash lines -->
      <path d="M12 46H34M8 66H30M14 86H36" stroke="#FF3B30" stroke-width="5"/>
      <!-- Stick figure sprinting away -->
      <circle cx="72" cy="34" r="16" fill="#FFE600"/>
      <circle cx="78" cy="32" r="2.5" fill="#141414"/>
      <path d="M68 50L58 78M64 60L92 56M64 60L42 66M58 78L88 94M58 78L42 104"/>
    </g>
  </svg>`,

  no_money: `<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g stroke="#141414" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round">
      <!-- Empty open wallet with flying moth -->
      <path d="M22 54L60 36L98 54V92L60 106L22 92V54Z" fill="#FFFFFF"/>
      <path d="M22 54L60 68L98 54"/>
      <path d="M60 68V106"/>
      <!-- Little moth flying out -->
      <ellipse cx="54" cy="24" rx="10" ry="6" transform="rotate(-24 54 24)" fill="#FFE600"/>
      <ellipse cx="70" cy="24" rx="10" ry="6" transform="rotate(24 70 24)" fill="#FFE600"/>
      <path d="M62 20V32"/>
      <text x="60" y="92" text-anchor="middle" font-size="18" font-weight="900" fill="#FF3B30" stroke="none">¥0</text>
    </g>
  </svg>`,
};
