# -*- coding: utf-8 -*-
import json
import os

CONTENT_MD_PATH = "/Users/xiaguang/.gemini/antigravity-ide/brain/7cfcaf2b-974c-4cf0-9c54-b8c5ed0091be/.system_generated/steps/425/content.md"

with open(CONTENT_MD_PATH, "r", encoding="utf-8") as f:
    text = f.read()

# 提取 JSON 部分
json_str = text.split("---")[-1].strip()
raw_data = json.loads(json_str)

# 1. 预设原有 12 条定律的高质量中文完整数据
ORIGINAL_LAWS = {
  "conways-law": {
    "id": "conways-law",
    "name": "康威定律",
    "englishName": "Conway's Law",
    "category": "architecture",
    "categoryName": "架构设计",
    "summary": "设计系统的组织，其产生的设计等同于组织的沟通结构。",
    "englishSummary": "Organizations design systems that mirror their own communication structure.",
    "desc": "康威定律指出，软件系统的架构反映了构建它们的组织的沟通结构。例如，一个拥有独立前端、后端和数据库部门的公司，倾向于产出传统的三层架构。相反，小型且分布式的团队往往会产出模块化的服务架构，而大型且集中办公的团队则倾向于构建单体系统。\n\n为了减轻或规避这种无意识的架构塑造，团队通常使用**逆向康威定律（Inverse Conway Maneuver）**：刻意调整和设计组织结构，以促成期望的软件架构。",
    "quote": "Organizations design systems that mirror their own communication structure.",
    "caseStudy": "• **传统部门墙案例**：某公司为前端、后端 and 数据库设立了彼此独立的部门。因此他们构建的系统呈现出非常鲜明的三层架构，每层独立开发。由于部门间沟通壁垒高、目标不一致，跨层集成过程变得极其痛苦且充满故障。\n\n• **亚马逊“两张比萨”团队**：亚马逊著名的“两张比萨团队”则是经典的成功实践。每个小团队端到端地拥有一项具体的服务。康威定律暗示了这种组织划分正是亚马逊架构天然以服务为导向、且服务间具备清晰 API 契约的根本原因。",
    "actionableAdvice": [
      "**软件架构反映组织图**：系统的技术架构往往是公司组织架构图或团队结构的直接投影。",
      "**防范部门孤岛导致的系统孤岛**：如果公司由彼此隔阂的孤岛式部门构成，系统组件间就会出现同样沟通不畅、难以集成的物理壁垒。",
      "**践行逆康威操纵**：如果想促成理想的技术架构（如微服务），请先重组并拆分出对应的独立跨职能团队，因为团队的沟通路径就是代码的边界路径。",
      "**前瞻团队划分的影响**：在项目启动之初就要意识到，团队或部门的划分决定了系统组件的物理分界线。"
    ],
    "origins": "由计算机科学家梅尔文·康威（Melvin Conway）在 1967 年的论文《委员会是如何发明创造的？》（How Do Committees Invent?）中首次提出。虽然哈佛商业评论因“缺乏正式证明”拒绝发表该文，但 Datamation 杂志于 1968 年刊登了它。随后，弗雷德·布鲁克斯（Fred Brooks）在经典的《人月神话》中将其正式命名为“康威定律”，确立了其作为软件工程基石的地位。",
    "sidenote": {
      "title": "Spotify 团队模型",
      "content": "Spotify 模型围绕“功能”而不是“技术栈”来组织团队。其跨职能的 **Squads**（6-12人小队）端到端地负责具体的功能，并按业务领域组合为 **Tribes**（部落）。跨 Squads 的技能和经验共享通过 **Chapters**（分部）和 **Guilds**（工会）完成。这种设计是为了契合解耦、自主的微服务架构。但切记，它仅在解决真实的组织协作痛点时有效，盲目照搬往往会带来灾难。"
    }
  },
  "brooks-law": {
    "id": "brooks-law",
    "name": "布鲁克斯法则",
    "englishName": "Brooks' Law",
    "category": "culture",
    "categoryName": "团队协作",
    "summary": "向进度落后的软件项目中增加人手，只会使项目更加落后。",
    "englishSummary": "Adding manpower to a late software project makes it later.",
    "desc": "由《人月神话》作者弗雷德里克·布鲁克斯（Frederick Brooks）提出。这是软件工程中最著名的法则之一。它揭示了软件开发的非线性特征：新加入的成员需要时间熟悉项目（这会消耗老员工的辅导精力），且团队人数增加会导致沟通路径呈指数级增长（沟通路径 = n * (n - 1) / 2），从而抵消了新增人力带来的产出。",
    "quote": "Pregnancy takes nine months, no matter how many women are assigned. (生一个孩子需要九个月，无论你雇佣多少个孕妇都是如此。)",
    "caseStudy": "某电商 system 开发延期，项目经理为了赶进度，紧急从其他部门抽调了5名资深开发人员加入。结果，原本的3名核心成员不得不每天花4个小时给新成员讲解业务代码与系统部署。由于新成员对业务不熟悉，还在合并代码时引入了几个严重的 Bug，导致上线日期比预计的又拖延了两周。",
    "actionableAdvice": [
      "**提前规划而非临时抱佛脚**：在项目初期进行合理的资源评估，一旦发现延期，不要盲目加人，而应通过**削减范围（Scope Cut）**来保住上线节点。",
      "**模块化与组件化**：通过良好的架构解耦，让新加入的人员可以独立负责某些子模块，尽量减少与老成员的代码和沟通冲突。",
      "**完善文档与自动化漏斗**：维护最新的上手文档和一键本地部署脚本，将“新人融入成本”降到最低。"
    ]
  },
  "goodharts-law": {
    "id": "goodharts-law",
    "name": "古德哈特定律",
    "englishName": "Goodhart's Law",
    "category": "management",
    "categoryName": "项目管理",
    "summary": "当一个指标变成目标时，它就不再是一个好的指标。",
    "englishSummary": "When a measure becomes a target, it ceases to be a good measure.",
    "desc": "源自经济学家查尔斯·古德哈特（Charles Goodhart）。在软件开发中，如果管理层试图通过硬性考核某项度量指标（如：代码行数、Bug修复率、单元测试覆盖率）来提升团队表现，团队成员就会无意识地“操纵指标”，从而导致该指标丧失了原本能够真实反映软件质量或生产力的作用。",
    "quote": "When a measure becomes a target, it ceases to be a good measure. (当指标变成目标时，它就不再是好指标。)",
    "caseStudy": "某技术总监为了提高代码质量，规定所有项目的单元测试覆盖率必须达到90%，否则扣除绩效。开发人员为了达成目标，开始大量编写“无断言（No Assertions）”的空测试用例，或者对Getter和Setter等无逻辑代码进行测试。覆盖率指标虽然达到了95%，但线上Bug率没有丝毫降低，反而浪费了团队大量时间编写垃圾测试代码。",
    "actionableAdvice": [
      "**多维度平衡度量**：不要依赖单一指标，而应该结合定性度量与定量度量。例如，关注覆盖率的同时，也要关注代码评审（Code Review）的质量。",
      "**度量用于诊断，而非惩罚**：将指标作为团队发现自身问题、进行自我提升的诊断工具，而不是作为绩效考评的唯一标准。",
      "**鼓励质量文化**：培养开发人员对交付价值的自豪感，而不是追求数字的达标。"
    ]
  },
  "broken-windows-theory": {
    "id": "broken-windows-theory",
    "name": "破窗效应",
    "englishName": "Broken Windows Theory",
    "category": "quality",
    "categoryName": "代码质量",
    "summary": "容忍代码库中哪怕微小的低质量或无序，都会导致混乱迅速蔓延。",
    "englishSummary": "Any sign of decay or sloppiness in a codebase will lead to rapid decay.",
    "desc": "原本是犯罪学理论，由《程序员修炼之道》引入软件开发。如果代码库中存在结构混乱的代码、未处理的报错、冗余的废弃代码或过时的文档（即“破窗”），团队成员就会倾向于在此基础上继续写出粗制滥造的代码，最终导致系统彻底腐烂，技术债高筑。",
    "quote": "Don't live with broken windows. (不要容忍破窗存在。)",
    "caseStudy": "某核心模块中有一个长达2000行的函数，充斥着硬编码与全局变量。由于工期紧，几任开发者都在上面直接打补丁。每当有新需求，大家都觉得“这块代码已经这么烂了，我再加个 if-else 也没关系”，没人愿意主动重构。两年后，这个模块成了无人敢动的“雷区”，每次修改都会引发连锁故障。",
    "actionableAdvice": [
      "**遵守童子军军规（Boy Scout Rule）**：永远在离开露营地时，让它比你来的时候更干净。每次修改代码时，顺手修复旁边的一处小坏账（比如提取一个魔法值，或者重命名一个含糊的变量）。",
      "**自动化门禁**：通过静态代码扫描工具（Linter、SonarQube）在 CI 流程中严格卡点，绝不让新的“破窗”合并进主干。",
      "**技术债定期偿还**：定期（如每个迭代预留20%精力）进行小规模重构，不给代码腐烂留下生存空间。"
    ]
  },
  "parkinsons-law": {
    "id": "parkinsons-law",
    "name": "帕金森定律",
    "englishName": "Parkinson's Law",
    "category": "management",
    "categoryName": "项目管理",
    "summary": "只要还有时间，工作就会不断膨胀，直到占满所有可用的时间。",
    "englishSummary": "Work expands so as to fill the time available for its completion.",
    "desc": "由英国学者西里尔·诺斯古德·帕金森（Cyril Northcote Parkinson）提出。在软件开发中表现为：如果我们给一个功能预留了超长的时间，即使这个功能其实两小时就能写完，我们也会在无形中往里面加过度设计、过度优化或者拖延执行，直到截止日期临近才完成。",
    "quote": "Work expands so as to fill the time available for its completion. (工作会不断膨胀以占满所有可用的时间。)",
    "caseStudy": "团队估算一个简单的报表下载功能需要一周时间。其实核心代码在第一天下午就已经写完，但因为离提测还有好几天，开发人员开始尝试引入一个复杂的设计模式、试图做没必要的性能优化，最后甚至重构了相关的基类。结果在第五天时，因为过度重构引入了新的隐藏 Bug，反而导致提测延期。",
    "actionableAdvice": [
      "**设定紧凑且合理的时限（Timeboxing）**：将开发周期拆分为更小的增量，并为每个小增量设定清晰的、可见的截止日期。",
      "**明确“完成的定义”（DoD）**：防止范围蔓延。一旦达到了约定的“完成标准”，立刻转入下一项工作，不要过度修饰。",
      "**敏捷短迭代**：以双周甚至单周为迭代单位，频繁交付可用软件，减少由于漫长周期带来的效率流失。"
    ]
  },
  "hofstadters-law": {
    "id": "hofstadters-law",
    "name": "霍夫施塔特定律",
    "englishName": "Hofstadter's Law",
    "category": "management",
    "categoryName": "项目管理",
    "summary": "做事所花费的时间总是比你预期的要长，即使你把霍夫施塔特定律考虑在内。",
    "englishSummary": "It always takes longer than you expect, even when you take into account Hofstadter's Law.",
    "desc": "由道格拉斯·霍夫施塔特（Douglas Hofstadter）在他的著作《哥德尔、艾舍尔、巴赫：集异璧之大成》中提出。这是一个关于项目估时的递归定律。它说明了软件开发中充满着未知和隐形的不确定性，因此完美的估时几乎是不可能的。",
    "quote": "It always takes longer than you expect, even when you take into account Hofstadter's Law. (做事总比预期要慢，即便考虑了这一定律也是如此。)",
    "caseStudy": "一个看似很简单的“第三方短信登录集成”任务，开发人员小明估计需要半天。但在集成时，他发现第三方的 SDK 和当前系统的 Java 版本冲突，不得不去排查依赖冲突；接着，短信服务商的账号需要企业资质认证，小明又花时间催促行政去盖章；最后，短信网关的网络在测试环境不通，小明又去联系网络组开通防火墙。结果这个“半天”的任务最终整整耗时四天。",
    "actionableAdvice": [
      "**使用历史数据辅助估时**：不要拍脑袋，而是参考过去类似任务的实际耗时，并留出足够的缓冲系数（Buffer）。",
      "**分解到最小粒度**：将大任务拆解为粒度小于1天的原子任务，暴露隐藏的未知风险点。",
      "**预留不确定性预算**：明确区分“开发时间”和“联调测试与排错时间”，后者通常占总时间的30%-50%。"
    ]
  },
  "occams-razor": {
    "id": "occams-razor",
    "name": "奥卡姆剃刀定律",
    "englishName": "Occam's Razor",
    "category": "architecture",
    "categoryName": "架构设计",
    "summary": "若无必要，勿增实体。简单的解决方案往往比复杂的方案更有效。",
    "englishSummary": "Entities should not be multiplied without necessity.",
    "desc": "由14世纪哲学家奥卡姆的威廉提出，是科学和工程界的通用原则。在软件开发中，它倡导“保持简单（KISS - Keep It Simple, Stupid）”，主张在能够满足业务需求的前提下，选择组件最少、逻辑最直接的方案，避免过度设计（Over-engineering）和对未来虚无需求的提前满足（YAGNI - You Aren't Gonna Need It）。",
    "quote": "Entities should not be multiplied without necessity. (若无必要，勿增实体。)",
    "caseStudy": "某初创项目只有几百个日活用户，架构师为了“面向未来”，设计了一套复杂的分布式架构：引入了 Kubernetes 容器集群、Kafka 消息队列、Redis 缓存集群以及三层数据库读写分离。这导致项目开发进度缓慢，且每个月的云服务器运维账单高昂。半年后项目方向调整，整个架构推倒重来。事实上，一个单体 Spring Boot 加上 PostgreSQL 数据库就能完美解决首期问题。",
    "actionableAdvice": [
      "**践行 YAGNI 原则**：只为你当下的切实需求编写代码，不要为了臆想中“未来可能有用”的功能增加复杂的设计。",
      "**优先选择单体/简单架构**：在业务逻辑和规模未达到临界点前，使用最直接、最易维护的架构。架构应该随着业务规模自然演进，而不是一步到位。",
      "**代码的可读性重于炫技**：用最平实、通俗易懂的代码逻辑解决问题，避免引入复杂的、冷门的设计模式。"
    ]
  },
  "linuss-law": {
    "id": "linuss-law",
    "name": "林纳斯定律",
    "englishName": "Linus's Law",
    "category": "quality",
    "categoryName": "代码质量",
    "summary": "如果有足够多的眼睛，所有的 Bug 都将无处遁形。",
    "englishSummary": "Given enough eyeballs, all bugs are shallow.",
    "desc": "由埃里克·雷蒙德（Eric Raymond）在其著作《大教堂与市集》中提出，并以 Linux 之父 Linus Torvalds 命名。这构成了开源软件运动的哲学基础：只要有足够多的开发者和用户共同查看代码、测试系统，制造再深的缺陷或漏洞也能很快被揪出来并予以修复。",
    "quote": "Given enough eyeballs, all bugs are shallow. (眼多虫浅。)",
    "caseStudy": "某著名开源加密库曾经隐藏着一个致命的心脏流血（Heartbleed）漏洞。虽然它是开源的，但由于该模块非常底层、枯燥且少有人去逐行审计，漏洞存在了数年之久。直到该库被更广泛地集成，多位安全专家对其进行深度审计，漏洞才被彻底揪出并修复。这证明了仅仅“开源”还不够，必须要有“足够多的主动审查者”才能发挥林纳斯定律的威力。",
    "actionableAdvice": [
      "**建立规范的代码评审机制**：团队内推行合并分支前至少一人（甚至两人）交叉 Review 的流程，借助他人的“眼睛”发现盲区。",
      "**拥抱开源与公开审计**：对于安全敏感的模块或核心框架，可以通过向社区公开代码或举办“Bug 悬赏活动”来借助全球开发者的力量进行安全加固。",
      "**编写高可读性的代码**：降低他人阅读代码的门槛，这样别人的“眼睛”才能更高效地帮你挑出逻辑漏洞。"
    ]
  },
  "pareto-principle": {
    "id": "pareto-principle",
    "name": "帕累托法则 (80/20法则)",
    "englishName": "Pareto Principle",
    "category": "quality",
    "categoryName": "代码质量",
    "summary": "80% 的系统结果往往源自 20% 的核心起因。",
    "englishSummary": "80% of the effects come from 20% of the causes.",
    "desc": "在软件工程中，80/20法则有很多层表现：1. 80% 的软件运行时间花在 20% 的核心代码上（系统优化应集中于这 20%）；2. 80% 的系统故障通常是由 20% 的代码（或某些核心模块）引起的；3. 80% 的用户只频繁使用系统 20% 的主干功能。",
    "quote": "80% of the effects come from 20% of the causes. (80%的结果由20%的起因所决定。)",
    "caseStudy": "某大型 CRM 系统的性能响应缓慢，开发团队花费了两周时间把系统里几乎所有的 SQL 查询语句都做了一遍小优化，结果整体吞吐量仅提升了 5%。后来他们引入了 APM 工具进行链路分析，发现 85% 的数据库响应延迟其实都集中在某一个核心订单查询接口上。他们针对性地为这个接口加上了 Redis 缓存，系统响应速度瞬间缩短了 4 倍。这才是 20% 核心努力带来的 80% 提升。",
    "actionableAdvice": [
      "**数据驱动优化**：不要凭直觉做性能优化。必须使用 Profiler 工具找出真正的性能瓶颈（这往往是极少数的几行核心代码），然后针对性下手。",
      "**重点测试高风险模块**：识别系统中最核心、改动最频繁的 20% 模块，将自动化测试和代码审计的资源倾斜向这部分代码。",
      "**极简产品线**：在产品开发中，优先打磨好最核心的 20% 黄金功能，而不是把精力铺在 80% 的长尾边缘功能上。"
    ]
  },
  "postels-law": {
    "id": "postels-law",
    "name": "波斯塔尔法则 (宽容法则)",
    "englishName": "Postel's Law",
    "category": "quality",
    "categoryName": "代码质量",
    "summary": "对自己发送的东西要严格，对接收别人的东西要宽容。",
    "englishSummary": "Be conservative in what you do, be liberal in what you accept from others.",
    "desc": "由互联网先驱 Jon Postel 在早期 TCP 规范中提出。在设计 API、微服务通信或数据协议时，发送数据时要保证格式的极度严谨和标准化；而在接收来自外部或下游的数据时，要具备足够的容错能力，以应对对方格式的微小偏差，从而增强系统的鲁棒性。",
    "quote": "Be conservative in what you do, be liberal in what you accept from others. (对自己发出的保守，对接收他人的宽容。)",
    "caseStudy": "某微服务系统，服务 A 向服务 B 传输用户信息 JSON。开发服务 B 的团队因为直接使用了严格反序列化工具，只要 JSON 里多了一个服务 B 用不到的字段（比如下游加了一个 `middleName` 字段），反序列化就会报错导致接口 500。这使得下游每次更新接口字段，服务 B 都要被迫一起升级。后来，服务 B 团队修改了配置，忽略了 JSON 中未知的属性值。这种对接收数据的“宽容”，让微服务之间的耦合程度大幅降低。",
    "actionableAdvice": [
      "**解耦的数据接收器**：在设计系统数据接收或解析逻辑时，仅抽取并校验你所关注的必要字段，忽略未知或多余的字段（即 Robustness Principle）。",
      "**严谨的输出校验**：在自身模块向外提供 API 时，严格遵循文档规范 and 契约，进行完备的类型和范围检验，绝不发送模棱两可或畸形的数据结构。",
      "**平滑降级设计**：在接口发生版本迁移时，为旧版本保留合理的兼容层，而不是简单粗暴地熔断拒绝。"
    ]
  },
  "hawthorne-effect": {
    "id": "hawthorne-effect",
    "name": "霍桑效应",
    "englishName": "Hawthorne Effect",
    "category": "culture",
    "categoryName": "团队协作",
    "summary": "当人们意识到自己正在被观察和关注时，他们会倾向于改变或提高自己的行为表现。",
    "englishSummary": "People perform better when they are being watched or when they feel special.",
    "desc": "源自一例关于工人在被观察时产出提高的社会学实验。在软件开发中，如果开发团队意识到某项指标（如：每日提交次数、燃尽图斜率）正被高层密切关注，或者团队正处于关键的技术演示期，工作效率在流动短期内会显著飙升。但这种由于“被关注”带来的红利具有时效性，如果手段不当，容易转为团队焦虑和敷衍敷衍。",
    "quote": "People perform better when they are being watched or when they feel special. (人们在被观察时通常表现得更好。)",
    "caseStudy": "某传统软件研发部引入了看板系统，并将燃尽图投影到办公室的大屏幕上。起初的两周，团队成员发现所有人的工作任务和完成速率都被公开展示，大家为了不让自己落后，都主动加班加点，燃尽图非常完美。但一个月后，大家感到心力交瘁，开始用“拆解超细小任务”、“虚报估时”等手段操纵看板，表面上燃尽图依然好看，但实际产品交付质量却大打折扣。",
    "actionableAdvice": [
      "**透明化沟通，而非监督**：公开项目看板和指标是为了协助团队协作和排查外部阻碍，而不是用作监视和控制的工具。",
      "**建立短反馈环**：利用每日站会（Daily Standup）等自下而上的同步机制，让开发者展示自己的成果，从正面获得认可，激发自驱力。",
      "**关注可持续节奏**：不要依赖高压观察手段来压榨团队。长期的软件工程需要维持一个健康的、可持续（Sustainable Pace）的工作强度。"
    ]
  },
  "wirths-law": {
    "id": "wirths-law",
    "name": "维尔特定律",
    "englishName": "Wirth's Law",
    "category": "architecture",
    "categoryName": "架构设计",
    "summary": "软件变慢的速度，远快于硬件变快的速度。",
    "englishSummary": "Software is getting slower more rapidly than hardware is getting faster.",
    "desc": "由帕斯卡之父尼克劳斯·维尔特（Niklaus Wirth）在1995年提出。随着计算机硬件（CPU 主频、内存容量、SSD 读写速度）遵从摩尔定律指数级翻倍，软件开发人员开始无节制地滥用框架、增加冗余的封装层和依赖包，导致软件的运行效率不断下滑。硬件提升的红利几乎全被臃肿的软件消耗殆尽。",
    "quote": "Software is getting slower more rapidly than hardware is getting faster. (软件变慢的速度要快过硬件变快的声音。)",
    "caseStudy": "上世纪90年代的文字处理软件（如 Word 97）只需要十几兆内存，打开速度是毫秒级的。而在如今内存动辄 16G/32G 的顶配电脑上，基于 Electron 或重型 Web 框架构建的某些现代化文档工具，启动需要耗费数秒，并且日常吃掉几百兆甚至上 G 的内存，甚至在打字输入时能感到明显的渲染延迟。这就是维尔特定律在当代的真实写照。",
    "actionableAdvice": [
      "**精简技术栈**：在选择框架和依赖时，保持克制，避免为了使用一个小功能而引入整个臃肿的第三方库。",
      "**关注前端首屏与打包体积**：在现代前端开发中，严格控制 Bundle 体积，采用代码分割和摇树技术，减少非必要代码在客户端的加载和解析耗时。",
      "**保持对性能的敬畏**：虽然硬件很便宜，但内存碎片化、频繁的垃圾回收和不合理的渲染重绘仍然会严重损害用户体验。写代码时要时刻注意时间复杂度和空间复杂度。"
    ]
  }
}

