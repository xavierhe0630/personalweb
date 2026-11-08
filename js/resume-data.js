/* =========================================================
   简历内容（中英双语）
   修改简历只需要改这个文件，主站和独立简历页会同时更新。
   每条内容写成 L("英文", "中文")。
   日期写成 "2025-04"，正在进行写 "now"。
   ========================================================= */
(function () {
  function L(en, zh) { return { en: en, zh: zh }; }

  window.RESUME = {
    name: "Yixuan He",
    tagline: L("M.S. Analytics, Northeastern University", "美国东北大学 分析学硕士在读"),
    location: L("Boston, MA", "波士顿"),
    email: "xavierhe0630@gmail.com",
    linkedin: "https://www.linkedin.com/in/yixuan-he-7b23b7237/",

    // 顶部照片（替换 assets/portrait.jpg 即可换照片）
    heroPhoto: "assets/portrait.jpg",

    experience: [
      {
        org: L("USWOO", "USWOO"), role: L("Realty Agent", "房产经纪人"),
        when: ["2025-04", "now"], where: L("Boston, MA", "波士顿"),
        points: [
          L("Research rental trends, pricing, and property performance through structured data collection, turning the findings into recommendations that help clients spot competitive opportunities.",
            "通过结构化的数据收集研究租赁趋势、定价和房源表现，把分析结果转化为建议，帮助客户发现有竞争力的机会。"),
          L("Build a personal brand across social media, professional networking, and community events, using multiple channels to acquire clients and grow market presence.",
            "通过社交媒体、人脉拓展和社区活动打造个人品牌，多渠道获客并扩大市场影响力。"),
          L("Maintain the client relationship database, tracking communication history, lead status, and contract timelines so every transaction stays organized and accurately recorded.",
            "维护客户关系数据库，跟踪沟通记录、线索状态和合同节点，确保每笔交易有条理、记录准确。")
        ]
      },
      {
        org: L("Trip.com", "携程 Trip.com"), role: L("Data Analyst", "数据分析师"),
        when: ["2024-09", "2025-01"], where: L("Shanghai, China", "上海"),
        points: [
          L("Engineered scalable ETL pipelines in MySQL and Python to extract, transform, and load 2M+ customer records, and automated rule-based user segmentation scripts that enabled large-scale behavioral classification across multiple business units.",
            "用 MySQL 和 Python 搭建可扩展的 ETL 流程，抽取、转换并加载 200 万+ 条客户记录；编写基于规则的用户分群自动化脚本，支持多个业务部门的大规模用户行为分类。"),
          L("Designed and deployed 50+ Tableau dashboards from parameterized templates on live data sources, giving cross-functional stakeholders self-serve, real-time KPI monitoring across marketing campaigns and e-commerce funnels.",
            "基于参数化模板设计并上线 50+ 个连接实时数据源的 Tableau 看板，让跨部门团队能自助、实时地监控营销活动和电商漏斗的 KPI。"),
          L("Built SQL-based revenue forecasting models that aggregated multi-dimensional sales data to project market size and surface growth opportunities, then translated the outputs into strategic recommendations adopted by senior leadership.",
            "构建基于 SQL 的收入预测模型，汇总多维度销售数据以测算市场规模、发现增长机会，并将结果转化为战略建议，被公司高层采纳。")
        ]
      },
      {
        org: L("Momentum Solar", "Momentum Solar"), role: L("Canvasser", "上门拓客专员"),
        when: ["2023-09", "2024-04"], where: L("Orlando, FL", "奥兰多"),
        points: [
          L("Developed and presented customized proposals for 80+ households through systematic property assessment and data collection, translating each client’s needs into viable, cost-effective solutions.",
            "通过系统化的房屋评估和数据收集，为 80+ 户家庭定制并讲解方案，把每位客户的需求转化为可行且划算的解决方案。"),
          L("Built and maintained long-term client relationships through structured follow-up and consistent outreach tracking, driving referral business and expanding market reach.",
            "通过结构化回访和持续的跟进记录维护长期客户关系，带来转介绍业务并扩大市场覆盖。")
        ]
      },
      {
        org: L("EasyTransfer", "EasyTransfer"), role: L("Marketing Database and Research", "市场数据库与研究"),
        when: ["2023-06", "2023-09"], where: L("Beijing, China", "北京"),
        points: [
          L("Architected a SQL Server pipeline that automated data extraction across 30+ state-level datasets, with built-in validation logic to flag anomalies and protect output integrity, improving overall processing efficiency by 80%.",
            "搭建 SQL Server 数据管道，自动抽取 30+ 个州级数据集，并内置校验逻辑标记异常、保证输出准确，整体处理效率提升 80%。"),
          L("Scripted Tableau report automation that produced 3 standardized weekly intelligence reports, applying rule-based pattern detection to surface data trends and saving 60 labor hours per month.",
            "编写 Tableau 报表自动化脚本，每周生成 3 份标准化分析报告，用基于规则的模式识别发现数据趋势，每月节省 60 小时人工。"),
          L("Developed Excel-based predictive models of client transaction behavior whose forecasts exposed operational inefficiencies and guided process improvements, reducing profit loss by 8% and raising customer retention by 15%.",
            "用 Excel 建立客户交易行为预测模型，找出运营中的低效环节并指导流程改进，使利润损失减少 8%、客户留存率提升 15%。")
        ]
      },
      {
        org: L("University of Florida", "佛罗里达大学"), role: L("Teaching Assistant, ECO4421 Econometrics", "助教，ECO4421 计量经济学"),
        when: ["2023-01", "2023-05"], where: L("Gainesville, FL", "盖恩斯维尔"),
        points: [
          L("Supported instruction in statistical modeling and econometric methods for 44 students, giving individualized guidance on data analysis techniques, regression models, and quantitative research.",
            "协助 44 名学生学习统计建模与计量经济学方法，就数据分析技巧、回归模型和定量研究提供一对一指导。"),
          L("Held 20+ hours of office hours, building rapport with students and offering targeted academic guidance and study strategies to strengthen their comprehension and performance.",
            "累计 20+ 小时答疑，与学生建立良好关系，提供有针对性的学业指导和学习方法，帮助他们加深理解、提高成绩。")
        ]
      },
      {
        org: L("The Selling Factory", "The Selling Factory"), role: L("Sales Intern", "销售实习生"),
        when: ["2022-06", "2022-07"], where: L("Gainesville, FL", "盖恩斯维尔"),
        points: [
          L("Completed 75 hours of intensive sales training, building proficiency in lead research, prospecting strategy, and cold calling.",
            "完成 75 小时销售强化培训，熟练掌握线索调研、客户开发策略和电话陌拜技巧。"),
          L("Contacted 800+ businesses through outbound calls, qualifying prospects and generating 100 sales-ready leads for account executives at a 12.5% conversion rate.",
            "外呼 800+ 家企业，筛选潜在客户，为客户经理产出 100 条可跟进的销售线索，转化率 12.5%。")
        ]
      },
      {
        org: L("Kingdee International Software Group", "金蝶国际软件集团"), role: L("Marketing Expansion", "市场拓展"),
        when: ["2020-09", "2021-01"], where: L("Shenzhen, China", "深圳"),
        points: [
          L("Gathered and analyzed logistics process data to identify patterns and cost drivers, then coordinated cost-saving actions that improved working efficiency by 20%.",
            "收集并分析公司物流流程数据，找出规律和成本来源，协调推进降本措施落地，工作效率提升 20%。"),
          L("Averaged 500 calls a day, reaching 40+ potential customers and about 10 new acquisitions daily; analyzed call content to distill effective techniques into a sales FAQ that raised sales efficiency by 35%.",
            "日均外呼约 500 通，每天触达 40+ 位潜在客户、成交约 10 位；分析通话内容、总结有效话术并编写销售 FAQ，使销售效率提升 35%。"),
          L("Provided technical support through professional remote product demos, improving customer satisfaction and trust.",
            "通过专业的远程产品演示为客户提供技术支持，提升客户满意度和信任。")
        ]
      }
    ],

    education: {
      photo: "assets/education.jpg", // 教育经历的照片，替换这个文件即可
      // 每所学校一行：学校名、学位或阶段、年份（可不填）、定位卡片截图
      schools: [
        { school: L("Northeastern University", "美国东北大学"), degree: L("M.S. in Analytics, Statistical Modeling", "分析学硕士，统计建模方向"), when: ["2025", "2027"], map: "assets/card-neu.jpg" },
        { school: L("University of Florida", "佛罗里达大学"), degree: L("B.A. in Economics & Business Administration", "经济学与工商管理 文学学士"), when: ["2019", "2023"], map: "assets/card-uf.jpg" },
        { school: L("The High School Attached to Northwest Normal University", "西北师范大学附属中学"), degree: L("High school, Lanzhou", "高中，兰州"), map: "assets/card-sdfz.jpg" },
        { school: L("Lanzhou No. 11 Middle School", "兰州市第十一中学"), degree: L("Middle school, Lanzhou", "初中，兰州"), map: "assets/card-l11.jpg" },
        { school: L("Yizhichuan Primary School", "一只船小学"), degree: L("Primary school, Lanzhou", "小学，兰州"), map: "assets/card-yzc.jpg" }
      ]
    },

    // 项目：preview 是缩略图，links 是按钮（站内链接同页打开，外部链接新标签打开）
    project: [
      {
        org: L("Python (pandas, NumPy, SciPy), D3.js", "Python（pandas、NumPy、SciPy）、D3.js"),
        role: L("U.S. Cancer Incidence & Mortality Forecasting, 2014–2030", "美国十大癌症发病率与死亡率预测（2014–2030）"),
        points: [
          L("Forecast age-adjusted incidence and mortality rates for the ten most common U.S. cancers through 2030 from SEER 2014–2023 data, with 95% prediction intervals.",
            "基于 SEER 2014–2023 年数据，预测美国十大常见癌症到 2030 年的年龄标化发病率与死亡率，并给出 95% 预测区间。"),
          L("Combined a log-linear trend model (with a 2020 indicator so the pandemic dip doesn’t bias the slope) and a damped-trend model (φ = 0.8) into an ensemble forecast.",
            "将对数线性趋势模型（加入 2020 年指示变量，避免疫情导致的下降拉低趋势）与阻尼趋势模型（φ = 0.8）组合为集成预测。"),
          L("Validated by refitting on 2014–2019 and scoring on 2021–2023: the ensemble cut mortality forecast error to 2.5% MAPE versus 5.0% for a no-change baseline, and matched the baseline for incidence.",
            "用 2014–2019 年数据重新训练、在 2021–2023 年回测：死亡率预测误差（MAPE）为 2.5%，比“不变”基准的 5.0% 降低一半；发病率与基准持平。"),
          L("Quantified the 2020 diagnosis gap at 4–14% below trend across sites, and built an interactive D3.js dashboard with a site explorer, ranking race, incidence-versus-mortality chart, and sortable summary table.",
            "量化 2020 年的诊断缺口（各癌种比趋势低 4–14%），并用 D3.js 搭建交互看板，包含癌种浏览、排名变化动画、发病与死亡趋势对比图和可排序汇总表。")
        ],
        preview: "projects/cancer-forecast/preview.jpg",
        links: [
          { href: "projects/cancer-forecast/", label: L("View interactive dashboard", "查看交互看板"), primary: true }
        ]
      },
      {
        org: L("Python, Flask, Azure SQL, Azure OpenAI, Leaflet, Chart.js", "Python, Flask, Azure SQL, Azure OpenAI, Leaflet, Chart.js"),
        role: L("Retail Site-Selection Decision Support", "零售选址决策支持系统"),
        points: [
          L("Built an AI-driven web app that applies a Huff gravity model over an Azure SQL dataset of 149 neighborhoods and 4,000+ points of interest to predict visits and market share for candidate retail locations across 20+ business categories.",
            "开发 AI 驱动的 Web 应用，在包含 149 个社区、4,000+ 兴趣点的 Azure SQL 数据集上应用 Huff 引力模型，预测 20+ 业态候选门店的客流与市场份额。"),
          L("Architected an AI-as-controller chatbot with Azure OpenAI tool calling, so the assistant gathers inputs conversationally and calls the real prediction engine instead of fabricating numbers.",
            "用 Azure OpenAI 工具调用实现“AI 作为控制器”的聊天助手：助手通过对话收集输入，再调用真实的预测引擎，而不是编造数字。"),
          L("Engineered a competitor-intelligence feature that surfaces rival stores within a 3-mile radius with their distance, size, and foot traffic, plotted on an interactive Leaflet map alongside a Chart.js results dashboard.",
            "开发竞品情报功能，找出 3 英里内的竞争门店并展示距离、规模与客流，在交互式 Leaflet 地图上呈现，并配合 Chart.js 结果看板。"),
          L("Implemented tiered confidence labels and precision guardrails to keep predictions trustworthy, and resolved production defects while supporting continuous deployment to Azure App Service via GitHub Actions.",
            "设置分级置信度标签和精度护栏，保证预测可信；修复线上问题，并通过 GitHub Actions 持续部署到 Azure App Service。")
        ],
        preview: "projects/site-selection/preview.jpg",
        links: [
          { href: "projects/site-selection/", label: L("Demo Present", "项目演示"), primary: true }
        ]
      }
    ],

    leadership: [
      {
        org: L("Northeastern University", "美国东北大学"), role: L("Member, Graduate Student Government", "研究生会（GSG）成员"),
        when: ["2025-05", "now"],
        points: [
          L("Represent graduate student interests on the GSG council, advancing initiatives that promote academic integrity, judicial standards, and diversity across the graduate community.",
            "在研究生会理事会代表研究生利益，推动学术诚信、司法规范和多元包容相关的项目。"),
          L("Evaluate and approve funding proposals, petitions, and referenda that support graduate student initiatives and partnerships with external organizations.",
            "审核并批准经费申请、请愿与公投，支持研究生发起的项目及与校外机构的合作。"),
          L("Administer Graduate Activity Fee allocations to eligible students and organizations, ensuring compliance with university policy while maximizing the impact of student resources.",
            "向符合条件的学生和组织分配研究生活动经费，在遵守校规的同时让学生资源发挥最大作用。")
        ]
      },
      {
        org: L("Northeastern University", "美国东北大学"), role: L("Vice President, Chinese Students and Scholars Association", "中国学生学者联合会（CSSA）副主席"),
        when: ["2025-01", "now"],
        points: [
          L("Direct the association’s financial operations and annual budget, implementing internal controls that ensure full compliance with university financial policies.",
            "主管学联的财务运作和年度预算，建立内部控制制度，确保完全符合学校财务规定。"),
          L("Coordinate event logistics as the primary liaison with university administration, securing approvals and streamlining the planning process.",
            "作为与校方的主要联络人统筹活动后勤，争取审批并简化筹备流程。")
        ]
      },
      {
        org: L("University of Florida", "佛罗里达大学"), role: L("Director of Student Service Department, Chinese Students Association", "中国学生会 学生服务部部长"),
        when: ["2020-02", "2022-04"],
        points: [
          L("Created and managed communication channels for 3,000+ Chinese international students and scholars, easing their transition to Gainesville and American culture.",
            "为 3,000+ 名中国留学生和学者建立并管理信息沟通渠道，帮助他们适应盖恩斯维尔的生活和美国文化。"),
          L("Organized large-scale events of 500+ attendees, including the Chinese New Year Gala and New Student Orientation, strengthening community ties and helping incoming students settle into campus life.",
            "组织 500+ 人规模的大型活动，包括春节晚会和新生迎新，加强社区联系，帮助新生融入校园生活。")
        ]
      },
      {
        org: L("University of Florida", "佛罗里达大学"), role: L("Member, American Marketing Association", "美国市场营销协会（AMA）成员"),
        when: ["2019-08", "2023-05"],
        points: [
          L("Examined how diversity, equity, inclusion, and accessibility principles can be built into marketing strategy through a case study led by AMA’s Director of DEIA.",
            "通过 AMA 的 DEIA 总监主导的案例研究，探讨如何将多元、公平、包容与无障碍理念融入营销策略。"),
          L("Took part in AMA’s Immersion Experiences, SPARKS, and Apex programs, building a foundation in hands-on marketing practice and industry skills.",
            "参与 AMA 的 Immersion Experiences、SPARKS 和 Apex 项目，打下实战营销和行业技能的基础。")
        ]
      }
    ],

    community: [
      {
        org: L("Hebrew SeniorLife", "Hebrew SeniorLife"), role: L("Healthcare Volunteer", "医疗志愿者"),
        when: ["2025-07", "now"], where: L("Boston, MA", "波士顿"),
        points: [
          L("Maintain accurate clinical data records for 100+ senior residents, coordinating daily health monitoring and medication tracking and keeping nursing staff informed of patient status, contributing to measurable improvements in care coordination.",
            "为 100+ 名长者住户维护准确的健康记录，协调日常健康监测与用药跟踪，及时向护理人员同步住户状况，切实提升护理协作质量。"),
          L("Conduct structured needs assessments and document resolution outcomes for 50+ resident cases involving safety incidents, applying data integrity standards and cross-department coordination to keep case records accurate and auditable.",
            "针对 50+ 起涉及安全事件的住户个案开展结构化需求评估并记录处理结果，遵循数据完整性标准、跨部门协作，确保个案记录准确、可审核。"),
          L("Provide bilingual English–Mandarin support that removes language barriers for residents, and track wellness program participation data to measure engagement and inform program improvements.",
            "提供中英双语陪护支持，消除住户的语言障碍；跟踪健康项目的参与数据，评估参与度并为项目改进提供依据。")
        ]
      },
      {
        org: L("ENGin", "ENGin"), role: L("Instructor", "英语讲师"),
        when: ["2025-03", "now"], where: L("Online", "线上"),
        points: [
          L("Lead structured weekly English sessions for Ukrainian learners, tracking each learner’s progress and adapting the curriculum based on performance to improve conversational proficiency.",
            "每周为乌克兰学员开展结构化的英语课程，跟踪每位学员的进度，并根据表现调整课程内容，提升口语能力。"),
          L("Foster an inclusive, culturally responsive learning environment that builds vocabulary, pronunciation accuracy, and confident communication in real-world contexts.",
            "营造包容、尊重文化差异的学习氛围，帮助学员积累词汇、提高发音准确度，并能在真实场景中自信交流。")
        ]
      },
      {
        org: L("Haven Hospice", "Haven Hospice"), role: L("Patient & Caregiver Volunteer", "病人与家属志愿者"),
        when: ["2022-06", "2022-09"], where: L("Gainesville, FL", "盖恩斯维尔"),
        points: [
          L("Delivered end-of-life care to elderly patients, including those with Alzheimer’s disease, and kept patient condition records accurate and current so the clinical team always had complete information.",
            "为老年病人（包括阿尔茨海默病患者）提供临终关怀，及时、准确地记录病人状况，确保医疗团队随时掌握完整信息。"),
          L("Collaborated with an interdisciplinary team of nurses, physicians, social workers, and therapists to monitor patient status and support care planning, maintaining paper-based clinical records under hospice documentation protocols.",
            "与护士、医生、社工和治疗师组成的跨专业团队协作，监测病人状况、支持护理计划，并按照临终关怀记录规范维护纸质病历。")
        ]
      }
    ],

    skills: [
      { label: L("Programming & Analytics", "编程与分析"), items: ["Python", "MySQL", "SQL Server", "R Studio", "Tableau", "Excel / Google Sheets", "Microsoft Office", "VS Code"] },
      { label: L("Design & Media", "设计与媒体"), items: ["Premiere Pro", "Photoshop", "Illustrator", "Aegisub", "Processing"] },
      { label: L("Languages", "语言"), items: [L("Chinese (native)", "中文（母语）"), L("English (fluent)", "英语（流利）"), L("Japanese", "日语"), L("Russian", "俄语")] }
    ],

    certs: [
      { name: L("Critical Thinking, Decision-Making, and Problem-Solving", "批判性思维、决策与问题解决"), when: "2025-06" },
      { name: L("Python for Data Science and AI", "面向数据科学与 AI 的 Python"), when: "2024-03" },
      { name: L("SQL for Data Analysis", "SQL 数据分析"), when: "2023-09" },
      { name: L("Sales Development Certificate", "销售拓展证书"), when: "2022-07" },
      { name: L("Project Management Essential Certification (PMEC)", "项目管理基础认证（PMEC）"), when: "2022-06" },
      { name: L("Dementia Care: Understanding Alzheimer’s Disease", "失智照护：认识阿尔茨海默病"), when: "2022-05" }
    ],

    // 照片墙：把照片放进 assets 文件夹，然后在 src 填路径，例如 "assets/work-1.jpg"
    gallery: [
      { src: "", caption: L("Main photo: your favorite work photo", "主图位：最想展示的一张工作照"), big: true },
      { src: "", caption: L("USWOO showings", "USWOO 看房 / 带客现场") },
      { src: "", caption: L("Trip.com team or office", "Trip.com 团队或办公室") },
      { src: "", caption: L("CSSA events", "CSSA 活动现场") },
      { src: "", caption: L("Hebrew SeniorLife volunteering", "Hebrew SeniorLife 志愿服务") },
      { src: "", caption: L("Project screenshot: site-selection app", "项目截图：选址决策系统") }
    ]
  };
})();
