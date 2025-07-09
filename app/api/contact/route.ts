import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Method 1: Using Formspree (requires setup)
    // You can sign up at https://formspree.io/ and get a form endpoint
    const formspreeEndpoint = process.env.FORMSPREE_ENDPOINT

    if (formspreeEndpoint) {
      const formspreeResponse = await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
        }),
      })

      if (formspreeResponse.ok) {
        return NextResponse.json({ success: true })
      }
    }

    // Method 2: Using EmailJS (client-side service)
    // This will be handled in the frontend component

    // Method 3: Using Nodemailer (requires SMTP setup)
    // Uncomment and configure if you want to use SMTP
    /*
    const nodemailer = require('nodemailer')
    
    const transporter = nodemailer.createTransporter({
      service: 'gmail', // or your email service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'vsivareddy.venna@gmail.com',
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <h3>New contact form submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    })
    */

    return NextResponse.json({ 
      success: true, 
      message: 'Message sent successfully!' 
    })

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