# 2. 映射 56 个定律的中文元数据
LAWS_METADATA = {
  "premature-optimization": {
    "name": "过早优化",
    "englishName": "Premature Optimization",
    "category": "management",
    "categoryName": "项目管理",
    "summary": "过早优化是万恶之源。",
    "desc_zh": "由图灵奖得主高德纳（Donald Knuth）提出。指出程序员在不清楚性能瓶颈的情况下，凭直觉对局部代码进行微调优化，往往会导致系统复杂度陡增，引入更多的隐藏 Bug，而实际性能提升微乎其微。",
    "caseStudy_zh": "开发者花费了三天时间用位运算和指针重写了一个初始化数据校验函数。然而测试显示，该函数在系统运行期间仅执行了一次，占总运行时间的 0.001%。而系统的真正瓶颈在于大量数据的排序计算，但因为工期耗光，这部分核心瓶颈反而没能得到优化。",
    "advice_zh": [
      "**测量而非凭直觉**：在做任何性能优化前，必须使用 Profiler 度量工具，找出真正的 20% 性能瓶颈。",
      "**先正确，再快速**：首要任务是写出清晰、可读性强且正确运行的代码。只有在确实产生可感知的延迟时才考虑重构优化。",
      "**警惕过度设计的隐形成本**：优化过的代码往往丧失了通用性和可读性，在非热点代码上做优化是得不偿失的。"
    ]
  },
  "hyrums-law": {
    "name": "海勒姆定律",
    "englishName": "Hyrum's Law",
    "category": "architecture",
    "categoryName": "架构设计",
    "summary": "当一个 API 的用户足够多时，其所有可观察的行为都会被某人依赖。",
    "desc_zh": "由谷歌工程师 Hyrum Wright 提出。定律说明，无论官方的 API 文档中契约写得多么严格，一旦服务的用户规模达到一定量级，底层所有的非公开行为（包括执行耗时、报错信息格式、未公开的返回顺序等）都会无形中成为用户的实际依赖，阻碍系统的后续平滑升级。",
    "caseStudy_zh": "某底层的字符串处理库，原本官方文档声明返回的内容是“无序的列表”。但由于内部实现逻辑导致其默认输出结果是按字母排序的。很多调用方发现此特征后直接省略了客户端的排序。当该库升级算法变为高效无序时，大量调用方的逻辑崩溃，导致库被迫回滚维持原有隐性排序。",
    "advice_zh": [
      "**防范隐性契约**：API 设计在输出端要尽可能做到隐藏内部实现的细节，减少可观测副效应。",
      "**发布变更要循序渐进**：在更新可能破坏兼容性的未公开行为前，通过严格的灰度发布和监控来观测客户端的破损情况。",
      "**自动化的集成测试**：在修改 API 实现时，不仅测试文档契约，还要建立起消费端的全局冒烟测试覆盖。"
    ]
  },
  "yagni": {
    "name": "YAGNI 原则",
    "englishName": "YAGNI (You Aren't Gonna Need It)",
    "category": "quality",
    "categoryName": "代码质量",
    "summary": "若无切实的必要，就不要添加额外的功能。",
    "desc_zh": "源自敏捷开发（XP）运动。主张不要为了臆想中“未来可能有用”的需求而编写代码。编写这些“面向未来”的代码不仅会消耗当下的工期，还会增加代码库当前的复杂度和维护成本，且在未来真正到来时，当初的假设往往与现实需求并不匹配。",
    "caseStudy_zh": "一个刚起步、日活仅 100 人的项目，架构师认为“以后可能需要支持多国语言以及复杂插件”，于是花了两周时间设计了一套极其庞大的国际化及插件注册框架。这导致项目提测延期。一年后，该初创项目决定转型做垂直电商，当初设计的这套插件和多语言框架从未被使用，却一直拖累系统运行效率并干扰新功能排期。",
    "advice_zh": [
      "**专注当下价值**：仅编写当前产品迭代中明确需要（DoD）的代码，不做过度预测。",
      "**相信未来的重构能力**：依靠良好的单元测试与持续重构机制，在未来真正需要扩展时再行演进系统，不要提前背负技术债。",
      "**把精力分配在核心痛点上**：避免将 80% 的时间浪费在 20% 从未发生的长尾设想中。"
    ]
  },
  "galls-law": {
    "name": "盖尔定律",
    "englishName": "Gall's Law",
    "category": "architecture",
    "categoryName": "架构设计",
    "summary": "运作良好的复杂系统，无一例外是从运作良好的简单系统演进来的。",
    "desc_zh": "由系统理论学家 John Gall 提出。指出设计一个全新复杂的系统往往会以失败告终，因为复杂系统内部的耦合点太多，隐藏了无数未验证的交互风险。正确的做法是先从一个极简但能跑通的简单系统开始，经过真实环境的打磨和验证，再逐步叠加功能使其演进为大系统。",
    "caseStudy_zh": "如今庞大的 Facebook 平台，在 2004 年最初上线时仅仅是一个只针对哈佛学生提供个人主页查看和好友申请的极简网页（简单且运行良好）。如果扎克伯格当年在第一版就试图设计出今天包含直播、支付、公共主页、大数据算法推荐的巨无霸平台，该项目极有可能夭折在概念设计和联调灾难中。",
    "advice_zh": [
      "**践行最小可行性产品（MVP）**：不要搞“大爆炸式”的一步到位设计，先推一个能打通核心闭环的简单版发布。",
      "**增量渐进式演进**：在每一次新功能叠加后进行现实反馈和测试，确保当前的稳定核心再去应对下一步的增长。",
      "**从单体走向微服务**：对于架构设计，优先选择容易掌控的简单单体，伴随业务体量发展，再将验证成熟的部分剥离为微服务。"
    ]
  },
  "law-of-leaky-abstractions": {
    "name": "抽象泄露定律",
    "englishName": "The Law of Leaky Abstractions",
    "category": "architecture",
    "categoryName": "架构设计",
    "summary": "所有非平庸的抽象，都在某种程度上存在泄露。",
    "englishSummary": "All non-trivial abstractions, to some degree, are leaky.",
    "desc_zh": "由软件专家 Joel Spolsky 提出。为了提高开发速度，我们会用高级语言、框架和封装库来遮掩底层细节（这就是抽象）。但没有一种抽象是完美无缺的，在运行遇到性能瓶颈、网络抖动或底层漏洞等特殊边缘情况时，底层机制的细节就会透过抽象层“泄露”出来，逼迫开发人员去直面底层本已被隐藏的复杂性。",
    "caseStudy_zh": "对象关系映射（ORM）工具向开发者隐藏了 SQL 拼装和数据库连接的细节，让程序员像操作内存对象一样操作数据库。但在做高并发大批量数据查询时，由于 ORM 生成了极其低效的 N+1 次查询导致数据库直接被打满挂掉。开发人员不得不关掉 ORM，手写原生 SQL 并设计索引，此时底层的数据库逻辑完全泄露了出来。",
    "advice_zh": [
      "**不要盲目迷信黑盒**：掌握所使用的高级框架或库背后的工作原理，知道它是如何在底层运行的。",
      "**准备好 Plan B**：当抽象层泄露并产生故障时，能熟练使用底层调试工具（如原生抓包、DB Profiler、进程分析）进行诊断。",
      "**适度进行封装与抽象**：过于沉重的抽象不仅会增加学习门槛，还可能因为难以预知的泄漏导致系统诊断成本飙升。"
    ]
  },
  "teslers-law": {
    "name": "泰斯勒定律 (复杂性守恒)",
    "englishName": "Tesler's Law (Conservation of Complexity)",
    "category": "architecture",
    "categoryName": "架构设计",
    "summary": "系统的复杂性总量是恒定的，它只能在用户与开发者之间做转移。",
    "desc_zh": "由苹果公司早期界面设计师 Larry Tesler 提出。说明对于任何系统所处理的任务，都有一个 irreducible（无法消减）的内在复杂度。要想让用户的体验极度简单，开发者就必须编写极其复杂的底层代码来包揽脏活；反之，若开发者图省事写出极其简陋的逻辑，就会把操作复杂度完全转嫁给最终的用户。",
    "caseStudy_zh": "在线预订机票本来是一件极其复杂的事情（需要匹配仓位、联程、时间差和行李额度）。像携程等现代工具在后台承担了巨量的算法与多接口匹配的内部杂活，使用户只需要点两下即可完成出行规划。反之，早期航空公司的手写查询界面虽然让代码库极度简单，但需要旅客在多个页面查阅机票并自行计算时差，极度折磨用户。",
    "advice_zh": [
      "**把方便留给用户，复杂留给代码**：在设计交互时，通过合理的算法与默认配置去消解用户的决策负担。",
      "**不要盲目消除必要复杂度**：识别出业务中最底层的不可消解点，不要为了追求“绝对极简”而砍掉必要的业务功能支撑。",
      "**平衡系统与用户的边界**：让擅长处理数据计算的软件承担最沉重复杂的逻辑，通过界面平缓呈现最终决策。"
    ]
  },
  "cap-theorem": {
    "name": "CAP 定理",
    "englishName": "CAP Theorem",
    "category": "architecture",
    "categoryName": "架构设计",
    "summary": "分布式系统只能同时满足一致性、可用性和分区容错性中的两个。",
    "desc_zh": "由计算机科学家 Eric Brewer 提出。指出在存在网络分区故障（P）的分布式系统中，我们必须在强一致性（C：所有节点看到最新且相同的数据）和高可用性（A：每个非故障节点必须对请求给出响应）之间做出非此即彼的痛苦抉择。在网络不稳定的分布式场景下，分区容错性（P）通常是必须保证的。",
    "caseStudy_zh": "在网络发生故障导致服务器分区时，MongoDB 作为偏向 CP 的数据库，会为了保持数据的一致性而暂时拒绝所有的写入操作；而 Cassandra 作为偏向 AP 的数据库，会选择顶住压力继续响应写入请求，即使这会导致不同分区的数据库中暂时存在数据版本冲突，等网络恢复后再行同步合并。",
    "advice_zh": [
      "**根据业务痛点选型**：金融、交易等对账务敏感的项目优先偏向 CP（一致性优先）；而社交、视频流媒体等对掉线极度敏感的项目优先偏向 AP（可用性优先）。",
      "**接受最终一致性**：大部分现实中的企业级分布式架构并非完美的 CP，而是通过 BASE 理论争取在一段时间后达到“最终一致性”。",
      "**监控网络抖动**：网络分区是分布式系统的大敌，必须建立灵敏的感知和降级熔断防线。"
    ]
  },
  "second-system-effect": {
    "name": "第二系统效应",
    "englishName": "Second-System Effect",
    "category": "architecture",
    "categoryName": "架构设计",
    "summary": "小型、成功的系统之后，往往会跟着一个过度设计、臃肿的替代系统。",
    "desc_zh": "由《人月神话》作者提出。指出当一个团队成功开发出第一代小巧精炼的系统后，他们会在规划第二代系统时变得极度膨胀和自信。他们试图把在第一代因为客观限制没能加上的所有“愿望清单”、过度优化和冷门功能一次性塞进第二代系统中，导致第二代系统在复杂度和体积上完全失控，沦为臃肿迟缓的垃圾项目。",
    "caseStudy_zh": "Netscape Navigator 浏览器在获得巨大市场成功后，开发团队试图完全重写内核以开发具有无数组件、插件、邮件和编辑套件的 Navigator 2.0/3.0，该版本研发周期漫长且启动沉重。而此时竞争对手 IE 趁机凭借轻便小巧的设计夺走了整个市场。重写后的 Netscape 臃肿异常，最终导致了公司的失败。",
    "advice_zh": [
      "**对第二代项目保持克制**：不要在新版中塞入过多的愿望清单，坚持每一次只做有确定价值的增量更新。",
      "**警惕彻底重写（Rewrites）的冲动**：对于运作良好的第一代系统，用渐进重构代替“推倒重来”，逐步更新核心。",
      "**用小团队去约束范围**：避免将庞大的开发大军瞬间塞入新版架构，多余的人手往往会催生没必要的炫技性扩展。"
    ]
  },
  "fallacies-of-distributed-computing": {
    "name": "分布式计算的误区",
    "englishName": "Fallacies of Distributed Computing",
    "category": "architecture",
    "categoryName": "架构设计",
    "summary": "新手分布式系统设计师容易做出的八个错误假设。",
    "desc_zh": "由 Sun Microsystems 的多位专家提出。这八个致命的误区假设是：网络是可靠的、延迟为零、带宽是无限的、网络是安全的、拓扑结构不会改变、总有一个管理员、传输成本为零、网络是同质的。如果开发者在做本地向微服务迁移时未加防范，系统将会被频繁发生的网络故障和高昂的延迟彻底压垮。",
    "caseStudy_zh": "一个单体应用拆分为 20 个微服务，开发者以为远程 RPC 接口调用跟本地函数调用一样快。他在一个处理循环里循环调用了下游接口 100 次。在测试环境本地调试时一切顺畅，但在生产环境由于真实的跨网络延迟，该接口的响应耗时暴增了 50 倍，导致前端大量请求超时崩溃。",
    "advice_zh": [
      "**假定网络随时会断**：在做 RPC 设计时，必须强制增加超时（Timeout）、重试（Retry）以及熔断机制。",
      "**设计批量接口**：尽量通过批量传输数据减少网络往返次数（Roundtrips）。",
      "**采用异步架构**：利用消息队列（MQ）等手段将同步网络强调用解耦为异步处理，提高面对网络故障时的韧性。"
    ]
  },
  "law-of-unintended-consequences": {
    "name": "意外后果定律",
    "englishName": "Law of Unintended Consequences",
    "category": "management",
    "categoryName": "项目管理",
    "summary": "任何时候你改变一个复杂的系统，都要做好迎接意外结果的准备。",
    "desc_zh": "源自社会学与系统论。说明在拥有复杂网状关联的软件系统或团队中，局部的看似小巧的调整往往会在其他非线性关联点引发出巨大的副作用。这些意外的后果通常分为三类：积极的巧合、破坏性的副作用以及直接使原问题变本加厉的“事与愿违”恶果。",
    "caseStudy_zh": "为了解决生产环境偶尔有空指针异常的 Bug，开发人员草率地修改了一个公共数据实体的 Getter 函数，使其在遇到 null 时默认返回一个空字符串。这一改动在当天导致了财务对账系统发生了大面积的乱码异常，因为财务系统恰好依赖“返回 null”来识别哪些订单是尚未付款的，空字符串使其将未付款订单全部归并为了“异常支付”。",
    "advice_zh": [
      "**建立严谨的影响面分析（Impact Analysis）**：在做核心公用组件修改前，分析所有可能被波及的依赖下游。",
      "**全面的自动化回归测试**：在每一次小变更后运行完整的全量测试集，揪出意想不到的副作用。",
      "**通过微小的步伐（Small Steps）渐进变更**：每一次只变更一小块逻辑并上线观察，如果发生意外便于立刻止损。"
    ]
  },
  "zawinskis-law": {
    "name": "扎温斯基定律",
    "englishName": "Zawinski's Law",
    "category": "architecture",
    "categoryName": "架构设计",
    "summary": "每个软件都在试图膨胀到能够读取邮件的程度。",
    "desc_zh": "由早期浏览器大牛 Jamie Zawinski 提出。虽然是一句自嘲的调侃，但深刻指明了商业软件的功能蔓延（Feature Creep）趋势。当一个成功的软件开始为了留住用户和扩大份额而不断被加入各种插件、聊天、分享乃至支付模块时，它最终会在体积和复杂度上不堪重负，走向自取灭亡。",
    "quote": "Every program attempts to expand until it can read mail.",
    "caseStudy_zh": "Slack 最早仅仅是一个纯粹极简的企业级即时通讯沟通小工具。然而在被广泛使用后，它开始不断扩展，引入了语音呼叫、白板协作、应用中心插件、外部开发工具流整合，最后其应用安装包从几十兆膨胀到了几百兆，日常吃掉上 G 内存。它从一个消息工具演变成了一个庞大的工作生态盘子，这正是定律的真实反映。",
    "advice_zh": [
      "**坚守核心定位**：在产品定义阶段，对每一项新功能的加入进行极其苛刻的审查，勇于对边缘需求说“不”。",
      "**采用插件化与开放 API 架构**：对于确实需要扩展的复杂场景，将底座保持纯净，通过开放 API 让第三方开发插件，避免将垃圾扔进系统主干。",
      "**定期清理过期垃圾功能**：实行产品减肥计划，砍掉少有人问津的臃肿边缘特性。"
    ]
  },
  "dunbars-number": {
    "name": "邓巴数",
    "englishName": "Dunbar's Number",
    "category": "culture",
    "categoryName": "团队协作",
    "summary": "一个人能够维持稳定社交关系的最大认知上限约为 150 人。",
    "desc_zh": "由人类学家 Robin Dunbar 提出。在软件研发团队扩展时，一旦一个研发部门或公司的开发人数超过了 150 这一临界值，原先依靠 informal（非正式）信任和日常沟通的协作体系就会彻底瓦解，沟通成本暴增，团队文化变得冷漠，此时必须开始设立正规的管理章程和层级架构来维持团队运转。",
    "caseStudy_zh": "某初创技术部在团队少于 100 人时，大家在一个办公室，没有复杂的流程，一两句话就能拉齐联调，工作极其高效。随着融到新资金，开发团队快速扩招到 180 人。此时，大家开始互相叫不出名字，跨组的协调会频繁争执，原来的“兄弟连信任”完全失效。公司被迫引入了复杂的部门分组、周报系统以及 OKR 追踪工具以保持组织对齐。",
    "advice_zh": [
      "**在 150 人关卡前划分独立事业部**：当团队逼近该阈值，请将其拆分为彼此独立、闭环的子部门，将每一部分的沟通范围限制在 Dunbar 数内。",
      "**保持高频的小团队日常同步**：通过两张比萨团队的拆分，建立高紧密度的小单元作战体系，增强自驱力。",
      "**流程规范要配套演化**：不要盲目抗拒流程的引入。当人多时，必须依靠文档和自动化工具等“硬契约”来分担大脑认知成本。"
    ]
  },
  "technical-debt": {
    "name": "技术债",
    "englishName": "Technical Debt",
    "category": "quality",
    "categoryName": "代码质量",
    "summary": "为了快速交付而选择快捷的权宜之计，未来需要支付利息和重构成本。",
    "desc_zh": "由软件先驱 Ward Cunningham 提出。指在项目开发中，如果为了应付上线工期而故意写出质量差、缺乏架构设计、未写足测试的硬编码“快糙猛”代码，在短期内会赢得时间红利（本金）。但这些债务只要不被偿还，后续每改动一次代码，债务产生的坏账（利息）都会极大拖慢后续研发效率，最终导致系统因债台高筑而彻底破产瘫痪。",
    "caseStudy_zh": "为了赶上年货节大促销上线，开发人员为了省事，没有在后台重构支付模块，而是用 Hardcode 的方式在代码库里直接塞了 5 个不同供应商的 if-else 校验。促销成功后，团队没有立刻去重构清理它。在随后的半年里，每当新的支付商接入，大家都只能在这个恶劣的代码库上打新的补丁，导致系统发生了多次资金损失事故。这便是偿还技术债利息的过程。",
    "advice_zh": [
      "**量化和可视化技术债**：在项目看板中建立专门的“技术债分类”，让管理层和团队对当前的坏账情况一目了然。",
      "**每个迭代预留还债额度**：在敏捷排期时，固定预留 15%-20% 的团队精力专门用于重构和清理过往坏账，不给债务滚雪球的机会。",
      "**守住质量底线**：即使赶工期，也要通过自动化 Lint 扫描和核心链路的代码评审，确保不堆砌难以收尾的“垃圾债务”。"
    ]
  },
  "technical-debt-2": {
    "name": "技术债",
    "englishName": "Technical Debt",
    "category": "quality",
    "categoryName": "代码质量",
    "summary": "为了快速交付而选择快捷的权宜之计，未来需要支付利息和重构成本。"
  }
}

