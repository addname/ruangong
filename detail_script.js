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

  const HERO_MOTIFS = {
    "kernighans-law": "debug",
    "broken-windows": "window",
    "conways-law": "network",
    "goodharts-law": "target",
    "technical-debt": "debt",
    "testing-pyramid": "pyramid",
    "kiss-principle": "line",
    "premature-optimization": "target"
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
            <a class="back-to-laws" href="index.html">← 返回定律列表</a>
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
      </article>
    `;
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
    const motif = HERO_MOTIFS[law.id] || getCategoryMotif(law.category);
    return `
      <svg viewBox="0 0 180 112" xmlns="http://www.w3.org/2000/svg" focusable="false">
        <g>${renderMotif(motif)}</g>
      </svg>
    `;
  }

  function getCategoryMotif(category) {
    const motifs = {
      architecture: "network",
      management: "target",
      quality: "debug",
      culture: "people",
      scale: "pyramid",
      design: "line",
      decisions: "balance"
    };
    return motifs[category] || "network";
  }

  function renderMotif(motif) {
    const motifs = {
      network: `<path d="M48 76 84 42l48 20M84 42l10 38M48 76l46 4 38-18" /><circle cx="48" cy="76" r="8" /><circle cx="84" cy="42" r="8" /><circle cx="132" cy="62" r="8" /><circle cx="94" cy="80" r="8" />`,
      target: `<circle cx="90" cy="58" r="36" /><circle cx="90" cy="58" r="22" /><circle cx="90" cy="58" r="8" /><path d="M90 18v16M90 82v16M50 58H34M146 58h-16" />`,
      debug: `<path d="M90 34c17 0 28 12 28 28s-11 28-28 28-28-12-28-28 11-28 28-28Z" /><path d="M70 28l13 12M110 28 97 40M58 62H42M138 62h-16M67 83 54 96M113 83l13 13" />`,
      window: `<rect x="48" y="26" width="84" height="58" rx="4" /><path d="M90 26v58M48 55h84M98 55 83 68l12 3-20 13" />`,
      debt: `<path d="M58 30h56l14 14v48H58zM114 30v14h14M72 58h36M72 72h28" />`,
      pyramid: `<path d="M90 24 142 88H38Z" /><path d="M58 64h64M72 46h36" />`,
      line: `<path d="M44 58h92" /><path d="m116 40 20 18-20 18" />`,
      people: `<circle cx="68" cy="47" r="12" /><circle cx="108" cy="47" r="12" /><circle cx="90" cy="35" r="12" /><path d="M46 77c5-15 38-15 44 0M90 77c6-15 39-15 44 0M62 82c8-18 48-18 56 0" />`,
      balance: `<path d="M90 28v56M58 42h64M58 42 40 76h36L58 42ZM122 42l-18 34h36l-18-34ZM72 88h36" />`
    };

    return motifs[motif] || motifs.network;
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
