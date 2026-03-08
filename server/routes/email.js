const express = require('express');
const router = express.Router();
const { createTransporter, emailTemplate } = require('../config/email');

// 发送邮件路由
router.post('/send-email', async (req, res) => {
    try {
        const { name, email, company, phone, message } = req.body;

        // 验证必填字段
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all required fields'
            });
        }

        // 验证邮箱格式
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address'
            });
        }

        // 创建邮件传输器
        const transporter = createTransporter();

        // 邮件选项
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // 发送到自己的邮箱
            subject: `New Contact Form Submission from ${name}`,
            html: emailTemplate({ name, email, company, phone, message })
        };

        // 发送邮件
        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: 'Email sent successfully!!🎉 We will contact you shortly via the contact information you provided~'
        });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send email',
            error: process.env.NODE_ENV === 'development' ? error.message : {}
        });
    }
});

module.exports = router;