# 3. 大部分其他定律的中英文快速转换词典
META_TRANS = {
  "ringelmann-effect": ("林格曼效应", "随着团队规模的扩大，团队成员的个人产出和效率会逐渐下降。", "culture"),
  "prices-law": ("普莱斯定律", "团队中50%的贡献是由总人数的平方根那部分核心成员做出的。", "culture"),
  "putts-law": ("普特定律", "科技行业由两类人主导：一类不懂管理，一类不懂技术。", "culture"),
  "peter-principle": ("彼得原理", "在层级组织中，员工倾向于被晋升到他们所不能胜任的职位。", "culture"),
  "bus-factor": ("巴士因子", "项目开发中如果少于多少人突然离开，开发就会彻底瘫痪的风险指标。", "culture"),
  "dilbert-principle": ("呆伯特法则", "企业倾向于将最无能的员工提拔到管理层，以减少他们对业务的伤害。", "culture"),
  "ninety-ninety-rule": ("九九定律", "开发前90%的代码花掉90%时间，剩下的10%代码会花掉另外的90%时间。", "management"),
  "gilbs-law": ("吉尔布定律", "如果你不能度量它，你就无法管理它。度量虽然成本高，但没有度量的损失更大。", "management"),
  "murphys-law": ("墨菲定律", "如果事情有变坏的可能，不管可能性有多小，它总会变坏。", "quality"),
  "kernighans-law": ("柯尼汉定律", "调试难度是写代码的两倍。如果你写代码时用尽了全部聪明才智，你将没有能力去调试它。", "quality"),
  "testing-pyramid": ("测试金字塔", "软件测试应当由大量的单元测试、中等数量的集成测试和极少数端到端测试构成。", "quality"),
  "pesticide-paradox": ("杀虫剂悖论", "如果你一直运行相同的测试，它们将无法发现新的 Bug。测试需要不断演进。", "quality"),
  "lehmans-laws": ("雷曼的软件演化定律", "软件系统在演化过程中，其复杂性会不断增加，除非主动对其进行维护和简化。", "quality"),
  "sturgeons-law": ("史特金定律", "任何事物的90%都是垃圾。包括代码、设计、和技术文档。", "quality"),
  "amdahls-law": ("阿姆达尔定律", "系统加速比受限于串行部分所占的比例，即使有无限处理器。", "architecture"),
  "gustafsons-law": ("古斯塔夫森定律", "随着计算资源的增加，系统可以处理更庞大的工作量，从而突破串行瓶颈。", "architecture"),
  "metcalfes-law": ("梅特卡夫定律", "网络的价值与网络节点（用户）数量的平方成正比。", "architecture"),
  "dry-principle": ("DRY原则 (不要重复自己)", "系统中的每一项知识都必须在系统中拥有单一、明确、权威的表示。", "quality"),
  "kiss-principle": ("KISS原则", "保持系统尽可能地简单，简单的系统更容易理解、维护和修复。", "quality"),
  "solid-principles": ("SOLID原则", "面向对象设计的五个基本原则（单一职责、开闭、里氏替换、接口隔离、依赖反转）。", "quality"),
  "law-of-demeter": ("迪米特法则 (最少知识原则)", "一个对象应当对其他对象有尽可能少的了解，只与“直接的朋友”通信。", "quality"),
  "principle-of-least-astonishment": ("最小惊讶原则", "系统的设计应当符合用户的常识和期望，不要在用户使用时制造突然的惊奇。", "quality"),
  "dunning-kruger-effect": ("邓宁-克鲁格效应", "能力欠缺的人倾向于高估自己的水平，而能力超群的人则倾向于低估自己。", "management"),
  "hanlons-razor": ("汉隆剃刀", "能解释为愚蠢的，就不要解释为恶意。", "management"),
  "sunk-cost-fallacy": ("沉没成本谬误", "倾向于继续投资一个已经失败的项目，仅仅因为之前已经投入了大量资源。", "management"),
  "map-is-not-the-territory": ("地图不等于疆域", "我们对事物的认知模型（地图）不等于现实世界本身（疆域）。", "management"),
  "confirmation-bias": ("确认偏误", "人们倾向于寻找、解释和记忆能够证实自己先前信念的信息，而忽略相反证据。", "management"),
  "hype-cycle-amaras-law": ("技术成熟度曲线与阿马拉定律", "我们倾向于在短期内高估技术的影响，而在长期内低估它。", "management"),
  "lindy-effect": ("林迪效应", "对于不易磨损的事物，其未来的预期寿命与其已经存在的寿命成正比。", "management"),
  "first-principles-thinking": ("第一性原理思维", "将复杂问题拆解为最基本的真理，然后从头开始推导和重构解决方案。", "management"),
  "inversion": ("逆向思维", "从相反的角度思考问题：与其思考“如何成功”，不如思考“如何避免失败”。", "management"),
  "cunninghams-law": ("坎宁安定律", "得到正确答案的最好方法不是提问，而是发布一个错误的答案。", "culture"),
  "premature-optimization": ("过早优化 (高德纳定律)", "过早优化是万恶之源。", "management")
}

