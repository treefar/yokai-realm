/* ============================================================
   《妖境說》完整版 · 核心程式
     1. ASSETS         — 資產路徑
     2. CHAR_NAMES     — 角色顯示名
     3. YAOLI          — 五大妖力
     4. CHAPTERS       — 七章劇本
     5. STAGES         — 戰鬥關卡配置
     6. State / Save   — 遊戲狀態 + 存讀檔
     7. SceneManager   — 場景切換
     8. VN engine      — 對話、選項、分支、探索熱點
     9. Script runner
    10. Opening CG
    11. Chapter Card
    12. Battle engine（支援多關卡 + 五種妖力）
    13. Menu overlay  — 章節選、存檔、讀檔
    14. Endings
    15. 啟動 / 事件繫結
   ============================================================ */

// ============================================================
// 1. ASSETS
// ============================================================
const ASSETS = {
  bg: {
    // 既有 6 張水墨手繪 PNG
    museum:          'assets/bg/museum.png?v=20260510-preload1',
    mistVillage:     'assets/bg/mist-village.png?v=20260510-preload1',
    villageInterior: 'assets/bg/village-interior.png?v=20260510-preload1',
    bambooForest:    'assets/bg/bamboo-forest.png?v=20260510-preload1',
    bossArena:       'assets/bg/boss-arena.png?v=20260510-preload1',
    chapterCard:     'assets/bg/chapter-card.png?v=20260510-preload1',
    // 後續章節新增專屬手繪 PNG（已不再共用 + 染色）
    foxfire:         'assets/bg/foxfire.png?v=20260510-preload1',
    foxfireArena:    'assets/bg/foxfire-arena.png?v=20260510-preload1',
    southMountain:   'assets/bg/south-mountain.png?v=20260510-preload1',
    southArena:      'assets/bg/south-arena.png?v=20260510-preload1',
    rift:            'assets/bg/rift.png?v=20260510-preload1',
    riftArena:       'assets/bg/rift-arena.png?v=20260510-preload1',
    nuwa:            'assets/bg/nuwa.png?v=20260510-preload1',
    nuwaArena:       'assets/bg/nuwa-arena.png?v=20260510-preload1',
    finalArena:      'assets/bg/final-arena.png?v=20260510-preload1',
    finalArenaBoss:  'assets/bg/final-arena-boss.png?v=20260510-preload1',
    modernStreet:    'assets/bg/modern-street.png?v=20260510-preload1',
    // 以下尚無圖時 fallback 到 modernStreet（檔案到位後改路徑即可）
    modernClassroom: 'assets/bg/modern-classroom.png?v=20260510-preload1',
    modernHome:      'assets/bg/modern-home.png?v=20260510-preload1',
    endingUnnamed:   'assets/bg/ending-unnamed-card.png?v=20260510-preload1',
    yaojingScroll:   'assets/bg/yaojing-scroll.png?v=20260510-preload1',
    museumNight:     'assets/bg/museum-night.png?v=20260510-preload1',
    bambooFar:       'assets/bg/bamboo-far.png?v=20260510-preload1',
    bambooMid:       'assets/bg/bamboo-mid.png?v=20260510-preload1',
    bambooNear:      'assets/bg/bamboo-near.png?v=20260510-preload1',
  },
  // VN 背景 CSS filter — 既然有專屬手繪，色調不再過度染色（保留輕微 brightness 微調作氣氛）
  bgTint: {
    // 大多新背景已自帶氛圍色，不另染色
  },
  char: {
    ruoli: {
      normal:     'assets/char/ruoli/normal.png?v=20260510-preload1',
      surprised:  'assets/char/ruoli/surprised.png?v=20260510-preload1',
      worried:    'assets/char/ruoli/worried.png?v=20260510-preload1',
      determined: 'assets/char/ruoli/determined.png?v=20260510-preload1',
      ch3Normal:  'assets/char/ruoli/ch3-attired-normal.png?v=20260510-preload1',
      ch3Determined: 'assets/char/ruoli/ch3-attired-determined.png?v=20260510-preload1',
      ch5Normal:  'assets/char/ruoli/ch5-attired-normal.png?v=20260510-preload1',
      ch5Determined: 'assets/char/ruoli/ch5-attired-determined.png?v=20260510-preload1',
      finaleNormal: 'assets/char/ruoli/finale-normal.png?v=20260510-preload1',
      finaleDetermined: 'assets/char/ruoli/finale-determined.png?v=20260510-preload1',
    },
    ruoliModern: {
      normal:  'assets/char/ruoli-modern/normal.png?v=20260510-preload1',
      curious: 'assets/char/ruoli-modern/curious.png?v=20260510-preload1',
      falling: 'assets/char/ruoli-modern/falling.png?v=20260510-preload1',
    },
    bailing: {
      smile: 'assets/char/bailing/smile.png?v=20260510-preload1',
      sly:   'assets/char/bailing/sly.png?v=20260510-preload1',
    },
    xuance: {
      normal:    'assets/char/xuance/normal.png?v=20260510-preload1',
      stern:     'assets/char/xuance/stern.png?v=20260510-preload1',
      surprised: 'assets/char/xuance/surprised.png?v=20260510-preload1',
    },
    chiyu: {
      normal:   'assets/char/chiyu/normal.png?v=20260510-preload1',
      focused:  'assets/char/chiyu/focused.png?v=20260510-preload1',
      friendly: 'assets/char/chiyu/friendly.png?v=20260510-preload1',
    },
    nuwa: {
      apparition: 'assets/char/nuwa/apparition.png?v=20260510-preload1',
      sad:         'assets/char/nuwa/sad.png?v=20260510-preload1',
      normal:      'assets/char/nuwa/apparition.png?v=20260510-preload1',
    },
    classmate: {
      normal:  'assets/char/classmate/normal.png?v=20260510-preload1',
      worried: 'assets/char/classmate/worried.png?v=20260510-preload1',
    },
    mother: {
      normal: 'assets/char/mother/normal.png?v=20260510-preload1',
    },
    curator: {
      normal: 'assets/char/curator/normal.png?v=20260510-preload1',
    },
  },
  battle: {
    ruoli:     'assets/battle/ruoli.png?v=20260510-preload1',
    boar:      'assets/battle/boar.png?v=20260510-preload1',
    leap:      'assets/battle/leap.png?v=20260510-preload1',
    wisp:      'assets/battle/wisp.png?v=20260510-preload1',
    boss:      'assets/battle/boss.png?v=20260510-preload1',
    // 新增專屬手繪 PNG（不再用 tint 區分）
    foxfire:   'assets/battle/foxfire.png?v=20260510-preload1',
    yaobing:   'assets/battle/yaobing.png?v=20260510-preload1',
    guidiao:   'assets/battle/guidiao.png?v=20260510-preload1',
    qiongqi:   'assets/battle/qiongqi.png?v=20260510-preload1',
    guardian:  'assets/battle/guardian.png?v=20260510-preload1',
    finalboss: 'assets/battle/finalboss.png?v=20260510-preload1',
    jiuwei:    'assets/battle/jiuwei.png?v=20260510-preload1',
  },
  bossIntro: {
    boss:      'assets/battle/boss-intro/wuyao-hero.png?v=20260510-preload1',
    jiuwei:    'assets/battle/boss-intro/jiuwei-hero.png?v=20260510-preload1',
    qiongqi:   'assets/battle/boss-intro/qiongqi-hero.png?v=20260510-preload1',
    guidiao:   'assets/battle/boss-intro/guidiao-hero.png?v=20260510-preload1',
    guardian:  'assets/battle/boss-intro/guardian-hero.png?v=20260510-preload1',
    finalboss: 'assets/battle/boss-intro/finalboss-hero.png?v=20260510-preload1',
  },
  ui: {
    seal: 'assets/ui/seal.png?v=20260510-preload1',
    items: {
      phone: 'assets/ui/items/phone.png?v=20260510-preload1',
      studentId: 'assets/ui/items/student-id.png?v=20260510-preload1',
      sketchbook: 'assets/ui/items/sketchbook.png?v=20260510-preload1',
      scrollFrag: 'assets/ui/items/scroll-yaojing.png?v=20260510-preload1',
      yaoliPill: 'assets/ui/items/yaoli-pill.png?v=20260510-preload1',
      hpDrop: 'assets/ui/items/hp-drop.png?v=20260510-preload1',
    },
    touch: {
      jump: 'assets/ui/touch/jump.png?v=20260510-preload1',
      attack: 'assets/ui/touch/attack.png?v=20260510-preload1',
      roll: 'assets/ui/touch/roll.png?v=20260510-preload1',
      yaoli: 'assets/ui/touch/yaoli.png?v=20260510-preload1',
    },
    yaoliIcons: {
      inkshade:   'assets/ui/yaoli/ink.png?v=20260510-preload1',
      moonlight:  'assets/ui/yaoli/moon.png?v=20260510-preload1',
      azureflame: 'assets/ui/yaoli/flame.png?v=20260510-preload1',
      windplume:  'assets/ui/yaoli/wind.png?v=20260510-preload1',
      spiritbind: 'assets/ui/yaoli/bind.png?v=20260510-preload1',
    },
  },
};

const BATTLE_TINT = {};
const ASSET_FALLBACKS = {
  bg: {
    museumNight: 'museum',
  },
};

// ============================================================
// 2. CHAR_NAMES
// ============================================================
const CHAR_NAMES = {
  ruoli:   '林若璃',
  ruoliModern: '林若璃',
  bailing: '白綾',
  xuance:  '玄澈',
  chiyu:   '赤羽',
  nuwa:    '女媧殘影',
  classmate: '陳語凡',
  mother:  '林媽媽',
  '':      '',
};

// ============================================================
// 3. YAOLI — 五大妖力屬性
// ============================================================
const YAOLI = {
  inkshade:  { id:'inkshade',  name:'墨影', cost:35, color:'#1a1612', icon:'assets/ui/yaoli/ink.png?v=20260510-preload1',   desc:'遠距水墨斬擊', dmgMul:2.5, basicDmg:12 },
  moonlight: { id:'moonlight', name:'月華', cost:40, color:'#d8e0f0', icon:'assets/ui/yaoli/moon.png?v=20260510-preload1',  desc:'回血展盾',     dmgMul:1.6, basicDmg:11, heal:18 },
  azureflame:{ id:'azureflame',name:'青焰', cost:30, color:'#f5601a', icon:'assets/ui/yaoli/flame.png?v=20260510-preload1', desc:'近身燃燒',     dmgMul:2.2, basicDmg:13, burn:true },
  windplume: { id:'windplume', name:'風羽', cost:25, color:'#5ad0e0', icon:'assets/ui/yaoli/wind.png?v=20260510-preload1',  desc:'高速二段',     dmgMul:2.0, basicDmg:11, fast:true },
  spiritbind:{ id:'spiritbind',name:'靈縛', cost:45, color:'#a060d8', icon:'assets/ui/yaoli/bind.png?v=20260510-preload1',  desc:'束縛敵人',     dmgMul:1.8, basicDmg:11, stun:true },
};

// ============================================================
// 4. CHAPTERS — 七章
// ============================================================
const CHAPTERS = [
  {
    id:'prologue',
    title:'序章 · 墨染現世',
    next:'chapter1',
    nextLabel:'第一章 · 霧村妖影',
    script:[
      { type:'bg', id:'museumNight' },
      { type:'branch', flag:'ngplus',
        then:[
          { type:'narrate', text:'……第 N 次。她又一次站在這展廳裡。霧的氣味她記得，墨的味道她記得，就連卷邊滑下那滴墨的時刻她都記得。' },
          { type:'narrate', text:'這次，她想試試別的選擇。' },
        ],
      },
      { type:'narrate', text:'2026 年，盛夏。台北。夜晚的博物館。' },
      { type:'narrate', text:'閉館前最後一小時，特展廳只剩下腳步回聲。' },
      { type:'show', char:'ruoliModern', mood:'normal', side:'center' },
      { type:'speak', char:'ruoliModern', text:'……這幅畫，跟圖鑑上看到的完全不一樣。' },
      { type:'speak', char:'ruoliModern', mood:'curious', text:'《妖境圖》。明明只是一幅山水卷軸，為什麼……我覺得，山的後面有什麼在看著我。' },
      { type:'choice', options:[
        { label:'再靠近一點', flag:{ closer:true } },
        { label:'先看說明牌', flag:{ closer:false } },
      ]},
      { type:'branch', flag:'closer',
        then:[
          { type:'narrate', text:'她伸出手，指尖差點碰到畫卷的邊緣。' },
          { type:'speak', char:'ruoliModern', mood:'curious', text:'……墨色，在動？' },
        ],
        else:[
          { type:'narrate', text:'她退後一步，瞇起眼讀那張說明牌：「年代不詳，疑為先秦遺物，紙絹上墨色至今未乾。」' },
          { type:'speak', char:'ruoliModern', mood:'curious', text:'……至今未乾？這是哪一種寫法。' },
        ],
      },
      { type:'narrate', text:'霎那間，畫卷的墨色像被誰的呼吸吹皺，一滴墨自卷邊滑落。' },
      { type:'hide', char:'ruoliModern' },
      { type:'cg', id:'opening' },
    ],
  },
  {
    id:'chapter1',
    title:'第一章 · 霧村妖影',
    next:'chapter2',
    nextLabel:'第二章 · 青丘狐火',
    script:[
      { type:'bg', id:'mistVillage' },
      { type:'show', char:'ruoli', mood:'worried', side:'center' },
      { type:'speak', char:'ruoli', text:'……這裡是？' },
      { type:'narrate', text:'校服還在，書包也還在。但空氣不對——是潮的，是冷的，是帶著草根與舊紙味的霧。' },
      { type:'narrate', text:'她下意識摸了摸口袋——手機、學生證、素描本還在；袖中一卷舊紙——是她墜落時抓住的，《妖境圖》的一片殘卷。' },
      { type:'getItem', id:'scrollFrag' },
      { type:'speak', char:'ruoli', mood:'normal', text:'這是哪兒的山。這是哪兒的霧。' },
      { type:'narrate', text:'遠處，一聲輕笑從竹影後傳來。' },
      { type:'hide', char:'ruoli' },
      { type:'show', char:'ruoli', mood:'worried', side:'left' },
      { type:'show', char:'bailing', mood:'sly', side:'right' },
      { type:'speak', char:'bailing', text:'外鄉客——你是怎麼進來的？' },
      { type:'speak', char:'bailing', text:'啊呀，還穿著這麼怪的衣服。莫不是從畫裡掉出來的吧？' },
      { type:'choice', options:[
        { label:'「你怎麼知道？」', flag:{ trustBailing:1 } },
        { label:'「你又是誰？」',   flag:{ trustBailing:0 } },
      ]},
      { type:'branch', flag:'trustBailing',
        then:[
          { type:'speak', char:'bailing', mood:'smile', text:'這就奇了。第一個被我看穿就點頭的外鄉客。' },
        ],
        else:[
          { type:'speak', char:'bailing', mood:'sly', text:'問得急。看來，畫卷選人也選得急了。' },
        ],
      },
      { type:'speak', char:'bailing', text:'我叫白綾。青丘狐族——你大概不會懂這詞。' },
      { type:'speak', char:'bailing', text:'這座霧村，半個月前還有人聲。如今只剩霧——和霧裡那些「東西」。' },
      { type:'speak', char:'ruoli', mood:'worried', text:'那些東西……是什麼？' },
      { type:'speak', char:'bailing', mood:'sly', text:'你自己去看。畫裡掉下來的人，總得自己讀完一頁。' },
      { type:'hide', char:'ruoli' },
      { type:'hide', char:'bailing' },
      { type:'bg', id:'villageInterior' },
      { type:'narrate', text:'白綾推開村口的舊柵欄。村子裡空無一人，只有霧氣繞著屋簷。' },
      { type:'explore', bg:'villageInterior',
        points:[
          { id:'well', label:'古井', x:'46%', y:'72%', scene:[
            { type:'narrate', text:'井邊苔色發黑，井底有一口無底的霧。' },
            { type:'show', char:'bailing', mood:'sly', side:'right' },
            { type:'speak', char:'bailing', text:'村民最後在這裡見過自己的影子。然後，一個一個地——少了。' },
            { type:'hide', char:'bailing' },
          ]},
          { id:'stele', label:'殘碑', x:'37%', y:'78%', scene:[
            { type:'narrate', text:'半截石碑，刻著三個古字：「山·海·封」。' },
            { type:'show', char:'bailing', mood:'smile', side:'right' },
            { type:'speak', char:'bailing', text:'這碑，比霧還老。妖境的封印，最近鬆得有點過頭了。' },
            { type:'hide', char:'bailing' },
          ]},
          { id:'spirit', label:'霧中異影', x:'63%', y:'76%', triggersBattle:true, scene:[
            { type:'narrate', text:'霧中，一道紅眼亮起。' },
            { type:'show', char:'ruoli', mood:'surprised', side:'left' },
            { type:'show', char:'bailing', mood:'sly', side:'right' },
            { type:'speak', char:'bailing', text:'來了。外鄉客，你最早覺醒的那點墨影——拿出來用。' },
            { type:'hide', char:'ruoli' },
            { type:'hide', char:'bailing' },
          ]},
        ],
      },
      { type:'battle', stage:'mist' },
      { type:'bg', id:'bambooForest' },
      { type:'show', char:'ruoli', mood:'determined', side:'left' },
      { type:'show', char:'bailing', mood:'smile', side:'right' },
      { type:'speak', char:'bailing', text:'沒想到墨影一覺醒你就會用了。看來《妖境圖》認你。' },
      { type:'speak', char:'ruoli', mood:'worried', text:'……我能回家嗎？' },
      { type:'speak', char:'bailing', mood:'sly', text:'家？外鄉客，妖境裡可沒有什麼家。' },
      { type:'speak', char:'bailing', mood:'smile', text:'但你想找的答案，倒是在另一處——青丘的狐火，等你三百年了。' },
    ],
  },
  {
    id:'chapter2',
    title:'第二章 · 青丘狐火',
    next:'chapter3',
    nextLabel:'第三章 · 南山異獸',
    rewardYaoli:'moonlight',
    script:[
      { type:'bg', id:'foxfire' },
      { type:'narrate', text:'青丘。狐火亮如月，照得遠山泛著幽藍。' },
      { type:'show', char:'bailing', mood:'smile', side:'right' },
      { type:'show', char:'ruoli', mood:'normal', side:'left' },
      { type:'speak', char:'bailing', text:'踏入這座幻境，先說好——狐族試煉，靠的不是力，是讀。' },
      { type:'speak', char:'ruoli', text:'讀什麼？' },
      { type:'speak', char:'bailing', mood:'sly', text:'讀心。讀畫。讀你自己。' },
      { type:'narrate', text:'白綾抬手，無數狐火自地面竄起，繞著兩人盤旋。' },
      { type:'hide', char:'ruoli' },
      { type:'hide', char:'bailing' },
      { type:'narrate', text:'幻境之中，影像如卷軸般展開——博物館、母親的笑、《妖境圖》上那一抹滴落的墨。' },
      // 記憶閃回：第二章狐火幻境裡 Ruoli 看見昨日的教室（modern-classroom + classmate 對戲）
      { type:'flashback', bg:'modernClassroom', scene:[
        { type:'narrate', text:'——夕陽從教室窗外斜斜灑入。空著的座位上，還擱著她沒收完的水彩。' },
        { type:'show', char:'ruoliModern', mood:'normal', side:'left' },
        { type:'show', char:'classmate', mood:'normal', side:'right' },
        { type:'speak', char:'classmate', text:'若璃！妳又最後一個收？我跟妳說，今天博物館那個展，去了真的會後悔。' },
        { type:'speak', char:'ruoliModern', mood:'curious', text:'……後悔什麼？' },
        { type:'speak', char:'classmate', text:'《妖境圖》啊。聽說盯久了會做怪夢。妳這種愛畫水彩的，最危險。' },
        { type:'speak', char:'ruoliModern', text:'——我還記得這個味道。鉛筆屑、雨後的操場、媽媽燒的飯。' },
        { type:'speak', char:'classmate', mood:'worried', text:'……欸，妳剛剛是不是消失了一下？我叫妳三聲都沒回。' },
        { type:'hide', char:'classmate' },
        { type:'speak', char:'ruoliModern', mood:'falling', text:'對不起。我好像……正在離這裡很遠。' },
        { type:'hide', char:'ruoliModern' },
      ]},
      { type:'show', char:'ruoli', mood:'worried', side:'center' },
      { type:'speak', char:'ruoli', text:'這些……是我自己的記憶。' },
      { type:'choice', options:[
        { label:'承認自己想回家', flag:{ wantHome:true,  trustBailing:2 } },
        { label:'否認，假裝鎮定', flag:{ wantHome:false, trustBailing:1 } },
      ]},
      { type:'hide', char:'ruoli' },
      { type:'show', char:'bailing', mood:'smile', side:'center' },
      { type:'speak', char:'bailing', text:'幻境誠實。你騙不了它，也騙不了我。' },
      { type:'speak', char:'bailing', mood:'sly', text:'但既然心願是真的——狐火也會替你燒。' },
      { type:'narrate', text:'白綾指尖凝出一縷月白光焰，緩緩沒入若璃胸口。' },
      { type:'hide', char:'bailing' },
      { type:'narrate', text:'幻境深處，被狐火灼出的妖影忽然向兩人撲來。' },
      { type:'battle', stage:'foxfire' },
      { type:'bg', id:'foxfire' },
      { type:'show', char:'ruoli', mood:'determined', side:'left' },
      { type:'show', char:'bailing', mood:'smile', side:'right' },
      { type:'speak', char:'bailing', text:'月華已經屬於你了。這妖力——是我青丘三百年的等。' },
      { type:'speak', char:'ruoli', text:'你等的，真的是我嗎？' },
      { type:'speak', char:'bailing', mood:'sly', text:'我等的是「能夠在妖境裡好好讀完一頁的人」。是不是你，再走幾章就知道。' },
    ],
  },
  {
    id:'chapter3',
    title:'第三章 · 南山異獸',
    next:'chapter4',
    nextLabel:'第四章 · 不周裂隙',
    rewardYaoli:'azureflame',
    script:[
      { type:'bg', id:'southMountain' },
      { type:'narrate', text:'南山。赤土碎石，天邊燒著一片如鐵的雲。' },
      { type:'show', char:'ruoli', mood:'determined', side:'left' },
      { type:'show', char:'bailing', mood:'smile', side:'right' },
      { type:'speak', char:'bailing', text:'再過去，是窮奇出沒的地界。傳說中，牠專吃講真話的人。' },
      { type:'speak', char:'ruoli', text:'……那我們最好都閉嘴。' },
      { type:'narrate', text:'山徑盡頭，一道冷冽的人影擋住兩人去路。' },
      { type:'hide', char:'ruoli' },
      { type:'hide', char:'bailing' },
      { type:'show', char:'xuance', mood:'stern', side:'center' },
      { type:'speak', char:'xuance', text:'外鄉客。卷軸不該被你翻到第三頁。' },
      { type:'show', char:'ruoli', mood:'surprised', side:'left' },
      { type:'show', char:'bailing', mood:'sly', side:'right' },
      { type:'speak', char:'bailing', text:'守卷人。你來得倒快。' },
      { type:'speak', char:'xuance', mood:'normal', text:'白綾。妳又把人帶進不該進的地方。' },
      { type:'choice', options:[
        { label:'「我不是被帶進來的，是我自己走進來的。」', flag:{ trustXuance:1 } },
        { label:'「你是誰，憑什麼擋我？」',                 flag:{ trustXuance:0 } },
      ]},
      { type:'branch', flag:'trustXuance',
        then:[
          { type:'speak', char:'xuance', mood:'surprised', text:'……自己走進來的？這是這幾百年來，我第一次聽到這句話。' },
        ],
        else:[
          { type:'speak', char:'xuance', mood:'stern', text:'憑這把守了三百年的卷軸。妳的態度，我會記在帳上。' },
        ],
      },
      { type:'narrate', text:'山風驟急。遠處傳來一聲低吼——窮奇出現了。' },
      { type:'speak', char:'xuance', text:'說話留在後面。先活下來。' },
      { type:'hide', char:'ruoli' },
      { type:'hide', char:'bailing' },
      { type:'hide', char:'xuance' },
      { type:'battle', stage:'south' },
      { type:'bg', id:'southMountain' },
      { type:'show', char:'xuance', mood:'normal', side:'right' },
      { type:'show', char:'ruoli', mood:'determined', side:'left' },
      { type:'speak', char:'xuance', text:'妳手上的墨影——比卷軸記載的更熟。' },
      { type:'speak', char:'xuance', mood:'stern', text:'拿好。窮奇火舌裡留下的青焰——以後妳會用得上。' },
      { type:'narrate', text:'一縷青色火焰自殘骸中竄出，纏上若璃的指尖。' },
      { type:'speak', char:'ruoli', text:'……這就是青焰。' },
      { type:'speak', char:'xuance', mood:'normal', text:'下一站是不周裂隙。妳若敢繼續走，我陪。' },
    ],
  },
  {
    id:'chapter4',
    title:'第四章 · 不周裂隙',
    next:'chapter5',
    nextLabel:'第五章 · 女媧殘夢',
    rewardYaoli:'windplume',
    script:[
      { type:'bg', id:'rift' },
      { type:'narrate', text:'不周山的裂隙，自上古神戰起就再未癒合。星光從縫裡漏進來，像淌了三千年的墨。' },
      { type:'show', char:'ruoli', mood:'worried', side:'left' },
      { type:'show', char:'xuance', mood:'normal', side:'right' },
      { type:'speak', char:'xuance', text:'這裡的妖兵，是當年為神戰殞命的殘魂。妳看到他們的眼，先別還手。' },
      { type:'speak', char:'ruoli', text:'為什麼？' },
      { type:'speak', char:'xuance', mood:'stern', text:'因為他們不是壞人。他們只是還沒能下山。' },
      { type:'narrate', text:'此時，一道銳利的破風聲自頭頂掠過。' },
      { type:'hide', char:'xuance' },
      { type:'show', char:'chiyu', mood:'focused', side:'right' },
      { type:'speak', char:'chiyu', text:'守卷人，你帶外鄉客闖進這裡，可是違了三族盟約。' },
      { type:'speak', char:'ruoli', mood:'surprised', text:'你又是誰？' },
      { type:'speak', char:'chiyu', mood:'normal', text:'赤羽。半人半鳥族——別把目光黏在我背上的羽毛上，難看。' },
      { type:'choice', options:[
        { label:'「我不是來打架的，是來找答案的。」', flag:{ trustChiyu:1 } },
        { label:'保持沉默',                          flag:{ trustChiyu:0 } },
      ]},
      { type:'branch', flag:'trustChiyu',
        then:[
          { type:'speak', char:'chiyu', mood:'friendly', text:'……答案？這片裂隙底下，可全是答案。也全是陷阱。' },
        ],
        else:[
          { type:'speak', char:'chiyu', mood:'focused', text:'沉默。挺好。比起那些立刻打嘴砲的外鄉客，妳算合格。' },
        ],
      },
      { type:'speak', char:'chiyu', text:'妖兵伏擊就在前頭。妳的羽毛——啊，是腳——別跟丟了。' },
      { type:'hide', char:'ruoli' },
      { type:'hide', char:'chiyu' },
      { type:'battle', stage:'rift' },
      { type:'bg', id:'rift' },
      { type:'show', char:'ruoli', mood:'determined', side:'left' },
      { type:'show', char:'chiyu', mood:'friendly', side:'right' },
      { type:'speak', char:'chiyu', text:'打得不錯。比那些只會背卷軸的好太多。' },
      { type:'speak', char:'chiyu', mood:'normal', text:'這片風羽——我族的祝福。要妳收，妳就收。' },
      { type:'narrate', text:'一陣青藍色的羽光自赤羽肩後落下，鑽入若璃身邊的氣流。' },
      { type:'speak', char:'ruoli', text:'多謝。' },
      { type:'speak', char:'chiyu', mood:'focused', text:'別道謝得太早。再往裡走——是女媧殘夢。她開口的時候，比刀子還傷人。' },
    ],
  },
  {
    id:'chapter5',
    title:'第五章 · 女媧殘夢',
    next:'chapter6',
    nextLabel:'終章 · 歸途',
    rewardYaoli:'spiritbind',
    script:[
      { type:'bg', id:'nuwa' },
      { type:'narrate', text:'女媧殘夢——傳說中，神祇將自己的記憶埋在這片青光下，作最後一道封印。' },
      { type:'show', char:'ruoli', mood:'worried', side:'left' },
      { type:'narrate', text:'空氣凝住。一道半人半蛇的身影自青光中緩緩浮現——鬢間綴著古玉，眼睛裡盛著一整個被遺忘的世紀。' },
      { type:'speak', char:'nuwa', text:'孩子。你帶著三族的妖力來，是要把封印——拆了？還是補上？' },
      { type:'speak', char:'ruoli', mood:'surprised', text:'封印？我以為……我只是在找回家的路。' },
      { type:'speak', char:'nuwa', text:'兩件事，是同一件事。' },
      { type:'speak', char:'nuwa', mood:'sad', text:'妖境鬆動的真兇——不是哪一族，而是當年我自己留下的「補天石」碎片，正在反噬。' },
      { type:'choice', options:[
        { label:'「告訴我怎麼補。」',         flag:{ savedNuwa:true,  resolveBranch:'mend' } },
        { label:'「告訴我怎麼回去。」',       flag:{ savedNuwa:false, resolveBranch:'home' } },
        { label:'「我兩個都想要——可以嗎？」', flag:{ savedNuwa:true,  resolveBranch:'both', greedy:true } },
        { label:'「都不要。我不替你寫這一頁。」', flag:{ rejectNuwa:true, savedNuwa:false, resolveBranch:'reject' } },
      ]},
      { type:'branch', flag:'resolveBranch',
        // flag 為 string 時，then 走 truthy 分支即可（不用對值比較，這裡都會跑 then）
        then:[
          { type:'speak', char:'nuwa', text:'你的回答，我會記住——記在這片殘夢的最深處。' },
        ],
      },
      { type:'speak', char:'nuwa', text:'守護者就在前頭——他是我親手造的。打贏他，靈縛便會落到你手上。' },
      { type:'hide', char:'ruoli' },
      { type:'hide', char:'nuwa' },
      { type:'battle', stage:'nuwa' },
      { type:'bg', id:'nuwa' },
      { type:'show', char:'ruoli', mood:'determined', side:'left' },
      { type:'show', char:'nuwa', mood:'apparition', side:'right' },
      { type:'speak', char:'nuwa', text:'靈縛已隨守護者餘息歸於你。' },
      { type:'speak', char:'nuwa', text:'五道妖力俱全的孩子——下一頁，由你親自寫。' },
      { type:'speak', char:'ruoli', text:'我會的。' },
    ],
  },
  {
    id:'chapter6',
    title:'終章 · 歸途',
    next:null,
    nextLabel:null,
    isFinal:true,
    script:[
      { type:'bg', id:'finalArena' },
      { type:'narrate', text:'妖境最深處——當所有同伴的氣息匯聚過來，若璃站在補天石碎片之前。' },
      { type:'show', char:'bailing', mood:'smile', side:'left' },
      { type:'show', char:'ruoli', mood:'determined', side:'center' },
      { type:'show', char:'xuance', mood:'normal', side:'right' },
      { type:'speak', char:'bailing', text:'到這裡了。妳的選擇——只剩最後一頁。' },
      { type:'speak', char:'xuance', text:'回去現代、留在妖境、或……走那條我們三族都沒走過的路。' },
      { type:'branch', flag:'rejectNuwa',
        then:[
          // 第五章拒絕女媧三選項 → 終章多一個隱藏選項
          { type:'choice', options:[
            { label:'「補完封印，回到現代。」',         flag:{ ending:'home' } },
            { label:'「留在妖境，當下一個守卷人。」',   flag:{ ending:'stay' } },
            { label:'「打碎舊封印，重寫山海經。」',     flag:{ ending:'rewrite' } },
            { label:'「我不選。我把名字從卷軸劃掉。」', flag:{ ending:'unnamed' } },
          ]},
        ],
        else:[
          { type:'choice', options:[
            { label:'「補完封印，回到現代。」',         flag:{ ending:'home' } },
            { label:'「留在妖境，當下一個守卷人。」',   flag:{ ending:'stay' } },
            { label:'「打碎舊封印，重寫山海經。」',     flag:{ ending:'rewrite' } },
          ]},
        ],
      },
      { type:'hide', char:'bailing' },
      { type:'hide', char:'xuance' },
      { type:'narrate', text:'最後的妖獸——是補天石本身的怨念。它由若璃所有同行者的影子集合而成，朝她撲來。' },
      { type:'hide', char:'ruoli' },
      { type:'battle', stage:'final' },
      // 各結局的尾聲對白：branch 支援 eq 比對 ending flag
      { type:'branch', flag:'ending', eq:'home', then:[
        { type:'bg', id:'modernHome' },
        { type:'narrate', text:'墨色一寸寸退回卷軸。她睜眼時，夕陽從客廳的窗簾縫裡漏進來。' },
        { type:'show', char:'mother', mood:'normal', side:'right' },
        { type:'show', char:'ruoliModern', mood:'normal', side:'left' },
        { type:'speak', char:'mother', text:'若璃，妳怎麼坐在地上發呆？茶都涼了。' },
        { type:'speak', char:'ruoliModern', mood:'curious', text:'……媽，今天是星期幾？' },
        { type:'speak', char:'mother', text:'禮拜六啊。妳昨晚從博物館回來就累得睡了一整天。' },
        { type:'speak', char:'ruoliModern', mood:'normal', text:'……喔。對。我大概作了一個很長的夢。' },
        { type:'narrate', text:'她低頭看了看自己的手——指縫裡仍有一抹淡淡的墨痕，洗不掉。' },
        { type:'hide', char:'mother' },
        { type:'hide', char:'ruoliModern' },
      ]},
      { type:'branch', flag:'ending', eq:'unnamed', then:[
        { type:'bg', id:'endingUnnamed' },
        { type:'narrate', text:'她舉起墨筆，在卷軸最末一行寫上自己的名字——再用同一支筆，把它劃掉。' },
        { type:'narrate', text:'墨色暈染開來，連名字所在的那一頁，也跟著她的記憶，一寸寸褪去。' },
      ]},
      { type:'ending' },
    ],
  },
];

