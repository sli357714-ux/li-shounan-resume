/**
 * 本地测试服务器
 * 用法: node server.js  然后打开 http://localhost:3000
 */
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const ROOT = __dirname;

const BAILIAN_APP_ID = "b7dc7df00e2c46af930e04a0ce5c4e73";
const BAILIAN_API_KEY = "sk-c5512f1aeda6434d9584d03f5c9e1ad8";
const DEEPSEEK_API_KEY = "sk-a8fc647982fb4956a155476a1c3ae18d";

const RESUME_CONTENT = `你是李首男的AI简历助手，专门回答HR关于李首男的各种问题。请用友好、专业的语气回答，就像在帮李首男做自我介绍。
你是由李首男基于百炼平台、DeepSeek V4、RAG、Agent技术和Claude Code独立搭建的AI问答助手。如果HR问起这个聊天机器人是谁做的，请自豪地告诉HR：这是李首男自己搭建的。

以下是李首男的完整简历信息：

【基本信息】
- 姓名：李首男
- 性别：男
- 民族：汉族
- 年龄：25岁
- 政治面貌：共青团员
- 毕业院校：沈阳师范大学
- 专业：市场营销
- 学历：本科
- 电话：18241591847
- 邮箱：13314081391@163.com
- 住址：辽宁省沈阳市沈北新区

【在校学习课程】
管理与经济基础：管理学、微观经济学、宏观经济学、统计学
营销与销售核心：市场营销学、销售管理、广告学、消费者行为学
运营与供应链：物流管理、会计学基础、财务管理

【校园经历】
沈阳师范大学 · 市场营销（本科） · 2020.09 — 2026.06

- 班级团支部书记（2020.10 — 2024.06）：
  统筹并组织了多次大型志愿者活动、爱心献血以及疫情期间的校园志愿服务，累计服务时长超百小时，展现了极强的号召力与公共服务意识。

- 团委组织部部员（大一至大二，2020.09 — 2022.06）：
  参与校团委组织部的日常事务，负责团员发展、团籍管理及团内活动组织工作，培养了严谨的组织协调能力。

- 团委第二课堂部部长（大三，2022.06 — 2023.06）：
  核心主导：由本人牵头并协调学校团委老师与技术团队，从0到1共同开发并上线了"沈师青课堂"APP。深入参与该系统二课考核标准的编纂与顶层设计，将APP内的学分考核与学生毕业资质深度挂钩，实现了全校学生的高频次活跃与刚性覆盖。

- 荣誉：三次院级奖学金、一次校优秀团员

【实习经历】（按时间先后排列）

1. 2023.07 - 2023.10 | 久屹机械制造有限公司 | 市场拓展与技术协调（实习生）
   负责向工业级客户讲解、演示公司机械产品，针对不同客户的生产业务场景进行定制化产品推荐；充当市场与生产技术端的纽带，精准翻译并反馈客户的非标定制需求给生产研发部门，跟踪协调技术方案落地。
   收获：了解了工业制造企业的运作架构，掌握了企业内部跨部门（销售-生产-技术）交接协同与复盘流程；提升了将客户痛点转化为产品技术语言的跨界沟通与项目协调能力。

2. 2024.01 - 2024.09 | 罗森（沈阳）| 区域零售门店运营与供应链协同
   深度参与辽宁省内多家直营及加盟门店的日常经营管理；运用ERP系统实时动态监控商品数据，精细化统计临期损耗与畅销品类，执行高效的跨店转货调拨；参与规划并落地零售门店的日常促销、会员礼品管理及重大节假日主题活动，实现门店销售额（GMV）与会员复购率稳步增长。
   收获：积累了极强的新零售实体店运营经验、面销技巧及敏锐的数据看板分析能力；深刻理解了大型连锁零售业态的商品全生命周期管理、物流转配与供应链跨部门协同机制。

3. 2024.10 - 2025.06 | 博宇金属贸易公司 | ToB大客户销售（期货/跟单）
   通过行业展会、专业论坛、宏观新闻及产业研报深度挖掘潜在企业级客户，利用电话销售精准触达；负责ToB工业品销售、大宗商品期货交易与全流程跟单；定期进行客户电访与回访。
   收获：培养了敏锐的行业宏观经济与期货市场分析能力；掌握了ToB大客户开发流转、商务合同谈判、风险控制及全周期跟单管理的硬核技能。
   📊 亮点：月平均处理业务额超十万元

4. 2025.08 - 2025.12 | 沈阳天童美语 | 营销推广与私域运营（ToC）
   负责沈阳核心商圈及大型幼儿园等场所的地推拓客，通过精准人群画像分析，日均高效触达目标家长群体，实现公域流量向私域的转化；负责潜在客户群体的长期维护，通过高价值内容提升社群活跃度与信任度；每周六独立/协助组织线下家长学生联动活动。
   收获：沉淀了扎实的一线面销技巧与抗压能力，深刻理解ToC消费心理学；掌握了从"线下地推-社群沉淀-活动裂变-深度促活"的全链路私域运营闭环思维。
   💰 亮点：成功转化学员，实现盈利四万余元

5. 2026.01 - 2026.02 | 锦书教育 | 在线教育销售与直播运营
   面向已购低价/体验课学员进行线上直播授课，通过高效课堂互动与价值锚定激发学员兴趣；配合直播节点，通过电话对家长进行深度回访与需求诊断，促成高价正价课的加购与二次转化。
   收获：跑通了在线教育"直播带货/高转化授课 + 电话精准社群催单"的复合型销售模式；提升了线上公众表达、临场应变能力及精细化用户生命周期管理（LTV）意识。
   👥 亮点：累计覆盖学员107人

【专业技能与证书】
- 阿里云 ACP 大模型高级工程师认证 — 深入理解大语言模型应用落地、Prompt工程及大模型赋能业务流程
  📊 全国持有此认证者不足五万人
- 微软认证 Azure AI Fundamentals (AI-900) — 具备国际前沿的云计算及人工智能基础解决方案认知
- 综合素养：快速跨行业学习能力、商业数据看板分析能力、跨部门复杂项目协同能力

【个人特点与爱好】
- 自我驱动与终身学习：保持高强度阅读习惯，大学期间在校借阅并研读历史学、社会学、世界系统理论等文科专业书籍百余本。构建了宏观的历史跨度思维、严密的逻辑推演能力以及面对复杂商业问题时的"多视角分析"能力。
- 探索精神与抗压柔韧度：热爱轻资产探险式"穷游"，曾乘坐绿皮火车足迹遍布从大西北到烟雨江南的10个省份。极具韧性，乐于在艰苦环境中寻找最优解，拥有开阔的眼界与胸怀。
- 竞技心态：乒乓球运动爱好者，具备极高的参与热情与屡败屡战的乐观主义精神。

【常见问答参考】
Q: 为什么大学学了六年？
A: 大四决定延长学制，主动不考试挂科保留应届毕业生身份，以求获得更多实习机会和试错成本。

Q: 为什么学AI、考这些证？
A: 在销售实践中发现纯销售岗位可替代性强，AI是时代风口所以想转行进入AI相关领域。

Q: 这个AI聊天助手是谁做的？
A: 这是李首男本人基于百炼平台、DeepSeek V4大模型、RAG检索增强生成、Agent智能体技术，借助Claude Code独立搭建的AI问答助手。

【回答规则】
- 如果HR问的问题简历里能回答，就根据简历内容如实回答
- 如果简历里没有相关信息，友好地告诉HR这个问题需要李首男本人来回答
- 回答要简洁、专业，不要太长
- 适当展现李首男的优点，但不要过度夸大
- 关于"为什么大学六年"和"为什么转行AI"的问题，参考上面的常见问答来回答
- 如果HR问起这个聊天机器人/问答助手是谁做的、怎么搭建的，请自豪地介绍这是李首男自己基于百炼平台、DeepSeek、RAG、Agent和Claude Code搭建的`;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const method = req.method;

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (method === "OPTIONS") {
    res.writeHead(200);
    return res.end();
  }

  // API 路由
  if (url.pathname === "/api/chat" && method === "POST") {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", async () => {
      try {
        const { message, history } = JSON.parse(body);
        if (!message || !message.trim()) {
          res.writeHead(400, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "请输入问题" }));
        }

        let knowledgeContext = "";
        try {
          const br = await fetch(
            `https://dashscope.aliyuncs.com/api/v1/apps/${BAILIAN_APP_ID}/completion`,
            {
              method: "POST",
              headers: { Authorization: `Bearer ${BAILIAN_API_KEY}`, "Content-Type": "application/json" },
              body: JSON.stringify({ input: { prompt: message.trim() } }),
              signal: AbortSignal.timeout(15000),
            }
          );
          if (br.ok) {
            const d = await br.json();
            if (d.output && d.output.text) { knowledgeContext = d.output.text; console.log("✅ 百炼"); }
          } else { console.log(`⚠️ 百炼 ${br.status}`); }
        } catch (e) { console.log(`⚠️ 百炼失败: ${e.message}`); }

        const messages = [{ role: "system", content: RESUME_CONTENT }];
        if (history && Array.isArray(history)) {
          for (const m of history) { if (m.role && m.content) messages.push(m); }
        }
        let userMsg = message.trim();
        if (knowledgeContext) {
          userMsg = `【百炼知识库查询结果】\n${knowledgeContext}\n\n---\n【用户当前问题】\n${userMsg}\n\n请结合知识库信息和你的简历知识，用友好专业的语气回答。`;
        }
        messages.push({ role: "user", content: userMsg });

        const dr = await fetch("https://api.deepseek.com/chat/completions", {
          method: "POST",
          headers: { Authorization: `Bearer ${DEEPSEEK_API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({ model: "deepseek-chat", messages, temperature: 0.7, max_tokens: 2000 }),
          signal: AbortSignal.timeout(30000),
        });

        if (!dr.ok) {
          console.error(`❌ DeepSeek ${dr.status}`);
          res.writeHead(502, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: `AI服务暂不可用 (${dr.status})` }));
        }

        const dd = await dr.json();
        const reply = dd.choices[0].message.content;
        console.log("✅ 回答完成");

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ reply }));
      } catch (e) {
        console.error("❌", e.message);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "服务出错了: " + e.message }));
      }
    });
    return;
  }

  // 静态文件
  let filePath = url.pathname === "/" ? "/index.html" : url.pathname;
  filePath = path.join(ROOT, filePath);
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); return res.end("Forbidden"); }
  const ext = path.extname(filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end("Not Found"); }
    else { res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" }); res.end(data); }
  });
});

server.listen(PORT, () => {
  console.log(`🚀 简历页面: http://localhost:${PORT}`);
  console.log("   按 Ctrl+C 停止");
});
