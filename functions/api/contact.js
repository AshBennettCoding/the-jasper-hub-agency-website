export async function onRequestPost(context) {
    try {
        const data = await context.request.json()

        const { name, email, company, phone, message } = data

        // 必填验证
        if (!name || !email || !message) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Please fill in all required fields"
                }),
                { status: 400 }
            )
        }

        // 邮箱格式验证
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Please enter a valid email address"
                }),
                { status: 400 }
            )
        }

        // HTML邮件模板（复用你的模板逻辑）
        const html = `
        <div style="font-family:Arial;max-width:600px;margin:auto">
          <h2>New Contact Form Submission</h2>
  
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
  
          ${company ? `<p><b>Company:</b> ${company}</p>` : ""}
  
          ${phone ? `<p><b>Phone:</b> ${phone}</p>` : ""}
  
          <p><b>Message:</b></p>
          <p>${message}</p>
  
          <hr>
          <p>This email was sent from The Jasper Hub Agency website.</p>
        </div>
      `

        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${context.env.RESEND_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                from: context.env.SEND_EMAIL,
                to: context.env.RECIEVE_EMAIL,
                subject: `New Contact Form Submission from ${name}`,
                html: html
            })
        })

        // if (!response.ok) {
        //     throw new Error("Email sending failed")
        // }

        const resendData = await response.text()

        if (!response.ok) {
          return new Response(
            JSON.stringify({
              success: false,
              message: "Resend API error",
              details: resendData
            }),
            {
              status: response.status,
              headers: { "Content-Type": "application/json" }
            }
          )
        }

        return new Response(
            JSON.stringify({
                success: true,
                message:
                    "Email sent successfully 🎉 We will contact you shortly."
            }),
            { status: 200 }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({
                success: false,
                message: "Failed to send email"
            }),
            { status: 500 }
        )
    }
}