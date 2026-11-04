// src/pages/Contact.jsx 重新设计版
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { sendEmail } from '../utils/api';


const Contact = ({ changeLanguage, i18n, t }) => {
    const { t: translate } = useTranslation();
    const trans = typeof translate === 'function' ? translate : t;

    // 打字机效果状态
    const [displayedGreeting, setDisplayedGreeting] = useState('');
    const [isTyping, setIsTyping] = useState(true);

    // 打字机效果逻辑
    useEffect(() => {
        setDisplayedGreeting('');
        const fullText = trans('contactGreeting');
        let index = -1;
        setIsTyping(true);

        const timer = setInterval(() => {
            if (index < fullText.length) {
                index++;
                // console.log(fullText.charAt(index));
                setDisplayedGreeting(prev => prev + fullText.charAt(index));

                // console.log(index);
            } else {
                setIsTyping(false);
                clearInterval(timer);
            }
        }, 50); // 打字速度

        return () => clearInterval(timer);
    }, [trans]); // 添加trans作为依赖项



    // 表单状态
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        phone: '',
        message: ''
    });

    // 提交状态
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({
        success: null,
        message: ''
    });

    // 处理输入变化
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // 清除之前的提交状态
        if (submitStatus.success !== null) {
            setSubmitStatus({ success: null, message: '' });
        }
    };

    // 处理表单提交
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 开始提交
        setIsSubmitting(true);
        setSubmitStatus({ success: null, message: '' });

        try {
            // 调用API发送邮件
            await sendEmail({
                inquiryType: 'brand_contact',
                ...formData,
            });

            // 提交成功
            setSubmitStatus({
                success: true,
                message: 'contactSuccess'
            });

            // 重置表单
            setFormData({
                name: '',
                email: '',
                company: '',
                phone: '',
                message: ''
            });
        } catch (error) {
            // 提交失败
            setSubmitStatus({
                success: false,
                message: 'contactError'
            });
        } finally {
            // 结束提交状态
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen font-montserrat">
            {/* 导航栏 + 联系页内容：融合在同一个全屏section */}
            <section className="relative w-full flex flex-col items-center justify-center overflow-hidden" style={{ minHeight: '100vh' }}>
                {/* 导入共享导航栏：isHome=true → 透明背景，融入布局 */}
                <Navbar
                    isHome={true}
                    changeLanguage={changeLanguage}
                    i18n={i18n}
                    t={trans}
                />

                {/* 联系页内容 */}
                <div className="relative z-20 max-w-7xl mx-12 mt-16">
                    {/* 全宽度的极简编辑式"联系我们"部分 */}
                    <div className="py-12 px-4 md:px-8 lg:px-16">
                        <div className="max-w-7xl mx-auto">
                            {/* 两列分割布局 */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                                {/* 左侧：联系信息 */}
                                <div className="lg:pr-8 flex flex-col h-full">
                                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 tracking-wider">
                                        {trans('contactTitle')}
                                    </h1>

                                    {/* 问候语 */}
                                    <p className="text-lg text-gray-700 leading-relaxed mb-8 min-h-[120px]">
                                        {displayedGreeting}
                                        {isTyping && <span className="animate-pulse">|</span>}
                                    </p>


                                    {/* 邮箱地址 - 移到底部 */}
                                    <div className="mt-auto mb-6">
                                        <p className="text-lg text-gray-700 mb-2">{trans('emailLabel')}</p>
                                        <p className="text-xl font-medium text-gray-900">{trans('emailAddress')}</p>
                                    </div>
                                </div>


                                {/* 右侧：联系表单 */}
                                <div className="lg:pl-8">
                                    <form className="space-y-6" onSubmit={handleSubmit}>
                                        {/* 提交状态消息 */}
                                        {submitStatus.success !== null && (
                                            <div role={submitStatus.success ? 'status' : 'alert'} className={`p-4 rounded-md ${submitStatus.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                                                {trans(submitStatus.message)}
                                            </div>
                                        )}

                                        {/* 第一行：姓名 | 邮箱 */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="brand-name" className="block text-gray-700 mb-2 text-sm font-medium">{trans('fullName')}</label>
                                                <input
                                                    id="brand-name"
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="w-full px-0 py-2 border-b border-gray-300 text-gray-900 text-lg focus:outline-none focus:border-gray-900 transition-colors"
                                                    placeholder={trans('fullNamePlaceholder')}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="brand-email" className="block text-gray-700 mb-2 text-sm font-medium">{trans('emailAddressLabel')}</label>
                                                <input
                                                    id="brand-email"
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="w-full px-0 py-2 border-b border-gray-300 text-gray-900 text-lg focus:outline-none focus:border-gray-900 transition-colors"
                                                    placeholder={trans('emailAddressPlaceholder')}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* 第二行：品牌 | 电话号码（可选） */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="brand-company" className="block text-gray-700 mb-2 text-sm font-medium">{trans('brand')}</label>
                                                <input
                                                    id="brand-company"
                                                    type="text"
                                                    name="company"
                                                    value={formData.company}
                                                    onChange={handleChange}
                                                    className="w-full px-0 py-2 border-b border-gray-300 text-gray-900 text-lg focus:outline-none focus:border-gray-900 transition-colors"
                                                    placeholder={trans('brandPlaceholder')}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="brand-phone" className="block text-gray-700 mb-2 text-sm font-medium">{trans('phoneLabel')}</label>
                                                <input
                                                    id="brand-phone"
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="w-full px-0 py-2 border-b border-gray-300 text-gray-900 text-lg focus:outline-none focus:border-gray-900 transition-colors"
                                                    placeholder={trans('phonePlaceholder')}
                                                />
                                            </div>
                                        </div>

                                        {/* 留言文本域 */}
                                        <div>
                                            <label htmlFor="brand-message" className="block text-gray-700 mb-2 text-sm font-medium">{trans('message')}</label>
                                            <textarea
                                                id="brand-message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                rows={6}
                                                className="w-full px-0 py-2 border-b border-gray-300 text-gray-900 text-lg focus:outline-none focus:border-gray-900 transition-colors resize-none"
                                                placeholder={trans('messagePlaceholder')}
                                                required
                                            ></textarea>
                                        </div>

                                        {/* CTA按钮 */}
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full border-2 border-gray-900 text-gray-900 px-8 py-4 text-lg font-medium hover:bg-gray-900 hover:text-white transition-all duration-300 flex items-center justify-between group disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <span>{isSubmitting ? trans('contactSending') : trans('submit')}</span>
                                            <svg className="w-6 h-6 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </button>
                                    </form>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Contact;