// ============================================================
// 5. STAGES — 戰鬥關卡配置
// ============================================================
const STAGES = {
  mist: {
    bg: 'bambooForest', arenaBg: 'bossArena',
    waves: [
      { spawn:[ {kind:'boar', x:1100}, {kind:'boar', x:1500} ] },
      { spawn:[ {kind:'leap', x:2300}, {kind:'boar', x:2600}, {kind:'leap', x:2900} ] },
      { spawn:[ {kind:'wisp', x:3500, y:350}, {kind:'wisp', x:3800, y:380}, {kind:'boar', x:3700} ] },
    ],
    boss: { kind:'boss', x:4900, y:380, w:200, h:220, hp:200, label:'霧妖將', phases:2, ranged:true },
  },
  foxfire: {
    // 戰鬥視差背景與 boss 區皆已有專屬手繪 PNG，無需染色。
    bg: 'foxfireArena', arenaBg: 'foxfire',
    waves: [
      { spawn:[ {kind:'foxfire', x:1100, y:380}, {kind:'foxfire', x:1500, y:360} ] },
      { spawn:[ {kind:'leap', x:2300}, {kind:'foxfire', x:2600, y:380}, {kind:'leap', x:2900} ] },
      { spawn:[ {kind:'wisp', x:3500, y:350}, {kind:'foxfire', x:3800, y:380}, {kind:'foxfire', x:3900, y:340} ] },
    ],
    boss: { kind:'jiuwei', x:4900, y:380, w:200, h:220, hp:240, label:'九尾幻影', phases:2, ranged:true, color:'#a04030' },
  },
  south: {
    bg: 'southArena', arenaBg: 'southMountain',
    waves: [
      { spawn:[ {kind:'boar', x:1100}, {kind:'boar', x:1400}, {kind:'leap', x:1700} ] },
      { spawn:[ {kind:'wisp', x:2400, y:340}, {kind:'wisp', x:2700, y:380} ] },
      { spawn:[ {kind:'boar', x:3500}, {kind:'leap', x:3700}, {kind:'wisp', x:3900, y:360} ] },
    ],
    boss: { kind:'qiongqi', x:4900, y:380, w:200, h:220, hp:280, label:'窮奇殘影', phases:2, ranged:false },
  },
  rift: {
    bg: 'riftArena', arenaBg: 'rift',
    waves: [
      { spawn:[ {kind:'yaobing', x:1100}, {kind:'yaobing', x:1400} ] },
      { spawn:[ {kind:'yaobing', x:2300}, {kind:'wisp', x:2500, y:340}, {kind:'yaobing', x:2800} ] },
      { spawn:[ {kind:'yaobing', x:3500}, {kind:'yaobing', x:3700}, {kind:'wisp', x:3900, y:360} ] },
    ],
    boss: { kind:'guidiao', x:4900, y:300, w:220, h:160, hp:320, label:'蠱雕', phases:2, ranged:true, fly:true },
  },
  nuwa: {
    bg: 'nuwaArena', arenaBg: 'nuwa',
    waves: [
      { spawn:[ {kind:'yaobing', x:1100}, {kind:'foxfire', x:1500, y:380} ] },
      { spawn:[ {kind:'wisp', x:2300, y:340}, {kind:'wisp', x:2600, y:380}, {kind:'yaobing', x:2900} ] },
      { spawn:[ {kind:'yaobing', x:3500}, {kind:'yaobing', x:3700}, {kind:'foxfire', x:3900, y:360} ] },
    ],
    boss: { kind:'guardian', x:4900, y:340, w:240, h:260, hp:380, label:'女媧守護者', phases:2, ranged:true },
  },
  final: {
    bg: 'finalArena', arenaBg: 'finalArenaBoss',
    waves: [
      { spawn:[ {kind:'yaobing', x:1100}, {kind:'foxfire', x:1300, y:380}, {kind:'yaobing', x:1500} ] },
      { spawn:[ {kind:'wisp', x:2300, y:340}, {kind:'qiongqi', x:2600, y:380}, {kind:'wisp', x:2900, y:380} ] },
      { spawn:[ {kind:'guidiao', x:3400, y:300}, {kind:'yaobing', x:3700}, {kind:'foxfire', x:3900, y:340} ] },
    ],
    boss: { kind:'finalboss', x:4900, y:300, w:280, h:300, hp:520, label:'補天石怨念', phases:3, ranged:true },
  },
};

// ============================================================
// 6. State / Save
// ============================================================
// G 包：NG+ 模式
const NG_PLUS_KEY = 'yaojingshuo.ngplus.v1';
const NGPlus = {
  unlocked: false,        // 任何結局通關後解鎖
  active: false,          // 是否在 NG+ 流程中
  cycle: 0,               // 第幾週目
  carryover: null,        // 上一週目保留的進度
  load() {
    try {
      const raw = localStorage.getItem(NG_PLUS_KEY);
      if (raw) Object.assign(this, JSON.parse(raw));
    } catch (_) {}
  },
  save() {
    try {
      localStorage.setItem(NG_PLUS_KEY, JSON.stringify({
        unlocked: this.unlocked, cycle: this.cycle, carryover: this.carryover,
      }));
    } catch (_) {}
  },
  // 通關後呼叫：解鎖 NG+ 並儲存可帶到下週目的進度
  onEndingReached() {
    this.unlocked = true;
    this.cycle = (this.cycle || 0) + 1;
    this.carryover = {
      unlockedYaoli: State.unlockedYaoli.slice(),
      inventory: Inventory.items.slice(),
      seenItemDialogs: true, // 標誌：第二週目對白略不同
    };
    this.save();
  },
  // 啟動 NG+：把 carryover 套到 State
  startCycle() {
    if (!this.unlocked || !this.carryover) return false;
    this.active = true;
    State.flags = { ngplus: true, cycle: this.cycle };
    State.scriptIndex = 0;
    State.chapterIdx = 0;
    State.unlockedYaoli = this.carryover.unlockedYaoli.slice();
    State.currentYaoli = State.unlockedYaoli[0] || 'inkshade';
    Inventory.items = this.carryover.inventory.slice();
    Inventory.save();
    State.startTime = Date.now();
    return true;
  },
};

// 多存檔：5 槽手動 + 1 自動。舊版單一 save 會自動遷移到 'auto'。
const SAVE_PREFIX = 'yaojingshuo.save.';
const SAVE_LEGACY_KEY = 'yaojingshuo.save.v1';
const SAVE_SLOTS = ['auto', '1', '2', '3', '4', '5'];

const State = {
  flags: {},
  scriptIndex: 0,
  scene: 'title',
  exploreReturn: null,
  battleReturn: null,
  chapterIdx: 0,
  unlockedYaoli: [],
  currentYaoli: 'inkshade',
  startTime: 0,        // 計算遊戲時數用
  playSeconds: 0,
};

function getCurrentChapter() { return CHAPTERS[State.chapterIdx]; }
function getCurrentScript()  { return getCurrentChapter().script; }

function unlockYaoli(id) {
  if (!State.unlockedYaoli.includes(id)) State.unlockedYaoli.push(id);
  State.currentYaoli = id;
  Achievements.check();
}

// 截圖 canvas/dialog 當作 save thumbnail（base64 dataURL，small）
function captureThumbnail() {
  try {
    if (State.scene === 'battle' && Battle.canvas) {
      const small = document.createElement('canvas');
      small.width = 240; small.height = 90;
      small.getContext('2d').drawImage(Battle.canvas, 0, 0, 240, 90);
      return small.toDataURL('image/jpeg', 0.6);
    }
    if (State.scene === 'vn') {
      // 用 VN bg 當縮圖（CSS background-image）
      const bgEl = document.getElementById('vn-bg');
      const bgUrl = (bgEl.style.backgroundImage || '').match(/url\("?(.*?)"?\)/);
      return bgUrl ? bgUrl[1] : null;
    }
  } catch (_) {}
  return null;
}

function saveGameToSlot(slot) {
  try {
    const data = {
      flags: State.flags,
      chapterIdx: State.chapterIdx,
      scriptIndex: State.scriptIndex,
      unlockedYaoli: State.unlockedYaoli,
      currentYaoli: State.currentYaoli,
      ts: Date.now(),
      playSeconds: State.playSeconds + Math.round((Date.now() - (State.startTime||Date.now())) / 1000),
      chapterTitle: getCurrentChapter().title,
      thumb: captureThumbnail(),
      inventory: Inventory.items.slice(),
      v: 4,
    };
    localStorage.setItem(SAVE_PREFIX + slot, JSON.stringify(data));
    return true;
  } catch (_) { return false; }
}

function loadSaveSlot(slot) {
  try {
    const raw = localStorage.getItem(SAVE_PREFIX + slot);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (_) { return null; }
}

// 取最新的有效 save（給「繼續」按鈕用）
function loadSaveData() {
  let latest = null;
  for (const slot of SAVE_SLOTS) {
    const d = loadSaveSlot(slot);
    if (d && (!latest || d.ts > latest.ts)) latest = d;
  }
  // 舊版相容
  if (!latest) {
    try {
      const raw = localStorage.getItem(SAVE_LEGACY_KEY);
      if (raw) latest = JSON.parse(raw);
    } catch (_) {}
  }
  return latest;
}

// 給舊呼叫保留：寫入 auto 槽
function saveGame() { return saveGameToSlot('auto'); }

function applySave(data) {
  if (!data) return false;
  State.flags = data.flags || {};
  State.chapterIdx = data.chapterIdx || 0;
  State.scriptIndex = data.scriptIndex || 0;
  State.unlockedYaoli = data.unlockedYaoli || [];
  State.currentYaoli = data.currentYaoli || State.unlockedYaoli[0] || 'inkshade';
  State.playSeconds = data.playSeconds || 0;
  State.startTime = Date.now();
  if (data.inventory) {
    Inventory.items = data.inventory.slice();
    Inventory.save();
  }
  return true;
}

// ============================================================
// 6.5 Settings — 偏好設定（textSpeed / volume / shake / 自動間隔 / 觸控 / 語言）
// ============================================================
const SETTINGS_KEY = 'yaojingshuo.settings.v1';
const Settings = {
  textSpeed: 28,        // ms / 字
  bgmVolume: 0.6,
  sfxVolume: 0.8,
  shake: true,
  autoIntervalSec: 2.5,
  touch: false,
  lang: 'zh-Hant',
  perf: false,

  load() {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (!raw) {
        // 首次：依瀏覽器語言自動選
        if (typeof navigator !== 'undefined') this.lang = detectLang();
        return;
      }
      Object.assign(this, JSON.parse(raw));
    } catch (_) {}
  },
  save() {
    try {
      const o = {
        textSpeed: this.textSpeed, bgmVolume: this.bgmVolume, sfxVolume: this.sfxVolume,
        shake: this.shake, autoIntervalSec: this.autoIntervalSec, touch: this.touch, lang: this.lang,
      };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(o));
    } catch (_) {}
  },
  reset() {
    this.textSpeed = 28; this.bgmVolume = 0.6; this.sfxVolume = 0.8;
    this.shake = true; this.autoIntervalSec = 2.5; this.touch = false;
    this.lang = detectLang(); this.perf = false;
    this.save(); this.applyToUI();
  },
  applyToUI() {
    const ts = document.getElementById('set-text-speed');
    if (ts) ts.value = String(this.textSpeed);
    const bv = document.getElementById('set-bgm-vol'); if (bv) { bv.value = Math.round(this.bgmVolume * 100); document.getElementById('val-bgm-vol').textContent = bv.value; }
    const sv = document.getElementById('set-sfx-vol'); if (sv) { sv.value = Math.round(this.sfxVolume * 100); document.getElementById('val-sfx-vol').textContent = sv.value; }
    const sh = document.getElementById('set-shake'); if (sh) sh.checked = this.shake;
    const ai = document.getElementById('set-auto-interval'); if (ai) { ai.value = this.autoIntervalSec; document.getElementById('val-auto-interval').textContent = ai.value; }
    const tc = document.getElementById('set-touch'); if (tc) tc.checked = this.touch;
    const pf = document.getElementById('set-perf'); if (pf) pf.checked = this.perf;
    const ln = document.getElementById('set-lang'); if (ln) ln.value = this.lang;
    const vp = document.getElementById('virtual-pad'); if (vp) vp.classList.toggle('show', this.touch);
    const po = document.getElementById('perf-overlay'); if (po) po.classList.toggle('show', this.perf);
  },
  bind() {
    const sel = (id) => document.getElementById(id);
    sel('set-text-speed')?.addEventListener('change', e => { this.textSpeed = +e.target.value; this.save(); });
    sel('set-bgm-vol')?.addEventListener('input', e => { this.bgmVolume = +e.target.value / 100; document.getElementById('val-bgm-vol').textContent = e.target.value; Audio.applyVolumes(); this.save(); });
    sel('set-sfx-vol')?.addEventListener('input', e => { this.sfxVolume = +e.target.value / 100; document.getElementById('val-sfx-vol').textContent = e.target.value; this.save(); });
    sel('set-shake')?.addEventListener('change', e => { this.shake = e.target.checked; this.save(); });
    sel('set-auto-interval')?.addEventListener('input', e => { this.autoIntervalSec = +e.target.value; document.getElementById('val-auto-interval').textContent = e.target.value; this.save(); });
    sel('set-touch')?.addEventListener('change', e => { this.touch = e.target.checked; document.getElementById('virtual-pad').classList.toggle('show', this.touch); this.save(); });
    sel('set-perf')?.addEventListener('change', e => { this.perf = e.target.checked; document.getElementById('perf-overlay').classList.toggle('show', this.perf); this.save(); });
    sel('set-lang')?.addEventListener('change', e => { this.lang = e.target.value; this.save(); applyI18nDOM(); flashToast('Language updated · 語言已切換'); });
  },
};

// ============================================================
// 6.6 Audio — BGM/SFX，檔案缺失時靜默不報錯
// ============================================================
const AUDIO_BGM = {
  title:        'assets/audio/bgm/title.wav?v=20260510-preload1',
  museum:       'assets/audio/bgm/museum.wav?v=20260510-preload1',
  mistVillage:  'assets/audio/bgm/mistVillage.wav?v=20260510-preload1',
  foxfire:      'assets/audio/bgm/foxfire.wav?v=20260510-preload1',
  south:        'assets/audio/bgm/south.wav?v=20260510-preload1',
  rift:         'assets/audio/bgm/rift.wav?v=20260510-preload1',
  nuwa:         'assets/audio/bgm/nuwa.wav?v=20260510-preload1',
  battle:       'assets/audio/bgm/battle.wav?v=20260510-preload1',
  final:        'assets/audio/bgm/final.wav?v=20260510-preload1',
  ending:       'assets/audio/bgm/ending.wav?v=20260510-preload1',
};
const AUDIO_SFX = {
  inkStroke:    'assets/audio/sfx/ink-stroke.wav?v=20260510-preload1',
  jump:         'assets/audio/sfx/jump.wav?v=20260510-preload1',
  roll:         'assets/audio/sfx/roll.wav?v=20260510-preload1',
  hit:          'assets/audio/sfx/hit.wav?v=20260510-preload1',
  hitYaoli:     'assets/audio/sfx/hit-yaoli.wav?v=20260510-preload1',
  playerHurt:   'assets/audio/sfx/player-hurt.wav?v=20260510-preload1',
  uiStamp:      'assets/audio/sfx/ui-stamp.wav?v=20260510-preload1',
  uiPage:       'assets/audio/sfx/ui-page.wav?v=20260510-preload1',
  victory:      'assets/audio/sfx/victory.wav?v=20260510-preload1',
  defeat:       'assets/audio/sfx/defeat.wav?v=20260510-preload1',
  bossRoar:     'assets/audio/sfx/boss-roar.wav?v=20260510-preload1',
  bossWarning:  'assets/audio/sfx/boss-warning.wav?v=20260510-preload1',
};
const Audio = {
  bgm: null,        // 目前播放中的 HTMLAudioElement
  bgmId: null,
  sfxPool: {},      // id → HTMLAudioElement[]
  enabled: true,    // 缺檔時自動關閉個別音檔，但整體仍 enabled

  _newAudio(src, loop = false) {
    try {
      const a = new globalThis.Audio();
      a.src = src;
      a.loop = loop;
      a.preload = 'auto';
      // 缺檔不報錯
      a.addEventListener('error', () => {});
      return a;
    } catch (_) { return null; }
  },

  playBgm(id) {
    if (!AUDIO_BGM[id]) return;
    if (this.bgmId === id && this.bgm) return; // 已在播放
    this.stopBgm();
    const a = this._newAudio(AUDIO_BGM[id], true);
    if (!a) return;
    a.volume = Settings.bgmVolume;
    const p = a.play();
    if (p && p.catch) p.catch(() => { /* 自動播放被瀏覽器擋 → 靜默 */ });
    this.bgm = a;
    this.bgmId = id;
  },
  unlock() {
    if (!this.bgm) {
      if (State.scene === 'title') this.playBgm('title');
      return;
    }
    const p = this.bgm.play();
    if (p && p.catch) p.catch(() => {});
  },
  stopBgm() {
    if (this.bgm) {
      try { this.bgm.pause(); this.bgm.src = ''; } catch (_) {}
    }
    this.bgm = null;
    this.bgmId = null;
  },
  playSfx(id) {
    if (!AUDIO_SFX[id]) return;
    const a = this._newAudio(AUDIO_SFX[id], false);
    if (!a) return;
    a.volume = Settings.sfxVolume;
    const p = a.play();
    if (p && p.catch) p.catch(() => {});
  },
  applyVolumes() {
    if (this.bgm) this.bgm.volume = Settings.bgmVolume;
  },
};

