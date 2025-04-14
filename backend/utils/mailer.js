import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER, // Thay bằng email của bạn
    pass: process.env.EMAIL_PASS, // Thay bằng mật khẩu ứng dụng của bạn
  },
});

export const sendContactEmail = async (contactData) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Email của bạn
    subject: "New Contact Form Submission",
    html: `
      <h3>New Contact Message</h3>
      <p><strong>Name:</strong> ${contactData.first_name} ${contactData.last_name}</p>
      <p><strong>Email:</strong> ${contactData.email}</p>
      <p><strong>Message:</strong> ${contactData.message}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
