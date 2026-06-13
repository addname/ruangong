/**
 * 软工定律详情页脚本
 * 渲染轻量知识条目：核心句、短 Takeaways、具体例子、来源与相关定律。
 */

document.addEventListener("DOMContentLoaded", () => {
  if (typeof LAWS_DATA === "undefined") {
    console.error("laws.js 定律数据未成功加载。");
    return;
  }

  const postWrapper = document.getElementById("post-wrapper");

  const RELATED_LAWS = {
    "kernighans-law": ["kiss-principle", "premature-optimization", "technical-debt", "testing-pyramid"],
    "kiss-principle": ["kernighans-law", "occams-razor", "yagni", "premature-optimization"],
    "premature-optimization": ["kernighans-law", "pareto-principle", "kiss-principle", "wirths-law"],
    "technical-debt": ["broken-windows", "boy-scout-rule", "kernighans-law", "testing-pyramid"],
    "testing-pyramid": ["pesticide-paradox", "linuss-law", "technical-debt", "kernighans-law"]
  };

  const EXAMPLE_ENHANCEMENTS = {
    "kernighans-law": `
      <p>一个常见陷阱是把“聪明”写成一行，然后把调试成本留给未来。</p>
      <div class="code-compare">
        <div>
          <div class="example-label">反模式：压缩到看不懂</div>
          <pre><code>public string GetUserDisplay(User u) =>
    u?.IsActive == true
        ? ((u.Name ?? "").Trim() is var n && n.Length > 0
            ? n + (u.Role > 0 ? $" ({(Role)u.Role})" : "")
            : "Unknown")
        : "Inactive";</code></pre>
        </div>
        <div>
          <div class="example-label">更好的做法：让状态显式</div>
          <pre><code>public string GetUserDisplay(User user)
{
    if (user is null || !user.IsActive) return "Inactive";

    var name = user.Name?.Trim();
    if (string.IsNullOrEmpty(name)) return "Unknown";

    return user.Role > 0 ? $"{name} ({(Role)user.Role})" : name;
}</code></pre>
        </div>
      </div>
      <p>前者写起来快，但一旦线上出现空值、角色枚举或边界输入问题，调试者必须同时理解业务、语言技巧和嵌套表达式。后者稍长，却能让排错路径直接许多。</p>
    `,
    "kiss-principle": `
      <p>需求只是“导出月度订单 CSV”时，直接查询、校验、输出文件就够了。</p>
      <ol class="example-steps">
        <li>简单方案：一个导出命令 + 明确字段映射 + 错误日志。</li>
        <li>过度方案：插件系统、可视化模板引擎、抽象数据管线。</li>
        <li>判断标准：如果未来变化还没有真实出现，就先别为它付复杂度成本。</li>
      </ol>
    `,
    "premature-optimization": `
      <p>先用 profiler 找热点，再优化；不要先凭直觉改最顺手的代码。</p>
      <ol class="example-steps">
        <li>错误流程：重写初始化校验函数，节省 2ms，但它一天只运行一次。</li>
        <li>正确流程：测量请求链路，发现 80% 时间花在排序和数据库查询。</li>
        <li>有效优化：给核心查询加索引和缓存，响应时间从 1200ms 降到 180ms。</li>
      </ol>
    `,
    "technical-debt": `
      <p>技术债最可怕的地方不是“当时写得丑”，而是它会持续收利息。</p>
      <ol class="example-steps">
        <li>短期捷径：支付接入先写 5 个供应商 if-else。</li>
        <li>利息出现：每加一个供应商都要修改同一个脆弱函数。</li>
        <li>偿还方式：提取统一支付策略接口，并给旧逻辑补回归测试。</li>
      </ol>
    `,
    "testing-pyramid": `
      <p>测试金字塔强调反馈速度：越底层的测试越多，越接近真实用户路径的测试越少。</p>
      <ol class="example-steps">
        <li>单元测试：覆盖价格、折扣、库存扣减等纯业务规则。</li>
        <li>集成测试：验证订单服务能正确调用支付、库存和通知。</li>
        <li>端到端测试：只保留少量关键路径，比如浏览、加购、结账。</li>
      </ol>
    `
  };

  const LAW_VISUALS = {
    "conways-law": { motif: "network", title: "组织结构映射系统结构" },
    "brooks-law": { motif: "people", title: "新增人手带来沟通成本" },
    "goodharts-law": { motif: "target", title: "指标变目标后失真" },
    "broken-windows": { motif: "window", title: "小破损会扩散成腐烂" },
    "parkinsons-law": { motif: "clock", title: "工作膨胀占满时间" },
    "hofstadters-law": { motif: "spiral", title: "估时总会递归变长" },
    "occams-razor": { motif: "razor", title: "削去不必要复杂度" },
    "linuss-law": { motif: "eyes", title: "足够多审查能暴露缺陷" },
    "pareto-principle": { motif: "ratio", title: "少数原因贡献多数结果" },
    "postels-law": { motif: "gateway", title: "输出严谨，输入宽容" },
    "hawthorne-effect": { motif: "spotlight", title: "被关注会改变行为" },
    "wirths-law": { motif: "speed", title: "软件膨胀吞掉硬件红利" },
    "premature-optimization": { motif: "target", title: "先测量，再优化" },
    "hyrums-law": { motif: "api", title: "可观测行为都会被依赖" },
    "boy-scout-rule": { motif: "flag", title: "离开营地时让代码更干净" },
    "yagni": { motif: "lock", title: "不要提前实现未知需求" },
    "galls-law": { motif: "blocks", title: "复杂系统从简单系统演化" },
    "law-of-leaky-abstractions": { motif: "leak", title: "抽象层终会泄露细节" },
    "teslers-law": { motif: "balance", title: "复杂度不会凭空消失" },
    "cap-theorem": { motif: "triangle", title: "一致性、可用性与分区容忍的取舍" },
    "second-system-effect": { motif: "bloated-system", title: "第二个系统容易过度设计并膨胀" },
    "fallacies-of-distributed-computing": { motif: "cloud", title: "分布式环境没有想象中可靠" },
    "law-of-unintended-consequences": { motif: "ripple", title: "改动会产生意外连锁反应" },
    "zawinskis-law": { motif: "mail", title: "软件会扩张到收发邮件" },
    "dunbars-number": { motif: "people", title: "稳定协作关系存在规模上限" },
    "ringelmann-effect": { motif: "rope", title: "群体变大后个体投入下降" },
    "prices-law": { motif: "pyramid", title: "少数人贡献大部分成果" },
    "putts-law": { motif: "ladder", title: "技术与管理层级的错配" },
    "peter-principle": { motif: "stairs", title: "晋升到不能胜任的位置" },
    "bus-factor": { motif: "bus", title: "关键知识集中带来风险" },
    "dilbert-principle": { motif: "maze", title: "组织把低效推向管理层" },
    "ninety-ninety-rule": { motif: "progress", title: "最后 10% 也可能耗掉 90% 时间" },
    "gilbs-law": { motif: "magnifier", title: "模糊问题需要先澄清" },
    "murphys-law": { motif: "alert", title: "可能出错的地方终会出错" },
    "technical-debt": { motif: "debt", title: "欠下的捷径会产生利息" },
    "kernighans-law": { motif: "debug", title: "调试比编写更难" },
    "testing-pyramid": { motif: "pyramid", title: "测试层级应该稳固分布" },
    "pesticide-paradox": { motif: "spray", title: "固定测试会失去发现力" },
    "lehmans-laws": { motif: "cycle", title: "软件必须持续演化" },
    "sturgeons-law": { motif: "filter", title: "大部分产物质量普通" },
    "amdahls-law": { motif: "parallel", title: "串行瓶颈限制并行收益" },
    "gustafsons-law": { motif: "expand", title: "扩大问题规模释放并行价值" },
    "metcalfes-law": { motif: "mesh", title: "网络价值随连接数增长" },
    "dry-principle": { motif: "duplicate", title: "避免重复表达同一知识" },
    "kiss-principle": { motif: "line", title: "保持简单直接" },
    "solid-principles": { motif: "pillars", title: "面向对象设计的五根支柱" },
    "law-of-demeter": { motif: "neighbor", title: "只与直接朋友通信" },
    "principle-of-least-astonishment": { motif: "spark", title: "行为应符合直觉" },
    "dunning-kruger-effect": { motif: "curve", title: "能力低时容易高估自己" },
    "hanlons-razor": { motif: "razor", title: "优先假设疏忽而非恶意" },
    "sunk-cost-fallacy": { motif: "anchor", title: "不要被既有投入绑住" },
    "map-is-not-the-territory": { motif: "map", title: "模型不等于真实世界" },
    "confirmation-bias": { motif: "lens", title: "人会偏爱支持己见的信息" },
    "hype-cycle-amaras-law": { motif: "wave", title: "短期高估，长期低估" },
    "lindy-effect": { motif: "hourglass", title: "经得起时间的更可能继续存在" },
    "first-principles-thinking": { motif: "atom", title: "回到基本事实推导" },
    "inversion": { motif: "invert", title: "反过来思考风险与目标" },
    "cunninghams-law": { motif: "comment", title: "错误答案会激发纠正" }
  };

  init();

  function init() {
    const params = new URLSearchParams(window.location.search);
    let id = params.get("id");

    if (!id || !LAWS_DATA.some(law => law.id === id)) {
      id = LAWS_DATA[0].id;
    }

    renderPostContent(id);
  }

  function renderPostContent(lawId) {
    const law = LAWS_DATA.find(item => item.id === lawId);
    if (!law) return;

    document.title = `${law.name} | 软工定律`;
    postWrapper.className = `post-wrapper cat-${law.category}`;

    const takeaways = getParsedTakeaways(law);
    const relatedLaws = getRelatedLaws(law);
    const readMinutes = Math.max(2, Math.ceil((law.desc.length + law.caseStudy.length) / 460));

    postWrapper.innerHTML = `
      <header class="post-hero">
        <div class="post-hero-inner">
          <div class="post-hero-copy">
            <div class="breadcrumb">定律 / ${law.name}</div>
            <h1>${law.name}</h1>
            <div class="english-title">${law.englishName}</div>
            <div class="post-tags">
              <span>${law.categoryName}</span>
              <span>${readMinutes} 分钟阅读</span>
            </div>
          </div>
          <div class="post-hero-visual" aria-hidden="true">
            ${renderHeroVisual(law)}
          </div>
        </div>
      </header>

      <article class="article-shell">
        <div class="article-meta">${readMinutes} 分钟阅读</div>
        <p class="post-lead">
          ${law.summary}
        </p>

        ${law.quote ? `<blockquote class="law-quote">${cleanInline(law.quote)}</blockquote>` : ""}

        <section class="post-section">
          <h2 class="post-section-title">核心要点</h2>
          <div class="takeaways-grid">
            ${takeaways.map((point, index) => {
              const numStr = String(index + 1).padStart(2, '0');
              return `
                <div class="takeaway-panel${point.title ? '' : ' no-title'}">
                  <div class="takeaway-header">
                    <span class="takeaway-num">${numStr}</span>
                    ${point.title ? `<h3 class="takeaway-title">${point.title}</h3>` : ''}
                  </div>
                  <p class="takeaway-desc">${point.desc}</p>
                </div>
              `;
            }).join("")}
          </div>
        </section>

        <section class="post-section">
          <h2 class="post-section-title">核心定义</h2>
          <p>${law.desc}</p>
        </section>

        <section class="post-section">
          <h2 class="post-section-title">典型案例</h2>
          ${renderExample(law)}
        </section>

        ${law.vibeCodingAdvice ? `
          <section class="post-section">
            <h2 class="post-section-title">Vibe Coding 启示</h2>
            <p>${law.vibeCodingAdvice}</p>
          </section>
        ` : ""}

        ${law.origins ? `
          <section class="post-section">
            <h2 class="post-section-title">定律起源</h2>
            <p>${law.origins}</p>
          </section>
        ` : ""}

        ${law.sidenote ? `
          <section class="post-section">
            <h2 class="post-section-title">${law.sidenote.title}</h2>
            <p>${law.sidenote.content}</p>
          </section>
        ` : ""}

        <section class="post-section related-section">
          <h2 class="post-section-title">相关定律</h2>
          <div class="related-laws">
            ${relatedLaws.map(related => `
              <a class="related-law" href="detail.html?id=${related.id}">
                <span>${related.categoryName}</span>
                <strong>${related.name}</strong>
                <em>${related.summary}</em>
              </a>
            `).join("")}
          </div>
        </section>

        <section class="post-section comments-section" aria-labelledby="comments-title">
          <h2 class="post-section-title" id="comments-title">讨论</h2>
          <p class="comments-note">欢迎补充案例、指出问题，或留下你在项目里踩过的坑。</p>
          <div class="github-comments" id="github-comments"></div>
        </section>
      </article>
    `;

    loadGiscusComments(law);
  }

  function loadGiscusComments(law) {
    const comments = document.getElementById("github-comments");
    if (!comments) return;

    comments.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", "addname/ruangong");
    script.setAttribute("data-repo-id", "R_kgDOS5p6YQ");
    script.setAttribute("data-category", "General");
    script.setAttribute("data-category-id", "DIC_kwDOS5p6Yc4C_FWh");
    script.setAttribute("data-mapping", "specific");
    script.setAttribute("data-term", `软工定律：${law.name}`);
    script.setAttribute("data-strict", "1");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", "noborder_light");
    script.setAttribute("data-lang", "zh-CN");
    script.setAttribute("crossorigin", "anonymous");
    script.async = true;

    comments.appendChild(script);
  }

  function getParsedTakeaways(law) {
    const source = law.actionableAdvice && law.actionableAdvice.length
      ? law.actionableAdvice
      : [law.summary];

    return source.slice(0, 4).map(item => {
      // 匹配 **标题**：内容 或 **标题**: 内容
      const match = item.match(/^\*\*(.*?)\*\*[:：]?\s*(.*)$/);
      if (match) {
        return {
          title: cleanInline(match[1]),
          desc: cleanInline(match[2])
        };
      }
      
      // 备用：按冒号分割
      const colonIndex = item.indexOf('：') !== -1 ? item.indexOf('：') : item.indexOf(':');
      if (colonIndex !== -1 && colonIndex < 20) {
        return {
          title: cleanInline(item.slice(0, colonIndex)),
          desc: cleanInline(item.slice(colonIndex + 1))
        };
      }
      
      return {
        title: "",
        desc: cleanInline(item)
      };
    });
  }

  function cleanInline(text) {
    return String(text || "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/•\s*/g, "")
      .trim();
  }

  function renderExample(law) {
    if (EXAMPLE_ENHANCEMENTS[law.id]) {
      return `<div class="example-body">${EXAMPLE_ENHANCEMENTS[law.id]}</div>`;
    }

    return `<div class="example-body">${law.caseStudy}</div>`;
  }

  function renderHeroVisual(law) {
    const visual = LAW_VISUALS[law.id] || { motif: "blocks", title: law.summary };
    return `
      <svg viewBox="0 0 180 112" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${visual.title}">
        ${renderMotif(visual.motif)}
      </svg>
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
      flag: `<path d="M68 92V28M68 30h52l-12 15 12 15H68M56 92h48" /><path d="M76 76c13 8 31 8 44 0" />`,
      lock: `<rect x="58" y="50" width="64" height="42" rx="7" /><path d="M72 50V38c0-11 8-18 18-18s18 7 18 18v12" /><path d="M90 66v11" />`,
      blocks: `<rect x="48" y="60" width="28" height="24" rx="3" /><rect x="78" y="44" width="28" height="40" rx="3" /><rect x="108" y="28" width="28" height="56" rx="3" />`,
      leak: `<path d="M52 34h76v28H52zM64 62v12M90 62v26M116 62v16" /><path d="M90 88c-7-8-7-14 0-22 7 8 7 14 0 22Z" />`,
      balance: `<path d="M90 28v56M58 42h64M58 42 40 76h36L58 42ZM122 42l-18 34h36l-18-34ZM72 88h36" />`,
      triangle: `<path d="M90 22 140 86H40Z" /><path d="M90 22v64M63 56h54" />`,
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

  function getRelatedLaws(law) {
    const configured = RELATED_LAWS[law.id] || [];
    const configuredLaws = configured
      .map(id => LAWS_DATA.find(item => item.id === id))
      .filter(Boolean);

    if (configuredLaws.length >= 4) return configuredLaws.slice(0, 4);

    const fallback = LAWS_DATA
      .filter(item => item.id !== law.id && item.category === law.category && !configured.includes(item.id))
      .slice(0, 4 - configuredLaws.length);

    return [...configuredLaws, ...fallback];
  }

});
