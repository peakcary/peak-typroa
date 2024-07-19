# 深度｜AI Agent 开源和创业项目大盘点，Agent 基础设施正在崛起

原创 SenseAI [深思SenseAI](javascript:void(0);) *2024年07月10日 09:30* *上海*



“

“When everyone is looking for gold, it's a good time to be in the pick and shovel business.”

​                   ——Mark Twain



“当每个人都在寻找黄金时，正是卖镐和铲子的好时机。”

“













AI 崛起，能够自主规划并执行多个步骤的 Agents，正成为用户的接口，也成为开发者的核心着力点。



近期美国风投 Madrona 合伙人 John Turow 发表了一篇行业洞察**《The Rise of AI Agent Infrastructure》**，分享了 agent 领域的观察和思考，他谈到尽管当前 Agent 存在明显局限，但丝毫不影响 Agent 激增的势头，并推动着新的基础设施不断发展**。本文希望通过盘点文章中出现的项目，窥探 Agent 基础设施发展现状以及突出的项目情况。**



Agent 领域的研究进展可观，在一些技术细节上有了初步共识。



从 MRKL、ReAct、BabyAGI 和 AutoGPT 等工作开始，开发者们意识到**链式的提示和响应可以使大模型将任务拆解成小任务并执行**；



LangChain、Griptap 等框架展示了 Agents 通过代码与 API 交互的能力。 Toolformer 和 Goriila 等研究表明，**基础模型可以有效使用 API。**



微软（autogen）、斯坦福（AgentSims）和腾讯的研究里揭示了 **Agents 协同工作能带来比单 Agent 工作更好的效果。**





不可否认的说，今天的 Agents 还有很多局限性，例如经常出错、需要指导，在带宽、成本、延迟和用户体验上都还有很大的优化空间。这些局限反映了 LLM 本身与基础设施的局限性，开发者们努力通过工程能力来弥补这一点，并随之加速着 Agents 基础设施的搭建。





**支撑 Agents 的基础设施**



在 AI Agents 基础设施的早期时代，多数 Agents 是直接构建完成的。通常需要用于管理 agent 的云主机、存储记忆与状态的数据库、从外部来源获取上下文的连接器，以及用于调用外部 API 的能力。



