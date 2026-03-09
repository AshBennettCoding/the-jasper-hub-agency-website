import { sendEmail } from "../config/email";

export async function onRequestPost(context) {
    try {
        const data = await context.request.json();

        const { name, email, message } = data;

        // 必填验证
        if (!name || !email || !message) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Please fill in all required fields"
                }),
                { status: 400 }
            );
        }

        // 邮箱验证
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Please enter a valid email address"
                }),
                { status: 400 }
            );
        }

        // 调用邮件发送函数
        await sendEmail(context.env, data);

        return new Response(
            JSON.stringify({
                success: true,
                message:
                    "Email sent successfully 🎉 We will contact you shortly."
            }),
            { status: 200 }
        );

    } catch (error) {
        console.error(error);

        return new Response(
            JSON.stringify({
                success: false,
                message: "Sorry...Failed to send email"
            }),
            { status: 500 }
        );
    }
}