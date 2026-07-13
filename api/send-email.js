const nodemailer = require("nodemailer");

module.exports = async (req, res) => {

    if (req.method === "GET") {
        return res.status(200).json({
            success: true,
            message: "BrandKira Email API Working"
        });
    }

    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method Not Allowed"
        });
    }

    try {

        const {
            name,
            company,
            email,
            phone,
            budget,
            requirement,
            leadId
        } = req.body;

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: Number(process.env.SMTP_PORT) === 465,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        // Verify SMTP connection
        await transporter.verify();

        // Email to BrandKira
        await transporter.sendMail({
            from: `"BrandKira" <${process.env.SMTP_USER}>`,
            to: "brandkira11@gmail.com",
            subject: `🔔 New BrandKira Lead - ${leadId}`,
            html: `
                <h2>New Lead Received</h2>
                <p><b>Lead ID:</b> ${leadId}</p>
                <p><b>Name:</b> ${name}</p>
                <p><b>Company:</b> ${company}</p>
                <p><b>Email:</b> ${email}</p>
                <p><b>Phone:</b> ${phone}</p>
                <p><b>Budget:</b> ${budget}</p>
                <p><b>Requirement:</b><br>${requirement}</p>
            `
        });

        // Email to Client
        await transporter.sendMail({
            from: `"BrandKira" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Thank you for contacting BrandKira",
            html: `
                <h1>Thank You, ${name}! 👋</h1>
                <p>We have received your enquiry successfully.</p>
                <p><b>Lead ID:</b> ${leadId}</p>
                <p>Our team will contact you within one business day.</p>
                <br>
                <p>Regards,<br><b>BrandKira</b></p>
            `
        });

        return res.status(200).json({
            success: true
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            error: error.message
        });

    }

};