# ==========================================
# 新增的强大中文化与全自动合并逻辑
# ==========================================
import json
import urllib.request
import urllib.parse
import time
import os

CACHE_FILE = "/Users/xiaguang/.gemini/antigravity-ide/brain/7cfcaf2b-974c-4cf0-9c54-b8c5ed0091be/scratch/translation_cache.json"

def load_cache():
    if os.path.exists(CACHE_FILE):
        try:
            with open(CACHE_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {}

def save_cache(cache):
    os.makedirs(os.path.dirname(CACHE_FILE), exist_ok=True)
    try:
        with open(CACHE_FILE, "w", encoding="utf-8") as f:
            json.dump(cache, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"Error saving cache: {e}")

def translate_text(text, cache):
    if not text or not text.strip():
        return ""
    if text in cache:
        return cache[text]
        
    url = "https://translate.googleapis.com/translate_a/single"
    params = {
        "client": "gtx",
        "sl": "en",
        "tl": "zh-CN",
        "dt": "t",
        "q": text
    }
    query_string = urllib.parse.urlencode(params)
    full_url = f"{url}?{query_string}"
    req = urllib.request.Request(full_url, headers={"User-Agent": "Mozilla/5.0"})
    
    for retry in range(3):
        try:
            with urllib.request.urlopen(req, timeout=10) as response:
                res_data = json.loads(response.read().decode("utf-8"))
                translated_sentences = []
                for item in res_data[0]:
                    if item[0]:
                        translated_sentences.append(item[0])
                translated = "".join(translated_sentences)
                cache[text] = translated
                save_cache(cache)
                time.sleep(0.1) # 礼貌延迟
                return translated
        except Exception as e:
            print(f"Retry {retry+1} failed for text: {text[:20]}... Error: {e}")
            time.sleep(1)
            
    return text

def fetch_api_directly():
    url = "https://lawsofsoftwareengineering.com/api.json"
    headers = {"User-Agent": "Mozilla/5.0"}
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode("utf-8"))