// ============================================================
// 6.7 Backlog — 對話歷史
// ============================================================
const Backlog = {
  rows: [],
  MAX: 200,
  push(charId, text, isNarrate) {
    this.rows.push({ char: charId, name: CHAR_NAMES[charId] || '', text, narrate: !!isNarrate, ts: Date.now() });
    if (this.rows.length > this.MAX) this.rows.shift();
  },
  open() {
    const list = document.getElementById('backlog-list');
    if (!list) return;
    list.innerHTML = '';
    for (const r of this.rows) {
      const row = document.createElement('div');
      row.className = 'backlog-row';
      const by = document.createElement('div');
      by.className = 'by' + (r.narrate ? ' narrate' : '');
      by.textContent = r.narrate ? '（旁白）' : (r.name || '');
      const tx = document.createElement('div');
      tx.className = 'text';
      tx.textContent = r.text;
      row.appendChild(by); row.appendChild(tx);
      list.appendChild(row);
    }
    list.scrollTop = list.scrollHeight;
    document.getElementById('backlog-menu').classList.add('show');
  },
  close() { document.getElementById('backlog-menu').classList.remove('show'); },
};

// ============================================================
// 6.8 Achievements — 成就
// ============================================================
const ACHIEVEMENTS = [
  { id:'first-blood',  icon:'⚔', name:'初試鋒芒',        desc:'通過第一場戰鬥' },
  { id:'all-yaoli',    icon:'☯', name:'五道俱全',        desc:'解鎖五大妖力' },
  { id:'all-trust',    icon:'❤', name:'三族同心',        desc:'與白綾、玄澈、赤羽皆建立信任' },
  { id:'ending-home',  icon:'⏎', name:'歸途',            desc:'達成結局 A：回到現代' },
  { id:'ending-stay',  icon:'⏏', name:'守卷人',          desc:'達成結局 B：留守妖境' },
  { id:'ending-write', icon:'✦', name:'重寫山海經',      desc:'達成結局 C：第三條路' },
  { id:'true-end',     icon:'☆', name:'三結局通關',      desc:'達成全部三個結局' },
  { id:'explorer',     icon:'⟡', name:'勘輿者',          desc:'走完霧村全部三處互動點' },
  { id:'no-damage',    icon:'❄', name:'墨光無傷',        desc:'單場 boss 戰未受擊獲勝' },
  { id:'combo-30',     icon:'⚡', name:'三十連刀',        desc:'單場戰鬥達成 30 連擊' },
  { id:'inv-master',   icon:'⛀', name:'物盡其用',        desc:'觸發任一道具隱藏對白' },
  { id:'ending-none',  icon:'∅', name:'無名',            desc:'達成隱藏結局 D' },
  { id:'ng-plus',      icon:'∞', name:'重啟之輪',        desc:'開始第二週目（NG+）' },
  { id:'partner-trio', icon:'三', name:'三人成鏡',        desc:'單場戰鬥同時出動三位夥伴' },
  { id:'perfect-dodge',icon:'◇', name:'墨光閃影',        desc:'觸發第一次完美閃避' },
];
const ACH_KEY = 'yaojingshuo.achievements.v1';
const Achievements = {
  unlocked: {},

  load() {
    try { this.unlocked = JSON.parse(localStorage.getItem(ACH_KEY)) || {}; }
    catch (_) { this.unlocked = {}; }
  },
  save() { try { localStorage.setItem(ACH_KEY, JSON.stringify(this.unlocked)); } catch (_) {} },
  unlock(id) {
    if (this.unlocked[id]) return;
    this.unlocked[id] = Date.now();
    this.save();
    const a = ACHIEVEMENTS.find(x => x.id === id);
    if (a) flashToast(`成就解鎖：${a.name}`);
    Audio.playSfx('uiStamp');
  },
  check() {
    // 五妖力齊備
    if (State.unlockedYaoli.length >= 5) this.unlock('all-yaoli');
    // 三族信任：trustBailing>=1 + trustXuance>=1 + trustChiyu>=1
    const f = State.flags;
    if (f.trustBailing >= 1 && f.trustXuance >= 1 && f.trustChiyu >= 1) this.unlock('all-trust');
    // 三結局通關
    if (this.unlocked['ending-home'] && this.unlocked['ending-stay'] && this.unlocked['ending-write']) {
      this.unlock('true-end');
    }
  },
};

// ============================================================
// 6.9 Glossary — 山海經詞典
// ============================================================
const GLOSSARY = [
  { id:'wuyao',     name:'霧妖將',   img:ASSETS.battle.boss,      source:'《山海經》改寫', desc:'霧村的封印鬆動者，臉部以墨團代替，披風由霧凝成。第一章 boss。' },
  { id:'jiuwei',    name:'九尾幻影', img:ASSETS.battle.jiuwei,    source:'《山海經·南山經》', desc:'青丘狐族的祖靈幻象。九條尾巴據說能映出每個人最深的願。' },
  { id:'qiongqi',   name:'窮奇',     img:ASSETS.battle.qiongqi,   source:'《山海經·西山經》', desc:'有翼之猛獸，相傳食言而吞之。出沒於南山赤土地帶。' },
  { id:'guidiao',   name:'蠱雕',     img:ASSETS.battle.guidiao,   source:'《山海經·南山經》', desc:'雕首人身、能飛能潛。出現於不周裂隙上空。' },
  { id:'guardian',  name:'女媧守護者', img:ASSETS.battle.guardian, source:'神話改寫',       desc:'女媧親手以玉與蛇骨造出，守護補天石殘片。' },
  { id:'finalboss', name:'補天石怨念', img:ASSETS.battle.finalboss, source:'神話改寫',     desc:'女媧補天石碎片化作的怨念集合體，妖境鬆動的真正源頭。' },
  { id:'foxfire',   name:'狐火',     img:ASSETS.battle.foxfire,   source:'民俗', desc:'青丘狐族留下的靈火。可作標記、攻擊、或讀取記憶。' },
  { id:'yaobing',   name:'妖兵',     img:ASSETS.battle.yaobing,   source:'神戰殘魂', desc:'上古神戰中殞命的兵卒殘魂，徘徊於不周裂隙。' },
  { id:'boar',      name:'霧豕',     img:ASSETS.battle.boar,      source:'《山海經》改寫', desc:'霧色短毛、紅眼。直線衝撞型小妖。' },
  { id:'leap',      name:'跳躍靈',   img:ASSETS.battle.leap,      source:'山鬼意象', desc:'瘦長手臂如猿。週期跳擊。' },
  { id:'wisp',      name:'霧火',     img:ASSETS.battle.wisp,      source:'山海經', desc:'燈籠/燭台型妖物，遠程吐墨彈。' },
];
const Glossary = {
  isUnlocked(id) {
    // 妖怪在首次戰鬥碰到該 kind 後解鎖
    return !!Glossary._seen[id];
  },
  _seen: {},
  see(id) {
    if (this._seen[id]) return;
    this._seen[id] = true;
    try { localStorage.setItem('yaojingshuo.glossary.v1', JSON.stringify(this._seen)); } catch (_) {}
  },
  load() {
    try { this._seen = JSON.parse(localStorage.getItem('yaojingshuo.glossary.v1')) || {}; }
    catch (_) { this._seen = {}; }
  },
  open() {
    const list = document.getElementById('glossary-list');
    if (!list) return;
    list.innerHTML = '';
    for (const g of GLOSSARY) {
      const card = document.createElement('div');
      const seen = this.isUnlocked(g.id);
      card.className = 'glossary-card' + (seen ? '' : ' locked');
      card.innerHTML = `
        <img src="${g.img}" alt="" />
        <div>
          <div class="gl-name">${seen ? g.name : '??? 未遭遇'}</div>
          <div class="gl-source">${seen ? g.source : ' '}</div>
          <div class="gl-desc">${seen ? g.desc : '尚未在妖境中遭遇此妖怪。'}</div>
        </div>`;
      list.appendChild(card);
    }
    document.getElementById('glossary-menu').classList.add('show');
  },
};

// ============================================================
// 6.10 i18n — 對白文案資料庫（先建框架，預設 zh-Hant 直接用 SCRIPT 的 text）
// ============================================================
const I18N = {
  'zh-Hant': {}, // 原文即繁中
  'zh-Hans': {
    '妖境說': '妖境说',
    '在水墨山海間，重寫一部山海經。': '在水墨山海间，重写一部山海经。',
    '新的開始': '新的开始',
    '繼續': '继续',
    '章節選擇': '章节选择',
    '直接進戰鬥（除錯）': '直接进战斗（除错）',
    '系統': '系统',
    '存檔': '存档',
    '讀檔': '读档',
    '設定': '设置',
    '圖鑑': '图鉴',
    '山海經': '山海经',
    '背包': '背包',
    '返回標題': '返回标题',
    '關閉選單': '关闭选单',
    '完整版 · Full Build · 七章 · 五大妖力 · 三結局': '完整版 · Full Build · 七章 · 五大妖力 · 三结局',
    '繼續下一章': '继续下一章',
    '當前妖力': '当前妖力',
    '對話歷史': '对话历史',
    '結局': '结局',
    '成就': '成就',
    'CG': 'CG',
    '回到山海之外': '回到山海之外',
    '前方妖獸': '前方妖兽',
  },
  'en': {
    '妖境說': 'Yāojìng Shuō',
    '在水墨山海間，重寫一部山海經。': 'Rewrite Shan Hai Jing in the realm of ink mountains.',
    '新的開始': 'New Game',
    '繼續': 'Continue',
    '章節選擇': 'Chapter Select',
    '直接進戰鬥（除錯）': 'Skip to Battle (Debug)',
    '系統': 'System',
    '存檔': 'Save',
    '讀檔': 'Load',
    '設定': 'Settings',
    '圖鑑': 'Gallery',
    '山海經': 'Bestiary',
    '背包': 'Inventory',
    '返回標題': 'Back to Title',
    '關閉選單': 'Close Menu',
    '完整版 · Full Build · 七章 · 五大妖力 · 三結局': 'Full Build · 7 Chapters · 5 Powers · 3 Endings',
    '繼續下一章': 'Next Chapter',
    '當前妖力': 'Current Power',
    '對話歷史': 'Backlog',
    '結局': 'Endings',
    '成就': 'Achievements',
    'CG': 'CGs',
    '回到山海之外': 'Beyond Shan Hai',
    '前方妖獸': 'Beast Ahead',
  },
};

// 自動偵測語言（只在初次無 settings 時）
function detectLang() {
  if (typeof navigator === 'undefined') return 'zh-Hant';
  const l = (navigator.language || '').toLowerCase();
  if (l.startsWith('zh-tw') || l.startsWith('zh-hk') || l.startsWith('zh-mo')) return 'zh-Hant';
  if (l.startsWith('zh')) return 'zh-Hans';
  if (l.startsWith('en')) return 'en';
  return 'zh-Hant';
}

function _t(s) { return (I18N[Settings.lang] && I18N[Settings.lang][s]) || s; }

// 翻譯所有畫面上靜態 i18n 文字節點
function applyI18nDOM() {
  // 標題
  const map = [
    ['.title-name', '妖境說'],
    ['.title-deck', '在水墨山海間，重寫一部山海經。'],
    ['.title-meta', '完整版 · Full Build · 七章 · 五大妖力 · 三結局'],
    ['[data-action="start"]', '新的開始'],
    ['[data-action="continue"]', '繼續'],
    ['[data-action="chapter-select"]', '章節選擇'],
    ['[data-action="skip-to-battle"]', '直接進戰鬥（除錯）'],
    ['#chapter-continue', '繼續下一章'],
    ['#ending-end', '回到山海之外'],
    ['.boss-intro-eyebrow', '前方妖獸'],
    ['.yaoli-current-label', '當前妖力'],
  ];
  for (const [sel, key] of map) {
    document.querySelectorAll(sel).forEach(el => {
      // 章節選擇按鈕在多處出現，只翻文字內容
      if (el.children.length === 0) el.textContent = _t(key);
    });
  }
  // sys-menu 按鈕
  document.querySelectorAll('#sys-menu .chop-btn').forEach(btn => {
    const t = btn.textContent.trim();
    btn.textContent = _t(t);
  });
}

// ============================================================
// 6.9b Perf — FPS 監控
// ============================================================
const Perf = {
  fps: 0, frames: 0, lastT: 0, _accum: 0,
  particles: 0, enemies: 0,
  tick() {
    const now = performance.now();
    if (this.lastT === 0) this.lastT = now;
    this.frames++;
    this._accum += now - this.lastT;
    this.lastT = now;
    if (this._accum >= 500) {
      this.fps = Math.round(this.frames * 1000 / this._accum);
      this.frames = 0; this._accum = 0;
      this.update();
    }
  },
  update() {
    if (!Settings.perf) return;
    const el = document.getElementById('perf-overlay');
    if (!el) return;
    el.textContent = `FPS ${this.fps} | particles ${this.particles} | enemies ${this.enemies} | scene ${State.scene}`;
  },
};

// ============================================================
// 6.10a Inventory — 背包道具系統
// ============================================================
const ITEMS = [
  { id:'phone',     name:'手機',         icon:'📱', img:ASSETS.ui.items.phone, desc:'2026 年的智慧手機。電池還剩 38%。' },
  { id:'studentId', name:'學生證',       icon:'🪪', img:ASSETS.ui.items.studentId, desc:'台北市立第三高中 · 一年級 · 林若璃。背面貼著一張舊照。' },
  { id:'sketchbook',name:'素描本',       icon:'📓', img:ASSETS.ui.items.sketchbook, desc:'帶著畫具的習慣使然。前幾頁畫的全是山水，最後一頁是空白。' },
  { id:'scrollFrag',name:'妖境圖殘片',   icon:'📜', img:ASSETS.ui.items.scrollFrag, desc:'墜入妖境時帶下的卷軸碎片。墨色仍未乾。' },
];
// 主角從現代帶來的初始道具（前 3 樣）+ 序章末取得殘片
const INITIAL_ITEMS = ['phone', 'studentId', 'sketchbook'];

// useItem 觸發後播放的隱藏對白（依章節 + 道具）
const ITEM_DIALOGS = {
  // 章節 idx + item id → 對白序列
  '2:phone': [
    { type:'narrate', text:'她從口袋摸出手機。螢幕亮起的瞬間，妖境的霧氣似乎也跟著震了一下。' },
    { type:'speak', char:'ruoli', mood:'worried', text:'……當然沒有訊號。連時間都顯示亂碼。' },
    { type:'narrate', text:'但相簿裡，最後一張照片是她跟同學的合照。她盯了三秒，把手機收回去。' },
  ],
  '3:studentId': [
    { type:'narrate', text:'她遞出學生證。玄澈接過去看了一眼。' },
    { type:'speak', char:'xuance', mood:'normal', text:'……「林若璃」。卷軸把妳的名字記下來了。從妳掉進來那一刻起。' },
    { type:'speak', char:'ruoli', mood:'surprised', text:'卷軸……記名字？' },
    { type:'speak', char:'xuance', mood:'stern', text:'山海有冊。寫進去就出不來。除非妳願意親手把名字劃掉。' },
  ],
  '5:scrollFrag': [
    { type:'narrate', text:'若璃將懷中的卷軸殘片遞向女媧。' },
    { type:'speak', char:'nuwa', text:'……這片殘卷。是當年我親手撕下，封進補天石裡的。' },
    { type:'speak', char:'nuwa', mood:'sad', text:'你帶它回來——是要我承認這個錯，還是把它補上？' },
  ],
  '2:sketchbook': [
    { type:'narrate', text:'若璃翻開素描本。前幾頁的山水，居然和妖境的景一模一樣。' },
    { type:'speak', char:'ruoli', mood:'surprised', text:'……我什麼時候畫過這些？我根本沒來過這裡。' },
    { type:'speak', char:'bailing', mood:'sly', text:'有趣。畫卷選人，畫家也畫了卷。妳和《妖境圖》的緣分，比我以為的深。' },
  ],
};

const Inventory = {
  items: INITIAL_ITEMS.slice(),
  load() {
    try {
      const raw = localStorage.getItem('yaojingshuo.inv.v1');
      if (raw) this.items = JSON.parse(raw);
    } catch (_) {}
  },
  save() {
    try { localStorage.setItem('yaojingshuo.inv.v1', JSON.stringify(this.items)); } catch (_) {}
  },
  has(id) { return this.items.includes(id); },
  add(id) { if (!this.has(id)) { this.items.push(id); this.save(); flashToast(`取得：${ITEMS.find(x=>x.id===id)?.name||id}`); } },
  open(onPick) {
    const m = document.getElementById('inventory-menu');
    const list = document.getElementById('inventory-list');
    if (!m || !list) return;
    list.innerHTML = '';
    if (this.items.length === 0) {
      list.innerHTML = '<p style="color:var(--muted); padding:20px;">背包空空。</p>';
    } else {
      for (const id of this.items) {
        const it = ITEMS.find(x => x.id === id);
        if (!it) continue;
        const card = document.createElement('button');
        card.className = 'inv-item';
        const iconClass = it.img ? 'inv-icon has-art' : 'inv-icon';
        const iconHtml = it.img
          ? `<img class="inv-icon-img" src="${it.img}" alt="" /><span class="inv-icon-fallback">${it.icon}</span>`
          : `<span class="inv-icon-fallback">${it.icon}</span>`;
        card.innerHTML = `
          <div class="${iconClass}">${iconHtml}</div>
          <div class="inv-meta">
            <div class="inv-name">${it.name}</div>
            <div class="inv-desc">${it.desc}</div>
          </div>`;
        const iconImg = card.querySelector('.inv-icon-img');
        if (iconImg) {
          iconImg.addEventListener('error', () => {
            iconImg.closest('.inv-icon')?.classList.remove('has-art');
          }, { once: true });
        }
        card.addEventListener('click', () => {
          m.classList.remove('show');
          if (onPick) onPick(id);
          else this.tryUseInScene(id);
        });
        list.appendChild(card);
      }
    }
    m.classList.add('show');
  },
  close() { document.getElementById('inventory-menu').classList.remove('show'); },
  // 在當前章節嘗試使用道具
  tryUseInScene(id) {
    const key = State.chapterIdx + ':' + id;
    const seq = ITEM_DIALOGS[key];
    if (!seq) {
      flashToast('現在沒法用這個。');
      return;
    }
    // 將 seq 推入 VN.subQueue 立刻播
    VN.subQueue.unshift(...seq);
    Achievements.unlock('inv-master');
    if (State.scene === 'vn') {
      // 推進一格觸發
      runNext();
    }
  },
};
// 解鎖時機：白綾 ch1+、玄澈 ch3+、赤羽 ch4+
// 每隻 boss 戰每位夥伴只能用一次，按 V/B/N 觸發（V=白綾、B=玄澈、N=赤羽）
const PARTNERS = {
  bailing: {
    id:'bailing', name:'白綾', skill:'狐火', key:'KeyV',
    unlockChapter: 1,
    desc:'召喚九尾狐火，全螢幕傷害敵人並燃燒 3 秒',
    color:'#f5601a',
  },
  xuance: {
    id:'xuance', name:'玄澈', skill:'封卷', key:'KeyB',
    unlockChapter: 3,
    desc:'卷軸封印，所有敵人停滯 3 秒',
    color:'#a060d8',
  },
  chiyu: {
    id:'chiyu', name:'赤羽', skill:'風刃', key:'KeyN',
    unlockChapter: 4,
    desc:'瞬間突進，玩家無敵 1.5 秒並造成風刃 AOE',
    color:'#5ad0e0',
  },
};
function partnersAvailable() {
  return Object.values(PARTNERS).filter(p => State.chapterIdx >= p.unlockChapter);
}

// ============================================================
// 6.11 Skip / Auto-play 旗標 + 工具
// ============================================================
const VNMode = {
  skipMode: false,
  autoMode: false,
  _autoTimer: null,

  toggleAuto() {
    this.autoMode = !this.autoMode;
    this.skipMode = false;
    document.getElementById('btn-auto')?.classList.toggle('active', this.autoMode);
    document.getElementById('btn-skip')?.classList.remove('active');
    if (!this.autoMode) clearTimeout(this._autoTimer);
  },
  toggleSkip() {
    this.skipMode = !this.skipMode;
    this.autoMode = false;
    document.getElementById('btn-skip')?.classList.toggle('active', this.skipMode);
    document.getElementById('btn-auto')?.classList.remove('active');
  },
  cancelAll() {
    this.skipMode = this.autoMode = false;
    document.getElementById('btn-skip')?.classList.remove('active');
    document.getElementById('btn-auto')?.classList.remove('active');
    clearTimeout(this._autoTimer);
  },
};

function maybeAutoAdvance() {
  // Skip：立刻完成 typing 並推進
  if (VNMode.skipMode) {
    setTimeout(() => {
      if (VN.isTyping) VN.finishTyping();
      if (VN._pendingNext) {
        const cb = VN._pendingNext; VN._pendingNext = null;
        VN.hideDialog();
        cb();
      }
    }, 18);
    return;
  }
  // Auto：等待 settings.autoIntervalSec 後推進
  if (VNMode.autoMode) {
    clearTimeout(VNMode._autoTimer);
    VNMode._autoTimer = setTimeout(() => {
      if (VN.isTyping) { VN.finishTyping(); }
      if (VN._pendingNext) {
        const cb = VN._pendingNext; VN._pendingNext = null;
        VN.hideDialog();
        cb();
      }
    }, Settings.autoIntervalSec * 1000);
  }
}

// ============================================================
// 6.12 Boss intro 演出
// ============================================================
// 信任度變化浮字（trustBailing/trustXuance/trustChiyu/savedNuwa）
const TRUST_LABELS = {
  trustBailing: '白綾', trustXuance: '玄澈', trustChiyu: '赤羽',
  savedNuwa: '女媧', wantHome: '歸鄉之心', closer: '近觀',
};
function showTrustFloats(before, after) {
  const layer = document.getElementById('trust-float-layer');
  if (!layer) return;
  for (const k of Object.keys(after)) {
    const a = after[k], b = before[k];
    if (a === b) continue;
    const label = TRUST_LABELS[k];
    if (!label) continue;
    let delta = '';
    if (typeof a === 'number' && typeof b === 'number') {
      delta = (a > b ? '+' : '') + (a - b);
    } else if (typeof a === 'boolean') {
      delta = a ? '✓' : '✗';
    } else if (a !== b) {
      delta = '·';
    }
    const f = document.createElement('div');
    f.className = 'trust-float';
    f.textContent = `${label} ${delta}`;
    f.style.color = (typeof a === 'number' && a > b) ? '#f5a030' :
                    (typeof a === 'boolean' && a) ? '#54e0c0' :
                    (typeof a === 'number' && a < b) ? '#a060d8' : '#f5efde';
    layer.appendChild(f);
    setTimeout(() => f.remove(), 2400);
  }
}

function isSystemPaused() {
  // 任一個 overlay-menu / sys-menu / chapter-menu 開啟 → 暫停
  const ids = ['sys-menu', 'chapter-menu', 'settings-menu', 'save-menu', 'backlog-menu', 'gallery-menu', 'glossary-menu', 'battle-tutorial'];
  for (const id of ids) {
    const el = document.getElementById(id);
    if (el && el.classList.contains('show')) return true;
  }
  return false;
}

const BOSS_INTRO_COPY = {
  boss:      '霧妖將的戰吼震開竹影，墨霧像鐵甲一樣合攏。牠不會讓外鄉客帶著殘卷離開。',
  jiuwei:    '九尾幻影自狐火深處睜眼。每一條尾焰，都像在問她是否真的想回家。',
  qiongqi:   '窮奇殘影踏碎南山赤土，吼聲裡全是謊言與饑餓。真話，會先被牠咬碎。',
  guidiao:   '蠱雕從不周裂隙俯衝而下，翅影遮住天光。牠記得神戰，也記得所有墜落的人。',
  guardian:  '女媧守護者垂首甦醒，石甲寸寸亮起。補天石前，任何猶豫都會被審判。',
  finalboss: '補天石怨念在卷軸盡頭成形。這一次，妖境與人間都在等她落筆。',
};

function showBossIntro(label, sub, kind) {
  const el = document.getElementById('boss-intro');
  if (!el) return;
  const duration = 2800;
  clearInterval(showBossIntro._typingTimer);
  clearTimeout(showBossIntro._hideTimer);
  document.getElementById('boss-intro-name').textContent = label || '';
  document.getElementById('boss-intro-sub').textContent = sub || '';
  const copyEl = document.getElementById('boss-intro-copy');
  const copy = BOSS_INTRO_COPY[kind] || '妖氣壓低了整片戰場。下一擊之前，空氣先被戰吼撕開。';
  if (copyEl) {
    copyEl.textContent = '';
    let i = 0;
    showBossIntro._typingTimer = setInterval(() => {
      i += 1;
      copyEl.textContent = copy.slice(0, i);
      if (i >= copy.length) clearInterval(showBossIntro._typingTimer);
    }, 32);
  }
  const hero = document.getElementById('boss-intro-hero');
  const heroSrc = kind && ASSETS.bossIntro ? ASSETS.bossIntro[kind] : '';
  if (hero && heroSrc) {
    hero.hidden = false;
    hero.onerror = () => { hero.hidden = true; hero.removeAttribute('src'); };
    hero.src = heroSrc;
  } else if (hero) {
    hero.hidden = true;
    hero.removeAttribute('src');
  }
  el.classList.add('show');
  Audio.playSfx('bossRoar');
  showBossIntro._hideTimer = setTimeout(() => {
    el.classList.remove('show');
    if (copyEl) copyEl.textContent = '';
  }, duration);
  return duration;
}

