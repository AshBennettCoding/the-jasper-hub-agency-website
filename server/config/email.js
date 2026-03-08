const nodemailer = require('nodemailer');

// 创建邮件传输器
const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.feishu.cn", // Outlook SMTP
    port: 587,
    secure: false, // 必须 false（使用 STARTTLS）
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      ciphers: "SSLv3",
    },
  });
};

// 邮件模板
const emailTemplate = (data) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Form Submission</title>
      <style>
        body {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 30px;
          background-color: #f9f9f9;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e0e0e0;
        }
        .header h1 {
          color: #2c3e50;
          margin: 0;
          font-size: 28px;
        }
        .content {
          margin-bottom: 30px;
        }
        .field {
          margin-bottom: 20px;
        }
        .field-label {
          font-weight: bold;
          color: #2c3e50;
          margin-bottom: 5px;
        }
        .field-value {
          padding: 10px;
          background-color: #fff;
          border-left: 3px solid #3498db;
        }
        .footer {
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
          color: #7f8c8d;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Contact Form Submission</h1>
        </div>
        <div class="content">
          <div class="field">
            <div class="field-label">Name:</div>
            <div class="field-value">${data.name}</div>
          </div>
          <div class="field">
            <div class="field-label">Email:</div>
            <div class="field-value">${data.email}</div>
          </div>
          ${data.company ? `
          <div class="field">
            <div class="field-label">Company:</div>
            <div class="field-value">${data.company}</div>
          </div>
          ` : ''}
          ${data.phone ? `
          <div class="field">
            <div class="field-label">Phone:</div>
            <div class="field-value">${data.phone}</div>
          </div>
          ` : ''}
          <div class="field">
            <div class="field-label">Message:</div>
            <div class="field-value">${data.message}</div>
          </div>
        </div>
        <div class="footer">
          <p>This email was sent from The Jasper Hub Agency contact form.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  createTransporter,
  emailTemplate
};
