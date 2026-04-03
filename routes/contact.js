import express from 'express';
import ContactInquiry from '../models/ContactInquiry.js';
import transporter from '../config/mailer.js'; // adjust path

const router = express.Router();

router.post('/inquiries', async (req, res) => {
  try {
    const { name, email, phone, company, product_interest, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newInquiry = new ContactInquiry({
      name,
      email,
      phone,
      company: company || '',
      product_interest: product_interest || '',
      message
    });

    await newInquiry.save();
// ✅ SEND EMAIL (NEW CODE)
  // ✅ 1. Send email to ADMIN (YOU)
await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL_USER, // your email
  subject: 'New Contact Inquiry',
  html: `
    <h2>New Inquiry Received</h2>
    <p><b>Name:</b> ${name}</p>
    <p><b>Email:</b> ${email}</p>
    <p><b>Phone:</b> ${phone}</p>
    <p><b>Company:</b> ${company}</p>
    <p><b>Product:</b> ${product_interest}</p>
    <p><b>Message:</b> ${message}</p>
  `,
});

// ✅ 2. Auto-reply to USER
await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: email,
  subject: "We received your inquiry",
  html: `
    <p>Hi ${name},</p>
    <p>Thank you for contacting us. We have received your inquiry and will get back to you within 24 hours.</p>
    <br/>
    <p>Regards,<br/>Santosh Engineering Works</p>
  `,
});
    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully & email sent',
      data: newInquiry
    });
  } catch (error) {
    console.error('Error saving inquiry:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit inquiry'
    });
  }
});

router.get('/inquiries', async (req, res) => {
  try {
    const inquiries = await ContactInquiry.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: inquiries
    });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch inquiries'
    });
  }
});

export default router;