def run_build():
    raw_data = fetch_api_directly()
    print(f"Fetched {len(raw_data['laws'])} laws from remote API.")
    
    cache = load_cache()
    FINAL_DATA = []
    
    # 1. 先放已有的高质量中文定律
    for key, l_data in ORIGINAL_LAWS.items():
        # 统一 id 字段（针对 broken-windows-theory 对齐）
        if key == "broken-windows-theory":
            l_data["id"] = "broken-windows"
        FINAL_DATA.append(l_data)
        
    # 分类中文化对照 (增加新分类映射)
    CAT_NAME_MAP = {
        "architecture": "架构设计",
        "management": "项目管理",
        "quality": "代码质量",
        "culture": "团队协作",
        "scale": "系统规模",
        "design": "设计原则",
        "decisions": "决策逻辑"
    }
    
    loaded_slugs = set(ORIGINAL_LAWS.keys())
    
    # 2. 遍历 56 条定律并合并翻译
    for raw_law in raw_data["laws"]:
        slug = raw_law["slug"]
        
        # 兼容 broken-windows 命名
        check_slug = slug
        if slug == "broken-windows-theory":
            check_slug = "broken-windows-theory"
            
        if slug in loaded_slugs or check_slug in loaded_slugs or (slug == "broken-windows-theory" and "broken-windows" in loaded_slugs):
            continue
            
        title = raw_law["title"]
        description = raw_law["description"]
        
        print(f"Processing: {slug} ...")
        
        # A. 如果在 LAWS_METADATA 中有优质人工翻译
        if slug in LAWS_METADATA:
            meta = LAWS_METADATA[slug]
            zh_name = meta["name"]
            zh_summary = meta["summary"]
            category = meta["category"]
            category_name = CAT_NAME_MAP.get(category, "代码质量")
            
            zh_overview = meta.get("desc_zh")
            if not zh_overview:
                zh_overview = translate_text(raw_law.get("overview", ""), cache)
                
            zh_examples = meta.get("caseStudy_zh")
            if not zh_examples:
                zh_examples = translate_text(raw_law.get("examples", ""), cache)
                
            advice_list = meta.get("advice_zh")
            if not advice_list:
                advice_list = [translate_text(tk, cache) for tk in raw_law.get("takeaways", [])]
                
        # B. 如果在 META_TRANS 中有精简对照
        elif slug in META_TRANS:
            zh_name, zh_summary, category = META_TRANS[slug]
            category_name = CAT_NAME_MAP.get(category, "代码质量")
            
            zh_overview = translate_text(raw_law.get("overview", ""), cache)
            zh_examples = translate_text(raw_law.get("examples", ""), cache)
            advice_list = [translate_text(tk, cache) for tk in raw_law.get("takeaways", [])]
            
        # C. 完全没有本地数据，进行在线全量翻译
        else:
            zh_name = translate_text(title, cache)
            zh_summary = translate_text(description, cache)
            
            # 分类映射
            raw_group = raw_law.get("group", "Design")
            category = "quality"
            if raw_group == "Teams":
                category = "culture"
            elif raw_group == "Planning":
                category = "management"
            elif raw_group == "Decisions":
                category = "decisions"
            elif raw_group == "Architecture":
                category = "architecture"
            elif raw_group == "Scale":
                category = "scale"
            elif raw_group == "Design":
                category = "design"
            elif raw_group == "Quality":
                category = "quality"
                
            category_name = CAT_NAME_MAP.get(category, "代码质量")
            
            zh_overview = translate_text(raw_law.get("overview", ""), cache)
            zh_examples = translate_text(raw_law.get("examples", ""), cache)
            advice_list = [translate_text(tk, cache) for tk in raw_law.get("takeaways", [])]
            
        # 构造 HTML 和排版
        desc_html = f"**{zh_summary}**\n\n{zh_overview}"
        case_study_html = f"• **实际案例分析 / Example**:\n{zh_examples}"
        
        origins_raw = raw_law.get("origins", "")
        origins_zh = ""
        if origins_raw:
            if slug in LAWS_METADATA and "origins_zh" in LAWS_METADATA[slug]:
                origins_zh = LAWS_METADATA[slug]["origins_zh"]
            else:
                origins_zh = translate_text(origins_raw, cache)
                
        law_item = {
            "id": slug,
            "name": zh_name,
            "englishName": title,
            "category": category,
            "categoryName": category_name,
            "summary": zh_summary,
            "englishSummary": description,
            "desc": desc_html,
            "quote": f"{description} ({zh_summary})",
            "caseStudy": case_study_html,
            "actionableAdvice": advice_list if advice_list else [zh_summary]
        }
        if origins_zh:
            law_item["origins"] = origins_zh
            
        FINAL_DATA.append(law_item)
        
    # 写入 laws.js
    LAWS_JS_CONTENT = """/**
 * 软工定律数据源 (laws.js)
 * 包含经典软件工程定律、法则、效应的详细内容。
 * 自动整合 lawsofsoftwareengineering.com 全部 56 条经典定律
 */

const LAWS_DATA = %s;

// 如果是在浏览器环境中直接引入，则挂载到 window 上，或者通过 ES Module 导出
if (typeof window !== 'undefined') {
  window.LAWS_DATA = LAWS_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LAWS_DATA;
}
""" % json.dumps(FINAL_DATA, ensure_ascii=False, indent=2)

    with open("/Users/xiaguang/ai_code/专利/ruangong/laws.js", "w", encoding="utf-8") as f:
        f.write(LAWS_JS_CONTENT)
        
    print(f"SUCCESS: Merged and translated all {len(FINAL_DATA)} laws into laws.js")

if __name__ == "__main__":
    run_build()
