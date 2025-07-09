'use client'

export default function EmailJSDebug() {
  const checkConfig = () => {
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

    console.log('EmailJS Configuration Debug:')
    console.log('Service ID:', serviceId ? `✅ Set (${serviceId.substring(0, 10)}...)` : '❌ Not set')
    console.log('Template ID:', templateId ? `✅ Set (${templateId.substring(0, 10)}...)` : '❌ Not set')
    console.log('Public Key:', publicKey ? `✅ Set (${publicKey.substring(0, 10)}...)` : '❌ Not set')
    
    if (!serviceId || !templateId || !publicKey) {
      console.log('❌ EmailJS is NOT configured. Using mailto fallback.')
    } else {
      console.log('✅ EmailJS is configured and ready!')
    }

    // Check if emailjs is available
    if (typeof window !== 'undefined' && (window as any).emailjs) {
      console.log('✅ EmailJS library is loaded')
    } else {
      console.log('❌ EmailJS library is not loaded')
    }

    alert(`EmailJS Config:\nService ID: ${serviceId ? '✅ Set' : '❌ Missing'}\nTemplate ID: ${templateId ? '✅ Set' : '❌ Missing'}\nPublic Key: ${publicKey ? '✅ Set' : '❌ Missing'}`)
  }

  return (
    <button 
      onClick={checkConfig}
      className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded z-50"
    >
      Debug EmailJS
    </button>
  )
}
