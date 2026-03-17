// src/components/Navbar.jsx 完整适配版
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const navStyles = `
  /* 基础样式保留，新增响应式媒体查询 */
  .nav-item {
    position: relative;
    display: inline-block;
    padding: 8px 0;
    font-size: 18px;
    font-weight: 500;
    color: #374151;
    text-decoration: none;
    transition: all 0.3s ease;
    transform: translateY(0);
  }
  .nav-item:hover {
    color: #0FB97F;
    transform: translateY(-3px);
  }
  .nav-item::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background-color: #0FB97F;
    transition: all 0.3s ease;
    transform: translateX(-50%);
  }
  .nav-item:hover::after {
    width: 100%;
    left: 0;
    transform: translateX(0);
  }
  .lang-btn {
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
  }
  .lang-btn:hover {
    transform: translateY(-2px);
  }
  .logo-container {
    overflow: visible !important;
    z-index: 10;
  }

  /* 响应式适配：平板/手机端 */
  @media (max-width: 768px) {
    .nav-item {
      font-size: 14px; /* 缩小导航文字 */
      padding: 4px 0;
    }
    .lang-btn {
      padding: 2px 6px; /* 缩小语言按钮 */
      font-size: 12px;
    }
    .nav-container {
      padding-left: 20px !important;
      padding-right: 20px !important;
    }
  }

  @media (max-width: 480px) {
    .nav-item {
      font-size: 12px;
      margin: 0 4px; /* 减少导航项间距 */
    }
    .logo-container img {
      transform: scale(2) !important; /* 缩小LOGO缩放比例 */
    }
  }
`;

const Navbar = ({ isHome, changeLanguage, i18n, t }) => {
    // 容错处理
    const currentLang = i18n?.language || 'zh';
    const location = useLocation();
    const navigate = useNavigate();

    // 处理语言切换，同时更新URL
    const handleLangChange = (lang) => {
        if (typeof changeLanguage === 'function') {
            changeLanguage(lang);
        }

        // 获取当前路径
        const currentPath = location.pathname;
        // 构建新的URL，保留当前路径并添加语言参数
        const newUrl = `${currentPath}?lang=${lang}`;
        navigate(newUrl);
    };

    const translate = (key) => {
        return typeof t === 'function' ? t(key) : key;
    };

    // 优化导航栏样式：增加响应式高度+容器类名
    const navBaseStyle = {
        height: '100px', // 固定高度，方便页面计算padding
        backgroundColor: isHome ? 'transparent' : '#ffffff',
        boxShadow: isHome ? 'none' : '0 2px 4px rgba(0,0,0,0.1)',
        position: isHome ? 'absolute' : 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 9999, // 提高z-index避免被遮挡
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: '60px',
        paddingRight: '60px',
        boxSizing: 'border-box', // 关键：padding计入宽度，避免溢出
        // 响应式高度
        '@media (max-width: 768px)': {
            height: '80px',
        },
        '@media (max-width: 480px)': {
            height: '70px',
        }
    };

    return (
        <>
            <style>{navStyles}</style>
            {/* 增加nav-container类名，方便响应式控制 */}
            <nav style={navBaseStyle} className="nav-container">
                {/* LOGO 部分：优化响应式缩放 */}
                <Link to={`/?lang=${currentLang}`} className="logo-container h-20 md:h-24 flex items-center" style={{ overflow: 'visible' }}>
                    <img
                        src={require('../assets/Agency-LOGO.webp')} // 替换为实际LOGO路径
                        loading='eager'
                        alt="Jasper Logo"
                        style={{
                            transform: 'scale(0.2)',
                            transformOrigin: 'left center',
                            maxWidth: 'none',
                            maxHeight: 'none',
                            display: 'block',
                            overflow: 'visible',
                            // 小屏幕缩小LOGO
                            '@media (max-width: 768px)': {
                                transform: 'scale(0)',
                            },
                            '@media (max-width: 480px)': {
                                transform: 'scale(0)',
                            }
                        }}
                    />
                </Link>

                {/* 导航+语言切换：优化间距 */}
                <div className="flex items-center gap-4 md:gap-6">
                    {['home', 'services', 'contact'].map((item) => (
                        <Link
                            key={item}
                            to={item === 'home' ? `/?lang=${currentLang}` : `/${item}?lang=${currentLang}`}
                            className="nav-item"
                            style={{ color: !isHome ? '#374151' : '#374151' }}
                        >
                            {translate(item)}
                        </Link>
                    ))}

                    {/* 语言切换按钮：增加间距适配 */}
                    <div className="ml-2 flex gap-2">
                        <button
                            onClick={() => handleLangChange('en')}
                            className={`lang-btn px-3 py-1 rounded text-sm font-medium ${currentLang === 'en'
                                ? 'bg-[#0FB97F] text-white'
                                : `bg-gray-100/80 text-gray-800 hover:bg-gray-200/80 ${!isHome ? 'bg-gray-200/80' : ''}`
                                }`}
                        >
                            EN
                        </button>
                        <button
                            onClick={() => handleLangChange('zh')}
                            className={`lang-btn px-3 py-1 rounded text-sm font-medium ${currentLang === 'zh'
                                ? 'bg-[#0FB97F] text-white'
                                : `bg-gray-100/80 text-gray-800 hover:bg-gray-200/80 ${!isHome ? 'bg-gray-200/80' : ''}`
                                }`}
                        >
                            中文
                        </button>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
