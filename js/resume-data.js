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
    linkedin: "", // 填你的 LinkedIn 链接，例如 "https://www.linkedin.com/in/xxx"

    // 个人简介：两种语言都留空时，页面显示预留框
    about: L("", ""),

    experience: [
      {
        org: L("USWOO", "USWOO"), role: L("Realty Agent", "房产经纪人"),
        when: ["2025-04", "now"], where: L("Boston, MA", "波士顿"),
        points: [
          L("Conducted market research and data analysis on rental trends, pricing, and property performance to advise clients and identify competitive opportunities.",
            "针对租赁趋势、定价和房源表现开展市场调研与数据分析，为客户提供建议并发掘竞争机会。"),
          L("Built a personal brand through social media, networking, and community engagement to acquire clients and expand market presence.",
            "通过社交媒体、人脉拓展和社区活动打造个人品牌，多渠道获客并扩大市场影响力。"),
          L("Managed the client relationship database, tracking communication history, lead status, and contract timelines across all transactions.",
            "管理客户关系数据库，跟踪沟通记录、线索状态与合同节点，确保每笔交易记录准确有序。")
        ]
      },
      {
        org: L("Trip.com", "携程 Trip.com"), role: L("Data Analyst", "数据分析师"),
        when: ["2024-09", "2025-01"], where: L("Shanghai, China", "上海"),
        points: [
          L("Engineered scalable ETL pipelines in MySQL and Python for 2M+ customer records, automating rule-based user segmentation across multiple business units.",
            "用 MySQL 和 Python 搭建可扩展的 ETL 流程，处理 200 万+ 客户记录，并自动化基于规则的用户分群，支持多个业务部门的大规模行为分类。"),
          L("Designed and deployed 50+ Tableau dashboards on live data sources, enabling self-serve real-time KPI monitoring across marketing campaigns and e-commerce funnels.",
            "基于参数化模板设计并上线 50+ 个连接实时数据源的 Tableau 看板，让跨部门团队自助实时监控营销活动与电商漏斗的 KPI。"),
          L("Built SQL-based revenue forecasting models to project market size and identify growth opportunities; recommendations were adopted by senior leadership.",
            "构建基于 SQL 的收入预测模型，测算市场规模、识别增长机会，相关建议被高层采纳。")
        ]
      },
      {
        org: L("Momentum Solar", "Momentum Solar"), role: L("Canvasser", "上门拓客专员"),
        when: ["2023-09", "2024-04"], where: L("Orlando, FL", "奥兰多"),
        points: [
          L("Developed and delivered customized proposals for 80+ households through systematic property assessment and data collection.",
            "通过系统化的房屋评估和数据收集，为 80+ 户家庭定制并讲解方案。"),
          L("Built long-term client relationships through structured follow-up, driving referral business and expanding market reach.",
            "通过结构化回访维护长期客户关系，带来转介绍业务并扩大市场覆盖。")
        ]
      },
      {
        org: L("EasyTransfer", "EasyTransfer"), role: L("Marketing Database and Research", "市场数据库与研究"),
        when: ["2023-06", "2023-09"], where: L("Beijing, China", "北京"),
        points: [
          L("Architected a SQL Server pipeline automating extraction across 30+ state-level datasets with validation logic, improving processing efficiency by 80%.",
            "搭建 SQL Server 数据管道，自动抽取 30+ 个州级数据集，并加入校验逻辑标记异常，整体处理效率提升 80%。"),
          L("Scripted Tableau report automation producing 3 standardized weekly intelligence reports, saving 60 labor hours per month.",
            "编写 Tableau 报表自动化脚本，每周生成 3 份标准化分析报告，每月节省 60 小时人工。"),
          L("Developed Excel-based predictive models of client transaction behavior, reducing profit loss by 8% and improving customer retention by 15%.",
            "用 Excel 建立客户交易行为预测模型，找出运营低效环节，使利润损失减少 8%、客户留存率提升 15%。")
        ]
      },
      {
        org: L("University of Florida", "佛罗里达大学"), role: L("Teaching Assistant, ECO4421 Econometrics", "助教，ECO4421 计量经济学"),
        when: ["2023-01", "2023-05"], where: L("Gainesville, FL", "盖恩斯维尔"),
        points: [
          L("Supported instruction of statistical modeling and econometric methods for 44 students, guiding them on regression models and quantitative research.",
            "协助 44 名学生学习统计建模与计量经济学方法，就回归模型与定量研究提供个别指导。"),
          L("Held 20+ hours of office hours with targeted academic guidance and study strategies.",
            "累计 20+ 小时答疑，提供有针对性的学习建议。")
        ]
      },
      {
        org: L("The Selling Factory", "The Selling Factory"), role: L("Sales Intern", "销售实习生"),
        when: ["2022-06", "2022-07"], where: L("Gainesville, FL", "盖恩斯维尔"),
        points: [
          L("Completed 75 hours of intensive sales training in lead research, prospecting, and cold calling.",
            "完成 75 小时销售强化培训，掌握线索调研、客户开发与电话陌拜技巧。"),
          L("Contacted 800+ businesses, generating 100 sales-ready leads for account executives at a 12.5% conversion rate.",
            "外呼 800+ 家企业，为客户经理筛选出 100 条有效销售线索，转化率 12.5%。")
        ]
      },
      {
        org: L("Kingdee International Software Group", "金蝶国际软件集团"), role: L("Marketing Expansion", "市场拓展"),
        when: ["2020-09", "2021-01"], where: L("Shenzhen, China", "深圳"),
        points: [
          L("Analyzed logistics process data and coordinated cost-saving actions, improving working efficiency by 20%.",
            "分析公司物流流程数据并推动降本措施落地，工作效率提升 20%。"),
          L("Averaged 500 calls a day with 40+ prospects and 10 acquisitions; a sales FAQ built from call analysis lifted sales efficiency by 35%.",
            "日均外呼约 500 通，触达 40+ 潜在客户、成交约 10 位；基于通话分析编写销售 FAQ，使销售效率提升 35%。"),
          L("Provided technical support through remote product demos, improving customer satisfaction and trust.",
            "通过远程演示为客户提供技术支持，提升客户满意度与信任。")
        ]
      }
    ],

    education: {
      schoolsImage: "assets/schools.jpg", // 学校定位截图（左）
      photo: "assets/photo.jpg",          // 个人照片（右），替换这个文件即可
      degrees: [
        { school: L("Northeastern University", "美国东北大学"), degree: L("M.S. in Analytics, Statistical Modeling", "分析学硕士，统计建模方向"), when: ["2025", "2027"] },
        { school: L("University of Florida", "佛罗里达大学"), degree: L("B.A. in Economics & Business Administration", "经济学与工商管理 文学学士"), when: ["2019", "2023"] }
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
          { href: "projects/cancer-forecast/", label: L("View interactive dashboard", "查看交互看板"), primary: true },
          { href: "https://github.com/xavierhe0630/personalweb/blob/main/projects/cancer-forecast/cancer_forecast_model.py", label: L("Model code", "模型代码") }
        ]
      },
      {
        org: L("Python, Flask, Azure SQL, Azure OpenAI, Leaflet, Chart.js", "Python, Flask, Azure SQL, Azure OpenAI, Leaflet, Chart.js"),
        role: L("Retail Site-Selection Decision Support", "零售选址决策支持系统"),
        points: [
          L("Built an AI-driven web app applying a Huff gravity model over 149 neighborhoods and 4,000+ points of interest to predict daily visits and market share for candidate retail locations across 20+ categories.",
            "开发 AI 驱动的 Web 应用，在包含 149 个社区、4,000+ 兴趣点的 Azure SQL 数据集上应用 Huff 引力模型，预测 20+ 业态候选门店的日访客量与市场份额。"),
          L("Architected an AI-as-controller chatbot with Azure OpenAI tool calling, so the assistant gathers inputs conversationally and calls the real prediction engine instead of fabricating numbers.",
            "用 Azure OpenAI 工具调用实现“AI 作为控制器”的聊天助手：助手通过对话收集输入，再调用真实的预测引擎，而不是编造数字。"),
          L("Engineered a competitor-intelligence feature mapping rival stores within 3 miles on an interactive Leaflet map, alongside a Chart.js results dashboard.",
            "开发竞品情报功能，在交互式 Leaflet 地图上展示 3 英里内竞品门店的距离、规模与客流，并配合 Chart.js 结果看板。"),
          L("Implemented tiered confidence labels and precision guardrails; supported continuous deployment to Azure App Service via GitHub Actions.",
            "设置分级置信度标签与精度护栏，保证预测可信；通过 GitHub Actions 持续部署到 Azure App Service。")
        ],
        preview: "projects/site-selection/preview.jpg",
        links: [
          { href: "projects/site-selection/", label: L("Try the interactive demo", "试用交互演示"), primary: true },
          { href: "https://alsds-team1-app-e3fed9azh2fpb4ej.eastus-01.azurewebsites.net/", label: L("Full app on Azure", "Azure 完整版") }
        ]
      }
    ],

    leadership: [
      {
        org: L("Northeastern University", "美国东北大学"), role: L("Member, Graduate Student Government", "研究生会（GSG）成员"), when: ["2025-05", "now"],
        points: [
          L("Represented graduate student interests on the GSG council, on initiatives for academic integrity, judicial standards, and diversity.",
            "在研究生会理事会代表研究生利益，参与推动学术诚信、司法规范与多元包容相关事项。"),
          L("Evaluated funding proposals, petitions, and referenda, and administered Graduate Activity Fee allocations in line with university policy.",
            "审核经费申请、请愿与公投，并按校规分配研究生活动经费。")
        ]
      },
      {
        org: L("Northeastern University", "美国东北大学"), role: L("Vice President, Chinese Students and Scholars Association", "中国学生学者联合会（CSSA）副主席"), when: ["2025-01", "now"],
        points: [
          L("Directed financial operations and the annual budget, with internal controls for full policy compliance.",
            "主管财务与年度预算，建立内部控制，确保符合学校财务规定。"),
          L("Served as primary liaison with university administration for event approvals and planning.",
            "作为与校方的主要联络人，负责活动审批与筹备协调。")
        ]
      },
      {
        org: L("University of Florida", "佛罗里达大学"), role: L("Director of Student Service Department, Chinese Students Association", "中国学生会 学生服务部部长"), when: ["2020-02", "2022-04"],
        points: [
          L("Built communication channels for 3,000+ Chinese international students and scholars.",
            "为 3,000+ 名中国留学生和学者搭建信息沟通渠道，帮助他们适应当地生活。"),
          L("Organized events of 500+ attendees, including the Chinese New Year Gala and New Student Orientation.",
            "组织 500+ 人规模的春节晚会和新生迎新等大型活动。")
        ]
      },
      {
        org: L("University of Florida", "佛罗里达大学"), role: L("Member, American Marketing Association", "美国市场营销协会（AMA）成员"), when: ["2019-08", "2023-05"],
        points: [
          L("Studied DEIA integration in marketing strategy through a case study led by AMA’s Director of DEIA, and took part in Immersion Experiences, SPARKS, and Apex programming.",
            "通过 AMA 的 DEIA 总监主导的案例研究，探讨如何将多元、公平、包容与无障碍理念融入营销策略；参与 Immersion Experiences、SPARKS 和 Apex 等项目。")
        ]
      }
    ],

    community: [
      {
        org: L("Hebrew SeniorLife", "Hebrew SeniorLife"), role: L("Healthcare Volunteer", "医疗志愿者"), when: ["2025-07", "now"], where: L("Boston, MA", "波士顿"),
        points: [
          L("Maintained clinical data records for 100+ senior residents, coordinating daily health monitoring and medication tracking with nursing staff.",
            "为 100+ 名长者住户维护健康记录，协调日常健康监测与用药跟踪，并及时向护理人员同步。"),
          L("Documented needs assessments and outcomes for 50+ resident cases, supporting auditable quality assurance.",
            "为 50+ 例住户事务完成需求评估与结果记录，支持护理质量审核。"),
          L("Provided bilingual English/Mandarin patient support and tracked wellness program participation.",
            "提供中英双语陪护支持，并跟踪健康项目的参与情况。")
        ]
      },
      {
        org: L("ENGin", "ENGin"), role: L("Instructor", "英语讲师"), when: ["2025-03", "now"], where: L("Online", "线上"),
        points: [
          L("Teaches weekly English sessions to Ukrainian learners, adapting the curriculum to each learner’s progress.",
            "每周为乌克兰学员上英语课，根据学员进度调整课程内容。")
        ]
      },
      {
        org: L("Haven Hospice", "Haven Hospice"), role: L("Patient & Caregiver Volunteer", "病人与家属志愿者"), when: ["2022-06", "2022-09"], where: L("Gainesville, FL", "盖恩斯维尔"),
        points: [
          L("Delivered end-of-life care to elderly patients, including those with Alzheimer’s disease, working with nurses, physicians, social workers, and therapists.",
            "为老年病人（包括阿尔茨海默病患者）提供临终关怀，与护士、医生、社工和治疗师协作。")
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
