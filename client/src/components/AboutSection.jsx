// src/components/AboutSection.jsx（含按钮文字修改+跳转功能）
import React from 'react';
import { motion } from 'framer-motion';
// 新增：引入React Router的导航钩子（需确保项目已安装react-router-dom）
import { useNavigate } from 'react-router-dom';

// 卡片配置（保持不变）
const ABOUT_CARDS_CONFIG = [
    {
        key: 'mission',
        icon: 'track_changes',
        translations: {
            zh: { title: '我们的使命', desc: '为领先科技企业的消费类应用提供高效、优质的数字营销方案。' },
            en: { title: 'Our Mission', desc: 'Delivering highly efficient digital media marketing solutions for consumer-facing APPs of leading technology companies.' }
        }
    },
    {
        key: 'vision',
        icon: 'rocket_launch',
        translations: {
            zh: { title: '我们的愿景', desc: '以内容讲好产品故事，助力品牌持续增长，成为全球领先的社交媒体营销伙伴。' },
            en: { title: 'Our Vision', desc: 'Bringing product stories to life through content, empowering brands to achieve long-term growth and become a leading global social media marketing partner.' }
        }
    },
    {
        key: 'value',
        icon: 'lightbulb',
        translations: {
            zh: { title: '核心价值', desc: '以成果为导向，融合数据洞察与协作创新，推动品牌长期发展。' },
            en: { title: 'Core Value', desc: 'Driven by results, we combine data insights with collaborative creation to power long-term brand growth.' }
        }
    },
    {
        key: 'Succeed',
        icon: 'celebration',
        translations: {
            zh: { title: '成功案例', desc: '助力百余家领先科技企业旗下应用，实现高价值、可持续的市场增长。' },
            en: { title: 'Success Cases', desc: 'Driving high-value, long-term growth for apps backed by over 100 leading technology companies.' }
        }
    }
];

const AboutSection = ({ i18n, t }) => {
    const currentLang = i18n?.language || 'zh';
    const trans = (key) => t?.(key) || key;

    // 新增：初始化导航钩子，用于跳转至服务页面
    const navigate = useNavigate();

    // 交互变体（保持修复后的逻辑）
    const interactVariants = {
        cardHover: {
            scale: 1.02,
            y: -8,
            boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
            transition: { duration: 0.3 }
        },
        iconHover: {
            scale: 1.1,
            color: "#0FB97F",
            transition: { duration: 0.3 }
        },
        buttonHover: { scale: 1.05 },
        buttonTap: { scale: 0.98 }
    };

    // 卡片渲染（保持修复后的逻辑）
    const renderCards = () => {
        return ABOUT_CARDS_CONFIG.map((card) => {
            const cardTrans = card.translations[currentLang];
            return (
                <motion.div
                    key={card.key}
                    whileHover={interactVariants.cardHover}
                    className="bg-white rounded-lg p-8 border border-gray-100 cursor-pointer"
                >
                    <motion.span
                        className="material-symbols-outlined text-4xl mb-4 inline-block text-gray-700"
                        whileHover={interactVariants.iconHover}
                        aria-hidden="true"
                    >
                        {card.icon}
                    </motion.span>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">{cardTrans.title}</h3>
                    <p className="text-gray-600">{cardTrans.desc}</p>
                </motion.div>
            );
        });
    };

    // 详情文本（核心修改：按钮文字改为"了解服务/Our Services"）
    const detailText = {
        title: currentLang === 'zh'
            ? '以创作者内容赢得信任，驱动品牌持续增长'
            : 'Building Authentic User Trust Through Creator-Led Content, Driving Sustainable Brand Growth',
        content: currentLang === 'zh'
            ? '我们专注全球影响者营销与增长策略，已服务百余品牌。通过数据洞察与优质内容，助力品牌高效获客、持续增长。'
            : 'We specialize in global influencer marketing and growth strategy, helping 100+ brands achieve high-quality user acquisition and sustainable growth through data-driven content.',
        // 修改：按钮文字从"了解更多/Learn More"改为"了解服务/About Services"
        buttonText: currentLang === 'zh' ? '了解服务' : 'About Services'
    };

    // 新增：定义按钮点击跳转函数（适配中英文路由）
    const handleServiceNavigate = () => {
        // 根据当前语言跳转对应服务页面路由，并添加语言参数
        const serviceRoute = `/services?lang=${currentLang}`;
        navigate(serviceRoute);
    };

    return (
        <section className="py-20 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
                {trans('aboutUs') || (currentLang === 'zh' ? '关于我们' : 'About Us')}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderCards()}
                </div>

                <div className="space-y-6">
                    <motion.h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {detailText.title}
                    </motion.h3>
                    <p className="text-gray-700 leading-relaxed">
                        {detailText.content}
                    </p>
                    {/* 修改：按钮添加点击跳转事件，文字更新为"了解服务/Our Services" */}
                    <motion.button
                        whileHover={interactVariants.buttonHover}
                        whileTap={interactVariants.buttonTap}
                        onClick={handleServiceNavigate} // 新增：点击跳转
                        className="bg-[#0FB97F] text-white px-8 py-3 rounded-lg font-medium inline-block cursor-pointer"
                    >
                        {detailText.buttonText}
                    </motion.button>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
