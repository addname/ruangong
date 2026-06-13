/**
 * 软工定律交互脚本 (script.js - Claude 风格弹窗版)
 * 适配卡片网格布局，实现大卡片今日推荐、定律卡片动态生成、温润 Modal 弹窗开闭与模拟提交。
 */

document.addEventListener("DOMContentLoaded", () => {
  // 数据源校验
  if (typeof LAWS_DATA === "undefined") {
    console.error("定律数据未加载成功，请检查 laws.js 是否正确引入。");
    return;
  }

  // DOM 节点缓存
  const header = document.querySelector("header");
  const lawsGrid = document.getElementById("laws-grid");
  const searchInput = document.getElementById("search-input");
  const tabButtons = document.querySelectorAll(".tab-btn");
  
  // 今日推荐 DOM 节点
  const recommendTitle = document.getElementById("recommend-title");
  const recommendDesc = document.getElementById("recommend-desc");
  const btnRecommendDetail = document.getElementById("btn-recommend-detail");
  
  // 贡献表单 DOM 节点
  const contributeForm = document.getElementById("contribute-form");
  const formSuccessState = document.getElementById("form-success-state");
  const btnResetForm = document.getElementById("btn-reset-form");
  
  // 移动端菜单
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  const CATEGORY_ACCENTS = {
    architecture: "#295b8f",
    management: "#a6731e",
    quality: "#32733c",
    culture: "#ac4b37",
    scale: "#7b4f8d",
    design: "#2d787f",
    decisions: "#5c6370"
  };

  const LAW_VISUALS = {
    "conways-law": { motif: "network", mark: "org", title: "组织结构映射系统结构" },
    "brooks-law": { motif: "people", mark: "+n", title: "新增人手带来沟通成本" },
    "goodharts-law": { motif: "target", mark: "KPI", title: "指标变目标后失真" },
    "broken-windows": { motif: "window", mark: "crack", title: "小破损会扩散成腐烂" },
    "parkinsons-law": { motif: "clock", mark: "∞", title: "工作膨胀占满时间" },
    "hofstadters-law": { motif: "spiral", mark: "T+?", title: "估时总会递归变长" },
    "occams-razor": { motif: "razor", mark: "cut", title: "削去不必要复杂度" },
    "linuss-law": { motif: "eyes", mark: "bugs", title: "足够多审查能暴露缺陷" },
    "pareto-principle": { motif: "ratio", mark: "80/20", title: "少数原因贡献多数结果" },
    "postels-law": { motif: "gateway", mark: "in/out", title: "输出严谨，输入宽容" },
    "hawthorne-effect": { motif: "spotlight", mark: "watch", title: "被关注会改变行为" },
    "wirths-law": { motif: "speed", mark: "slow", title: "软件膨胀吞掉硬件红利" },
    "premature-optimization": { motif: "target", mark: "3%", title: "先测量，再优化" },
    "hyrums-law": { motif: "api", mark: "API", title: "可观测行为都会被依赖" },
    "boy-scout-rule": { motif: "flag", mark: "clean", title: "离开营地时让代码更干净" },
    "yagni": { motif: "lock", mark: "later", title: "不要提前实现未知需求" },
    "galls-law": { motif: "blocks", mark: "simple", title: "复杂系统从简单系统演化" },
    "law-of-leaky-abstractions": { motif: "leak", mark: "abs", title: "抽象层终会泄露细节" },
    "teslers-law": { motif: "balance", mark: "C", title: "复杂度不会凭空消失" },
    "cap-theorem": { motif: "triangle", mark: "CAP", title: "一致性、可用性与分区容忍的取舍" },
    "second-system-effect": { motif: "bloated-system", mark: "v2", title: "第二个系统容易过度设计并膨胀" },
    "fallacies-of-distributed-computing": { motif: "cloud", mark: "net", title: "分布式环境没有想象中可靠" },
    "law-of-unintended-consequences": { motif: "ripple", mark: "?", title: "改动会产生意外连锁反应" },
    "zawinskis-law": { motif: "mail", mark: "@", title: "软件会扩张到收发邮件" },
    "dunbars-number": { motif: "people", mark: "150", title: "稳定协作关系存在规模上限" },
    "ringelmann-effect": { motif: "rope", mark: "-%", title: "群体变大后个体投入下降" },
    "prices-law": { motif: "pyramid", mark: "√n", title: "少数人贡献大部分成果" },
    "putts-law": { motif: "ladder", mark: "mgr", title: "技术与管理层级的错配" },
    "peter-principle": { motif: "stairs", mark: "ceil", title: "晋升到不能胜任的位置" },
    "bus-factor": { motif: "bus", mark: "1?", title: "关键知识集中带来风险" },
    "dilbert-principle": { motif: "maze", mark: "boss", title: "组织把低效推向管理层" },
    "ninety-ninety-rule": { motif: "progress", mark: "90+90", title: "最后 10% 也可能耗掉 90% 时间" },
    "gilbs-law": { motif: "magnifier", mark: "ask", title: "模糊问题需要先澄清" },
    "murphys-law": { motif: "alert", mark: "!", title: "可能出错的地方终会出错" },
    "technical-debt": { motif: "debt", mark: "$", title: "欠下的捷径会产生利息" },
    "kernighans-law": { motif: "debug", mark: "2x", title: "调试比编写更难" },
    "testing-pyramid": { motif: "pyramid", mark: "test", title: "测试层级应该稳固分布" },
    "pesticide-paradox": { motif: "spray", mark: "resist", title: "固定测试会失去发现力" },
    "lehmans-laws": { motif: "cycle", mark: "evolve", title: "软件必须持续演化" },
    "sturgeons-law": { motif: "filter", mark: "10%", title: "大部分产物质量普通" },
    "amdahls-law": { motif: "parallel", mark: "max", title: "串行瓶颈限制并行收益" },
    "gustafsons-law": { motif: "expand", mark: "scale", title: "扩大问题规模释放并行价值" },
    "metcalfes-law": { motif: "mesh", mark: "n²", title: "网络价值随连接数增长" },
    "dry-principle": { motif: "duplicate", mark: "DRY", title: "避免重复表达同一知识" },
    "kiss-principle": { motif: "line", mark: "KISS", title: "保持简单直接" },
    "solid-principles": { motif: "pillars", mark: "SOLID", title: "面向对象设计的五根支柱" },
    "law-of-demeter": { motif: "neighbor", mark: "1-hop", title: "只与直接朋友通信" },
    "principle-of-least-astonishment": { motif: "spark", mark: "aha", title: "行为应符合直觉" },
    "dunning-kruger-effect": { motif: "curve", mark: "conf", title: "能力低时容易高估自己" },
    "hanlons-razor": { motif: "razor", mark: "kind", title: "优先假设疏忽而非恶意" },
    "sunk-cost-fallacy": { motif: "anchor", mark: "cost", title: "不要被既有投入绑住" },
    "map-is-not-the-territory": { motif: "map", mark: "≠", title: "模型不等于真实世界" },
    "confirmation-bias": { motif: "lens", mark: "yes", title: "人会偏爱支持己见的信息" },
    "hype-cycle-amaras-law": { motif: "wave", mark: "hype", title: "短期高估，长期低估" },
    "lindy-effect": { motif: "hourglass", mark: "age", title: "经得起时间的更可能继续存在" },
    "first-principles-thinking": { motif: "atom", mark: "root", title: "回到基本事实推导" },
    "inversion": { motif: "invert", mark: "flip", title: "反过来思考风险与目标" },
    "cunninghams-law": { motif: "comment", mark: "wrong", title: "错误答案会激发纠正" }
  };

  // 当前检索状态
  let currentCategory = "all";
  let searchQuery = "";
  let recommendedLaw = null;

  // 初始化入口
  init();

  function init() {
    setupScrollHeader();
    setupRecommendation();
    renderLaws();
    setupFilterSearch();
    setupContributeForm();
    setupMobileMenu();
  }

  // 1. 顶部导航随滚动变化样式 (加深极轻微的阴影)
  function setupScrollHeader() {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 20) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
  }

  // 2. 根据日期哈希选出“今日定律”
  function setupRecommendation() {
    if (LAWS_DATA.length === 0) return;
    
    // 用当前公历年份+月份+日期作哈希，保证同一天所有人看到同一条定律
    const today = new Date();
    const dateStr = `${today.getFullYear()}${today.getMonth() + 1}${today.getDate()}`;
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
      hash = dateStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % LAWS_DATA.length;
    recommendedLaw = LAWS_DATA[index];

    // 填充今日推荐 DOM
    recommendTitle.textContent = recommendedLaw.name;
    recommendDesc.textContent = recommendedLaw.summary;
    renderRecommendationVisual(recommendedLaw);

    btnRecommendDetail.addEventListener("click", () => {
      window.location.href = `detail.html?id=${recommendedLaw.id}`;
    });
  }

  function renderRecommendationVisual(law) {
    const recommendBlock = document.getElementById("today-recommend-block");
    if (!recommendBlock) return;

    let visual = recommendBlock.querySelector(".recommend-visual");
    if (!visual) {
      visual = document.createElement("div");
      visual.className = "recommend-visual";
      recommendBlock.prepend(visual);
    }

    visual.style.setProperty("--law-accent", getLawAccent(law));
    visual.innerHTML = renderLawVisual(law, "recommend");
  }

  // 3. 动态渲染定律卡片网格
  function renderLaws() {
    lawsGrid.innerHTML = "";

    // 过滤数据
    const filteredLaws = LAWS_DATA.filter(law => {
      const matchesCategory = currentCategory === "all" || law.category === currentCategory;
      const searchTarget = `${law.name} ${law.englishName} ${law.summary} ${law.desc}`.toLowerCase();
      const matchesSearch = searchTarget.includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });

    if (filteredLaws.length === 0) {
      // 渲染空状态
      lawsGrid.innerHTML = `
        <div class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h4>未检索到相关的定律</h4>
          <p>请尝试更换检索关键词或选择其他分类。</p>
        </div>
      `;
      return;
    }

    filteredLaws.forEach(law => {
      const card = document.createElement("div");
      card.className = `law-card cat-${law.category}`;
      card.setAttribute("data-id", law.id);
      card.style.setProperty("--law-accent", getLawAccent(law));
      
      // 卡片内部 HTML
      card.innerHTML = `
        <div class="card-top">
          <div class="card-header-meta">
            <span class="card-id">${law.categoryName}</span>
          </div>
          <div class="card-title-row">
            ${renderLawVisual(law, "card")}
            <div class="card-title-copy">
              <h3>${law.name}</h3>
              <div class="english-title">${law.englishName}</div>
            </div>
          </div>
          <p class="summary-text">${law.summary}</p>
        </div>
        <div class="card-footer">
          <span class="read-more">
            深入阅读
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      `;

      // 点击跳转到详情页
      card.addEventListener("click", () => {
        window.location.href = `detail.html?id=${law.id}`;
      });

      lawsGrid.appendChild(card);
    });
  }

  function getLawAccent(law) {
    return CATEGORY_ACCENTS[law.category] || CATEGORY_ACCENTS.decisions;
  }

  function renderLawVisual(law, instance = "card") {
    const visual = LAW_VISUALS[law.id] || { motif: "blocks", mark: law.categoryName, title: law.summary };
    return `
      <div class="law-visual" role="img" aria-label="${visual.title}">
        <svg viewBox="0 0 180 112" xmlns="http://www.w3.org/2000/svg" focusable="false">
          <circle class="law-visual-bg" cx="90" cy="56" r="52" />
          ${renderMotif(visual.motif)}
        </svg>
      </div>
    `;
  }

  function renderMotif(motif) {
    const motifs = {
      network: `<path d="M48 76 84 42l48 20M84 42l10 38M48 76l46 4 38-18" /><circle cx="48" cy="76" r="8" /><circle cx="84" cy="42" r="8" /><circle cx="132" cy="62" r="8" /><circle cx="94" cy="80" r="8" />`,
      people: `<circle cx="68" cy="47" r="12" /><circle cx="108" cy="47" r="12" /><circle cx="90" cy="35" r="12" /><path d="M46 77c5-15 38-15 44 0M90 77c6-15 39-15 44 0M62 82c8-18 48-18 56 0" />`,
      target: `<circle cx="90" cy="58" r="36" /><circle cx="90" cy="58" r="22" /><circle cx="90" cy="58" r="8" /><path d="M90 18v16M90 82v16M50 58H34M146 58h-16" />`,
      window: `<rect x="48" y="26" width="84" height="58" rx="4" /><path d="M90 26v58M48 55h84M98 55 83 68l12 3-20 13" />`,
      clock: `<circle cx="90" cy="57" r="34" /><path d="M90 34v25l18 10" /><path d="M54 57h-13M139 57h-13" />`,
      spiral: `<path d="M116 58c0 17-14 29-31 26-18-3-28-21-20-37 8-17 31-22 44-8 11 12 7 31-8 37-13 5-28-3-29-17-1-12 10-22 22-19 10 3 15 14 9 23-5 7-16 8-21 1" />`,
      razor: `<path d="M44 74h76l16-26H60zM61 74l-12 18M116 74l12 18M70 48l18-24h44l-12 24" />`,
      eyes: `<path d="M36 58s20-26 54-26 54 26 54 26-20 26-54 26-54-26-54-26Z" /><circle cx="90" cy="58" r="16" /><circle cx="90" cy="58" r="5" />`,
      ratio: `<rect x="40" y="38" width="72" height="36" rx="5" /><rect x="116" y="38" width="24" height="36" rx="5" /><path d="M40 84h100" />`,
      gateway: `<path d="M46 36h40v44H46zM94 36h40v44H94zM86 58h8" /><path d="m61 58 10-10M61 58l10 10M119 48l10 10-10 10" />`,
      spotlight: `<path d="M76 26h28l8 16H68zM90 42v16M56 90l34-32 34 32M52 90h76" />`,
      speed: `<path d="M44 76c6-26 24-42 46-42s40 16 46 42" /><path d="M90 70l28-24" /><path d="M50 82h80M36 58h22M122 58h22" />`,
      api: `<rect x="38" y="34" width="42" height="42" rx="8" /><rect x="100" y="34" width="42" height="42" rx="8" /><path d="M80 55h20M59 47v16M121 47v16" />`,
      broom: `<path d="M116 26 72 70M65 64l20 20M57 72l20 20M64 93c15-4 25-13 29-28" />`,
      flag: `<path d="M68 92V28M68 30h52l-12 15 12 15H68M56 92h48" /><path d="M76 76c13 8 31 8 44 0" />`,
      lock: `<rect x="58" y="50" width="64" height="42" rx="7" /><path d="M72 50V38c0-11 8-18 18-18s18 7 18 18v12" /><path d="M90 66v11" />`,
      blocks: `<rect x="48" y="60" width="28" height="24" rx="3" /><rect x="78" y="44" width="28" height="40" rx="3" /><rect x="108" y="28" width="28" height="56" rx="3" />`,
      leak: `<path d="M52 34h76v28H52zM64 62v12M90 62v26M116 62v16" /><path d="M90 88c-7-8-7-14 0-22 7 8 7 14 0 22Z" />`,
      balance: `<path d="M90 28v56M58 42h64M58 42 40 76h36L58 42ZM122 42l-18 34h36l-18-34ZM72 88h36" />`,
      triangle: `<path d="M90 22 140 86H40Z" /><path d="M90 22v64M63 56h54" />`,
      tower: `<path d="M62 88h56M72 88V32l36 14v42M72 46h36M72 60h36M72 74h36" />`,
      "bloated-system": `<rect x="38" y="46" width="28" height="28" rx="5" /><path d="M72 60h22M86 50l10 10-10 10" /><rect x="104" y="34" width="42" height="42" rx="7" /><path d="M112 34V24M126 34V22M140 34V28M112 76v12M126 76v14M140 76v8M104 44H92M104 58H88M104 72H96M146 44h12M146 58h16M146 72h10" />`,
      cloud: `<path d="M58 74h70c12 0 18-8 16-18-2-11-13-16-23-12-6-14-28-17-39-4-12-3-24 5-24 20" /><path d="M52 88h76" />`,
      ripple: `<circle cx="90" cy="58" r="8" /><circle cx="90" cy="58" r="24" /><circle cx="90" cy="58" r="40" />`,
      mail: `<rect x="44" y="34" width="92" height="56" rx="6" /><path d="m44 42 46 32 46-32" />`,
      rope: `<path d="M34 62c18-22 34 22 52 0s34 22 52 0" /><path d="M46 82h88" />`,
      pyramid: `<path d="M90 24 142 88H38Z" /><path d="M58 64h64M72 46h36" />`,
      ladder: `<path d="M64 88V30M116 88V30M64 44h52M64 60h52M64 76h52" />`,
      stairs: `<path d="M48 86h26V68h26V50h26V32h18" />`,
      bus: `<rect x="42" y="38" width="96" height="42" rx="8" /><path d="M54 38v-8h72v8M62 80v10M118 80v10M58 52h64" />`,
      maze: `<path d="M48 32h84v56H48zM66 32v38M66 70h26M92 50h26M118 50v38" />`,
      progress: `<path d="M42 76h96" /><rect x="50" y="42" width="80" height="18" rx="9" /><path d="M50 51h58" />`,
      magnifier: `<circle cx="78" cy="52" r="26" /><path d="m98 72 32 32M72 52h12M84 52h.5" />`,
      alert: `<path d="M90 24 140 88H40Z" /><path d="M90 46v20M90 76h.5" />`,
      debt: `<path d="M58 30h56l14 14v48H58zM114 30v14h14M72 58h36M72 72h28" />`,
      debug: `<path d="M90 34c17 0 28 12 28 28s-11 28-28 28-28-12-28-28 11-28 28-28Z" /><path d="M70 28l13 12M110 28 97 40M58 62H42M138 62h-16M67 83 54 96M113 83l13 13" />`,
      spray: `<path d="M72 36h34v18H72zM86 54v34M68 88h38M108 42l28-10M110 52l30 8M110 62l24 24" />`,
      cycle: `<path d="M124 45a38 38 0 0 0-64-5M56 40h20V20M56 71a38 38 0 0 0 64 5M124 76h-20v20" />`,
      filter: `<path d="M48 30h84L99 64v24L81 96V64Z" />`,
      parallel: `<path d="M44 34h26v48H44zM78 34h26v48H78zM112 34h26v48h-26z" />`,
      expand: `<path d="M58 58h64M90 26v64M62 30l-20 20M118 30l20 20M62 86l-20-20M118 86l20-20" />`,
      mesh: `<circle cx="54" cy="40" r="7" /><circle cx="126" cy="40" r="7" /><circle cx="90" cy="32" r="7" /><circle cx="66" cy="78" r="7" /><circle cx="114" cy="78" r="7" /><path d="M54 40h72M54 40l36-8 36 8M54 40l12 38 24-46 24 46 12-38M66 78h48" />`,
      duplicate: `<rect x="54" y="34" width="50" height="42" rx="6" /><rect x="76" y="52" width="50" height="42" rx="6" />`,
      line: `<path d="M44 58h92" /><path d="m116 40 20 18-20 18" />`,
      pillars: `<path d="M42 84h96M50 76V36M70 76V36M90 76V36M110 76V36M130 76V36M42 36h96" />`,
      neighbor: `<circle cx="68" cy="58" r="18" /><circle cx="112" cy="58" r="18" /><path d="M86 58h8" />`,
      spark: `<path d="M90 24 99 49l25 9-25 9-9 25-9-25-25-9 25-9Z" />`,
      curve: `<path d="M42 82c18-46 39-48 54-4 12-20 24-30 42-42" /><path d="M42 88h96M42 28v60" />`,
      anchor: `<path d="M90 30v54M74 46h32M70 84c-18-8-22-25-22-25M110 84c18-8 22-25 22-25M76 30a14 14 0 1 0 28 0 14 14 0 0 0-28 0Z" />`,
      map: `<path d="M44 36 72 26l36 10 28-10v62l-28 10-36-10-28 10zM72 26v62M108 36v62" />`,
      lens: `<circle cx="82" cy="52" r="26" /><path d="m102 72 30 30M70 52l8 8 18-18" />`,
      wave: `<path d="M38 76c18-42 32-42 48 0s30 42 56 0" /><path d="M38 88h104" />`,
      hourglass: `<path d="M62 28h56M62 88h56M70 28c0 28 40 32 40 60M110 28c0 28-40 32-40 60" />`,
      atom: `<circle cx="90" cy="58" r="5" /><ellipse cx="90" cy="58" rx="46" ry="16" /><ellipse cx="90" cy="58" rx="46" ry="16" transform="rotate(60 90 58)" /><ellipse cx="90" cy="58" rx="46" ry="16" transform="rotate(120 90 58)" />`,
      invert: `<path d="M58 36h64M58 80h64M72 36l36 44M108 36 72 80" />`,
      comment: `<path d="M48 32h84v44H78L58 92V76H48z" /><path d="M68 52h44M68 64h28" />`
    };

    return `<g class="law-visual-lines">${motifs[motif] || motifs.blocks}</g>`;
  }

  // 4. 搜索和过滤事件绑定
  function setupFilterSearch() {
    // 搜索输入过滤
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderLaws();
    });

    // 分类 Tab 过滤
    tabButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        // 更新激活样式
        tabButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        // 触发渲染
        currentCategory = btn.getAttribute("data-category");
        renderLaws();
      });
    });

    // 锚点导航平滑滚动
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          // 关闭移动端菜单
          navLinks.classList.remove("active");
          
          const headerHeight = header.offsetHeight;
          const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - headerHeight - 10;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }



  // 6. 贡献表单模拟处理 (Claude 简约纸张表单提交)
  function setupContributeForm() {
    if (!contributeForm) return;

    contributeForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("law-name").value;
      const category = document.getElementById("law-cat").value;
      const desc = document.getElementById("law-desc").value;

      console.log("贡献定律提报成功：", { name, category, desc });

      // 切换视图，展现温和成功的状态
      contributeForm.style.display = "none";
      formSuccessState.style.display = "block";
    });

    // 重置表单
    btnResetForm.addEventListener("click", () => {
      contributeForm.reset();
      formSuccessState.style.display = "none";
      contributeForm.style.display = "block";
    });
  }

  // 7. 移动端折叠导航
  function setupMobileMenu() {
    if (!menuToggle) return;

    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      
      // 反馈汉堡动画
      const spans = menuToggle.querySelectorAll("span");
      if (navLinks.classList.contains("active")) {
        spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
        spans[1].style.opacity = "0";
        spans[2].style.transform = "rotate(-45deg) translate(5px, -5px)";
      } else {
        spans[0].style.transform = "none";
        spans[1].style.opacity = "1";
        spans[2].style.transform = "none";
      }
    });
  }
});
