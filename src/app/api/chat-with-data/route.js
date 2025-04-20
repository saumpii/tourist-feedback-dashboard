import { Anthropic } from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

export async function POST(req) {
  try {
    const { question, data } = await req.json()
    const sample = data.slice(0, 30)

    const context = sample.map(
      r => `City: ${r.city}, Category: ${r.category}, Review: ${r.review}, Rating: ${r.rating}`
    ).join('\n')

    const prompt = `
You are a helpful assistant analyzing tourist reviews.

Context:
${context}

Question:
${question}

Answer:
`

    const completion = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 800,
      temperature: 0.7,
      messages: [{ role: "user", content: prompt }]
    })

    return Response.json({ output: completion.content[0].text })
  } catch (err) {
    console.error('Claude chat error:', err)
    return Response.json({ output: 'Error generating response from Claude.' }, { status: 500 })
  }
}