![图片](https://mmbiz.qpic.cn/mmbiz_png/ib1O2Vnf2BvKTFm3MgjYCecfHjvak72squiadibZurwYcTUdnqApaFPndwMexsibQApGvDFSFqNv8ITAmlXTrialxIA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

*早期 AI Agent Infra 情况*

在当前，我们仍处于手工制作 Agents 的时代。对开发人员来说，短期内最有效的方式是构建一个基础设施，满足开发人员手工制作 Agents 网络的需求。随着时间推移，前沿模型将引导更多的工作流程，开发人员可以专注于产品和数据。



有人说，在模型成熟之前，构建应用仿佛在流沙上搭建城堡，而这些基础设施可能为应用或代理创建者提供了一层缓冲带，用于灵活适配并保持底层基础设施的相对稳定和持续迭代。



**![图片](https://mmbiz.qpic.cn/mmbiz_png/ib1O2Vnf2BvKTFm3MgjYCecfHjvak72sqnYUibGOjw5SqhfJxrmDzC4wdd0EnvyvSwcqRb97pot1EicZJaibBnE7LA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)**

*AI Agent Infra 现状*



整体来说，目前 AI Agent 技术栈分为**平台、记忆、规划与编排、执行和应用** 5 个板块，我们将通过后文逐一介绍。

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/ib1O2Vnf2BvKTFm3MgjYCecfHjvak72sqFLW0VCCmtK5Pq0atQlLIb4KddK5jbvXia4AdBoxG3tQ8ia62oibXS89Cg/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

*AI Agent 分层概念图*





**01****.**

**平台层**











**Agent 开发框架**



开发框架是用于构建、部署和管理 agent 综合平台。**提供模块化的组件、集成接口和工作流设计**，简化了开发者创建复杂AI应用的过程。支持数据处理、任务调度、上下文管理等功能，帮助实现高效、安全和可扩展的 AI 解决方案。



**LangChain**

LangChain 是一个围绕 LLM 构建的框架，适用于构建聊天机器人、生成式问答( GQA ) 、摘要等应用。

优势：多语言支持、模块化设计、丰富的组件和集成结构、完善的生态系统；

劣势：学习曲线陡峭、依赖外部 AI 服务和 API，可能增加集成和维护成本；

适合：多语言支持和模块化设计的应用开发；



**LlamaIndex**

LlamaIndex 前身为 GPT-Index，是一个创新的数据框架，旨在简化外部知识库和大型语言模型的集成，包括各种文件格式，例如 PDF 和 PowerPoint，以及 Notion 和 Slack 等应用程序，甚至 Postgres 和 MongoDB 等数据库。



![图片](https://mmbiz.qpic.cn/mmbiz_png/ib1O2Vnf2BvI0MUuYw7VjemfHCFeyUYBVVLxOLUkC4Uh4NxnrBaZgEKUbSQic1icFcNoa2w9tZCUtpzMoZh3IK4dA/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

*LlamaIndex*

优势：数据检索方面深度优化、支持多种数据结构；

劣势：功能单一、社区和资源支持相对较少；

适合：数据索引和检索优化场景；



**Semantic Kernel**

Semantic Kernel 是一个集成了 OpenAI、Azure OpenAI、Huggingface的SDK，特别之处在于它能够自动与 AI 协调插件，借助 Semantic Kernel 规划器，实现用户独特目标的计划。

![图片](https://mmbiz.qpic.cn/mmbiz_png/ib1O2Vnf2BvI0MUuYw7VjemfHCFeyUYBVgVywslTN17YZg6nQSaHdLhjpRFwCLplyGelZVj1T8ib3zjia5bT5vLMg/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

*Semantic Kernel*

优势：企业级支持、强大的自动化和扩展性，通过插件和计划生成器执行计划；

劣势：初始设置复杂、依赖微软生态；

适合：企业级应用，需高度可扩展性和稳定性的场景；



**Griptape**

Griptape 是一个模块化 Python 框架，用于构建 AI 驱动的应用程序，包含结构、记忆、任务、工具等多个模块。

优势：结构化工作流确保操作的可预测性和可靠性、模块化设计、安全和性能优化好；

劣势：初始学习曲线较陡、社区和资源支持较少；

适合：构建复杂 AI 工作流和代理，注重可预测性、安全性和性能的场景；



**Agent 托管**



**Agent Hosting 是指在服务器或云基础设施上部署和运行 AI Agent。**托管这些代理需要提供所需的计算资源、安全性和拓展性，以及能够高效可靠的运行。



**Ollama**，是这个方向最受关注的项目之一。提供了一整套用于下载、运行和管理 LLMs 的工具和服务，用户可以在本地设备上高效部署和操作 agent。适合需要快速部署和管理 AI 服务的中小型企业和独立开发者。



**LangServe**，将 AI 链（模型和工作流）作为 REST API 进行部署，简化了将复杂 AI 模型集成到生成环境中的过程，提供稳定可拓展的 API 接口。适用于需要将 AI 功能通过 API 提供服务的企业和应用。



**E2B**，开源的安全云环境，专门为 AI 应用和 AI Agent 提供运行时环境。它通过提供隔离的沙箱环境，使 AI 代理和应用能够在云中安全地执行代码。适合用于构建和部署需要安全运行环境的 AI 代理和应用，特别是在代码执行和数据处理方面。



**Agent 评估**



用于评估 AI Agent 性能和质量的工具。通常通过 Agent 响应的准确性、检索数据与问题的相关性、响应的性能、安全性和用户反馈等方式来进行评估。



**AgentOps 和 BrainTrust**强调全生命周期的代理管理和评估，注重自动化和安全性。

**Context**专注于对话系统的评估，提升用户体验和对话质量。

**LangSmith 和 LangFuse** ，提供了全面的评估和调试工具，适用于需要详细追踪和分析 LLM 应用的团队。

**WhyLabs**强调实时监控和异常检测，适用于需要确保模型在生产环境中稳定运行的场景。



![图片](https://mmbiz.qpic.cn/mmbiz_png/ib1O2Vnf2BvKTFm3MgjYCecfHjvak72sqK7Bcm1pRSvjyEgtowdHNl3mGlsPjFCU1o6FxwXRSj3o3BH3ucWrRWQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

*LangSmith*



**Developer Tools**



Developer Tools 提供了多样化的解决方案，帮助开发者高效地创建、管理和优化 AI Agent。无论是全面自动化的开发助手（**Morph**）、分步编程和调试工具（**FlowPlay AI**），还是支持自然语言编程的创新 IDE（**Wordware**），这些工具都为不同需求和场景提供了有力支持。

**
**

**02****.**

**记忆层**



**个性化（记忆）**



指根据用户的历史行为、偏好和特定需求，动态调整和定制 AI 代理的响应和功能。**这有助于提升用户体验，使得 AI 代理更具相关性和响应性。**



**WhyHowAI****：**提供个性化推荐和响应优化。借助 WhyHow，开发人员可以自动创建知识图谱并将其与现有工作流程集成，构建有效的 RAG 解决方案。

**Cognee****：**通过分析用户交互数据，提供个性化服务。

**Graphlit****：**利用用户数据进行个性化推荐。

**LangMem****：**专注于个性化记忆功能，使 AI 代理能够记住用户的偏好和历史交互。

**MemGPT****：**结合 GPT 模型进行个性化响应生成。MemGPT 代表 Memory-GPT，是一种旨在通过引入更先进的内存管理方案来提高大型语言模型 (LLM) 性能的系统，有助于克服固定上下文窗口带来的挑战。



![图片](https://mmbiz.qpic.cn/mmbiz_png/ib1O2Vnf2BvKTFm3MgjYCecfHjvak72sqSVlgd4e6iayicccWCUia5f21a9fkTuOcn7IsnB9p4ECSjXkUDTEamS8Bg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

*WhyHowAI*



**存储**



存储是指为 Agent 提供高效、可靠的数据存储解决方案。**这些存储系统需要能够处理大量的数据，并支持快速的读写操作，以确保 AI 模型的高效运行。**



**Pinecone****：**专注于高性能的向量数据库，支持快速的数据检索。

**C****hroma****：**提供高效的数据存储解决方案，开源的向量数据库，专为AI和嵌入式应用设计。

**Weaviate****：**开源的向量数据库，支持基于内容的检索和存储。

**MongoDB****：**流行的 NoSQL 数据库，提供灵活的存储和检索功能。



**上下文（Context）**

指 AI Agent 能够理解和利用对话或任务中的上下文信息，以提供更加准确和相关的响应。**这一层次的技术确保了 Agent 能够保持连贯性，并理解更复杂的用户需求。**



**Unstructure：**开源项目，致力于提供强大的上下文管理功能，使 AI 代理能够理解和利用对话或任务中的上下文信息，从而提供更加连贯和智能的响应。





**03****.**

**规划和编排层**



**持久化**



数据在系统长期保存和可用性，**这包括将重要数据（如用户交互、任务状态和执行日志）安全地保存到数据库或其他存储介质，以便在需要时能够可靠地检索和使用。**



**Inngest****：**事件驱动的持久化工作流引擎，支持在任何平台上运行。提供 SDK 在现有代码库中编写持久函数和工作流，可通过 HTTP 端点进行调用，无需额外的基础设施管理。**该项目获得了 a16z 领投的 610 万美金。**



![图片](https://mmbiz.qpic.cn/mmbiz_png/ib1O2Vnf2BvI0MUuYw7VjemfHCFeyUYBVv3Qia5RCr1OeRQLVQiaQhoGibYpG2sePY8QYaNoKBib2MRUI5soTOMqhiag/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

**
**

**Hatchet****：**一个端到端的任务编排平台，支持分布式、容错任务队列，旨在解决并发、公平性和速率限制等扩展问题，支持复杂任务编排和可视化 DAG（有向无环图）工作流设计，以确保工作流的组织和可预测性。**YC W24 布局了该项目**，其愿景是在后台使用异步任务运行缓慢的 OpenAI 请求，将复杂的任务串联到工作流中，并设置重试和超时以从故障中恢复。



![图片](https://mmbiz.qpic.cn/mmbiz_jpg/ib1O2Vnf2BvI0MUuYw7VjemfHCFeyUYBVPO2Fw3iblqK3Xsy00h5iaq7ibepbu0q3JDS6GOogTsZcYmia3tXGZsKxPg/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)



**Temporal****：**一个开源的工作流和编排系统，支持任务的持久化存储，确保任务的可靠执行和恢复能力。

**Trigger.dev**：通过事件驱动的方式，提供任务和工作流的持久化管理，帮助开发者更好地管理复杂任务。



**编排**



**编排是指协调和管理不同 AI 组件和服务，以确保它们在预定的流程中高效地协同工作。**



**DSPy****：**通过模块化和声明式的方法，DSPy 的核心是引入一种结构化的、以编程为中心的方法，取代传统的提示工程，允许用户以更清晰和高效的方式构建和优化复杂的 AI 系统。该架构由斯坦福的研究人员开发，目前在 Github 获得 1.4 万颗星。

**A****utoGen****：**微软开发的开源框架，自动生成和管理 AI 模型及其相关的工作流，简化了模型开发和部署的过程。AutoGen 提供多代理对话框架作为高级抽象。

**Sema4.ai****：**提供智能编排解决方案，用于优化和自动化机器学习和 AI 项目中的各个步骤。

**Lan****gGraph****：**LangChain 框架的扩展，旨在通过图形化的方法创建多代理工作流。能够处理有状态、循环和多角色的应用，适合构建需要多个代理协同工作的复杂 AI 系统。

**Griptape****：**提供灵活的编排框架，使开发者能够轻松定义、管理和执行复杂的 AI 工作流。

**CrewAI****：**一个多代理系统平台，旨在通过简单有效的方式实现复杂工作流的自动化。

**Fixpoint****：**提供可靠的编排工具，确保 AI 和数据工作流的高效运行和管理，适用于多种 AI 和数据密集型应用。

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/ib1O2Vnf2BvKTFm3MgjYCecfHjvak72sqkm5JAcQbBCspFsweiavcC95EzWNhl7JKz3HibIjFgAS7jiayCic0jYSZ0Q/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

*AutoGen*



**04****.**

**执行层**



Action 即执行层，主要涵盖了各种用于执行特定任务和操作的工具和服务。**这一层专注于提供执行动作、工具使用、授权管理以及 UI 自动化等方面的支持，使 AI agent 能够高效、准确地完成指定任务。**



**Presentation 展示**



AgentLabs 是一个开源的、用于搭建 Chat-based 应用的前端服务平台。可以在分钟之内快速创建丰富的聊天助手应用，提供 Node 和 Python SDK。



![图片](https://mmbiz.qpic.cn/mmbiz_jpg/ib1O2Vnf2BvI0MUuYw7VjemfHCFeyUYBVtJXYubqY2bDWic3lIpsH4hvItIbG4JnPG2tckWK6JkXH5yhK1xL6CCg/640?wx_fmt=jpeg&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

*AgentLabs*

**Tool Usage 工具使用**



LLM 具备与外部工具或 API 交互的能力，使得 LLM 不仅能够生成文本，还能够根据需要调用外部工具来执行特定任务。



对于模型公司来说，Tool Usage 已经成为一个必备的能力。这里列举了头部的模型公司如 OpenAI、Anthropic、Cohere 等以及模型工具框架 LangChain。



最近对于直接使用模型公司提供的 Tool Usage 还是使用便捷但封装较多的 LangChain 框架，最近应用开发者倾向于给出了一个结论，放弃 LangChain 选择直接编写 API 和调用数据库。“**由于 LangChain 故意将许多细节做得很抽象，我们无法轻松编写所需的底层代码，在抽象上构建抽象，实际使你的代码变得不必要的复杂**”，这是一位算法工程师对 LangChain 的直观吐槽。



![图片](https://mmbiz.qpic.cn/mmbiz_png/ib1O2Vnf2BvKTFm3MgjYCecfHjvak72sqCgwE7Q4wxKq76I7e8t7UMiaEAOPwiaDlHkzXfqzjUib3SZr2rMxepbWKg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

*Anthropic*

**Auth 授权**

**
**

当数字员工或 Agent 成为未来工作的主要载体时，如何确保人工智能安全地访问和控制在线用户账户成为一个 AI Native 的赛道机会。





**ANON**

：

**提供身份验证和授权服务，确保系统的安全性和用户数据的隐私。** 开发人员可以利用用户许可的集成，代表最终用户采取“行动”，并完全使用 Anon 的基础设施进行管理。**该公司日前获得了包括 Producthunt 创始人，Replit 创始人在内的 650 万美金的投资。**





![图片](https://mmbiz.qpic.cn/mmbiz_png/ib1O2Vnf2BvJKo9JEsU5dhhYHJSWX1DibEibmuepODZVRQ9rLREkBa8tiaHgULmxCwBKSZpXtmJHdkiaCAKFgctsTicQ/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

*ANON自动授权*

*
*

**Statics.ai**：专注于授权管理和数据保护，帮助开发者安全地管理用户权限。**Mindware**：提供身份验证和授权管理工具，支持复杂的访问控制。

**Clerk**：致力于创建一套可嵌入的 UI、API和管理仪表盘，提供身份验证和用户管理服务，简化用户注册和登录流程。**Clerk 在 2024 年 1 月获得了包括 a16z，Stripe，Madrona 在内的 3,000 万美金 B 轮投资。**“授权一直是我们产品愿景的一部分，但我们需要一个成功的身份验证产品来构建它”，Clerk 正在和 Stripe 进行深度合作，创建授权解决方案。



**Agent 即服务—UI 自动化和工具选择**



Agent as a Service 是一种服务模式，**允许用户通过 API 访问和使用云端的 AI Agent。这些 Agents 可以执行各种任务和操作，如数据处理、自动化任务、自然语言处理等，而无需用户在本地部署或管理。**



**其中 Tiny Fish、Reworkd、basepilot、induced、Superagent、Browse AI**，提供 UI 自动化服务，能够自动执行用户界面相关的任务，如数据抓取、自动填表、用户操作模拟等，模拟人工操作，提高效率和准确性。



在这篇文章中《[深度揭秘｜AI时代最火的孵化器在做什么](http://mp.weixin.qq.com/s?__biz=MzAxNjE1NTg2Ng==&mid=2247489793&idx=1&sn=04e564757249601a9d9b7a24b46edf14&chksm=9bf84cb4ac8fc5a2a2416c20166af4ebcefa6b2551c23250d05c8d4e6ea20ee3bdc589ab4ed7&scene=21#wechat_redirect)》，我们盘点了美国最火的早期投资机构 AI Grant 在 Batch3 中布局的项目，其中有好几个公司就是这类以 Agent as a Service 方式运行的，比如 Reworkd 帮助用户实现规模化的网页信息提取，将数据提取速度提高100倍，实现从数百个站点检索数据，无需开发人员，其自动化的任务包括制造业收集产品信息，电商行业获得竞品价格，招聘行业获得职位列表，销售职业批量获取Leads，房地产行业获取房屋列表等。



![图片](https://mmbiz.qpic.cn/mmbiz_png/ib1O2Vnf2BvJKo9JEsU5dhhYHJSWX1DibEdExMaibo8f6fKWYdTkLicNjcO3InSZpNgXEBjibN1icQeHMUThia2OhzZtA/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

*Reworkd*

**而 Induced AI 则是被 Open AI 的 Sam Altman、AI Grant 投资的一个专注浏览器原生的工作流程自动化公司。**该项目由两名青少年创立，分别是 18 岁的Sharma 和 19 岁的 Ayush Pathak。**他们希望能为浏览器的原生工作流程构建一个集成经济。**



目前，Induced AI 在 Chromium 上专门构建了一个浏览器环境，专为自主工作流程运行而设计。**它有自己的内存、文件系统和身份验证凭据（电子邮件、电话号码），可以执行复杂的流程。**据我所知，我们是第一个采用这种方法重新设计浏览器以供原生 AI 代理使用的公司。因此，复杂的登录、2FA（我们自动填写授权码/短信）、文件下载、存储和重复使用数据是其他自主代理无法做到的。



**NPi AI、Imprompt**，提供智能工具选择和推荐服务，帮助开发者在不同场景下选择最合适的工具。



**浏览器基础设施**



**Browserbase、browserless、APIFY、Cloudflare、bright data、platform.sh**，提供浏览器基础设施和服务，支持大规模数据采集、自动化测试和内容抓去等，侧重于对与底层浏览器的支持和管理。



以 Browserbase 为例，该项目于近期获得了来自 Vercel CEO、 Kleiner Perkins、AI Grant 等投资的 650 万美金的种子轮。



![图片](https://mmbiz.qpic.cn/mmbiz_png/ib1O2Vnf2BvJKo9JEsU5dhhYHJSWX1DibEthRtSeWib5wsTy4Y1puasESJicEVyzy5SDgSsIRLAtsR79lIYvhXcC5Q/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

*Browserbase*

该项目创建了一个无头浏览器（Headless Browser），是一种没有图形用户界面（GUI）的浏览器，能够加载和解析网页，执行JavaScript代码，以及进行网络请求和响应等操作。相比普通的浏览器，其主要优点在于节省资源，用编程形式控制，效率更高。Browserbase 认为这是浏览器执行 Agent 任务比较好的方式，旨在简化 Web 自动化流程，让开发人员能够更轻松地创建和管理复杂的工作流程。





![图片](https://mmbiz.qpic.cn/mmbiz_png/ib1O2Vnf2BvJKo9JEsU5dhhYHJSWX1DibEqILqXbnle08LJVzUvibuNCHHW26pMqQNkUNdmFjL6mR6Fb5qCLtVa4g/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

*Browserbase连续四周获得100%的增长*



**目前 Browserbase 的新增浏览器会话数达到 100 万次，是他们连续第四周实现 100% 的增长。**Browserbase 正在通过 2B2C 的方式走进 Agent 应用，为各类 Agent、助理类 AI 应用提供网页自动化的任务处理能力。



**05****.**

**应用层**



今年开始，国内的大量AI应用也开始初见产品价值，从 ToB 延伸到 ToC，从生产力和效率延伸到综合的社交娱乐和其他的多模态等各个领域。Agentic applicaitons 发展呈现出多元化、深入化的趋势。



**在海外创投生态，通过 Agent 思路解决应用场景问题成为一条广泛认可的 AI 创业路径。**



AI 搜索引擎 **Perplexity** 今年连续完成两轮融资估值超 25 亿美元，5月的访问量达 6742 万次，付费用户超过 10 万人。



AI 企业级搜索引擎 **Hebbia** 刚刚宣布获得了由 a16z、Index Ventures、Google Ventures 等主流机构投资的 1.3 亿美金，估值达到 7 亿美金。Hebbia 专为知识工作者设计，帮助客户用 AI Agent 完成日常知识工作。目前，Hebbia 已在全球领先的资产管理公司、律师事务所、银行和财富 100 强公司大规模部署，其宣称产品占据 OpenAI 日调用量的 2%，在过去 18 个月收入增长了 15 倍。



Cognition AI 开发的 **Devin AI** 首款自主 AI 软件工程师，与 copilot 不同， Devin 能够从头到尾处理整个软件开发项目。公司目前估值达 20 亿。

**
**

**MultiOn** 一款私人 AI Agent，希望能将人类从单调重复的琐事中解放出来，能够帮助用户管理日常事务，帮助企业自动执行重复性任务。当前估值超 5000 千万美金，详情可见《[AI+生活｜MultiOn：帮用户定机票酒店，斯坦福的两位创业者让 RPA 真正赋能用户生活》。](http://mp.weixin.qq.com/s?__biz=MzAxNjE1NTg2Ng==&mid=2247488500&idx=1&sn=e3073127bea9b3b9549bd9eb3e03a909&chksm=9bf84641ac8fcf57955b97a83f3b574e1644958aa08eb374446dad46105be468b467d6823b2d&scene=21#wechat_redirect)



还有更多 Agent 生态链上的公司正在获得资本市场和用户市场的认可。



**结语**



当前 AI Agent 和其基础设施的发展还处于非常早期的阶段，我们能看到的是一系列尚未商业化或整合到更广泛服务中的运营服务和开源工具。在这个领域，谁会成为最后的赢家还远未明确——这些最终的赢家可能今天还非常年轻，甚至还未出现。



参考材料

https://www.madrona.com/the-rise-of-ai-agent-infrastructure/

文章涉及大量项目链接和引用，可通过阅读原文跳转至知乎文章查看各项目链接。

转载请联系公众号后台











**欢迎加入 Sense AI 共创计划**



如果你对研究海外最新的 AI 产品感兴趣，并且愿意写出并分享自己的思考和观察，无论你是什么职业（投资人、创业者、产品经理、开发者、学生等等），都欢迎加入 SenseAI 的共创计划。



您可以填写下方的报名问卷，我们会在筛选后邀请您进入我们共创计划社群。SenseAI 的主理人们会在群内分享最新的海外 AI 产品和动态，同时也欢迎每一位参与共创计划的同学分享他们看到有意思的AI动态。



共创计划会以周为单位，每位参与者每周选择一款 AI 产品进行研究并写出相应的文章，每两周会组织一次集体的线上讨论或者线下的深度交流，一块研究前沿的 AI 趋势，特别是对海外 AI 市场动态的实时掌握。每四周调整一次参与成员，维持整个共创计划活跃度和高质量。