// ============================================================
// 7. SceneManager
// ============================================================
const SCENES = ['title', 'cg', 'vn', 'battle', 'chapter', 'ending'];
function showScene(name) {
  const prev = State.scene;
  State.scene = name;
  for (const s of SCENES) {
    const el = document.getElementById('scene-' + s);
    if (el) el.classList.toggle('scene-active', s === name);
  }
  // 同步側邊妖力 HUD 與功能按鈕顯示
  const yaoliHud = document.getElementById('yaoli-hud');
  const showYaoli = (name === 'battle' || name === 'vn') && State.unlockedYaoli.length > 0;
  if (yaoliHud) yaoliHud.classList.toggle('show', showYaoli);
  const sysBtns = document.getElementById('sys-buttons');
  if (sysBtns) sysBtns.classList.toggle('show', name === 'vn' || name === 'battle');
  if (showYaoli) Battle._updateYaoliBadge();
  // 切場景時取消 auto/skip 模式
  if (prev !== name) VNMode.cancelAll();

  // 場景對應 BGM（章節 BGM 由 chapter 觸發；title/ending 由此處）
  if (name === 'title')        Audio.playBgm('title');
  else if (name === 'cg')      Audio.playBgm('museum');
  else if (name === 'battle')  Audio.playBgm(getCurrentChapter().isFinal ? 'final' : 'battle');
  else if (name === 'ending')  Audio.playBgm('ending');
  else if (name === 'vn')      autoPlayChapterBgm();
}

// 各章節對應的 VN BGM
function autoPlayChapterBgm() {
  const ch = getCurrentChapter();
  const map = {
    prologue: 'museum',
    chapter1: 'mistVillage',
    chapter2: 'foxfire',
    chapter3: 'south',
    chapter4: 'rift',
    chapter5: 'nuwa',
    chapter6: 'final',
  };
  const id = map[ch.id];
  if (id) Audio.playBgm(id);
}

// ============================================================
// 8. VN Engine
// ============================================================
const VN = {
  bgEl:        null,
  imgLeft:     null,
  imgCenter:   null,
  imgRight:    null,
  slotLeft:    null,
  slotCenter:  null,
  slotRight:   null,
  dialogEl:    null,
  nameEl:      null,
  textEl:      null,
  choicesEl:   null,
  exploreEl:   null,

  shown: {},
  subQueue: [],
  isTyping: false,
  fullText: '',
  typingTimer: null,
  _pendingNext: null,

  init() {
    this.bgEl       = document.getElementById('vn-bg');
    this.imgLeft    = document.getElementById('vn-char-left');
    this.imgCenter  = document.getElementById('vn-char-center');
    this.imgRight   = document.getElementById('vn-char-right');
    this.slotLeft   = document.querySelector('.vn-char-slot.vn-char-left');
    this.slotCenter = document.querySelector('.vn-char-slot.vn-char-center');
    this.slotRight  = document.querySelector('.vn-char-slot.vn-char-right');
    this.dialogEl   = document.getElementById('dialog-frame');
    this.nameEl     = document.getElementById('dialog-name');
    this.textEl     = document.getElementById('dialog-text');
    this.choicesEl  = document.getElementById('choices');
    this.exploreEl  = document.getElementById('vn-explore');
  },

  setBg(id) {
    // 預載入；若 PNG 不存在自動 fallback 到 modernStreet（同類氛圍替代）
    const url = ASSETS.bg[id] || ASSETS.bg.modernStreet;
    const fallbackId = ASSET_FALLBACKS.bg[id];
    const fallbackUrl = fallbackId ? (ASSETS.bg[fallbackId] || ASSETS.bg.modernStreet) : ASSETS.bg.modernStreet;
    const img = new Image();
    img.onload = () => {
      this.bgEl.style.backgroundImage = `url("${url}")`;
    };
    img.onerror = () => {
      this.bgEl.style.backgroundImage = `url("${fallbackUrl}")`;
    };
    img.src = url;
    this.bgEl.style.backgroundImage = `url("${url}")`;
    this.bgEl.style.filter = ASSETS.bgTint && ASSETS.bgTint[id] ? ASSETS.bgTint[id] : 'none';
  },
  charImg(char, mood) {
    const moods = ASSETS.char[char];
    if (!moods) return '';
    if (char === 'ruoli' && (mood === 'normal' || mood === 'determined')) {
      const suffix = mood === 'determined' ? 'Determined' : 'Normal';
      if (State.chapterIdx >= 6 && moods['finale' + suffix]) return moods['finale' + suffix];
      if (State.chapterIdx >= 5 && moods['ch5' + suffix]) return moods['ch5' + suffix];
      if (State.chapterIdx >= 3 && moods['ch3' + suffix]) return moods['ch3' + suffix];
    }
    return moods[mood] || Object.values(moods)[0];
  },
  baseCharImg(char, mood) {
    const moods = ASSETS.char[char];
    if (!moods) return '';
    return moods[mood] || Object.values(moods)[0];
  },
  _slot(side) {
    return side === 'left' ? this.slotLeft
         : side === 'right' ? this.slotRight
         : this.slotCenter;
  },
  _img(side) {
    return side === 'left' ? this.imgLeft
         : side === 'right' ? this.imgRight
         : this.imgCenter;
  },

  show(char, mood, side) {
    if (!ASSETS.char[char]) return;  // 沒立繪：僅以對話名牌登場
    const sideName = side || 'center';
    this.shown[char] = { mood, side: sideName };
    const slot = this._slot(sideName);
    const img  = this._img(sideName);
    img.onerror = () => {
      img.onerror = null;
      img.src = this.baseCharImg(char, mood);
    };
    img.src = this.charImg(char, mood);
    slot.dataset.char = char;
    void slot.offsetWidth;
    slot.classList.add('show');
  },
  hide(char) {
    const cur = this.shown[char];
    if (!cur) return;
    const slot = this._slot(cur.side);
    slot.classList.remove('show', 'speaking', 'dim', 'mood-pop');
    delete slot.dataset.char;
    delete this.shown[char];
  },
  hideAll() {
    for (const ch of Object.keys(this.shown)) this.hide(ch);
  },
  setMood(char, mood) {
    const cur = this.shown[char];
    if (!cur) return;
    if (!ASSETS.char[char]) return;
    cur.mood = mood;
    const slot = this._slot(cur.side);
    const img  = this._img(cur.side);
    img.onerror = () => {
      img.onerror = null;
      img.src = this.baseCharImg(char, mood);
    };
    img.src = this.charImg(char, mood);
    slot.classList.remove('mood-pop');
    void slot.offsetWidth;
    slot.classList.add('mood-pop');
    setTimeout(() => slot.classList.remove('mood-pop'), 360);
  },

  setSpeaker(charId) {
    const all = [this.slotLeft, this.slotCenter, this.slotRight];
    for (const s of all) s.classList.remove('speaking', 'dim');
    if (!charId) return;
    const cur = this.shown[charId];
    if (!cur) {
      // 場上無立繪或已退場的角色說話時，讓焦點回到對話框。
      for (const s of all) {
        if (s.classList.contains('show')) s.classList.add('dim');
      }
      return;
    }
    const speakingSlot = this._slot(cur.side);
    speakingSlot.classList.add('speaking');
    for (const s of all) {
      if (s !== speakingSlot && s.classList.contains('show')) s.classList.add('dim');
    }
  },

  showDialog(name, text, isNarrate, charId) {
    this.dialogEl.classList.add('show');
    this.nameEl.textContent = name || '';
    this.textEl.classList.toggle('narrate', !!isNarrate);
    this.textEl.textContent = '';
    this.fullText = text;
    this.isTyping = true;
    Backlog.push(charId || '', text, isNarrate);
    Audio.playSfx('uiPage');
    const speed = Settings.textSpeed;
    if (speed <= 0) {
      // 瞬顯
      this.textEl.textContent = text;
      this.isTyping = false;
      return;
    }
    let i = 0;
    clearInterval(this.typingTimer);
    this.typingTimer = setInterval(() => {
      i++;
      this.textEl.textContent = text.slice(0, i);
      if (i >= text.length) {
        clearInterval(this.typingTimer);
        this.isTyping = false;
      }
    }, speed);
  },
  finishTyping() {
    clearInterval(this.typingTimer);
    this.textEl.textContent = this.fullText;
    this.isTyping = false;
  },
  hideDialog() {
    this.dialogEl.classList.remove('show');
  },

  showChoices(options, onPick) {
    this.hideDialog();
    this.choicesEl.innerHTML = '';
    this.choicesEl.classList.add('show');
    options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = opt.label;
      btn.addEventListener('click', () => {
        // 偵測信任度變化並飄字
        if (opt.flag) {
          const before = Object.assign({}, State.flags);
          Object.assign(State.flags, opt.flag);
          showTrustFloats(before, State.flags);
        }
        this.choicesEl.classList.remove('show');
        this.choicesEl.innerHTML = '';
        Achievements.check();
        onPick(i, opt);
      });
      this.choicesEl.appendChild(btn);
    });
  },

  showExplore(block, onDone) {
    this.hideDialog();
    this.exploreEl.classList.add('show');
    this.exploreEl.innerHTML = '<div class="explore-prompt">調查 — 走完所有熱點</div>';
    const visited = new Set();
    let pendingBattle = false;
    block.points.forEach((p) => {
      const dot = document.createElement('div');
      dot.className = 'explore-hotspot';
      dot.style.left = `calc(${p.x} - 40px)`;
      dot.style.top  = `calc(${p.y} - 40px)`;
      dot.textContent = p.label;
      dot.addEventListener('click', () => {
        if (visited.has(p.id)) return;
        visited.add(p.id);
        dot.classList.add('done');
        if (p.triggersBattle) pendingBattle = true;
        this.exploreEl.classList.remove('show');
        this.subQueue.push(...p.scene);
        const resumeExplore = () => {
          if (visited.size === block.points.length) {
            this.exploreEl.classList.remove('show');
            this.exploreEl.innerHTML = '';
            Achievements.unlock('explorer');
            onDone(pendingBattle);
          } else {
            this.exploreEl.classList.add('show');
          }
        };
        this.subQueue.push({ type:'_resumeExplore', cb: resumeExplore });
        runNext();
      });
      this.exploreEl.appendChild(dot);
    });
  },
};

// ============================================================
// 9. Script runner
// ============================================================
function runNext() {
  if (VN.subQueue.length > 0) {
    const block = VN.subQueue.shift();
    if (block.type === '_resumeExplore') {
      if (typeof block.cb === 'function') block.cb();
      return;
    }
    runBlock(block, () => runNext());
    return;
  }
  const script = getCurrentScript();
  if (State.scriptIndex >= script.length) {
    // 章節結尾
    onChapterComplete();
    return;
  }
  const block = script[State.scriptIndex++];
  runBlock(block, () => runNext());
}

function runBlock(block, next) {
  switch (block.type) {
    case 'bg':
      VN.setBg(block.id);
      next();
      break;
    case 'show':
      VN.show(block.char, block.mood || 'normal', block.side || 'center');
      next();
      break;
    case 'hide':
      VN.hide(block.char);
      next();
      break;
    case 'narrate':
      VN.setSpeaker('');
      VN.showDialog('', block.text, true, '');
      VN._pendingNext = next;
      maybeAutoAdvance();
      break;
    case 'speak': {
      if (block.mood) VN.setMood(block.char, block.mood);
      VN.setSpeaker(block.char);
      VN.showDialog(CHAR_NAMES[block.char], block.text, false, block.char);
      VN._pendingNext = next;
      maybeAutoAdvance();
      break;
    }
    case 'bgm':
      Audio.playBgm(block.id);
      next();
      break;
    case 'getItem':
      Inventory.add(block.id);
      next();
      break;
    case 'flashback':
      // 第二章記憶閃回橋段：暫存當前 bg + 套上 modern bg + filter，跑子腳本後復原
      VN._flashbackPrev = { bg: VN.bgEl.style.backgroundImage, filter: VN.bgEl.style.filter };
      VN.bgEl.style.backgroundImage = `url("${ASSETS.bg[block.bg] || ASSETS.bg.modernStreet}")`;
      VN.bgEl.style.filter = 'sepia(0.3) brightness(0.85) contrast(0.95)';
      VN.subQueue.unshift(...(block.scene || []));
      VN.subQueue.push({ type:'_endFlashback' });
      next();
      break;
    case '_endFlashback':
      if (VN._flashbackPrev) {
        VN.bgEl.style.backgroundImage = VN._flashbackPrev.bg;
        VN.bgEl.style.filter = VN._flashbackPrev.filter;
        VN._flashbackPrev = null;
      }
      next();
      break;
    case 'choice':
      VN.showChoices(block.options, () => next());
      break;
    case 'branch': {
      const v = State.flags[block.flag];
      const matched = ('eq' in block) ? (v === block.eq) : !!v;
      const sub = (matched ? block.then : block.else) || [];
      VN.subQueue.unshift(...sub);
      next();
      break;
    }
    case 'explore':
      VN.showExplore(block, () => next());
      break;
    case 'cg':
      runOpeningCG(() => {
        showScene('vn');
        next();
      });
      break;
    case 'battle':
      State.battleReturn = next;
      // 第一次戰鬥彈出教學
      const seenTutorial = localStorage.getItem('yaojingshuo.tutorial.v1') === '1';
      const startBattle = () => {
        runBattle(block.stage, () => {
          showScene('vn');
          const cb = State.battleReturn;
          State.battleReturn = null;
          cb();
        });
      };
      if (!seenTutorial) {
        document.getElementById('battle-tutorial').classList.add('show');
        const onClose = () => {
          document.getElementById('battle-tutorial').classList.remove('show');
          localStorage.setItem('yaojingshuo.tutorial.v1', '1');
          document.querySelector('[data-action="close-tutorial"]')?.removeEventListener('click', onClose);
          startBattle();
        };
        document.querySelector('[data-action="close-tutorial"]')?.addEventListener('click', onClose, { once: true });
      } else {
        startBattle();
      }
      break;
    case 'transition':
      document.body.style.transition = 'opacity 0.4s';
      document.body.style.opacity = 0.0;
      setTimeout(() => {
        document.body.style.opacity = 1.0;
        next();
      }, 400);
      break;
    case 'ending':
      runEnding();
      break;
    default:
      console.warn('Unknown block type', block);
      next();
  }
}

// ============================================================
// 10. Opening CG（30 秒 Canvas 動畫）
// ============================================================
function runOpeningCG(onDone) {
  showScene('cg');
  const canvas = document.getElementById('cg-canvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const DUR = 30000;
  let start = 0;
  let stopped = false;
  let started = false;
  let rafId = 0;
  const transitionSfx = { page: false, pull: false, impact: false };
  const skipBtn = document.querySelector('#scene-cg .skip-btn');
  const skipHandler = () => finish();
  skipBtn.addEventListener('click', skipHandler, { once: true });

  const images = {
    museum: new Image(),
    scroll: new Image(),
    modern: new Image(),
    yaojing: new Image(),
  };
  images.museum.src = ASSETS.bg.museum;
  images.scroll.src = ASSETS.bg.yaojingScroll;
  images.modern.src = ASSETS.bg.modernStreet;
  images.yaojing.src = ASSETS.bg.mistVillage;

  const ready = Object.values(images).map(img => new Promise(resolve => {
    if (img.complete) resolve();
    else {
      img.onload = resolve;
      img.onerror = resolve;
    }
  }));
  const begin = () => {
    if (started || stopped) return;
    started = true;
    start = performance.now();
    rafId = requestAnimationFrame(frame);
  };
  Promise.all(ready).then(begin);
  setTimeout(begin, 500);

  function finish() {
    if (stopped) return;
    stopped = true;
    skipBtn.removeEventListener('click', skipHandler);
    if (rafId) cancelAnimationFrame(rafId);
    onDone();
  }
  function isReady(img) {
    return img && img.complete && (img.naturalWidth || img.width);
  }
  function drawCover(img, x, y, w, h, alpha = 1) {
    if (!isReady(img)) return false;
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;
    const imgR = iw / ih;
    const boxR = w / h;
    let sx = 0, sy = 0, sw = iw, sh = ih;
    if (imgR > boxR) {
      sw = ih * boxR;
      sx = (iw - sw) / 2;
    } else {
      sh = iw / boxR;
      sy = (ih - sh) / 2;
    }
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
    ctx.restore();
    return true;
  }
  function drawContain(img, cx, cy, w, h, alpha = 1) {
    if (!isReady(img)) return false;
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;
    const scale = Math.min(w / iw, h / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.shadowColor = 'rgba(0,0,0,0.52)';
    ctx.shadowBlur = 22;
    ctx.shadowOffsetY = 10;
    ctx.drawImage(img, cx - dw / 2, cy - dh / 2, dw, dh);
    ctx.restore();
    return true;
  }
  function drawScrollFallback(cx, cy, w, h, alpha = 1, zoom = 1) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#d8cdb6';
    ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
    ctx.strokeStyle = 'rgba(58,47,36,0.6)';
    ctx.lineWidth = 5 * zoom;
    ctx.strokeRect(cx - w / 2 + 20 * zoom, cy - h / 2 + 28 * zoom, w - 40 * zoom, h - 56 * zoom);
    ctx.fillStyle = '#3a2f24';
    ctx.font = `${Math.round(32 * zoom)}px "Songti TC", "STSong", "PMingLiU", "Noto Serif TC", serif`;
    ctx.textAlign = 'center';
    ctx.fillText('《妖境圖》', cx, cy + 8 * zoom);
    ctx.restore();
  }
  function easeInOut(k) {
    return k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
  }
  function frame(now) {
    if (stopped) return;
    const t = Math.min((now - start) / DUR, 1);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);

    if (t < 0.13) {
      const k = t / 0.13;
      if (!drawCover(images.museum, 0, 0, W, H, k)) {
        ctx.fillStyle = `rgba(40,32,24,${k})`;
        ctx.fillRect(0, 0, W, H);
      }
      ctx.fillStyle = `rgba(6,5,4,${0.26 * k})`;
      ctx.fillRect(0, 0, W, H);
      if (!drawContain(images.scroll, W*0.5, H*0.5, W*0.22, H*0.58, k)) {
        drawScrollFallback(W*0.5, H*0.5, W*0.20, H*0.55, k, 1);
      }
    } else if (t < 0.30) {
      const k = (t - 0.13) / 0.17;
      const zoom = 1 + k * 1.6;
      drawCover(images.museum, 0, 0, W, H, 1);
      ctx.fillStyle = `rgba(10,8,6,${0.28 + k * 0.35})`;
      ctx.fillRect(0, 0, W, H);
      const sw = W * 0.22 * zoom;
      const sh = H * 0.58 * zoom;
      if (!drawContain(images.scroll, W*0.5, H*0.5, sw, sh, 1)) {
        drawScrollFallback(W*0.5, H*0.5, sw, sh, 1, zoom);
      }
    } else if (t < 0.47) {
      const k = (t - 0.30) / 0.17;
      if (!transitionSfx.page && k > 0.78) {
        transitionSfx.page = true;
        Audio.playSfx('uiPage');
      }
      ctx.fillStyle = '#28201a';
      ctx.fillRect(0, 0, W, H);
      if (!isReady(images.scroll)) {
        ctx.fillStyle = '#d8cdb6';
        ctx.fillRect(W*0.2, 0, W*0.6, H);
      } else {
        ctx.save();
        ctx.globalAlpha = 1 - k * 0.12;
        ctx.drawImage(images.scroll, W*0.2, -H*0.04, W*0.6, H*1.08);
        ctx.restore();
      }
      ctx.fillStyle = `rgba(26,22,18,${k * 0.6})`;
      ctx.fillRect(0, 0, W, H);
      if (k > 0.86) {
        ctx.fillStyle = `rgba(246,236,210,${(k - 0.86) / 0.14 * 0.45})`;
        ctx.fillRect(0, 0, W, H);
      }
    } else if (t < 0.67) {
      const k = (t - 0.47) / 0.20;
      if (!transitionSfx.pull && k > 0.06) {
        transitionSfx.pull = true;
        Audio.playSfx('inkStroke');
      }
      if (!transitionSfx.impact && k > 0.56) {
        transitionSfx.impact = true;
        Audio.playSfx('uiStamp');
      }
      const reveal = easeInOut(k);
      const pulse = Math.max(0, Math.sin(k * Math.PI * 9)) * (1 - k);
      const hitFlash = k > 0.52 && k < 0.68 ? 0.42 : 0;
      const shake = (1 - reveal) * 18 + pulse * 10;
      const ox = Math.sin(k * 86) * shake;
      const oy = Math.cos(k * 71) * shake * 0.45;
      const overscan = 28 + shake;

      ctx.save();
      ctx.translate(ox, oy);
      if (!drawCover(images.modern, -overscan, -overscan, W + overscan * 2, H + overscan * 2, Math.max(0, 1 - reveal * 0.92))) {
        const r = Math.round(40 + 200*(1-k));
        const g = Math.round(28 + 100*(1-k));
        const b = Math.round(20 + 60*(1-k));
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(-overscan, -overscan, W + overscan * 2, H + overscan * 2);
      }
      const strobe = (Math.sin(k * Math.PI * 16) > 0 ? 0.22 : 0) * (1 - k);
      drawCover(images.yaojing, -overscan, -overscan, W + overscan * 2, H + overscan * 2, Math.min(1, reveal + strobe));
      ctx.restore();

      ctx.fillStyle = `rgba(246,236,210,${Math.min(0.72, pulse * 0.58 + hitFlash)})`;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = `rgba(6,5,4,${0.06 + (1 - reveal) * 0.18})`;
      ctx.fillRect(0, 0, W, H);
    } else if (t < 0.87) {
      const k = (t - 0.67) / 0.20;
      const damp = 1 - easeInOut(k);
      const shake = damp * 10;
      ctx.save();
      ctx.translate(Math.sin(k * 52) * shake, Math.cos(k * 45) * shake * 0.35);
      drawCover(images.yaojing, -shake - 12, -shake - 12, W + (shake + 12) * 2, H + (shake + 12) * 2, 1);
      ctx.restore();
      const flash = Math.max(0, Math.sin(k * Math.PI * 6)) * damp * 0.35;
      ctx.fillStyle = `rgba(246,236,210,${flash})`;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = `rgba(6,5,4,${damp * 0.20})`;
      ctx.fillRect(0, 0, W, H);
    } else {
      const k = (t - 0.87) / 0.13;
      if (!drawCover(images.yaojing, 0, 0, W, H, 1)) {
        const c = Math.round(20 + (216-20)*k);
        ctx.fillStyle = `rgb(${c},${c-8},${c-24})`;
        ctx.fillRect(0, 0, W, H);
      }
      ctx.fillStyle = `rgba(0,0,0,${(1 - k) * 0.24})`;
      ctx.fillRect(0, 0, W, H);
      if (false) {
      ctx.fillStyle = `rgba(60,52,40,${k*0.6})`;
      ctx.beginPath();
      ctx.moveTo(0, H*0.7);
      ctx.lineTo(W*0.2, H*0.55);
      ctx.lineTo(W*0.4, H*0.65);
      ctx.lineTo(W*0.6, H*0.5);
      ctx.lineTo(W*0.8, H*0.6);
      ctx.lineTo(W, H*0.55);
      ctx.lineTo(W, H);
      ctx.lineTo(0, H);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = k;
      ctx.fillStyle = '#1a1612';
      ctx.font = '64px "Songti TC", "STSong", "PMingLiU", "Noto Serif TC", serif';
      ctx.textAlign = 'center';
      ctx.fillText('妖 境', W*0.5, H*0.5);
      ctx.globalAlpha = 1;
      }
    }
    if (t >= 1) { finish(); return; }
    rafId = requestAnimationFrame(frame);
  }
}

// ============================================================
// 11. Chapter Card / 章節結尾
// ============================================================
function onChapterComplete() {
  const ch = getCurrentChapter();
  if (ch.rewardYaoli) unlockYaoli(ch.rewardYaoli);
  saveGame();
  if (ch.isFinal) {
    runEnding();
    return;
  }
  showScene('chapter');
  document.getElementById('chapter-eyebrow').textContent = ch.title.split('·')[0].trim() + ' · 完';
  document.getElementById('chapter-title').textContent = ch.title.split('·').slice(1).join('·').trim() || ch.title;
  document.getElementById('chapter-subtitle').textContent =
    ch.rewardYaoli ? `已習得：${YAOLI[ch.rewardYaoli].name}` : '';
  document.getElementById('chapter-next').textContent = ch.nextLabel || '';
  // 為「繼續」按鈕掛事件，點擊後跑下一章
  const cont = document.getElementById('chapter-continue');
  cont.onclick = () => {
    State.chapterIdx++;
    State.scriptIndex = 0;
    saveGame(); // 進入新章即存檔，讓「章節選擇」中該章可再次進入
    showScene('vn');
    runNext();
  };
}

