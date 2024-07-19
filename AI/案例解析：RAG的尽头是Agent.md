# 案例解析：RAG的尽头是Agent

2024-06-30 06:29·[ChatGPT扫地僧](https://www.toutiao.com/c/user/token/MS4wLjABAAAABjEOBQR_Ycr6EcTpBib217ZOQBz7CUIiTC7L9296mLc/?source=tuwen_detail)

![img](https://p3-sign.toutiaoimg.com/tos-cn-i-axegupay5k/16f926afd8184449beaf33e507557973~noop.image?_iz=58558&from=article.pc_detail&lk3s=953192f4&x-expires=1721623737&x-signature=NRebFJ11km4kS%2F0JyGUHSawDsEM%3D)



AI进化论：从RAG到Agent，智能体如何重塑未来世界



**引言**



随着ChatGPT、ChatGPT-4等的发布，我们彻底被大模型（LLM）的魅力所征服，越来越多的公司和企业开始聚焦大模型技术的研发和使用，为我们的日常生活带来了极大的便利。但是，大模型同样面临着**时效性、准确性**等各种问题，如何让LLM变得更好？如何解决LLM所面临的挑战？如何构建高级的LLM应用？逐渐成为AI领域重要的研究课题。



为了解决这其中一些问题，RAG应运而生，RAG（检索增强生成）技术在自然语言处理领域带来了显著突破。通过结合信息检索和文本生成技术，RAG使机器能够更准确地理解和回应人类语言。但是随着RAG的应用，我们也逐渐意识到RAG的局限性，那么RAG究竟有何痛点？我们又应该如何解决？让我们来一起探寻吧！



**RAG痛点**

![img](https://p3-sign.toutiaoimg.com/tos-cn-i-6w9my0ksvp/9aab1734b3e745508b721e960c50a8bb~noop.image?_iz=58558&from=article.pc_detail&lk3s=953192f4&x-expires=1721623737&x-signature=7Csogwm3W%2BCoLA5fOeyVHpr%2Bb%2Fw%3D)



RAG技术可以在一些常见的自然语言处理任务中发挥作用，如**问答系统、智能助手和虚拟代理、信息检索、知识图谱填充**等，通过RAG，建立一个庞大的知识库，当用户查询的时候，利用信息检索从知识库中查询相关文本片段或实时数据，然后我们对检索到的信息进行筛选、排序和加权等操作，最后将整合后的信息作为生成模型的输入，无疑是提高答案准确性，减少虚假信息，极大的增强大模型的可用性。



但是RAG最初是为简单问题和小型文档集设计的，所以能够快速、高效。准确的进行输出，比如：



**特斯拉的主要风险因素是什么？(over Tesla 2021 10K)**



**作者在YC期间做了什么？（Paul Graham essay）**



我们通过使用特定的知识库，针对以上简单问题，LLM可以给出很好的答案，但是，针对某些类型的问题，RAG可能无法产生准确或者令人满意的结果，例如：



**总结性问题:“给我总结一下XXX公司的年度报告”**

**比较性问题:“比较开发者A和开发者B的开源贡献”**



**结构化分析+语义搜索:“告诉我美国最高业绩的拼车公司的风险因素”**



**综合性多部分问题: “告诉我文章A中的赞成X的论点，然后告诉我文章B中的赞成Y的论点，按照我们内部的风格指南制作一个表格，然后根据这些事实自行得出结论”**



Naive RAG，很多时候只是一个搜索系统，针对一些简单问题或查询，能够给予用户很好的反馈，但是有很多复杂问题/任务是它无法回答的，那么遇到复杂的问题/任务，我们可以怎么做呢？



**RAG To Agent**

![img](https://p3-sign.toutiaoimg.com/tos-cn-i-6w9my0ksvp/8a72df704bbe4d079017dcc7249f7904~noop.image?_iz=58558&from=article.pc_detail&lk3s=953192f4&x-expires=1721623737&x-signature=voQCJ%2BL7rbUQXKC1gwf%2FM9bdqE0%3D)



常规的RAG应用通常只是通过结合自有知识库来增强大模型，以获得更准确、实时和丰富的垂直内容或个性化结果，但这依然局限于内容生成的范畴。如果你需要人工智能像一个“以终为始”的高效率员工一样，自主选取各种工具，并与不同系统进行沟通协作，直到交付最终结果，那么就需要从RAG转变到Agent。

![img](https://p3-sign.toutiaoimg.com/tos-cn-i-6w9my0ksvp/fde9f3d6cf8e48a3aefa5c1370e23782~noop.image?_iz=58558&from=article.pc_detail&lk3s=953192f4&x-expires=1721623737&x-signature=I1QvUPeDcO0Wfqmn%2Fkn5tK137Rk%3D)



从RAG到Agent的转变，并不是意味着抛弃RAG，而是在此基础上增加以下几个层次的功能：



**● 多轮对话:** 与用户进行更深入的交流，识别用户意图



**●查询/任务规划层:** 能够理解并规划复杂的查询和任务



**●外部环境工具接口:** 使用外部工具完成任务



**●反思:** 对执行结果进行反思总结和评估



**● 记忆:** 维护用户交互的历史，从而提供个性化服务



通过增加这些功能，Agent不仅能适应复杂任务，还能在多变环境中灵活应对。与RAG相比，Agent则专注于实现特定任务，更注重与现有系统集成。它不仅能够理解语言，还能在现实世界或数字系统中采取行动，它不仅能够执行复杂的多步骤任务，如检索信息、处理信息，它还可以无缝接入各种系统和API接口，访问用户数据，与数据库交互。



人类之所以是人类，一个最明显的特征就是会使用工具。作为智能体，Agent同样可以借助外部工具，使其能够处理更加复杂的任务。比如Agent可以使用图表生成工具生成在线图表，可以使用天气查询工具查询天气。由此可见，Agent是可以真正释放LLM潜能的关键，那么我们的LLM应用，也终将从RAG转向Agent，Agent无疑是RAG的尽头。



**案例分析**



近日，阿里千问团队开发了一个Agent(智能体)，通过结合RAG，用于理解包含百万字词的文档，虽然仅使用Qwen2模型的8k上下文，但效果超过RAG和长序列原生模型。



**1.Agent构建**



该Agent的构建主要包含三个复杂度级别，每一层都建立在前一层的基础上



**级别一：检索**



如何找出与提取关键词最相关的块，主要分为三个步骤：



● 步骤1：指令信息与非指令信息分开



**用户输入：**"回答时请用2000字详尽阐述，我的问题是，自行车是什么时候发明的？请用英文回复。



**信息拆解：**{"信息": ["自行车是什么时候发明的"], "指令": ["回答时用2000字", "尽量详尽", "用英文回复"]}。



●步骤2：聊天模型推导出多语言关键词。



**输入：**"自行车是什么时候发明的"



**信息转换：**{"关键词_英文": ["bicycles", "invented", "when"], "关键词_中文": ["自行车", "发明", "时间"]}。



●步骤3：运用BM25关键词检索方法。

![img](https://p3-sign.toutiaoimg.com/tos-cn-i-6w9my0ksvp/b4dd7d6e63704b9f93dfc2ab4d3182f6~noop.image?_iz=58558&from=article.pc_detail&lk3s=953192f4&x-expires=1721623737&x-signature=UWaT3vvF1kJ1bHLVyVSdmoLrTOo%3D)



**级别二：分块阅读**

如何解决相关块与用户查询关键词重叠程度不足时失效，导致这些相关的块未被检索到、没有提供给模型。主要采用以下策略：



●步骤1：让聊天模型对于每个512字块评估其与用户查询的相关性，如果认为不相关则输出"无", 如果相关则输出相关句子。



● 步骤2：取出步骤1中相关句子，用它们作为搜索查询词，通过BM25检索出最相关的块。



●步骤3：基于检索到的上下文生成最终答案。

![img](https://p3-sign.toutiaoimg.com/tos-cn-i-6w9my0ksvp/50b5f1ce3b9d45c89fcf8e1e558cfdfe~noop.image?_iz=58558&from=article.pc_detail&lk3s=953192f4&x-expires=1721623737&x-signature=I5phYSX6GbsWhSugKYJToyqscOg%3D)



**级别三：逐步推理**



如何解决多跳推理。例如，用户输入：“与第五交响曲创作于同一世纪的交通工具是什么？”模型首先需要拆分为子问题进行回答，如“第五交响曲是在哪个世纪创作的？”，“自行车于19世纪发明”



可以采用工具调用（也称为函数调用）智能体或ReAct智能体进行解决：



向Lv3-智能体提出一个问题。

while (Lv3-智能体无法根据其记忆回答问题) {

Lv3-智能体提出一个新的子问题待解答。

Lv3-智能体向Lv2-智能体提问这个子问题。

将Lv2-智能体的回应添加到Lv3-智能体的记忆中。

}

Lv3-智能体提供原始问题的最终答案。

![img](https://p3-sign.toutiaoimg.com/tos-cn-i-6w9my0ksvp/0104f483a1a14fde9d6d31e5b7066323~noop.image?_iz=58558&from=article.pc_detail&lk3s=953192f4&x-expires=1721623737&x-signature=DtNeX2uz4uQ3xOTCrOwgp3e8th0%3D)



**2.实验对比**



为了进行验证，采取实验比对方式，通过采用以下三种模型进行比对：



●32k-模型：7B对话模型，主要在8k上下文样本上进行微调，并辅以少量32k上下文样本



●4k-RAG：使用与32k-模型相同的模型，但采取了Lv1-智能体的RAG策略



●4k-智能体：使用32k-模型的模型，但采用前文描述的更复杂的智能体策略

![img](https://p3-sign.toutiaoimg.com/tos-cn-i-6w9my0ksvp/946400ad63b647f78948029424ef2140~noop.image?_iz=58558&from=article.pc_detail&lk3s=953192f4&x-expires=1721623737&x-signature=zDA1BVk9SkuygHgORDCq7inIuqM%3D)



通过上述实验，我们能够看到4k-智能体始终表现优于32k-模型和4k-RAG，它结合RAG，通过工具调用，可以有更高的效率和准确率。但是Agent的优势远不止这些，Agent作为人工智能系统的关键角色，逐渐成为连接人与机器的重要桥梁，一旦Agent准备就绪，就可以为很多问题提供更多的解决方案。



**未来展望**



对于未来，我们知道Agent应用的开发必将遇到众多挑战，但同样是一种机遇。每一种挑战，都会触发新的技术融合，李彦宏曾表示：以后不会存在程序员这种职业了，因为只要会说话，人人都会具备程序员的能力。笔者认为，Agent虽然功能强大，但路漫漫其修远兮，Agent的应用落地依然有很长的路要走，但是我坚信不久的将来会有更多的Agent应用落地，Agent应用会涵盖更多的技术，终将会融进各行各业，为人类带来更大的便利。



**结语**



RAG和智能体（Agent）这些技术和理念的潜力在于相互结合，通过结合大模型的深层次语言理解和生成能力、RAG的垂直和实时的信息检索能力以及Agent的决策和执行能力，形成更为强大和敏捷的AI应用。Agent能够通过自我反思和反馈来改进执行，同时提供可观察性，以便开发者能够追踪和理解Agent的行为，结合各种工具，融合RAG技术，可以处理更复杂的业务逻辑。同时，多个Agent可以同步或异步地交互，以执行更复杂的任务，助力构建更加复杂的LLM应用。



参考文献

https://qwenlm.github.io/zh/blog/qwen-agent-2405/

https://docs.google.com/presentation/d/1IWjo8bhoatWccCfGLYw_QhUI4zfF-MujN3ORIDCBIbc/edit#slide=id.g2bac367b3d6_0_0