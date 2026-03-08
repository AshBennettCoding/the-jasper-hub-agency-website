import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 中英文案（删除重复的email键）
const resources = {
    en: {
        translation: {
            // 导航
            home: "Home",
            services: "Services",
            contact: "Contact",
            // 主页
            agencyName: "The Jasper Hub Agency",
            intro: "Global Influencer Marketing Partner",
            aboutUs: "About Us",
            aboutDesc: "The Jasper Hub Agency is a leading international social media influencer marketing agency, dedicated to helping brands connect with global audiences through authentic influencer partnerships.",
            whyChooseUs: "Why Choose Us",
            reason1: "Proven Global Experience",
            reason1Desc: "We partner with leading brands across diverse app categories, building sustainable growth systems backed by extensive hands-on expertise and measurable results.",
            reason2: "Data-Driven Growth Strategy",
            reason2Desc: "Guided by performance outcomes, we continuously optimize campaigns and content through real-time data insights to drive scalable and sustainable growth.",
            reason3: "Long-Term Growth Assets",
            reason3Desc: "We convert campaign learnings into repeatable growth frameworks, curated creator networks, and high-value content assets that compound long-term marketing efficiency.",
            successCases: "Success Cases",
            brandsWeWorkedWith: "Brands We Have Worked With",
            case1: "Beauty Brand Global Launch",
            case1Desc: "Increased brand awareness by 200% in 3 months with 50+ influencers.",
            case2: "Tech Product Market Expansion",
            case2Desc: "Drove 150% more sales in European markets via targeted influencer campaigns.",
            intro_tag: "Execute successful marketing campaigns",
            intro_sub: "The Top Choice for Global Influencer Marketing",
            // 服务页
            service1: "Global Social Media Influencer Resources",
            service1Desc: "Curated network of influencers across major international platforms (Instagram, TikTok, YouTube, LinkedIn, etc.), covering various niches and regions.",
            service2: "Professional Brand Social Media Marketing Full Planning & Execution",
            service2Desc: "Customized marketing strategies including content creation, campaign planning, and influencer collaboration execution.",
            service3: "Data Tracking & Strategy Adjustment",
            service3Desc: "Real-time data monitoring of campaign performance, timely adjustment of strategies to optimize results.",
            service4: "Phased Review & On-Time Delivery",
            service4Desc: "Regular phased reviews with clients, ensuring all deliverables are completed on schedule and meet expectations.",
            // 联系页
            contactTitle: "CONTACT US",
            contactGreeting: "Thank you for choosing us. We look forward to collaborating with you. Please fill out the form below or contact us via email. We wish you all the best!",
            emailLabel: "Email",
            emailAddress: "business@thejasperhub.com",
            fullName: "Full Name",
            fullNamePlaceholder: "Your full name",
            emailAddressLabel: "Email Address",
            emailAddressPlaceholder: "your@email.com",
            brand: "Brand / Company",
            brandPlaceholder: "Your company name",
            phoneLabel: "Phone Number (Optional)",
            phonePlaceholder: "+1 (555) 123-4567",
            message: "Message",
            messagePlaceholder: "Tell us about your project...",
            submit: "CONTACT US",
            // 页脚
            address: "Unit B53, 2/F, Kwai Shing Industrial Building Phase 1, 36-40 Tai Lin Pai Road, Kwai Chung, N.T.",
            copyright: "© 2026 The Jasper Hub Agency. All rights reserved."
        }
    },
    zh: {
        translation: {
            // 导航
            home: "首页",
            services: "服务",
            contact: "联系我们",
            // 主页
            agencyName: "The Jasper Hub Agency.",
            intro: "全球网红营销合作伙伴",
            aboutUs: "关于我们",
            aboutDesc: "贾斯珀中心营销机构是领先的国际社媒网红营销机构，致力于通过真实的网红合作帮助品牌连接全球受众。",
            whyChooseUs: "为什么选择我们",
            reason1: "卓越的全球合作经验",
            reason1Desc: "我们与多个应用赛道的领先品牌长期合作，打造可持续增长体系，在全球社媒营销领域积累了深度实践与可验证成果。",
            reason2: "数据驱动的增长策略",
            reason2Desc: "以结果为核心，通过实时数据反馈持续优化投放与内容策略，帮助品牌实现稳定且可规模化的增长。",
            reason3: "长期价值资产沉淀",
            reason3Desc: "在持续投放中沉淀可复制增长模型、优质创作者网络与高价值内容资产，为品牌长期营销效率提供复利增长。",
            successCases: "成功案例",
            brandsWeWorkedWith: "我们有幸携手合作的品牌产品",
            case1: "美妆品牌全球上线",
            case1Desc: "3个月内通过50+网红合作，品牌知名度提升200%。",
            case2: "科技产品市场拓展",
            case2Desc: "通过精准网红营销，欧洲市场销售额提升150%。",
            intro_tag: "执行成功的营销活动",
            intro_sub: "全球网红营销的顶尖选择",
            // 服务页
            service1: "覆盖国际社媒的网红资源",
            service1Desc: "精选Instagram、TikTok、YouTube、领英等主流国际平台的网红资源，覆盖各类细分领域和地区。",
            service2: "专业的品牌社媒营销全案策划和执行",
            service2Desc: "定制化营销方案，包括内容创作、活动策划、网红合作执行等全流程服务。",
            service3: "数据追踪复盘和策略沟通调整",
            service3Desc: "实时监控活动数据表现，及时调整策略以优化营销效果。",
            service4: "阶段性复盘沟通和按时交付",
            service4Desc: "定期与客户进行阶段性复盘，确保所有交付物按时完成并符合预期。",
            // 联系页
            contactTitle: "联系我们",
            contactGreeting: "感谢您选择我们，我们期待与您合作。请填写下表或通过邮箱联系我们。祝您一切顺利！",
            emailLabel: "邮箱",
            emailAddress: "business@thejasperhub.com",
            fullName: "全名",
            fullNamePlaceholder: "您的全名",
            emailAddressLabel: "邮箱地址",
            emailAddressPlaceholder: "your@email.com",
            brand: "品牌/公司",
            brandPlaceholder: "您的公司名称",
            phoneLabel: "电话号码（可选）",
            phonePlaceholder: "+1 (555) 123-4567",
            message: "留言",
            messagePlaceholder: "告诉我们关于您的项目...",
            submit: "联系我们",
            // 页脚
            address: "香港新界葵涌大連排道36-40號貴盛工業大廈一期2樓B53室",
            copyright: "© 2026 贾斯珀中心营销机构 保留所有权利。"
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en", // 默认语言
        fallbackLng: "en",
        interpolation: {
            escapeValue: false // React已处理XSS
        }
    });

export default i18n;
