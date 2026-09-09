import { Link } from 'react-router'
import { useState } from 'react'
import { ArrowRight, BookOpen, Check, Copy, KeyRound, ShieldCheck, Terminal } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Navbar2 } from '@/components/Navbar2'

const examples = [
  {
    title: 'cURL',
    language: 'Shell',
    code: `curl "https://YOUR_API_URL/api/v1/chat/completions" \\
  -H "Authorization: Bearer $ONE_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "openai/gpt-oss-120b",
    "messages": [{ "role": "user", "content": "Hello" }]
  }'`,
  },
  {
    title: 'JavaScript',
    language: 'Node.js',
    code: `const response = await fetch(
  'https://YOUR_API_URL/api/v1/chat/completions',
  {
    method: 'POST',
    headers: {
      Authorization: \`Bearer \${process.env.ONE_API_KEY}\`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'openai/gpt-oss-120b',
      messages: [{ role: 'user', content: 'Hello' }],
    }),
  },
)

const data = await response.json()`,
  },
  {
    title: 'Python',
    language: 'Python',
    code: `import os
import requests

response = requests.post(
    'https://YOUR_API_URL/api/v1/chat/completions',
    headers={
        'Authorization': f"Bearer {os.environ['ONE_API_KEY']}",
        'Content-Type': 'application/json',
    },
    json={
        'model': 'openai/gpt-oss-120b',
        'messages': [{ 'role': 'user', 'content': 'Hello' }],
    },
)

data = response.json()`,
  },
  {
    title: 'JavaScript with Axios',
    language: 'Node.js + Axios',
    code: `import axios from 'axios'

const { data } = await axios.post(
  'https://YOUR_API_URL/api/v1/chat/completions',
  {
    model: 'openai/gpt-oss-120b',
    messages: [{ role: 'user', content: 'Hello' }],
  },
  {
    headers: {
      Authorization: \`Bearer \${process.env.ONE_API_KEY}\`,
      'Content-Type': 'application/json',
    },
  },
)`,
  },
]

export const Docs = () => {
  const [copiedExample, setCopiedExample] = useState<string | null>(null)

  const copyExample = async (title: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedExample(title)
      setTimeout(() => setCopiedExample((current) => (current === title ? null : current)), 2000)
    } catch (error) {
      console.error('Unable to copy code example', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar2 />
      <main className="mx-auto max-w-6xl px-6 pb-20 pt-28">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-3 py-1.5 text-sm text-primary">
            <BookOpen className="h-4 w-4" />
            Documentation
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">Make your first request.</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Create a key, add it to your environment, and call the chat completions endpoint with the model you want to use.
          </p>
        </div>

        <section className="mt-14 grid gap-5 md:grid-cols-3">
          <Card className="border-border/70 bg-card/70">
            <CardContent className="p-6">
              <KeyRound className="h-5 w-5 text-primary" />
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">01 / Create a key</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Create a named key from the dashboard. Copy it when it is shown—full keys are only displayed once.</p>
              <Link to="/api-keys" className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80">
                Manage API keys <ArrowRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
          <Card className="border-border/70 bg-card/70">
            <CardContent className="p-6">
              <Terminal className="h-5 w-5 text-primary" />
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">02 / Store it safely</p>
              <pre className="mt-3 overflow-x-auto rounded-lg border border-border/70 bg-background p-3 text-xs text-foreground"><code>ONE_API_KEY=your_key_here</code></pre>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Use environment variables. Never commit a key to a repository or send it to the browser.</p>
            </CardContent>
          </Card>
          <Card className="border-border/70 bg-card/70">
            <CardContent className="p-6">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">03 / Send a request</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Pass the key as a Bearer token and choose a model slug from the models page.</p>
              <Link to="/dashboard" className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80">
                Browse models <ArrowRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </section>

        <section className="mt-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Examples</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight">Use the stack you already know.</h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">Replace <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">YOUR_API_URL</code> with your deployed API address.</p>
          </div>
          <div className="mt-7 grid gap-6">
            {examples.map((example) => (
              <Card key={example.title} className="overflow-hidden border-border/70 bg-card/80">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between border-b border-border/70 px-5 py-3">
                    <span className="font-medium">{example.title}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{example.language}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => void copyExample(example.title, example.code)}
                        aria-label={`Copy ${example.title} example`}
                      >
                        {copiedExample === example.title ? (
                          <Check className="h-3.5 w-3.5 text-chart-2" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                        {copiedExample === example.title ? 'Copied' : 'Copy'}
                      </Button>
                    </div>
                  </div>
                  <pre className="overflow-x-auto p-5 text-xs leading-relaxed text-muted-foreground"><code>{example.code}</code></pre>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-2xl border border-primary/25 bg-primary/8 px-6 py-8 sm:flex sm:items-center sm:justify-between sm:px-8">
          <div>
            <h2 className="text-xl font-semibold">Ready to try a request?</h2>
            <p className="mt-1 text-sm text-muted-foreground">Create a key first, then come back to the example that fits your stack.</p>
          </div>
          <Link to="/api-keys" className="mt-5 inline-block sm:mt-0">
            <Button>Go to API keys <ArrowRight className="h-4 w-4" /></Button>
          </Link>
        </section>
      </main>
    </div>
  )
}