// ============================================================
// 12. Battle engine（支援多關卡 + 五種妖力）
// ============================================================
const Battle = {
  canvas: null, ctx: null,
  W: 1920, H: 720,
  running: false,
  cameraX: 0,
  worldW: 5760,
  groundY: 600,
  player: null,
  enemies: [],
  projectiles: [],
  particles: [],
  dmgNumbers: [],
  swingTrail: [],
  boss: null, bossActive: false,
  reachedBossX: 4400,
  bgImage: null, bossArenaImage: null,
  sprites: {},
  keys: {},
  hp: 120, hpMax: 120,
  yaoli: 0, yaoliMax: 100,
  hitPause: 0, shakeAmount: 0, shakeTime: 0,
  onComplete: null,
  stageCfg: null,

  init(stageId, onComplete) {
    this.canvas = document.getElementById('battle-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.onComplete = onComplete;
    this.running = true;
    this.cameraX = 0;
    this.hp = this.hpMax;
    this.yaoli = 0;
    this.enemies = [];
    this.projectiles = [];
    this.particles = [];
    this.dmgNumbers = [];
    this.swingTrail = [];
    this.impactRings = [];
    this.hitSlashes = [];
    this.dustPuffs = [];
    this.drops = [];
    this.bossActive = false;
    this.boss = null;
    this.hitPause = 0;
    this.shakeAmount = 0;
    this.shakeTime = 0;
    this.playerHitFlash = 0; // 玩家受擊紅光
    this.bossWarning = 0;    // boss 預攻警告 frames
    this.combo = 0;          // 連擊數
    this.comboTimer = 0;     // 距離上次命中經過幾 frames（>120 自動重置）
    this.comboMax = 0;       // 本場最高連擊
    this.partnerCooldowns = { bailing: 0, xuance: 0, chiyu: 0 };
    this.partnerUsed = {};
    this.drops = [];
    this.companions = [];    // 戰場上跟隨玩家的夥伴 actors（E 包）
    this.armor = 0;          // 護體值（H 包）
    this.armorMax = 30;
    this.slowMo = 0;         // 完美閃避慢動作 frames（H 包）
    this.stageCfg = STAGES[stageId];
    if (!this.stageCfg) {
      console.warn('Unknown stage', stageId);
      onComplete();
      return;
    }
    this.bgImage = this._load(ASSETS.bg[this.stageCfg.bg]);
    this.bossArenaImage = this._load(ASSETS.bg[this.stageCfg.arenaBg]);
    this.parallaxLayers = this.stageCfg.bg === 'bambooForest'
      ? [
          { img: this._load(ASSETS.bg.bambooFar), speed: 0.18 },
          { img: this._load(ASSETS.bg.bambooMid), speed: 0.42 },
          { img: this._load(ASSETS.bg.bambooNear), speed: 0.72 },
        ]
      : [];
    this.dropSprites = {
      yaoli: this._load(ASSETS.ui.items.yaoliPill),
      hp: this._load(ASSETS.ui.items.hpDrop),
    };
    this.sprites.ruoli = this._load(ASSETS.battle.ruoli);
    for (const wave of this.stageCfg.waves) {
      for (const s of wave.spawn) {
        if (!this.sprites[s.kind]) this.sprites[s.kind] = this._load(ASSETS.battle[s.kind]);
      }
    }
    if (this.stageCfg.boss) {
      this.sprites[this.stageCfg.boss.kind] = this._load(ASSETS.battle[this.stageCfg.boss.kind]);
    }

    this.player = {
      x: 200, y: this.groundY - 128,
      w: 96, h: 128,
      vx: 0, vy: 0,
      facing: 1,
      onGround: true,
      attacking: 0, rolling: 0, yaoliCast: 0, hitCD: 0,
      doubleJump: false,
      animT: 0,
    };

    let waveBaseX = 0;
    for (const wave of this.stageCfg.waves) {
      for (const s of wave.spawn) {
        this.enemies.push(this._mkEnemy(s.kind, s.x, s.y));
      }
    }

    document.getElementById('hud-boss').hidden = true;
    this._updateHUD();
    this._updateYaoliBadge();
    this.partnerUsed = {};
    this._screenFlash = null;
    this._renderPartnerHud();

    // E 包：解鎖的夥伴自動上場（最多 3 位，不含主角）
    this.companions = [];
    const ratings = { bailing: 1, xuance: 3, chiyu: 4 };
    for (const id of ['bailing', 'xuance', 'chiyu']) {
      if (State.chapterIdx >= ratings[id]) {
        this._spawnCompanion(id);
      }
    }
    if (this.companions.length >= 3) Achievements.unlock('partner-trio');
    this.armor = this.armorMax;

    const PREVENT_DEFAULT = new Set(['Space','ArrowLeft','ArrowRight','ArrowUp','ArrowDown']);
    this._kdHandler = (e) => {
      if (PREVENT_DEFAULT.has(e.code)) e.preventDefault();
      this.keys[e.code] = true;
      // 妖力切換 1-5
      if (e.code === 'Digit1') this._tryYaoli('inkshade');
      if (e.code === 'Digit2') this._tryYaoli('moonlight');
      if (e.code === 'Digit3') this._tryYaoli('azureflame');
      if (e.code === 'Digit4') this._tryYaoli('windplume');
      if (e.code === 'Digit5') this._tryYaoli('spiritbind');
      // 夥伴技
      if (e.code === 'KeyV') this._castPartner('bailing');
      if (e.code === 'KeyB') this._castPartner('xuance');
      if (e.code === 'KeyN') this._castPartner('chiyu');
    };
    this._kuHandler = (e) => { this.keys[e.code] = false; };
    this._mdHandler = (e) => { if (e.button === 0) this.keys['MouseLeft'] = true; };
    this._muHandler = (e) => { if (e.button === 0) this.keys['MouseLeft'] = false; };
    window.addEventListener('keydown', this._kdHandler);
    window.addEventListener('keyup',   this._kuHandler);
    this.canvas.addEventListener('mousedown', this._mdHandler);
    this.canvas.addEventListener('mouseup',   this._muHandler);

    this._lastT = performance.now();
    requestAnimationFrame((t) => this._loop(t));
  },

  _tryYaoli(id) {
    if (!State.unlockedYaoli.includes(id)) return;
    State.currentYaoli = id;
    this._updateYaoliBadge();
  },

  _castPartner(id) {
    const p = PARTNERS[id];
    if (!p) return;
    if (State.chapterIdx < p.unlockChapter) return;
    if (this.partnerUsed[id]) { flashToast(`${p.name} 已用過`); return; }
    this.partnerUsed[id] = true;
    flashToast(`${p.name}：${p.skill}！`);
    Audio.playSfx('uiStamp');
    if (id === 'bailing') {
      // 全螢幕狐火 AOE
      for (const e of this.enemies) {
        e.hp -= 28;
        e.hitFlash = 10;
        e.burnLife = 120; e.burnTick = 0;
        this._burst(e.x + e.w/2, e.y + e.h/2, p.color, 16);
        this._spawnImpactRing(e.x + e.w/2, e.y + e.h/2, p.color, true);
      }
      if (this.boss) {
        this.boss.hp -= 22;
        this.boss.hitFlash = 12;
        this.boss.burnLife = 120; this.boss.burnTick = 0;
        this._burst(this.boss.x + this.boss.w/2, this.boss.y + this.boss.h/2, p.color, 24);
        this._spawnImpactRing(this.boss.x + this.boss.w/2, this.boss.y + this.boss.h/2, p.color, true);
      }
      // 全螢幕橘色閃光
      this._screenFlash = { color:'#f5601a', life:24 };
    } else if (id === 'xuance') {
      // 全敵人停滯 3 秒
      for (const e of this.enemies) e.stunLife = 180;
      if (this.boss) this.boss.stunLife = 180;
      this._screenFlash = { color:'#a060d8', life:30 };
    } else if (id === 'chiyu') {
      // 玩家無敵 + AOE 風刃
      this.player.rolling = 90; // 翻滾無敵延長
      this.player.vx = this.player.facing * 12;
      for (const e of this.enemies) {
        if (Math.abs(e.x - this.player.x) < 600) {
          e.hp -= 18;
          e.hitFlash = 8;
          e.knockback = (e.x < this.player.x ? -1 : 1) * 14;
          this._burst(e.x + e.w/2, e.y + e.h/2, p.color, 12);
        }
      }
      if (this.boss && Math.abs(this.boss.x - this.player.x) < 600) {
        this.boss.hp -= 14;
        this.boss.hitFlash = 10;
      }
      this._screenFlash = { color:'#5ad0e0', life:20 };
    }
    this.shakeTime = Settings.shake ? 18 : 0;
    this.shakeAmount = Settings.shake ? 9 : 0;
    this._renderPartnerHud();
  },

  _renderPartnerHud() {
    const hud = document.getElementById('partner-hud');
    if (!hud) return;
    hud.innerHTML = '';
    const list = partnersAvailable();
    if (list.length === 0) { hud.classList.remove('show'); return; }
    hud.classList.add('show');
    for (const p of list) {
      const item = document.createElement('div');
      const used = !!this.partnerUsed[p.id];
      item.className = 'partner-item' + (used ? ' used' : '');
      item.style.borderColor = used ? 'rgba(255,255,255,0.18)' : p.color;
      item.innerHTML = `
        <div class="partner-key">${p.key.replace('Key','')}</div>
        <div class="partner-name">${p.name}</div>
        <div class="partner-skill">${p.skill}</div>`;
      item.addEventListener('click', () => this._castPartner(p.id));
      hud.appendChild(item);
    }
  },

  _updateYaoliBadge() {
    const ybg = document.getElementById('yaoli-current');
    if (ybg) {
      const y = YAOLI[State.currentYaoli];
      ybg.innerHTML = `<img class="yaoli-current-icon" src="${y.icon}" alt="" /><span>${y.name}</span>`;
      ybg.style.color = y.color === '#1a1612' ? '#f5efde' : y.color;
      ybg.style.borderColor = y.color === '#1a1612' ? '#f5efde' : y.color;
    }
    const list = document.getElementById('yaoli-list');
    if (list) {
      list.innerHTML = '';
      Object.values(YAOLI).forEach((y, i) => {
        const item = document.createElement('div');
        item.className = 'yaoli-item';
        const unlocked = State.unlockedYaoli.includes(y.id);
        if (!unlocked) item.classList.add('locked');
        if (State.currentYaoli === y.id) item.classList.add('active');
        item.innerHTML = `<span class="num">${i+1}</span><img class="yaoli-icon" src="${y.icon}" alt="" /><span class="name">${y.name}</span>`;
        item.style.borderColor = unlocked ? y.color : 'rgba(255,255,255,0.18)';
        item.addEventListener('click', () => this._tryYaoli(y.id));
        list.appendChild(item);
      });
    }
  },

  _load(src) {
    const img = new Image();
    img.src = src;
    return img;
  },
  _ready(img) {
    return !!(img && img.complete && (img.naturalWidth || img.width));
  },
  _drawTiledLayer(ctx, img, speed, alpha = 1) {
    if (!this._ready(img)) return false;
    const W = this.W, H = this.H;
    const srcW = img.naturalWidth || img.width || 3840;
    const offset = -((this.cameraX * speed) % srcW);
    ctx.save();
    ctx.globalAlpha = alpha;
    for (let x = offset - srcW; x < W + srcW; x += srcW) {
      ctx.drawImage(img, x, 0, srcW, H);
    }
    ctx.restore();
    return true;
  },

  _mkEnemy(kind, x, y) {
    Glossary.see(kind);
    const seed = Math.random() * Math.PI * 2;
    const common = { vx:0, vy:0, dir:-1, animT:0, animSeed:seed, hitStun:0, hitShake:0, knockback:0 };
    if (kind === 'boar')    return { ...common, kind, x, y:this.groundY-80, w:96, h:80,  hp:30, behavior:'charge', cd:60 };
    if (kind === 'leap')    return { ...common, kind, x, y:this.groundY-96, w:80, h:96,  hp:24, behavior:'leap',   cd:90, onGround:true };
    if (kind === 'wisp')    return { ...common, kind, x, y:y || 350,        w:64, h:80,  hp:20, behavior:'shoot',  cd:120 };
    if (kind === 'foxfire') return { ...common, kind, x, y:y || 380,        w:80, h:96,  hp:28, behavior:'shoot',  cd:90 };
    if (kind === 'yaobing') return { ...common, kind, x, y:this.groundY-128,w:96, h:128, hp:42, behavior:'charge', cd:90, slow:true };
    return { ...common, kind, x, y:this.groundY-80, w:96, h:80, hp:30, behavior:'charge', cd:60 };
  },

  _spawnBoss() {
    const cfg = this.stageCfg.boss;
    this.boss = {
      kind: cfg.kind,
      x: cfg.x, y: cfg.y,
      w: cfg.w, h: cfg.h,
      hp: cfg.hp, hpMax: cfg.hp,
      phase: 1, cd: 120,
      attacking: 0, vx: 0, vy: 0,
      dir: -1,
      label: cfg.label,
      phases: cfg.phases || 2,
      ranged: cfg.ranged,
      fly: cfg.fly,
      color: cfg.color,
      animT: 0,
      hitShake: 0,
    };
    this.bossActive = true;
    this._hpAtBossSpawn = this.hp;
    document.getElementById('hud-boss').hidden = false;
    document.querySelector('#hud-boss .hud-label').textContent = cfg.label;
    // 出場演出（HTML overlay）+ Glossary 解鎖
    const bossSubMap = {
      mist:    '霧妖將 · 第一道封印的看守者',
      foxfire: '九尾幻影 · 青丘三百年的等',
      south:   '窮奇殘影 · 食言而吞',
      rift:    '蠱雕 · 神戰的目擊者',
      nuwa:    '女媧守護者 · 補天石的看門人',
      final:   '補天石怨念 · 妖境鬆動的真兇',
    };
    const introMs = showBossIntro(cfg.label, bossSubMap[this._stageId] || '', cfg.kind) || 2800;
    Glossary.see(cfg.kind);
    // 暫停戰鬥，讓戰吼與打字機介紹完整播完
    this.hitPause = Math.max(this.hitPause, Math.ceil(introMs / 16.67));
    this.shakeTime = Settings.shake ? 42 : 0;
    this.shakeAmount = Settings.shake ? 10 : 0;
  },

  _loop(now) {
    if (!this.running) return;
    let dt = Math.min((now - this._lastT) / 16.67, 2);
    this._lastT = now;
    // 完美閃避：世界減速 0.35x（玩家動作不受影響：另用 player slow flag）
    if (this.slowMo > 0) dt *= 0.35;
    if (Settings.perf) {
      Perf.particles = this.particles.length;
      Perf.enemies = this.enemies.length + (this.bossActive ? 1 : 0);
      Perf.tick();
    }
    // 系統選單開啟時暫停世界（但繼續 render）
    const paused = isSystemPaused();
    if (paused) {
      // freeze 但繼續貼最後一畫面
      this._render();
      this._lastT = now; // 保持 dt 重置
      requestAnimationFrame((t) => this._loop(t));
      return;
    }
    if (this.hitPause > 0) {
      this.hitPause -= dt;
      if (this.shakeTime > 0) this.shakeTime -= dt;
    } else {
      this._update(dt);
    }
    this._render();
    requestAnimationFrame((t) => this._loop(t));
  },

  _update(dt) {
    const p = this.player;
    p.animT = (p.animT || 0) + dt;
    let move = 0;
    if (this.keys['ArrowLeft'] || this.keys['KeyA'])  move -= 1;
    if (this.keys['ArrowRight'] || this.keys['KeyD']) move += 1;
    p.vx = move * 5;
    if (move !== 0) p.facing = move;

    // 跳：風羽允許二段
    const jumpKey = this.keys['Space'] || this.keys['ArrowUp'];
    if (jumpKey && !p._jumpHeld) {
      if (p.onGround) { p.vy = -14; p.onGround = false; p.doubleJump = (State.currentYaoli === 'windplume'); Audio.playSfx('jump'); }
      else if (p.doubleJump) { p.vy = -12; p.doubleJump = false; this._burst(p.x+p.w/2, p.y+p.h, '#5ad0e0', 12); Audio.playSfx('jump'); }
    }
    p._jumpHeld = jumpKey;

    p.vy += 0.7 * dt;
    p.y += p.vy * dt;
    p.x += p.vx * dt;
    const wasInAir = !p.onGround;
    if (p.y + p.h >= this.groundY) {
      p.y = this.groundY - p.h;
      p.vy = 0;
      p.onGround = true;
      // 落地揚起塵土
      if (wasInAir) this._spawnDust(p.x + p.w/2, this.groundY, 12);
    }
    p.x = Math.max(40, Math.min(this.worldW - p.w - 40, p.x));

    const yc = YAOLI[State.currentYaoli];
    const attackPressed = this.keys['KeyZ'] || this.keys['KeyJ'] || this.keys['MouseLeft'];
    const baseAttackCd = yc.fast ? 12 : 18;
    if (attackPressed && p.attacking <= 0) {
      p.attacking = baseAttackCd;
      this._playerAttack(yc.fast ? 50 : 40, false);
    }
    if (p.attacking > 0) p.attacking -= dt;

    const rollPressed = this.keys['KeyX'] || this.keys['KeyK'];
    if (rollPressed && p.rolling <= 0 && p.onGround) {
      p.rolling = 24;
      p.vx = p.facing * 9;
      this._spawnDust(p.x + p.w/2, this.groundY, 8);
      Audio.playSfx('roll');
    }
    if (p.rolling > 0) p.rolling -= dt;

    const yaoliPressed = this.keys['KeyC'] || this.keys['KeyL'];
    if (yaoliPressed && p.yaoliCast <= 0 && this.yaoli >= yc.cost) {
      this.yaoli -= yc.cost;
      p.yaoliCast = 30;
      this._playerAttack(140, true);
      if (yc.heal) {
        this.hp = Math.min(this.hpMax, this.hp + yc.heal);
        this._burst(p.x+p.w/2, p.y+p.h/2, '#d8e0f0', 24);
      }
    }
    if (p.yaoliCast > 0) p.yaoliCast -= dt;
    if (p.hitCD > 0) p.hitCD -= dt;
    this.cameraX = Math.max(0, Math.min(p.x - this.W*0.35, this.worldW - this.W));
    if (!this.bossActive && p.x > this.reachedBossX) this._spawnBoss();

    for (const e of this.enemies) this._updateEnemy(e, dt);
    // 死亡 → 掉落物
    for (const e of this.enemies) {
      if (e.hp <= 0 && !e._dropped) {
        e._dropped = true;
        this._spawnDrop(e.x + e.w/2, e.y + e.h/2);
      }
    }
    this.enemies = this.enemies.filter(e => e.hp > 0);
    if (this.bossActive && this.boss) this._updateBoss(this.boss, dt);

    for (const pr of this.projectiles) {
      pr.x += pr.vx * dt;
      pr.life -= dt;
      // 完美閃避偵測：翻滾中且敵彈剛好擦過
      if (pr.from === 'enemy' && this._aabb(pr, p) && p.rolling > 0 && p.rolling > 16) {
        this._triggerPerfectDodge();
        pr.life = 0;
      }
      if (pr.from === 'enemy' && this._aabb(pr, p) && p.rolling <= 0 && p.hitCD <= 0) {
        this._applyDamageToPlayer(pr.dmg);
        p.hitCD = 30;
        this.playerHitFlash = 16;
        if (Settings.shake) { this.shakeTime = 8; this.shakeAmount = 6; }
        Audio.playSfx('playerHurt');
        this.combo = 0;
        this._burst(p.x + p.w/2, p.y + p.h/2, '#ff5050', 14);
        pr.life = 0;
      }
      // 夥伴投射物 vs 敵人
      if (pr.from === 'companion') {
        for (const e of this.enemies) {
          if (this._aabb(pr, e)) {
            e.hp -= pr.dmg;
            e.hitFlash = 6;
            this._burst(e.x + e.w/2, e.y + e.h/2, '#f5601a', 6);
            pr.life = 0;
            break;
          }
        }
        if (this.boss && this._aabb(pr, this.boss)) {
          this.boss.hp -= Math.round(pr.dmg * 0.6);
          this.boss.hitFlash = 6;
          pr.life = 0;
        }
      }
      // 敵人投射物 vs 夥伴
      if (pr.from === 'enemy') {
        for (const c of this.companions) {
          if (c.retreat > 0) continue;
          if (this._aabb(pr, c)) {
            this._companionTakeDamage(c, pr.dmg);
            pr.life = 0;
            break;
          }
        }
      }
    }
    this.projectiles = this.projectiles.filter(pr => pr.life > 0);

    for (const pa of this.particles) {
      pa.x += pa.vx; pa.y += pa.vy;
      pa.vy += 0.4;
      pa.life -= dt;
    }
    this.particles = this.particles.filter(pa => pa.life > 0);
    for (const d of this.dmgNumbers) { d.x += d.vx; d.y += d.vy; d.vy += 0.10; d.life -= dt; }
    this.dmgNumbers = this.dmgNumbers.filter(d => d.life > 0);
    for (const s of this.swingTrail) s.life -= dt;
    this.swingTrail = this.swingTrail.filter(s => s.life > 0);
    for (const s of this.hitSlashes) s.life -= dt;
    this.hitSlashes = this.hitSlashes.filter(s => s.life > 0);

    for (const r of this.impactRings) {
      r.life -= dt;
      r.r += (r.maxR - r.r) * 0.18;
    }
    this.impactRings = this.impactRings.filter(r => r.life > 0);

    for (const d of this.dustPuffs) {
      d.x += d.vx; d.y += d.vy;
      d.vy += 0.05;
      d.life -= dt;
    }
    this.dustPuffs = this.dustPuffs.filter(d => d.life > 0);

    if (this.playerHitFlash > 0) this.playerHitFlash -= dt;

    this._updateDrops(dt);
    this._updateCompanions(dt);

    // 慢動作：完美閃避觸發後遞減
    if (this.slowMo > 0) this.slowMo -= dt;

    // 連擊計時：超過 2 秒沒新增命中就重置
    if (this.combo > 0) {
      this.comboTimer += dt;
      if (this.comboTimer > 120) this.combo = 0;
    }

    // 夥伴技冷卻
    for (const k of Object.keys(this.partnerCooldowns)) {
      if (this.partnerCooldowns[k] > 0) this.partnerCooldowns[k] -= dt;
    }

    for (const e of this.enemies) {
      if (e.hitFlash > 0) e.hitFlash -= dt;
      if (e.hitShake > 0) e.hitShake -= dt;
      if (e.burnLife && e.burnLife > 0) {
        e.burnLife -= dt;
        e.burnTick = (e.burnTick || 0) + dt;
        if (e.burnTick > 24) { e.burnTick = 0; e.hp -= 4; this._spawnDmgNumber(e.x+e.w/2, e.y, 4, false); }
      }
      if (e.stunLife && e.stunLife > 0) e.stunLife -= dt;
    }
    if (this.boss) {
      if (this.boss.hitFlash > 0) this.boss.hitFlash -= dt;
      if (this.boss.hitShake > 0) this.boss.hitShake -= dt;
      this.boss.animT = (this.boss.animT || 0) + dt;
      if (this.boss.burnLife && this.boss.burnLife > 0) {
        this.boss.burnLife -= dt;
        this.boss.burnTick = (this.boss.burnTick || 0) + dt;
        if (this.boss.burnTick > 24) { this.boss.burnTick = 0; this.boss.hp -= 5; }
      }
      if (this.boss.stunLife && this.boss.stunLife > 0) this.boss.stunLife -= dt;
    }

    if (this.shakeTime > 0) {
      this.shakeTime -= dt;
      this.shakeAmount *= 0.88;
      if (this.shakeTime <= 0) this.shakeAmount = 0;
    }

    this.yaoli = Math.min(this.yaoliMax, this.yaoli + 0.08 * dt);
    this._updateHUD();

    if (this.bossActive && this.boss && this.boss.hp <= 0) this._victory();
    if (this.hp <= 0) this._defeat();
  },

  _updateEnemy(e, dt) {
    const p = this.player;
    e.animT = (e.animT || 0) + dt;
    if (e.knockback && Math.abs(e.knockback) > 0.2) {
      e.x += e.knockback * dt;
      e.knockback *= 0.84;
      if (e.kind !== 'wisp' && e.kind !== 'foxfire') {
        e.y = this.groundY - e.h - Math.abs(e.knockback) * 0.45;
        if (Math.abs(e.knockback) < 1.2) e.y = this.groundY - e.h;
      }
      return;
    }
    e.knockback = 0;
    if (e.hitStun && e.hitStun > 0) { e.hitStun -= dt; return; }
    if (e.stunLife && e.stunLife > 0) return;
    const dx = p.x - e.x;
    const dist = Math.abs(dx);

    const moveScale = e.slow ? 0.7 : 1;

    if (e.behavior === 'charge') {
      if (dist < 360 && Math.abs(p.y - e.y) < 100) {
        e.dir = Math.sign(dx) || -1;
        e.vx = e.dir * 4 * moveScale;
      } else {
        e.vx = e.dir * 1.2 * moveScale;
      }
      e.x += e.vx * dt;
    } else if (e.behavior === 'leap') {
      e.cd -= dt;
      e.vy += 0.6 * dt;
      e.y += e.vy * dt;
      e.x += e.vx * dt;
      if (e.y + e.h >= this.groundY) { e.y = this.groundY - e.h; e.vy = 0; e.onGround = true; }
      if (e.onGround && e.cd <= 0 && dist < 500) {
        e.dir = Math.sign(dx) || -1;
        e.vy = -12;
        e.vx = e.dir * 4;
        e.onGround = false;
        e.cd = 110;
      }
    } else if (e.behavior === 'shoot') {
      e.cd -= dt;
      e.y += Math.sin(performance.now() * 0.003 + e.x) * 0.5;
      if (e.cd <= 0 && dist < 720) {
        e.dir = Math.sign(dx) || -1;
        const isFox = e.kind === 'foxfire';
        this.projectiles.push({
          x: e.x + e.w/2, y: e.y + e.h/2,
          w: 24, h: 24,
          vx: e.dir * (isFox ? 7 : 6), life: 90,
          dmg: isFox ? 12 : 10, from:'enemy', kind: isFox ? 'fire' : 'ink',
        });
        e.cd = isFox ? 80 : 100;
      }
    }

    if (this._aabb(e, p) && p.rolling > 16) {
      this._triggerPerfectDodge();
    }
    if (this._aabb(e, p) && p.rolling <= 0 && p.hitCD <= 0) {
      this._applyDamageToPlayer(8);
      p.hitCD = 30;
      p.vx = (p.x < e.x ? -1 : 1) * 6;
      this.playerHitFlash = 14;
      if (Settings.shake) { this.shakeTime = 8; this.shakeAmount = 6; }
      this._burst(p.x + p.w/2, p.y + p.h/2, '#ff5050', 12);
      Audio.playSfx('playerHurt');
      this.combo = 0;
    }
    // 敵人 vs 夥伴
    for (const c of this.companions) {
      if (c.retreat > 0) continue;
      if (this._aabb(e, c)) {
        this._companionTakeDamage(c, 4);
        e.knockback = (e.x < c.x ? -1 : 1) * 3;
      }
    }
  },

  _updateBoss(b, dt) {
    const p = this.player;
    b.animT = (b.animT || 0) + dt;
    if (b.knockback && Math.abs(b.knockback) > 0.2) { b.x += b.knockback * dt; b.knockback *= 0.7; return; }
    b.knockback = 0;
    if (b.stunLife && b.stunLife > 0) return;
    const dx = p.x - b.x;
    b.dir = dx < 0 ? -1 : 1;
    b.cd -= dt;

    // 階段切換（依 phases）
    const phaseHpRatio = b.hp / b.hpMax;
    if (b.phases >= 2 && b.phase === 1 && phaseHpRatio < 0.5) {
      b.phase = 2; b.cd = 60;
      this._burst(b.x + b.w/2, b.y + b.h/2, '#a04030', 30);
    }
    if (b.phases >= 3 && b.phase === 2 && phaseHpRatio < 0.25) {
      b.phase = 3; b.cd = 60;
      this._burst(b.x + b.w/2, b.y + b.h/2, '#f53050', 50);
      this.shakeTime = 30; this.shakeAmount = 14;
    }

    // 預攻警告：cd 接近 0 時亮起紅色警告環
    if (b.cd > 0 && b.cd < 28 && !b.attacking) {
      b.warning = b.cd;
      if (!b._warned) {
        b._warned = true;
        Audio.playSfx('bossWarning');
      }
    } else {
      b.warning = 0;
      if (b.cd > 35) b._warned = false;
    }
    if (b.cd <= 0) {
      if (b.phase === 1) {
        // 揮砍/突進：突進前一個爆裂特效
        b.attacking = 28;
        b.vx = b.dir * 5;
        b.cd = 130;
        this._burst(b.x + b.w/2, b.y + b.h/2, '#ff8030', 16);
        this.shakeTime = 6; this.shakeAmount = 4;
      } else if (b.phase === 2) {
        if (b.ranged) {
          for (let i = -1; i <= 1; i++) {
            this.projectiles.push({
              x: b.x + b.w/2, y: b.y + 60,
              w: 32, h: 32,
              vx: b.dir * 7, life: 120,
              dmg: 12, from:'enemy', kind:'ink',
            });
          }
          this._burst(b.x + b.w/2, b.y + 60, '#7030f0', 18);
        } else {
          b.attacking = 32;
          b.vx = b.dir * 7;
          this._burst(b.x + b.w/2, b.y + b.h/2, '#ff8030', 16);
        }
        if (Math.random() < 0.4) {
          // 召出小妖支援（霧火或妖兵）
          const minion = this._mkEnemy(Math.random() < 0.5 ? 'foxfire' : 'wisp', b.x - 200, this.groundY - 220);
          this.enemies.push(minion);
          this._burst(minion.x + minion.w/2, minion.y + minion.h/2, '#a060d8', 20);
        }
        b.cd = 110;
        this.shakeTime = 8; this.shakeAmount = 5;
      } else {
        // phase 3：扇形彈幕
        for (let i = -2; i <= 2; i++) {
          this.projectiles.push({
            x: b.x + b.w/2, y: b.y + 60,
            w: 32, h: 32,
            vx: b.dir * (6 + Math.abs(i)),
            life: 130,
            dmg: 14, from:'enemy', kind:'ink',
          });
        }
        b.cd = 90;
        this._burst(b.x + b.w/2, b.y + 60, '#ff3050', 24);
        this.shakeTime = 12; this.shakeAmount = 7;
      }
    }
    if (b.attacking > 0) { b.x += b.vx * dt; b.attacking -= dt; } else { b.vx *= 0.8; }
    if (b.fly) {
      b.y += Math.sin(performance.now() * 0.002) * 0.6;
    }
    if (this._aabb(b, p) && p.rolling > 16) {
      this._triggerPerfectDodge();
    }
    if (this._aabb(b, p) && p.rolling <= 0 && p.hitCD <= 0) {
      this._applyDamageToPlayer(14);
      p.hitCD = 36;
      p.vx = (p.x < b.x ? -1 : 1) * 8;
      this.playerHitFlash = 20;
      if (Settings.shake) { this.shakeTime = 14; this.shakeAmount = 10; }
      this._burst(p.x + p.w/2, p.y + p.h/2, '#ff3050', 18);
      Audio.playSfx('playerHurt');
      this.combo = 0;
    }
  },

  _playerAttack(reach, isYaoli) {
    const p = this.player;
    const yc = YAOLI[State.currentYaoli];
    const hb = {
      x: p.x + (p.facing > 0 ? p.w : -reach),
      y: p.y + 20,
      w: reach,
      h: p.h - 30,
    };
    this._burst(hb.x + hb.w/2, hb.y + hb.h/2, yc.color, isYaoli ? 24 : 10);

    this.swingTrail.push({
      cx: p.x + (p.facing > 0 ? p.w : 0),
      cy: p.y + p.h * 0.5,
      facing: p.facing,
      reach: reach + 18,
      life: isYaoli ? 22 : 16,
      lifeMax: isYaoli ? 22 : 16,
      isYaoli,
      color: yc.color,
    });

    let anyHit = false;
    const baseDmg = yc.basicDmg;
    const yaoliDmg = Math.round(baseDmg * yc.dmgMul);

    const applyEffects = (target) => {
      if (yc.burn) { target.burnLife = 90; target.burnTick = 0; }
      if (yc.stun) { target.stunLife = 60; }
    };

    for (const e of this.enemies) {
      if (this._aabb(hb, e)) {
        const dmg = isYaoli ? yaoliDmg : baseDmg;
        e.hp -= dmg;
        e.hitFlash = isYaoli ? 14 : 10;
        e.hitShake = isYaoli ? 14 : 10;
        e.hitStun = isYaoli ? 18 : 11;
        e.knockback = p.facing * (isYaoli ? 20 : 12);
        this.yaoli = Math.min(this.yaoliMax, this.yaoli + 6);
        this._burst(e.x + e.w/2, e.y + e.h/2, yc.color, isYaoli ? 18 : 12);
        this._spawnImpactRing(e.x + e.w/2, e.y + e.h/2, yc.color, isYaoli);
        this._spawnHitSlash(e.x + e.w/2, e.y + e.h/2, p.facing, yc.color, isYaoli);
        this._spawnDust(e.x + e.w/2, this.groundY, isYaoli ? 14 : 8);
        this._spawnDmgNumber(e.x + e.w/2, e.y - 6, dmg, isYaoli);
        applyEffects(e);
        anyHit = true;
      }
    }
    if (this.boss && this._aabb(hb, this.boss)) {
      const dmg = isYaoli ? Math.round(yaoliDmg * 0.75) : Math.round(baseDmg * 0.75);
      this.boss.hp -= dmg;
      this.boss.hitFlash = isYaoli ? 16 : 12;
      this.boss.hitShake = isYaoli ? 16 : 11;
      this.boss.knockback = p.facing * (isYaoli ? 9 : 4);
      this.yaoli = Math.min(this.yaoliMax, this.yaoli + 8);
      this._burst(this.boss.x + this.boss.w/2, this.boss.y + this.boss.h/2, yc.color, isYaoli ? 28 : 18);
      this._spawnImpactRing(this.boss.x + this.boss.w/2, this.boss.y + this.boss.h/2, yc.color, true);
      this._spawnHitSlash(this.boss.x + this.boss.w/2, this.boss.y + this.boss.h/2, p.facing, yc.color, true);
      this._spawnDust(this.boss.x + this.boss.w/2, this.groundY, isYaoli ? 18 : 10);
      this._spawnDmgNumber(this.boss.x + this.boss.w/2, this.boss.y, dmg, isYaoli);
      applyEffects(this.boss);
      anyHit = true;
    }

    if (anyHit) {
      this.hitPause   = isYaoli ? 12 : 6;
      this.shakeTime  = Settings.shake ? (isYaoli ? 18 : 11) : 0;
      this.shakeAmount = Settings.shake ? (isYaoli ? 15 : 8) : 0;
      Audio.playSfx(isYaoli ? 'hitYaoli' : 'hit');
      // 連擊
      this.combo += 1;
      this.comboTimer = 0;
      if (this.combo > this.comboMax) this.comboMax = this.combo;
      // 連擊獎勵：每 10 hits 回少量 yaoli + 螢幕加亮
      if (this.combo > 0 && this.combo % 10 === 0) {
        this.yaoli = Math.min(this.yaoliMax, this.yaoli + 12);
        flashToast(`${this.combo} 連擊！`);
      }
      if (this.combo >= 30) Achievements.unlock('combo-30');
    } else {
      Audio.playSfx('inkStroke');
    }
  },

  _spawnDmgNumber(x, y, dmg, isYaoli) {
    this.dmgNumbers.push({
      x, y,
      vx: (Math.random() - 0.5) * 1.6,
      vy: -2.6 - Math.random() * 0.6,
      life: 50, lifeMax: 50,
      dmg, isYaoli,
    });
  },

  _spawnImpactRing(x, y, color, isYaoli) {
    this.impactRings.push({
      x, y,
      r: 8,
      maxR: isYaoli ? 110 : 72,
      life: isYaoli ? 28 : 22,
      lifeMax: isYaoli ? 28 : 22,
      color,
    });
  },

  _spawnHitSlash(x, y, facing, color, isYaoli) {
    this.hitSlashes.push({
      x, y,
      facing,
      color,
      angle: (facing > 0 ? -0.62 : Math.PI + 0.62) + (Math.random() - 0.5) * 0.25,
      length: isYaoli ? 150 : 104,
      width: isYaoli ? 18 : 11,
      life: isYaoli ? 18 : 13,
      lifeMax: isYaoli ? 18 : 13,
    });
  },

  // ============ E 包：戰鬥夥伴 AI ============
  _spawnCompanion(id) {
    const cfg = {
      bailing: { name:'白綾', img:ASSETS.char.bailing.smile,    color:'#f5601a', behavior:'ranged',  hp:60, atkDmg:6,  cd:90 },
      xuance:  { name:'玄澈', img:ASSETS.char.xuance.normal,    color:'#a060d8', behavior:'support', hp:80, atkDmg:5,  cd:120 },
      chiyu:   { name:'赤羽', img:ASSETS.char.chiyu.normal,     color:'#5ad0e0', behavior:'melee',   hp:70, atkDmg:9,  cd:60 },
    }[id];
    if (!cfg) return;
    const img = new Image(); img.src = cfg.img;
    this.companions.push({
      id, name: cfg.name, img,
      x: this.player.x - 80 - this.companions.length * 60,
      y: this.groundY - 110, w: 60, h: 110,
      facing: 1,
      hp: cfg.hp, hpMax: cfg.hp,
      atkDmg: cfg.atkDmg, atkCd: 0, atkCdMax: cfg.cd,
      behavior: cfg.behavior,
      color: cfg.color,
      retreat: 0,    // > 0 表示退場中（受傷後暫離）
      bobPhase: Math.random() * Math.PI * 2,
    });
  },

  _updateCompanions(dt) {
    const p = this.player;
    for (const c of this.companions) {
      if (c.retreat > 0) {
        c.retreat -= dt;
        c.y -= 0.3 * dt;       // 緩慢飄離畫面
        if (c.retreat <= 0) {  // 退完後回到玩家身邊以低 HP 復出
          c.hp = Math.max(20, c.hpMax * 0.4);
          c.x = p.x - 100;
          c.y = this.groundY - c.h;
        }
        continue;
      }
      // 跟隨玩家：保持距離（近戰 80px、遠程 200px、輔助 150px）
      const followDist = c.behavior === 'melee' ? 80 : (c.behavior === 'ranged' ? 200 : 150);
      const targetX = p.x - p.facing * followDist;
      const dx = targetX - c.x;
      if (Math.abs(dx) > 8) {
        c.x += Math.sign(dx) * Math.min(4, Math.abs(dx) * 0.1) * dt;
        c.facing = dx > 0 ? 1 : -1;
      }
      c.y = this.groundY - c.h + Math.sin(performance.now() * 0.003 + c.bobPhase) * 2;

      // 找最近敵人
      c.atkCd -= dt;
      if (c.atkCd > 0) continue;
      let target = null, td = Infinity;
      const search = c.behavior === 'ranged' ? 600 : 200;
      for (const e of this.enemies) {
        const dd = Math.hypot(e.x - c.x, e.y - c.y);
        if (dd < search && dd < td) { target = e; td = dd; }
      }
      if (!target && this.boss && this.bossActive) {
        const dd = Math.hypot(this.boss.x - c.x, this.boss.y - c.y);
        if (dd < search) target = this.boss;
      }
      if (!target) continue;

      c.facing = target.x > c.x ? 1 : -1;
      // 行為動作
      if (c.behavior === 'ranged') {
        // 白綾：發狐火彈
        this.projectiles.push({
          x: c.x + 30, y: c.y + 50, w: 22, h: 22,
          vx: c.facing * 7, life: 90, dmg: c.atkDmg, from: 'companion', kind: 'fire',
        });
        Audio.playSfx('inkStroke');
      } else if (c.behavior === 'support') {
        // 玄澈：對 target 上短停滯（封印）
        if (!target.stunLife || target.stunLife < 30) target.stunLife = 60;
        this._burst(target.x + (target.w||40)/2, target.y + (target.h||40)/2, c.color, 14);
      } else {
        // 赤羽：近戰突進
        if (td < 100) {
          target.hp -= c.atkDmg;
          target.hitFlash = 6;
          target.knockback = c.facing * 4;
          this._burst(target.x + (target.w||40)/2, target.y + (target.h||40)/2, c.color, 8);
        }
      }
      c.atkCd = c.atkCdMax;
    }
  },

  _companionTakeDamage(c, dmg) {
    c.hp -= dmg;
    this._burst(c.x + c.w/2, c.y + c.h/2, '#ff5050', 10);
    if (c.hp <= 0) {
      c.retreat = 600; // 10 秒退場
      flashToast(`${c.name} 暫時退場`);
    }
  },

  // ============ H 包：完美閃避 ============
  _triggerPerfectDodge() {
    this.slowMo = Math.max(this.slowMo, 60); // 1 秒慢動作
    this.yaoli = Math.min(this.yaoliMax, this.yaoli + 25);
    this._burst(this.player.x + this.player.w/2, this.player.y + this.player.h/2, '#fff8e0', 24);
    this._spawnImpactRing(this.player.x + this.player.w/2, this.player.y + this.player.h/2, '#fff8e0', true);
    flashToast('完美閃避！+25 妖力');
    Audio.playSfx('uiStamp');
    Achievements.unlock('perfect-dodge');
  },

  // ============ H 包：armor 緩衝玩家受擊 ============
  _applyDamageToPlayer(dmg) {
    // 先扣 armor，剩下扣 hp
    if (this.armor > 0) {
      const block = Math.min(this.armor, dmg);
      this.armor -= block;
      dmg -= block;
      if (block > 0) this._burst(this.player.x + this.player.w/2, this.player.y + this.player.h/2, '#c8b890', 8);
    }
    if (dmg > 0) this.hp -= dmg;
  },

  _spawnDrop(x, y) {
    // 60% 妖力丹（藍綠）、30% 血滴（紅）、10% 沒掉
    const r = Math.random();
    if (r < 0.6) {
      this.drops.push({ kind:'yaoli', x, y, vy:-3, vx:(Math.random()-0.5)*2, life:600, mag:false });
    } else if (r < 0.9) {
      this.drops.push({ kind:'hp', x, y, vy:-3, vx:(Math.random()-0.5)*2, life:600, mag:false });
    }
  },

  _updateDrops(dt) {
    const p = this.player;
    const px = p.x + p.w/2, py = p.y + p.h/2;
    for (const d of this.drops) {
      // 物理：重力 → 地面停住
      if (d.y < this.groundY - 12) {
        d.vy += 0.32 * dt;
        d.y += d.vy * dt;
        d.x += d.vx * dt;
      } else {
        d.y = this.groundY - 12;
        d.vy = 0; d.vx *= 0.85;
      }
      // 磁吸：玩家靠近 120px 內被吸過去
      const dx = px - d.x, dy = py - d.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 120) d.mag = true;
      if (d.mag) {
        const len = Math.max(dist, 1);
        d.x += (dx / len) * Math.min(8, len) * 0.8;
        d.y += (dy / len) * Math.min(8, len) * 0.8;
      }
      // 撿起
      if (dist < 36) {
        d.life = 0;
        if (d.kind === 'yaoli') {
          this.yaoli = Math.min(this.yaoliMax, this.yaoli + 18);
          this._burst(d.x, d.y, '#54e0c0', 12);
          flashToast('+18 妖力');
        } else {
          this.hp = Math.min(this.hpMax, this.hp + 12);
          this._burst(d.x, d.y, '#f5e0c0', 12);
          flashToast('+12 HP');
        }
      }
      d.life -= dt;
    }
    this.drops = this.drops.filter(d => d.life > 0);
  },

  _spawnDust(x, y, n) {
    for (let i = 0; i < n; i++) {
      this.dustPuffs.push({
        x: x + (Math.random()-0.5) * 30,
        y,
        vx: (Math.random()-0.5) * 4,
        vy: -Math.random() * 2 - 0.5,
        r: 3 + Math.random() * 5,
        life: 30 + Math.random() * 14,
        lifeMax: 40,
      });
    }
  },

  _burst(x, y, color, n) {
    for (let i = 0; i < n; i++) {
      this.particles.push({
        x, y,
        vx: (Math.random()-0.5)*8,
        vy: (Math.random()-0.5)*8 - 2,
        life: 40 + Math.random()*30,
        color,
        r: 2 + Math.random()*4,
      });
    }
  },

  _aabb(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x &&
           a.y < b.y + b.h && a.y + a.h > b.y;
  },

  _updateHUD() {
    document.getElementById('hud-hp').style.width    = (this.hp / this.hpMax * 100) + '%';
    document.getElementById('hud-yaoli').style.width = (this.yaoli / this.yaoliMax * 100) + '%';
    const armorEl = document.getElementById('hud-armor');
    if (armorEl) armorEl.style.width = (this.armor / this.armorMax * 100) + '%';
    if (this.boss) {
      document.getElementById('hud-boss-hp').style.width = (this.boss.hp / this.boss.hpMax * 100) + '%';
    }
  },

  _drawBossArenaBackground(ctx, x, y, w, h, tint) {
    const img = this.bossArenaImage;
    if (!img || !img.complete) return;
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;
    const feather = Math.min(420, w * 0.42);
    const steps = 32;
    const smooth = p => p * p * (3 - 2 * p);

    ctx.save();
    if (tint) ctx.filter = tint;
    for (let i = 0; i < steps; i++) {
      const p0 = i / steps;
      const p1 = (i + 1) / steps;
      const localX = feather * p0;
      const localW = feather * (p1 - p0) + 1;
      ctx.globalAlpha = smooth(p1);
      ctx.drawImage(
        img,
        (localX / w) * iw, 0,
        (localW / w) * iw, ih,
        x + localX, y,
        localW, h
      );
    }
    ctx.globalAlpha = 1;
    ctx.drawImage(
      img,
      (feather / w) * iw, 0,
      iw - (feather / w) * iw, ih,
      x + feather, y,
      w - feather, h
    );
    if (tint) ctx.filter = 'none';
    ctx.restore();

    ctx.save();
    const mist = ctx.createLinearGradient(x - 120, 0, x + feather + 120, 0);
    mist.addColorStop(0, 'rgba(222,214,196,0)');
    mist.addColorStop(0.48, 'rgba(222,214,196,0.13)');
    mist.addColorStop(1, 'rgba(222,214,196,0)');
    ctx.fillStyle = mist;
    ctx.fillRect(x - 120, y, feather + 240, h);
    ctx.restore();
  },

  _render() {
    const ctx = this.ctx;
    const W = this.W, H = this.H;
    const shakeX = this.shakeAmount > 0 ? (Math.random() - 0.5) * this.shakeAmount * 2 : 0;
    const shakeY = this.shakeAmount > 0 ? (Math.random() - 0.5) * this.shakeAmount * 2 : 0;
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.translate(shakeX, shakeY);

    const bgTint = ASSETS.bgTint && ASSETS.bgTint[this.stageCfg.bg];
    const arenaTint = ASSETS.bgTint && ASSETS.bgTint[this.stageCfg.arenaBg];
    const hasParallax = this.parallaxLayers && this.parallaxLayers.some(l => this._ready(l.img));
    const hasFarLayer = hasParallax && this._ready(this.parallaxLayers[0]?.img);
    if (!hasParallax || !hasFarLayer) {
      if (this._ready(this.bgImage)) {
        if (bgTint) ctx.filter = bgTint;
        ctx.drawImage(this.bgImage, -this.cameraX * 0.6, 0, 3840, H);
        ctx.drawImage(this.bgImage, -this.cameraX * 0.6 + 3840, 0, 3840, H);
        if (bgTint) ctx.filter = 'none';
      }
    }
    if (hasParallax) {
      if (bgTint) ctx.filter = bgTint;
      this.parallaxLayers.forEach(layer => this._drawTiledLayer(ctx, layer.img, layer.speed));
      if (bgTint) ctx.filter = 'none';
    }
    if (this.bossActive && this.bossArenaImage.complete) {
      this._drawBossArenaBackground(ctx, 4400 - this.cameraX, 0, 1920, H, arenaTint);
    }

    const floorMist = ctx.createLinearGradient(0, this.groundY - 34, 0, this.groundY + 38);
    floorMist.addColorStop(0, 'rgba(20,16,12,0)');
    floorMist.addColorStop(0.52, 'rgba(20,16,12,0.18)');
    floorMist.addColorStop(1, 'rgba(20,16,12,0)');
    ctx.fillStyle = floorMist;
    ctx.fillRect(0, this.groundY - 34, W, 72);

    // 塵土先畫於人物之下
    for (const d of this.dustPuffs) {
      const t = d.life / d.lifeMax;
      ctx.globalAlpha = Math.max(0, t * 0.55);
      ctx.fillStyle = '#a89878';
      ctx.beginPath();
      ctx.arc(d.x - this.cameraX, d.y, d.r * (1 + (1 - t) * 0.4), 0, Math.PI*2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    for (const e of this.enemies) {
      this._drawSprite(e, this.sprites[e.kind], e.hitFlash, this._enemyAnim(e));
      if (e.burnLife > 0) this._drawAura(e, '#f5601a', 0.4);
      if (e.stunLife > 0) this._drawAura(e, '#a060d8', 0.5);
    }
    if (this.boss && this.bossActive) {
      // 預攻警告環：cd<28 時擴張的紅色預警圓
      if (this.boss.warning > 0) {
        const t = 1 - this.boss.warning / 28;
        ctx.globalAlpha = 0.55 * (1 - t * 0.4);
        ctx.strokeStyle = '#ff3050';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(this.boss.x + this.boss.w/2 - this.cameraX, this.boss.y + this.boss.h/2,
                this.boss.w * 0.5 + t * 60, 0, Math.PI*2);
        ctx.stroke();
        ctx.globalAlpha = 1;
        // boss 警告期間打上紅色霧氣 aura
        this._drawAura(this.boss, '#ff3050', 0.18 + t * 0.32);
      }
      this._drawSprite(this.boss, this.sprites[this.boss.kind], this.boss.hitFlash, this._bossAnim(this.boss));
      if (this.boss.burnLife > 0) this._drawAura(this.boss, '#f5601a', 0.4);
      if (this.boss.stunLife > 0) this._drawAura(this.boss, '#a060d8', 0.5);
    }

    for (const pr of this.projectiles) {
      ctx.fillStyle = pr.kind === 'fire' ? '#f5601a' : '#1a1612';
      ctx.beginPath();
      ctx.arc(pr.x - this.cameraX, pr.y, 12, 0, Math.PI*2);
      ctx.fill();
    }

    // 夥伴（畫在玩家之後，但小一些以區隔）
    for (const c of this.companions) {
      if (c.retreat > 0) continue;
      if (!c.img.complete) continue;
      const cx = c.x - this.cameraX + c.w/2;
      const cy = c.y;
      ctx.save();
      ctx.globalAlpha = 0.92;
      // 名字 + HP 條
      const hpRatio = Math.max(0, c.hp / c.hpMax);
      ctx.fillStyle = c.color;
      ctx.fillRect(cx - 22, cy - 10, 44 * hpRatio, 3);
      ctx.strokeStyle = 'rgba(20,16,14,0.7)';
      ctx.lineWidth = 1;
      ctx.strokeRect(cx - 22, cy - 10, 44, 3);
      ctx.font = '11px "Songti TC", serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = c.color;
      ctx.fillText(c.name, cx, cy - 14);
      // 立繪縮圖
      ctx.translate(cx, cy);
      if (c.facing < 0) ctx.scale(-1, 1);
      ctx.drawImage(c.img, -c.w/2, 0, c.w, c.h);
      ctx.restore();
    }

    this._drawSprite(this.player, this.sprites.ruoli, 0, this._playerAnim());

    for (const s of this.swingTrail) this._drawSwingArc(s);

    // 掉落物（在粒子之下、玩家之上）
    for (const d of this.drops) {
      const screenX = d.x - this.cameraX;
      const bob = Math.sin(performance.now() * 0.008) * 3;
      const dropImg = d.kind === 'yaoli' ? this.dropSprites?.yaoli : this.dropSprites?.hp;
      if (this._ready(dropImg)) {
        const size = d.kind === 'yaoli' ? 34 : 32;
        ctx.drawImage(dropImg, screenX - size / 2, d.y + bob - size / 2, size, size);
        continue;
      }
      const c = d.kind === 'yaoli' ? '#54e0c0' : '#f0a060';
      const cInner = d.kind === 'yaoli' ? '#aaf5e0' : '#ffd5a0';
      // 光暈
      ctx.globalAlpha = 0.45;
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(screenX, d.y + bob, 16, 0, Math.PI * 2);
      ctx.fill();
      // 主體
      ctx.globalAlpha = 1;
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(screenX, d.y + bob, 8, 0, Math.PI * 2);
      ctx.fill();
      // 高光
      ctx.fillStyle = cInner;
      ctx.beginPath();
      ctx.arc(screenX - 2, d.y + bob - 2, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    for (const s of this.hitSlashes) {
      const t = s.life / s.lifeMax;
      const len = s.length * (0.65 + (1 - t) * 0.45);
      const nx = Math.cos(s.angle);
      const ny = Math.sin(s.angle);
      ctx.save();
      ctx.translate(s.x - this.cameraX, s.y);
      ctx.rotate(s.angle);
      ctx.globalAlpha = Math.max(0, t);
      const grad = ctx.createLinearGradient(-len * 0.5, 0, len * 0.5, 0);
      grad.addColorStop(0, this._rgbaFromHex(s.color, 0));
      grad.addColorStop(0.45, this._rgbaFromHex(s.color, 0.92));
      grad.addColorStop(0.55, 'rgba(255,248,224,0.95)');
      grad.addColorStop(1, this._rgbaFromHex(s.color, 0));
      ctx.strokeStyle = grad;
      ctx.lineWidth = s.width;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-len * 0.5, 0);
      ctx.lineTo(len * 0.5, 0);
      ctx.stroke();
      ctx.globalAlpha = Math.max(0, t * 0.42);
      ctx.strokeStyle = 'rgba(255,255,255,0.9)';
      ctx.lineWidth = Math.max(2, s.width * 0.32);
      ctx.beginPath();
      ctx.moveTo(-len * 0.32, -ny * 10);
      ctx.lineTo(len * 0.36, nx * 10);
      ctx.stroke();
      ctx.restore();
    }
    ctx.globalAlpha = 1;

    // 衝擊圓環（在火花/粒子之上以求醒目）
    for (const r of this.impactRings) {
      const t = r.life / r.lifeMax;
      ctx.globalAlpha = Math.max(0, t * 0.85);
      ctx.strokeStyle = r.color;
      ctx.lineWidth = 3 + (1 - t) * 4;
      ctx.beginPath();
      ctx.arc(r.x - this.cameraX, r.y, r.r, 0, Math.PI*2);
      ctx.stroke();
      // 內圈白色高光
      ctx.globalAlpha = Math.max(0, t * 0.5);
      ctx.strokeStyle = '#fff8e0';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(r.x - this.cameraX, r.y, r.r * 0.7, 0, Math.PI*2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    for (const pa of this.particles) {
      ctx.globalAlpha = Math.max(0, pa.life / 60);
      ctx.fillStyle = pa.color;
      ctx.beginPath();
      ctx.arc(pa.x - this.cameraX, pa.y, pa.r, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // 連擊計數器（畫面正上方）
    if (this.combo >= 3) {
      const fade = Math.max(0, 1 - this.comboTimer / 120);
      const tier = this.combo >= 30 ? '#f53050' :
                   this.combo >= 20 ? '#f5a030' :
                   this.combo >= 10 ? '#f5d030' : '#f5efde';
      const size = Math.min(76, 36 + Math.log2(this.combo) * 6);
      ctx.save();
      ctx.globalAlpha = fade;
      ctx.font = `bold 18px "Songti TC", "STSong", serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle = tier;
      ctx.fillText('連擊', W * 0.5, 56);
      ctx.font = `bold ${Math.round(size)}px "Songti TC", "STSong", serif`;
      ctx.lineWidth = 4;
      ctx.strokeStyle = 'rgba(20,16,14,0.85)';
      ctx.strokeText(this.combo, W * 0.5, 56 + size);
      ctx.fillStyle = tier;
      ctx.fillText(this.combo, W * 0.5, 56 + size);
      ctx.restore();
    }

    // 夥伴技螢幕閃光
    if (this._screenFlash && this._screenFlash.life > 0) {
      const k = this._screenFlash.life / 30;
      const c = this._screenFlash.color;
      const r = parseInt(c.slice(1,3),16), g=parseInt(c.slice(3,5),16), b=parseInt(c.slice(5,7),16);
      ctx.fillStyle = `rgba(${r},${g},${b},${0.4 * k})`;
      ctx.fillRect(0, 0, W, H);
      this._screenFlash.life -= 1;
      if (this._screenFlash.life <= 0) this._screenFlash = null;
    }

    // 完美閃避：白色 radial overlay
    if (this.slowMo > 0) {
      const k = this.slowMo / 60;
      ctx.save();
      ctx.globalAlpha = k * 0.35;
      const grad = ctx.createRadialGradient(W/2, H/2, H*0.2, W/2, H/2, H*0.8);
      grad.addColorStop(0, 'rgba(248,240,200,0)');
      grad.addColorStop(1, 'rgba(248,240,200,0.6)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }

    // 玩家受擊：螢幕邊緣紅色 vignette
    if (this.playerHitFlash > 0) {
      const a = (this.playerHitFlash / 20) * 0.7;
      const grad = ctx.createRadialGradient(W/2, H/2, H*0.3, W/2, H/2, H*0.7);
      grad.addColorStop(0, 'rgba(255,30,60,0)');
      grad.addColorStop(1, `rgba(255,30,60,${a})`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    }

    for (const d of this.dmgNumbers) {
      const lifeT = d.life / d.lifeMax;
      const alpha = Math.min(1, lifeT * 1.5);
      const size = d.isYaoli ? 36 : 26;
      const color = d.isYaoli ? '#a04030' : '#1a1612';
      ctx.font = `bold ${size}px "Songti TC", "STSong", serif`;
      ctx.textAlign = 'center';
      ctx.lineWidth = 4;
      ctx.strokeStyle = `rgba(245,239,222,${alpha})`;
      ctx.strokeText(d.dmg, d.x - this.cameraX, d.y);
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;
      ctx.fillText(d.dmg, d.x - this.cameraX, d.y);
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  },

  _drawAura(obj, color, alpha) {
    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(obj.x + obj.w/2 - this.cameraX, obj.y + obj.h/2, obj.w*0.7, obj.h*0.55, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  },

  _drawSwingArc(s) {
    const ctx = this.ctx;
    const cx = s.cx - this.cameraX;
    const cy = s.cy;
    const t = 1 - s.life / s.lifeMax;
    const dir = s.facing;
    const startA = dir > 0 ? -Math.PI / 3 : Math.PI - (-Math.PI / 3);
    const endA   = dir > 0 ?  Math.PI / 3 : Math.PI - ( Math.PI / 3);
    const angHead = startA + (endA - startA) * Math.min(1, t * 1.6);
    const widths = s.isYaoli ? [20, 12, 6] : [12, 7, 3];
    const alphas = s.isYaoli ? [0.55, 0.42, 0.32] : [0.5, 0.35, 0.22];
    for (let i = 0; i < widths.length; i++) {
      const a = alphas[i] * (1 - t * 0.4);
      if (a <= 0) continue;
      const c = s.color || '#1a1612';
      ctx.strokeStyle = this._rgbaFromHex(c, a);
      ctx.lineWidth = widths[i];
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(cx, cy, s.reach, startA, angHead, dir < 0);
      ctx.stroke();
    }
    if (t < 0.6) {
      const hx = cx + Math.cos(angHead) * s.reach;
      const hy = cy + Math.sin(angHead) * s.reach;
      ctx.fillStyle = this._rgbaFromHex(s.color || '#1a1612', 0.8 * (1 - t));
      ctx.beginPath();
      ctx.arc(hx, hy, s.isYaoli ? 14 : 8, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  _rgbaFromHex(hex, a) {
    const h = hex.replace('#','');
    const r = parseInt(h.slice(0,2),16);
    const g = parseInt(h.slice(2,4),16);
    const b = parseInt(h.slice(4,6),16);
    return `rgba(${r},${g},${b},${a})`;
  },

  // 玩家動圖：依移動 / 跳躍 / 攻擊 / 翻滾算出 dx/dy/rot 與紅色受擊濾鏡
  _playerAnim() {
    const p = this.player;
    const t = p.animT || performance.now() * 0.06;
    let dx = 0, dy = 0, rot = 0, extraFilter = '', scaleX = 1, scaleY = 1, ghost = 0;
    if (p.rolling > 0) {
      // 翻滾：旋轉 + 上下蹦跳
      const k = 1 - p.rolling / 24;
      rot = p.facing * k * Math.PI * 2;
      dy = -Math.sin(k * Math.PI) * 12;
      scaleX = 1.08; scaleY = 0.94;
      ghost = 2;
      extraFilter = ' brightness(1.08) saturate(1.1)';
    } else if (!p.onGround) {
      // 空中：依垂直速度傾斜
      rot = (p.vy < 0 ? -0.18 : 0.18) * p.facing * 0.7;
      dy = 0;
      scaleX = 0.96; scaleY = 1.04;
    } else if (p.attacking > 0) {
      // 攻擊揮砍前衝
      const k = p.attacking / 18;
      dx = p.facing * (1 - k) * 12;
      rot = -p.facing * k * 0.16;
      scaleX = 1.12; scaleY = 0.92;
      ghost = 3;
    } else if (Math.abs(p.vx) > 0.5) {
      // 走路：四幀式 bob / 伸縮，讓單張立繪有動圖感
      const phase = Math.floor(t / 5) % 4;
      const bob = [0, -4, 0, -2][phase];
      dy = bob;
      rot = [0.02, -0.035, 0.02, 0.035][phase] * p.facing;
      scaleX = [1, 0.96, 1.02, 0.98][phase];
      scaleY = [1, 1.04, 0.98, 1.02][phase];
    } else {
      // 靜止呼吸
      dy = Math.sin(t * 0.12) * 1.2;
      scaleY = 1 + Math.sin(t * 0.08) * 0.012;
    }
    if (this.playerHitFlash > 0) {
      const k = this.playerHitFlash / 20;
      extraFilter += ` brightness(${1 + k * 0.4}) saturate(${1 + k * 0.5}) hue-rotate(${k * -20}deg)`;
      // 受擊抖動
      dx += (Math.random() - 0.5) * k * 6;
      dy += (Math.random() - 0.5) * k * 4;
    }
    return { dx, dy, rot, scaleX, scaleY, extraFilter, ghost };
  },

  _enemyAnim(e) {
    const t = (e.animT || 0) + (e.animSeed || 0);
    let dx = 0, dy = 0, rot = 0, scaleX = 1, scaleY = 1, ghost = 0, extraFilter = '';
    if (e.kind === 'wisp' || e.kind === 'foxfire') {
      dy = Math.sin(t * 0.14 + e.x * 0.01) * 5;
      scaleX = 1 + Math.sin(t * 0.18) * 0.08;
      scaleY = 1 - Math.sin(t * 0.18) * 0.05;
    } else {
      const moving = Math.abs(e.vx || 0) > 0.2;
      const phase = Math.floor(t / (moving ? 7 : 13)) % 4;
      dy = moving ? [0, -3, 0, -2][phase] : Math.sin(t * 0.08) * 1.4;
      rot = moving ? [0.04, -0.04, 0.03, -0.03][phase] * (e.dir || 1) : Math.sin(t * 0.05) * 0.025;
      scaleX = moving ? [1.05, 0.96, 1.04, 0.98][phase] : 1;
      scaleY = moving ? [0.96, 1.04, 0.97, 1.02][phase] : 1;
    }
    if (e.knockback && Math.abs(e.knockback) > 0.5) {
      rot = e.knockback * 0.024;
      scaleX = 1.18;
      scaleY = 0.84;
      ghost = 2;
    }
    if (e.hitShake > 0) {
      const k = e.hitShake / 14;
      dx += (Math.random() - 0.5) * 10 * k;
      dy += (Math.random() - 0.5) * 8 * k;
      extraFilter += ` contrast(${1 + k * 0.25})`;
    }
    return { dx, dy, rot, scaleX, scaleY, ghost, extraFilter };
  },

  _bossAnim(b) {
    const t = performance.now();
    let dx = 0, dy = 0, rot = 0, extraFilter = '', scaleX = 1, scaleY = 1, ghost = 0;
    // 沉重呼吸
    dy = Math.sin(t * 0.003) * 4;
    // 預攻警告：放大 + 色相偏紅
    if (b.warning > 0) {
      const k = 1 - b.warning / 28;
      const scaleK = 1 + k * 0.06;
      // 暫時用 extraFilter 內的 saturate 模擬，scale 透過 rot 處理會干擾，改用偏移與抖動
      dx += (Math.random() - 0.5) * k * 4;
      extraFilter = ` saturate(${1 + k * 0.6}) brightness(${1 + k * 0.15})`;
      // 經由縮放：在 dy 中加負值假裝大一點（真的縮放會用 transform，下方 _drawSprite 我們將支援）
      b._scaleAnim = scaleK;
    } else {
      b._scaleAnim = 1;
    }
    if (b.hitShake > 0) {
      const k = b.hitShake / 16;
      dx += (Math.random() - 0.5) * 12 * k;
      dy += (Math.random() - 0.5) * 8 * k;
      scaleX = 1 + k * 0.05;
      scaleY = 1 - k * 0.04;
      ghost = 1;
    }
    // 攻擊衝刺時傾身
    if (b.attacking > 0) rot = b.dir * 0.08;
    return { dx, dy, rot, scaleX, scaleY, ghost, extraFilter, scale: b._scaleAnim || 1 };
  },

  _drawSprite(obj, img, hitFlash = 0, anim = null) {
    if (!img || !img.complete) {
      this.ctx.fillStyle = '#a04030';
      this.ctx.fillRect(obj.x - this.cameraX, obj.y, obj.w, obj.h);
      return;
    }
    const ctx = this.ctx;
    const dir = obj.facing || obj.dir || 1;
    const flashing = hitFlash && hitFlash > 0;
    const tint = BATTLE_TINT[obj.kind];
    let filter = '';
    if (tint) {
      filter += ` hue-rotate(${tint.hueRotate}deg) saturate(${tint.saturate}) brightness(${tint.brightness})`;
    }
    if (flashing) {
      filter += ` brightness(${1 + hitFlash * 0.22}) saturate(${Math.max(0.3, 1 - hitFlash * 0.08)})`;
    }
    if (anim && anim.extraFilter) filter += anim.extraFilter;
    if (filter) ctx.filter = filter.trim();

    const dx = anim ? (anim.dx || 0) : 0;
    const dy = anim ? (anim.dy || 0) : 0;
    const rot = anim ? (anim.rot || 0) : 0;
    const scale = anim ? (anim.scale || 1) : 1;
    const scaleX = anim ? (anim.scaleX || 1) * scale : scale;
    const scaleY = anim ? (anim.scaleY || 1) * scale : scale;
    const ghost = anim ? (anim.ghost || 0) : 0;

    ctx.save();
    const baseX = obj.x - this.cameraX + obj.w/2;
    const baseY = obj.y + obj.h;
    ctx.translate(baseX + dx, baseY + dy);
    if (rot) ctx.rotate(rot);
    if (scaleX !== 1 || scaleY !== 1) ctx.scale(scaleX, scaleY);
    if (dir < 0) ctx.scale(-1, 1);
    if (ghost > 0) {
      const oldAlpha = ctx.globalAlpha;
      for (let i = ghost; i >= 1; i--) {
        ctx.globalAlpha = oldAlpha * (0.10 + 0.06 * i);
        ctx.drawImage(img, -obj.w/2 - dir * i * 10, -obj.h, obj.w, obj.h);
      }
      ctx.globalAlpha = oldAlpha;
    }
    ctx.drawImage(img, -obj.w/2, -obj.h, obj.w, obj.h);
    ctx.restore();

    if (filter) ctx.filter = 'none';
  },

  _victory() {
    Audio.playSfx('victory');
    Audio.stopBgm();
    Achievements.unlock('first-blood');
    if (this.boss && this._hpAtBossSpawn != null && this.hp >= this._hpAtBossSpawn) {
      Achievements.unlock('no-damage');
    }
    this._endBattle('勝');
  },
  _defeat()  {
    Audio.playSfx('defeat');
    this._endBattle('敗');
  },

  _endBattle(label) {
    if (!this.running) return;
    this.running = false;
    window.removeEventListener('keydown', this._kdHandler);
    window.removeEventListener('keyup',   this._kuHandler);
    this.canvas.removeEventListener('mousedown', this._mdHandler);
    this.canvas.removeEventListener('mouseup',   this._muHandler);
    this.keys = {};
    document.getElementById('partner-hud')?.classList.remove('show');
    const ctx = this.ctx;
    let alpha = 0;
    const fade = () => {
      alpha = Math.min(1, alpha + 0.02);
      ctx.fillStyle = `rgba(26,22,18,${alpha})`;
      ctx.fillRect(0, 0, this.W, this.H);
      ctx.fillStyle = '#f5efde';
      ctx.font = '120px "Songti TC", "STSong", "PMingLiU", "Noto Serif TC", serif';
      ctx.textAlign = 'center';
      ctx.fillText(label, this.W/2, this.H/2);
      if (alpha < 1) requestAnimationFrame(fade);
      else setTimeout(() => {
        // 戰敗：讓玩家重打
        if (label === '敗') {
          // 重啟同關
          const stageId = this._stageId;
          this.init(stageId, this.onComplete);
        } else {
          this.onComplete();
        }
      }, 800);
    };
    fade();
  },
};

function runBattle(stageId, onDone) {
  showScene('battle');
  Battle._stageId = stageId;
  Battle.init(stageId, onDone);
}

// ============================================================
// 13. Menu overlay — 章節選 / 存讀檔 / 設定
// ============================================================
// 章節對應的縮圖背景
const CHAPTER_THUMB = {
  prologue: 'museum',
  chapter1: 'mistVillage',
  chapter2: 'foxfire',
  chapter3: 'southMountain',
  chapter4: 'rift',
  chapter5: 'nuwa',
  chapter6: 'finalArenaBoss',
};

// 章節節點在卷軸地圖上的座標（百分比）— 由序章蜿蜒到終章
const CHAPTER_MAP_POS = [
  { x: 12, y: 78 },  // 序章
  { x: 26, y: 56 },  // ch1 霧村
  { x: 40, y: 36 },  // ch2 青丘
  { x: 54, y: 50 },  // ch3 南山
  { x: 66, y: 24 },  // ch4 不周
  { x: 80, y: 42 },  // ch5 女媧
  { x: 92, y: 70 },  // ch6 終章
];

let _chapterMapMode = 'map'; // 'map' | 'list'
function openChapterMenu() {
  const m = document.getElementById('chapter-menu');
  m.classList.add('show');
  renderChapterMenu();
}

function renderChapterMenu() {
  const list = document.getElementById('chapter-list');
  list.innerHTML = '';
  const save = loadSaveData();
  const maxUnlocked = save ? save.chapterIdx : 0;

  // 切換按鈕
  const toggle = document.createElement('div');
  toggle.className = 'cm-toggle';
  toggle.innerHTML = `
    <button data-cm="map" class="${_chapterMapMode==='map'?'active':''}">卷軸地圖</button>
    <button data-cm="list" class="${_chapterMapMode==='list'?'active':''}">列表</button>`;
  toggle.querySelectorAll('button').forEach(b => {
    b.addEventListener('click', () => { _chapterMapMode = b.dataset.cm; renderChapterMenu(); });
  });
  list.appendChild(toggle);

  if (_chapterMapMode === 'map') {
    const map = document.createElement('div');
    map.className = 'chapter-map';

    // 連線（SVG）
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.classList.add('cm-line');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');
    for (let i = 1; i < CHAPTER_MAP_POS.length; i++) {
      const a = CHAPTER_MAP_POS[i-1], b = CHAPTER_MAP_POS[i];
      const path = document.createElementNS(svgNS, 'path');
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2 - 8;
      path.setAttribute('d', `M${a.x} ${a.y} Q${mx} ${my} ${b.x} ${b.y}`);
      const reachable = i <= maxUnlocked;
      path.setAttribute('stroke', reachable ? 'oklch(42% 0.17 29)' : 'oklch(70% 0.012 60)');
      path.setAttribute('stroke-width', '0.4');
      path.setAttribute('stroke-dasharray', reachable ? '0' : '1.2');
      path.setAttribute('fill', 'none');
      svg.appendChild(path);
    }
    map.appendChild(svg);

    // 節點
    CHAPTERS.forEach((ch, i) => {
      const pos = CHAPTER_MAP_POS[i] || { x: 50, y: 50 };
      const node = document.createElement('button');
      const locked = i > maxUnlocked;
      const completed = save && i < maxUnlocked;
      const current = save && i === maxUnlocked;
      node.className = 'cm-node' + (locked ? ' locked' : '') + (current ? ' current' : '') + (completed ? ' completed' : '');
      node.style.left = pos.x + '%';
      node.style.top = pos.y + '%';
      const label = ch.title.split('·')[0].trim();
      node.innerHTML = `
        <div class="cm-dot">${i === 0 ? '序' : (ch.isFinal ? '終' : i)}</div>
        <div class="cm-label">${ch.title.replace(/^[^·]+·\s*/, '')}</div>`;
      node.disabled = locked;
      node.addEventListener('click', () => {
        if (locked) return;
        document.getElementById('chapter-menu').classList.remove('show');
        State.flags = save && save.flags ? Object.assign({}, save.flags) : {};
        State.unlockedYaoli = save ? (save.unlockedYaoli || ['inkshade']) : ['inkshade'];
        State.currentYaoli = save ? (save.currentYaoli || State.unlockedYaoli[0] || 'inkshade') : 'inkshade';
        State.chapterIdx = i;
        State.scriptIndex = 0;
        State.startTime = Date.now();
        showScene('vn');
        runNext();
      });
      map.appendChild(node);
    });
    list.appendChild(map);
  } else {
    // 列表 view（保留舊版）
    CHAPTERS.forEach((ch, i) => {
      const row = document.createElement('button');
      row.className = 'chapter-row';
      if (i > maxUnlocked) row.classList.add('locked');
      const thumbBg = ASSETS.bg[CHAPTER_THUMB[ch.id]] || ASSETS.bg.chapterCard;
      row.innerHTML =
        `<span class="ch-no">${ch.id === 'prologue' ? '序章' : '第' + i + '章'}</span>` +
        `<span class="ch-title">${ch.title}</span>` +
        `<span class="ch-state">${i > maxUnlocked ? '未解鎖' : (i === 0 ? '可開始' : '可進入')}</span>`;
      row.style.backgroundImage = `linear-gradient(90deg, var(--surface) 50%, oklch(98% 0.008 80 / 0.4)), url("${thumbBg}")`;
      row.style.backgroundSize = 'cover';
      row.style.backgroundPosition = 'center';
      row.disabled = i > maxUnlocked;
      row.addEventListener('click', () => {
        if (i > maxUnlocked) return;
        document.getElementById('chapter-menu').classList.remove('show');
        State.flags = save && save.flags ? Object.assign({}, save.flags) : {};
        State.unlockedYaoli = save ? (save.unlockedYaoli || ['inkshade']) : ['inkshade'];
        State.currentYaoli = save ? (save.currentYaoli || State.unlockedYaoli[0] || 'inkshade') : 'inkshade';
        State.chapterIdx = i;
        State.scriptIndex = 0;
        State.startTime = Date.now();
        showScene('vn');
        runNext();
      });
      list.appendChild(row);
    });
  }
}

function closeChapterMenu() {
  document.getElementById('chapter-menu').classList.remove('show');
}

// ============================================================
// 13.5 多存檔 UI
// ============================================================
let _saveMode = 'load'; // 'save' | 'load'
function openSaveMenu(mode) {
  _saveMode = mode;
  const title = document.getElementById('save-menu-title');
  if (title) title.textContent = mode === 'save' ? '存檔到…' : '讀取存檔';
  const wrap = document.getElementById('save-slots');
  wrap.innerHTML = '';
  for (const slot of SAVE_SLOTS) {
    const data = loadSaveSlot(slot);
    const row = document.createElement('button');
    row.className = 'save-slot' + (data ? '' : ' empty') + (slot === 'auto' ? ' auto' : '');
    const slotLabel = slot === 'auto' ? '自動存檔' : '存檔 ' + slot;
    if (data) {
      const date = new Date(data.ts).toLocaleString('zh-TW', { hour12: false });
      const mins = Math.floor((data.playSeconds || 0) / 60);
      row.innerHTML = `
        <div class="slot-thumb"${data.thumb ? ` style="background-image:url('${data.thumb}')"` : ''}>${data.thumb ? '' : '無預覽'}</div>
        <div class="slot-meta">
          <span class="slot-no">${slotLabel}</span>
          <span class="slot-name">${data.chapterTitle || '未命名'}</span>
          <span class="slot-date">${date} · 已遊玩 ${mins} 分</span>
        </div>`;
    } else {
      row.innerHTML = `
        <div class="slot-thumb">空</div>
        <div class="slot-meta">
          <span class="slot-no">${slotLabel}</span>
          <span class="slot-name">尚無存檔</span>
          <span class="slot-date">${mode === 'save' ? '點擊以存入此槽' : '無法讀取'}</span>
        </div>`;
    }
    if (mode === 'save' && slot === 'auto') {
      // 不允許手動寫入 auto
      row.classList.add('locked');
      row.disabled = true;
    }
    row.addEventListener('click', () => {
      if (mode === 'save' && slot === 'auto') return;
      if (mode === 'load') {
        if (!data) { flashToast('此槽尚無存檔'); return; }
        applySave(data);
        document.getElementById('save-menu').classList.remove('show');
        document.getElementById('sys-menu').classList.remove('show');
        showScene('vn');
        runNext();
      } else {
        if (saveGameToSlot(slot)) flashToast('已存到 ' + slotLabel);
        openSaveMenu('save'); // 重新整理
      }
    });
    wrap.appendChild(row);
  }
  document.getElementById('save-menu').classList.add('show');
}
function closeSaveMenu() { document.getElementById('save-menu').classList.remove('show'); }

// ============================================================
// 13.6 結局/CG/成就 圖鑑
// ============================================================
function openGallery() {
  document.getElementById('gallery-menu').classList.add('show');
  switchGalleryTab('endings');
  document.querySelectorAll('.gallery-tab').forEach(t => {
    t.onclick = () => switchGalleryTab(t.dataset.tab);
  });
}
function closeGallery() { document.getElementById('gallery-menu').classList.remove('show'); }
function switchGalleryTab(tab) {
  document.querySelectorAll('.gallery-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  const c = document.getElementById('gallery-content');
  c.innerHTML = '';
  if (tab === 'endings') {
    const grid = document.createElement('div'); grid.className = 'gallery-grid';
    for (const id of ['home','stay','rewrite','unnamed','default']) {
      const e = ENDINGS[id];
      const seen = id === 'default'
        ? (Achievements.unlocked['ending-home'] || Achievements.unlocked['ending-stay'] || Achievements.unlocked['ending-write'])
        : id === 'unnamed' ? Achievements.unlocked['ending-none']
        : Achievements.unlocked['ending-' + (id === 'rewrite' ? 'write' : id)];
      const card = document.createElement('div');
      card.className = 'gallery-card' + (seen ? '' : ' locked');
      const thumb = ASSETS.bg[e.bg] || ASSETS.bg.chapterCard;
      card.innerHTML = `
        <div class="gc-thumb" style="background-image:url('${thumb}'); ${e.bgFilter ? 'filter:' + e.bgFilter : ''}"></div>
        <div class="gc-meta">
          <div class="gc-title">${seen ? e.title : '???'}</div>
          <div class="gc-sub">${seen ? e.eyebrow : '結局未解鎖'}</div>
        </div>`;
      if (seen) card.addEventListener('click', () => { State.flags.ending = id; runEnding(); });
      grid.appendChild(card);
    }
    c.appendChild(grid);
  } else if (tab === 'cg') {
    const grid = document.createElement('div'); grid.className = 'gallery-grid';
    // Opening CG
    const op = document.createElement('div');
    op.className = 'gallery-card';
    op.innerHTML = `
      <div class="gc-thumb" style="background-image:url('${ASSETS.bg.yaojingScroll}'); filter:brightness(0.72) saturate(0.95)"></div>
      <div class="gc-meta">
        <div class="gc-title">序章 · 30 秒開場</div>
        <div class="gc-sub">墨染現世 · 主角墜入妖境</div>
      </div>`;
    op.addEventListener('click', () => {
      closeGallery();
      runOpeningCG(() => showScene('title'));
    });
    grid.appendChild(op);
    c.appendChild(grid);
  } else if (tab === 'achievements') {
    const list = document.createElement('div'); list.className = 'achievement-list';
    for (const a of ACHIEVEMENTS) {
      const got = !!Achievements.unlocked[a.id];
      const row = document.createElement('div');
      row.className = 'achievement-row' + (got ? '' : ' locked');
      row.innerHTML = `
        <div class="ach-icon">${a.icon}</div>
        <div>
          <div class="ach-name">${got ? a.name : '???'}</div>
          <div class="ach-desc">${got ? a.desc : '尚未解鎖'}</div>
        </div>`;
      list.appendChild(row);
    }
    c.appendChild(list);
  }
}

// ============================================================
// 14. Endings
// ============================================================
const ENDINGS = {
  home: {
    eyebrow:'結局 · 歸途 · A',
    title:'回到現代',
    text:'封印補上的那一刻，林若璃站在博物館的展廳前。卷軸已乾，墨色不再呼吸。她回頭看了看，沒有人，只有夜晚的腳步聲。但她知道——白綾、玄澈、赤羽、女媧——他們都還在那裡，那一頁，從未合上。',
    bg: 'modernHome',
    bgFilter: 'brightness(0.72) saturate(1.05)',
    char: 'mother',
    mood: 'normal',
  },
  stay: {
    eyebrow:'結局 · 留守 · B',
    title:'妖境守卷人',
    text:'她沒有回去。她接過玄澈的卷軸，把自己的名字寫在最末行——「林若璃，第七代守卷人」。狐火在身邊燒著，赤羽在天邊飛著，殘夢仍在最深處等著。她的故事，從這裡才真正開始。',
    bg: 'mistVillage',
    bgFilter: 'brightness(0.55) saturate(0.95) hue-rotate(-10deg)',
  },
  rewrite: {
    eyebrow:'結局 · 第三條路 · C',
    title:'重寫山海經',
    text:'她舉起墨筆，把整冊《山海經》從頭重寫。這次不是封印，不是補天——而是讓妖境與人間，重新成為一個世界。風羽、青焰、月華、靈縛、墨影——五道光合而為一，自她身邊散開。新的故事，由她，也由你，繼續寫下去。',
    bg: 'chapterCard',
    bgFilter: 'brightness(0.55) saturate(1.1)',
  },
  unnamed: {
    eyebrow:'隱藏結局 · 無名 · D',
    title:'劃去名字的人',
    text:'她沒有補天石、沒有重寫山海，也沒有回到現代。她舉起墨筆，在卷軸最末行寫上自己的名字——再用同一支筆把它劃掉。從此妖境少了一個外鄉客；從此人間少了一個學生。她去哪裡了？沒有人知道。連她自己都不再記得。',
    bg: 'endingUnnamed',
    bgFilter: 'brightness(0.32) saturate(0.6) contrast(1.1)',
  },
  default: {
    eyebrow:'結局',
    title:'未竟之頁',
    text:'故事到這裡，停了一拍。墨色暈開，卷軸合上。也許下次翻開時，會是另一條路。',
    bg: 'chapterCard',
    bgFilter: 'brightness(0.4) saturate(0.7)',
  },
};

function pickEnding() {
  const f = State.flags;
  if (f.ending === 'home')    return 'home';
  if (f.ending === 'stay')    return 'stay';
  if (f.ending === 'rewrite') return 'rewrite';
  if (f.ending === 'unnamed') return 'unnamed';
  return 'default';
}

function runEnding() {
  const id = pickEnding();
  const e = ENDINGS[id];
  // 解鎖結局成就
  if (id === 'home')    Achievements.unlock('ending-home');
  if (id === 'stay')    Achievements.unlock('ending-stay');
  if (id === 'rewrite') Achievements.unlock('ending-write');
  if (id === 'unnamed') Achievements.unlock('ending-none');
  Achievements.check();
  // G 包：解鎖 NG+
  NGPlus.onEndingReached();
  flashToast(`第 ${NGPlus.cycle} 週目通關 · NG+ 解鎖`);
  showScene('ending');
  document.getElementById('ending-eyebrow').textContent = e.eyebrow;
  document.getElementById('ending-title').textContent = e.title;
  document.getElementById('ending-text').textContent = e.text;
  // 結局背景：依結局取用對應的手繪 PNG，加上專屬色調
  const bgEl = document.querySelector('#scene-ending .ending-bg');
  if (bgEl) {
    bgEl.style.backgroundImage = `url("${ASSETS.bg[e.bg]}")`;
    bgEl.style.filter = e.bgFilter || 'none';
  }
  const charEl = document.getElementById('ending-character');
  if (charEl) {
    if (e.char && ASSETS.char[e.char]) {
      charEl.onerror = () => {
        charEl.onerror = null;
        charEl.src = VN.baseCharImg(e.char, e.mood || 'normal');
      };
      charEl.src = VN.charImg(e.char, e.mood || 'normal');
      charEl.classList.add('show');
    } else {
      charEl.removeAttribute('src');
      charEl.classList.remove('show');
    }
  }
  document.getElementById('ending-end').onclick = () => {
    showScene('title');
    refreshTitleButtons();
  };
}

// ============================================================
// 15. 啟動 / 事件繫結
// ============================================================
function refreshTitleButtons() {
  const cont = document.querySelector('[data-action="continue"]');
  const save = loadSaveData();
  if (cont) cont.style.display = save ? '' : 'none';
  const ng = document.getElementById('btn-ngplus');
  if (ng) {
    ng.style.display = NGPlus.unlocked ? '' : 'none';
    ng.textContent = NGPlus.cycle > 0 ? `NG+ 第 ${NGPlus.cycle + 1} 週目` : 'NG+ 二週目';
  }
  // 標題副標也加 cycle 顯示
  const meta = document.querySelector('.title-meta');
  if (meta && NGPlus.cycle > 0) {
    meta.textContent = `完整版 · Full Build · 已通關 ${NGPlus.cycle} 週目`;
  }
}

function startGame() {
  State.flags = {};
  State.scriptIndex = 0;
  State.chapterIdx = 0;
  State.unlockedYaoli = ['inkshade'];
  State.currentYaoli = 'inkshade';
  State.startTime = Date.now();
  Inventory.items = INITIAL_ITEMS.slice();
  Inventory.save();
  showScene('vn');
  runNext();
}

function continueGame() {
  const save = loadSaveData();
  if (!save) { startGame(); return; }
  applySave(save);
  showScene('vn');
  runNext();
}

document.addEventListener('click', (e) => {
  const action = e.target.dataset && e.target.dataset.action;
  if (!action) return;
  if (action === 'start')         { State.startTime = Date.now(); NGPlus.active = false; startGame(); }
  else if (action === 'continue') { State.startTime = Date.now(); continueGame(); }
  else if (action === 'ng-plus')  {
    if (!NGPlus.startCycle()) { flashToast('NG+ 尚未解鎖'); return; }
    Achievements.unlock('ng-plus');
    showScene('vn');
    runNext();
    flashToast(`已開啟第 ${NGPlus.cycle + 1} 週目，妖力與道具保留`);
  }
  else if (action === 'chapter-select') openChapterMenu();
  else if (action === 'close-chapter-menu') closeChapterMenu();
  else if (action === 'skip-to-battle') {
    State.flags = { closer:false, trustBailing:0 };
    State.unlockedYaoli = ['inkshade'];
    State.currentYaoli = 'inkshade';
    State.chapterIdx = 1;
    State.scriptIndex = 0;
    showScene('battle');
    Battle._stageId = 'mist';
    Battle.init('mist', () => {
      let i = 0;
      const script = getCurrentScript();
      for (; i < script.length; i++) {
        const b = script[i];
        if (b.type === 'bg' && b.id === 'bambooForest') break;
      }
      State.scriptIndex = i;
      showScene('vn');
      runNext();
    });
  }
  else if (action === 'skip-cg') { /* handled in runOpeningCG */ }
  else if (action === 'back-to-title') {
    document.getElementById('sys-menu')?.classList.remove('show');
    showScene('title'); refreshTitleButtons();
  }
  else if (action === 'open-menu') {
    document.getElementById('sys-menu').classList.toggle('show');
  }
  else if (action === 'close-menu') {
    document.getElementById('sys-menu').classList.remove('show');
  }
  // 新增 actions
  else if (action === 'open-save')    { Settings.applyToUI(); openSaveMenu('save'); }
  else if (action === 'open-load')    { openSaveMenu('load'); }
  else if (action === 'close-save')   { closeSaveMenu(); }
  else if (action === 'open-settings'){ Settings.applyToUI(); document.getElementById('settings-menu').classList.add('show'); }
  else if (action === 'close-settings'){ document.getElementById('settings-menu').classList.remove('show'); }
  else if (action === 'reset-settings'){ Settings.reset(); }
  else if (action === 'open-backlog') { Backlog.open(); }
  else if (action === 'close-backlog'){ Backlog.close(); }
  else if (action === 'open-gallery') { openGallery(); }
  else if (action === 'close-gallery'){ closeGallery(); }
  else if (action === 'open-glossary'){ Glossary.open(); }
  else if (action === 'close-glossary'){ document.getElementById('glossary-menu').classList.remove('show'); }
  else if (action === 'open-inventory'){ document.getElementById('sys-menu').classList.remove('show'); Inventory.open(); }
  else if (action === 'close-inventory'){ Inventory.close(); }
  else if (action === 'close-tutorial'){ document.getElementById('battle-tutorial').classList.remove('show'); }
  else if (action === 'toggle-auto')  { VNMode.toggleAuto(); }
  else if (action === 'toggle-skip')  { VNMode.toggleSkip(); }
});

document.getElementById('dialog-frame').addEventListener('click', () => {
  if (VN._pendingNext) {
    if (VN.isTyping) { VN.finishTyping(); return; }
    const cb = VN._pendingNext; VN._pendingNext = null;
    VN.hideDialog();
    cb();
  }
});

// VN 場景：點任何位置都推進對話（除 button / overlay / 已開的選單）
document.getElementById('scene-vn').addEventListener('click', (e) => {
  if (State.scene !== 'vn') return;
  // 避開：button / 連結 / 互動點 / 已開選單
  if (e.target.closest('button, a, .explore-hotspot, .overlay-menu, .sys-menu, .chapter-menu, .yaoli-hud, .partner-hud, .sys-buttons')) return;
  // 已展示選項時不推進
  if (document.getElementById('choices').classList.contains('show')) return;
  if (VN._pendingNext) {
    if (VN.isTyping) { VN.finishTyping(); return; }
    const cb = VN._pendingNext; VN._pendingNext = null;
    VN.hideDialog();
    cb();
  }
});

window.addEventListener('keydown', (e) => {
  // 全域：Esc 開關系統選單
  if (e.code === 'Escape') {
    // 優先關閉任一 overlay
    for (const id of ['battle-tutorial','glossary-menu','gallery-menu','backlog-menu','save-menu','settings-menu','chapter-menu']) {
      const el = document.getElementById(id);
      if (el && el.classList.contains('show')) { el.classList.remove('show'); return; }
    }
    document.getElementById('sys-menu').classList.toggle('show');
    return;
  }
  if (State.scene !== 'vn') return;
  if (e.code === 'Space' || e.code === 'Enter') {
    if (VN._pendingNext) {
      if (VN.isTyping) { VN.finishTyping(); return; }
      const cb = VN._pendingNext; VN._pendingNext = null;
      VN.hideDialog();
      cb();
    }
  } else if (e.code === 'ArrowUp' || e.code === 'KeyH') {
    Backlog.open();
  } else if (e.code === 'KeyA' && e.ctrlKey === false && e.altKey === false) {
    VNMode.toggleAuto();
  } else if (e.code === 'KeyS' && e.ctrlKey === false && e.altKey === false) {
    VNMode.toggleSkip();
  }
});

let _toastTimer = null;
function flashToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => t.classList.remove('show'), 1600);
}

// ============================================================
// 16. 觸控搖桿（mobile）
// ============================================================
function initTouchPad() {
  const stick = document.getElementById('vpad-stick');
  const knob = document.getElementById('vpad-knob');
  if (!stick) return;
  let active = false, startX = 0, startY = 0;
  const dispatchKey = (code, down) => {
    if (Battle && Battle.keys) Battle.keys[code] = !!down;
  };
  let prevDir = { l:false, r:false };
  stick.addEventListener('pointerdown', (e) => {
    active = true;
    const rect = stick.getBoundingClientRect();
    startX = rect.left + rect.width/2; startY = rect.top + rect.height/2;
    stick.setPointerCapture(e.pointerId);
  });
  stick.addEventListener('pointermove', (e) => {
    if (!active) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const len = Math.min(Math.hypot(dx, dy), 50);
    const angle = Math.atan2(dy, dx);
    knob.style.left = (50 + Math.cos(angle) * len) + '%';
    knob.style.top  = (50 + Math.sin(angle) * len) + '%';
    knob.style.transform = 'translate(-50%,-50%)';
    const left = dx < -16, right = dx > 16, up = dy < -20;
    if (left !== prevDir.l)  { dispatchKey('ArrowLeft',  left);  prevDir.l = left; }
    if (right !== prevDir.r) { dispatchKey('ArrowRight', right); prevDir.r = right; }
    if (up) dispatchKey('Space', true); // 按住搖桿往上 = 跳
    else dispatchKey('Space', false);
  });
  const release = () => {
    if (!active) return;
    active = false;
    knob.style.left = '50%'; knob.style.top = '50%';
    dispatchKey('ArrowLeft', false); dispatchKey('ArrowRight', false); dispatchKey('Space', false);
    prevDir = { l:false, r:false };
  };
  stick.addEventListener('pointerup', release);
  stick.addEventListener('pointercancel', release);
  stick.addEventListener('pointerleave', release);

  document.querySelectorAll('.vpad-btn').forEach(btn => {
    const code = btn.dataset.vkey;
    const down = (e) => { e.preventDefault(); dispatchKey(code, true); };
    const up = (e) => { e.preventDefault(); dispatchKey(code, false); };
    btn.addEventListener('pointerdown', down);
    btn.addEventListener('pointerup', up);
    btn.addEventListener('pointerleave', up);
    btn.addEventListener('pointercancel', up);
  });
}

function initOptionalTouchArt() {
  const artByKey = {
    Space: ASSETS.ui.touch.jump,
    KeyZ: ASSETS.ui.touch.attack,
    KeyX: ASSETS.ui.touch.roll,
    KeyC: ASSETS.ui.touch.yaoli,
  };
  document.querySelectorAll('.vpad-btn').forEach(btn => {
    const src = artByKey[btn.dataset.vkey];
    if (!src) return;
    const img = new Image();
    img.onload = () => {
      btn.style.backgroundImage = `url("${src}")`;
      btn.classList.add('has-art');
    };
    img.src = src;
  });
}

// 全域錯誤捕捉：用 toast 提示，但不阻擋遊戲繼續跑
window.addEventListener('error', (e) => {
  if (e && e.error) {
    flashToast('遊戲錯誤：' + (e.message || 'unknown').slice(0, 80));
    console.error('[Yaojingshuo error]', e.error);
  }
});
window.addEventListener('unhandledrejection', (e) => {
  flashToast('Promise 錯誤：' + ((e.reason && e.reason.message) || e.reason || '').toString().slice(0, 80));
  console.error('[Yaojingshuo promise rejection]', e.reason);
});

const PRELOAD_MAX_CONCURRENT = 6;

function isAudioAsset(url) {
  return /\.(wav|mp3|ogg|m4a)(\?|$)/i.test(url);
}

function collectPreloadAssets(options = {}) {
  const includeAudio = options.includeAudio === true;
  const seen = new Set();
  const add = (value) => {
    if (typeof value !== 'string') return;
    const url = value.trim();
    if (!includeAudio && isAudioAsset(url)) return;
    if (url.startsWith('assets/')) seen.add(url);
  };
  const walk = (value) => {
    if (!value) return;
    if (typeof value === 'string') { add(value); return; }
    if (Array.isArray(value)) { value.forEach(walk); return; }
    if (typeof value === 'object') Object.values(value).forEach(walk);
  };

  walk(ASSETS);
  walk(YAOLI);
  if (includeAudio) {
    walk(AUDIO_BGM);
    walk(AUDIO_SFX);
  }

  document.querySelectorAll('[src]').forEach(el => add(el.getAttribute('src')));

  const cssUrlRe = /url\(["']?(assets\/[^"')]+)["']?\)/g;
  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules || []) {
        let match;
        while ((match = cssUrlRe.exec(rule.cssText || ''))) add(match[1]);
      }
    } catch (_) {
      // Cross-origin or not-yet-readable stylesheets are ignored; game constants cover shipped assets.
    }
  }

  return [...seen];
}

function setLoadingProgress(done, total, detailText) {
  const percent = total > 0 ? Math.round((done / total) * 100) : 100;
  const fill = document.getElementById('loading-bar-fill');
  const percentEl = document.getElementById('loading-percent');
  const detail = document.getElementById('loading-detail');
  if (fill) fill.style.width = `${Math.min(100, Math.max(0, percent))}%`;
  if (percentEl) percentEl.textContent = `${percent}%`;
  if (detail) detail.textContent = detailText || `載入資產 ${done}/${total}`;
}

function preloadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = async () => {
      try {
        if (img.decode) await img.decode();
      } catch (_) {}
      resolve();
    };
    img.onerror = () => reject(new Error(`image failed: ${url}`));
    img.src = url;
  });
}

function preloadAudioElement(url) {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    let settled = false;
    const finish = (ok) => {
      if (settled) return;
      settled = true;
      audio.removeAttribute('src');
      audio.load();
      ok ? resolve() : reject(new Error(`audio failed: ${url}`));
    };
    audio.preload = 'auto';
    audio.oncanplaythrough = () => finish(true);
    audio.onloadeddata = () => finish(true);
    audio.onerror = () => finish(false);
    window.setTimeout(() => finish(true), 3500);
    audio.src = url;
    audio.load();
  });
}

async function preloadFetch(url) {
  if (!window.fetch || window.location.protocol === 'file:') {
    return preloadAudioElement(url);
  }
  const response = await fetch(url, { cache: 'force-cache' });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  if (response.body && response.body.getReader) {
    const reader = response.body.getReader();
    for (;;) {
      const { done } = await reader.read();
      if (done) break;
    }
  } else {
    await response.blob();
  }
}

async function preloadOneAsset(url) {
  try {
    const cleanUrl = url.split('?')[0].toLowerCase();
    if (/\.(png|jpg|jpeg|webp|gif)$/.test(cleanUrl)) {
      await preloadImage(url);
    } else if (/\.(wav|mp3|ogg|m4a)$/.test(cleanUrl)) {
      await preloadFetch(url);
    } else {
      await preloadFetch(url);
    }
    return { ok: true, url };
  } catch (error) {
    return { ok: false, url, error };
  }
}

async function preloadGameAssets() {
  const assets = collectPreloadAssets({ includeAudio: false });
  if (!assets.length) {
    setLoadingProgress(1, 1, '載入完成');
    return;
  }

  let next = 0;
  let done = 0;
  const failures = [];
  setLoadingProgress(0, assets.length, `載入圖像 0/${assets.length}`);

  async function worker() {
    while (next < assets.length) {
      const url = assets[next++];
      const result = await preloadOneAsset(url);
      done++;
      if (!result.ok) failures.push(result);
      const detail = done >= assets.length
        ? (failures.length ? `部分圖像稍後補載 ${failures.length}/${assets.length}` : '載入完成')
        : `載入圖像 ${done}/${assets.length}`;
      setLoadingProgress(done, assets.length, detail);
    }
  }

  await Promise.all(Array.from(
    { length: Math.min(PRELOAD_MAX_CONCURRENT, assets.length) },
    () => worker()
  ));
  if (failures.length) console.warn('[preload] Some assets were not warmed before boot:', failures);
  await new Promise(resolve => window.setTimeout(resolve, 250));
}

function warmAudioAssets() {
  const assets = collectPreloadAssets({ includeAudio: true }).filter(isAudioAsset);
  let next = 0;
  async function worker() {
    while (next < assets.length) {
      const url = assets[next++];
      await preloadOneAsset(url);
    }
  }
  Promise.all(Array.from({ length: Math.min(2, assets.length) }, () => worker()))
    .catch(error => console.warn('[preload] Audio cache warmup skipped:', error));
}

function finishLoadingScreen() {
  const screen = document.getElementById('loading-screen');
  window.requestAnimationFrame(() => {
    document.body.classList.remove('is-preloading');
    if (screen) window.setTimeout(() => screen.remove(), 600);
  });
}

// ============================================================
// 17. 啟動
// ============================================================
let didBootGame = false;

function bootGame() {
  if (didBootGame) return;
  didBootGame = true;

  Settings.load();
  Settings.bind();
  Settings.applyToUI();
  Achievements.load();
  Glossary.load();
  Inventory.load();
  NGPlus.load();
  VN.init();
  initTouchPad();
  initOptionalTouchArt();
  applyI18nDOM();
  refreshTitleButtons();
  showScene('title');

  // 進入新章節時自動存到 auto 槽
  const _origOnChapterComplete = onChapterComplete;
  onChapterComplete = function() {
    saveGameToSlot('auto');
    _origOnChapterComplete();
  };

  // 嘗試解鎖瀏覽器的自動播放（首次互動時）
  const _unlockAudio = () => {
    Audio.unlock();
    document.removeEventListener('click', _unlockAudio);
    document.removeEventListener('keydown', _unlockAudio);
  };
  document.addEventListener('click', _unlockAudio, { once: true });
  document.addEventListener('keydown', _unlockAudio, { once: true });
  finishLoadingScreen();
  warmAudioAssets();
}

preloadGameAssets()
  .then(bootGame)
  .catch(error => {
    console.warn('[preload] Booting after preload error:', error);
    setLoadingProgress(1, 1, '載入完成');
    bootGame();
  });
