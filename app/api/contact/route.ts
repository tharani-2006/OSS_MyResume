import { NextRequest, NextResponse } from 'next/server'
import { processFormData, securityHeaders, rateLimit } from '../../lib/security'

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = request.headers.get('x-forwarded-for') ||
                    request.headers.get('x-real-ip') ||
                    'unknown'

    // Rate limiting check
    const isAllowed = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 5,
      identifier: `contact_api_${clientIP}`,
    })

    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        {
          status: 429,
          headers: securityHeaders
        }
      )
    }

    // Validate request headers
    const contentType = request.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        {
          status: 400,
          headers: securityHeaders
        }
      )
    }

    // Check for CSRF token
    const csrfToken = request.headers.get('x-csrf-token')
    if (!csrfToken) {
      return NextResponse.json(
        { error: 'CSRF token missing' },
        {
          status: 403,
          headers: securityHeaders
        }
      )
    }

    // Parse and validate request body
    let body
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        {
          status: 400,
          headers: securityHeaders
        }
      )
    }

    // Validate CSRF token from body
    if (!body.csrf_token || body.csrf_token !== csrfToken) {
      return NextResponse.json(
        { error: 'Invalid CSRF token' },
        {
          status: 403,
          headers: securityHeaders
        }
      )
    }

    // Process and validate form data with security checks
    const { isValid, sanitizedData, errors } = processFormData(body)

    if (!isValid) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: errors
        },
        {
          status: 400,
          headers: securityHeaders
        }
      )
    }

    const { name, email, subject, message } = sanitizedData

    // Additional server-side validation
    const requiredFields = ['name', 'email', 'message']
    for (const field of requiredFields) {
      if (!sanitizedData[field] || sanitizedData[field].trim() === '') {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          {
            status: 400,
            headers: securityHeaders
          }
        )
      }
    }

    // Log the secure contact attempt
    console.log('Secure contact form submission:', {
      timestamp: new Date().toISOString(),
      clientIP,
      email: sanitizedData.email,
      name: sanitizedData.name,
      hasMessage: !!sanitizedData.message,
      userAgent: request.headers.get('user-agent'),
    })

    // Method 1: Using Formspree (requires setup)
    // You can sign up at https://formspree.io/ and get a form endpoint
    const formspreeEndpoint = process.env.FORMSPREE_ENDPOINT

    if (formspreeEndpoint) {
      const formspreeResponse = await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Portfolio-Contact-Form/1.0',
        },
        body: JSON.stringify({
          name,
          email,
          subject: subject || 'Portfolio Contact',
          message,
          timestamp: new Date().toISOString(),
          source: 'portfolio-website',
        }),
      })

      if (formspreeResponse.ok) {
        return NextResponse.json(
          {
            success: true,
            message: 'Message sent successfully via Formspree!',
            timestamp: new Date().toISOString()
          },
          {
            status: 200,
            headers: securityHeaders
          }
        )
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

    return NextResponse.json(
      {
        success: true,
        message: 'Message received successfully! We\'ll get back to you soon.',
        timestamp: new Date().toISOString()
      },
      {
        status: 200,
        headers: securityHeaders
      }
    )

  } catch (error) {
    console.error('Contact form error:', error)

    // Log security incident
    console.warn('Security incident in contact form:', {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      clientIP: request.headers.get('x-forwarded-for') || 'unknown',
    })

    return NextResponse.json(
      { error: 'Internal server error' },
      {
        status: 500,
        headers: securityHeaders
      }
    )
  }
}

// Handle other HTTP methods securely
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    {
      status: 405,
      headers: {
        ...securityHeaders,
        'Allow': 'POST'
      }
    }
  )
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    {
      status: 405,
      headers: {
        ...securityHeaders,
        'Allow': 'POST'
      }
    }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    {
      status: 405,
      headers: {
        ...securityHeaders,
        'Allow': 'POST'
      }
    }
  )
}
