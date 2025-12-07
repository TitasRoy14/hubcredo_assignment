import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // DBOPS: Extract signup data
    const { id, name, email, signupDate } = body

    // DBOPS: Call n8n webhook
    // Replace with your actual n8n webhook URL
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL

    if (n8nWebhookUrl) {
      const response = await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "USER_SIGNUP",
          userId: id,
          userName: name,
          userEmail: email,
          signupTimestamp: signupDate,
          timestamp: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        console.error("n8n webhook failed:", await response.text())
      }
    } else {
      console.warn("N8N_WEBHOOK_URL not configured")
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
