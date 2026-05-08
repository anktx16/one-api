import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Zap, Shield, Globe, ArrowRight, Sparkles, Code2, Layers } from 'lucide-react'

const features = [
  {
    icon: Globe,
    title: 'Unified API',
    description: 'Access hundreds of AI models through a single, consistent API endpoint.',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'API key management, usage tracking, and granular access controls built in.',
  },
  {
    icon: Layers,
    title: 'Smart Routing',
    description: 'Automatically route requests to the best provider based on cost and latency.',
  },
  {
    icon: Code2,
    title: 'Developer First',
    description: 'OpenAI-compatible API format. Drop-in replacement for your existing code.',
  },
]

const stats = [
  { value: '200+', label: 'AI Models' },
  { value: '50+', label: 'Providers' },
  { value: '99.9%', label: 'Uptime' },
  { value: '<100ms', label: 'Latency' },
]

export const Landing = () => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Zap className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold tracking-tight">OpenRouter</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/signin">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-6 pt-32 pb-20">
        <div className="relative mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Now with 200+ AI models
        </div>
        <h1 className="max-w-4xl text-center text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
          One API for{' '}
          <span className="bg-gradient-to-r from-primary via-primary/70 to-primary/40 bg-clip-text text-transparent">
            every AI model
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-center text-lg text-muted-foreground leading-relaxed">
          Access the world's best AI models — GPT-4, Claude, Gemini, Llama, and more — through a single, unified API. Pay only for what you use.
        </p>
        <div className="mt-10 flex items-center gap-4">
          <Link to="/signup">
            <Button size="lg" className="h-12 px-8 text-base">
              Start Building
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline" size="lg" className="h-12 px-8 text-base">
              View Models
            </Button>
          </Link>
        </div>

        {/* Code snippet preview */}
        <div className="mt-16 w-full max-w-2xl">
          <Card className="overflow-hidden border-border/50 bg-muted/30">
            <CardContent className="p-0">
              <div className="flex items-center gap-2 border-b border-border/50 px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-destructive/60" />
                <div className="h-3 w-3 rounded-full bg-chart-4/60" />
                <div className="h-3 w-3 rounded-full bg-chart-2/60" />
                <span className="ml-2 text-xs text-muted-foreground">api-request.ts</span>
              </div>
              <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
                <code className="text-muted-foreground">
                  <span className="text-primary/80">const</span> response = <span className="text-primary/80">await</span> fetch(<span className="text-chart-2">'https://openrouter.ai/api/v1/chat'</span>, {'{\n'}
                  {'  '}method: <span className="text-chart-2">'POST'</span>,{'\n'}
                  {'  '}headers: {'{ '}Authorization: <span className="text-chart-2">`Bearer ${'${'}API_KEY{'}'}`</span> {'}'},  {'\n'}
                  {'  '}body: JSON.stringify({'{\n'}
                  {'    '}model: <span className="text-chart-2">'openai/gpt-4-turbo'</span>,{'\n'}
                  {'    '}messages: [{'{ '}role: <span className="text-chart-2">'user'</span>, content: <span className="text-chart-2">'Hello!'</span> {'}'}]{'\n'}
                  {'  '}{'}'})  {'\n'}
                  {'}'});
                </code>
              </pre>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/50 bg-muted/20">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-6 py-16 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to build with AI
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Focus on building your product, not managing infrastructure.
          </p>
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {features.map((feature) => (
            <Card key={feature.title} className="border-border/50 bg-card/50 transition-colors hover:bg-card">
              <CardContent className="flex items-start gap-4 p-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/50 bg-muted/20">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Ready to get started?</h2>
          <p className="mt-4 text-muted-foreground">
            Create a free account and start making API calls in minutes.
          </p>
          <Link to="/signup">
            <Button size="lg" className="mt-8 h-12 px-8 text-base">
              Create Free Account
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span>OpenRouter</span>
          </div>
          <span>&copy; {new Date().getFullYear()} OpenRouter. All rights reserved.</span>
        </div>
      </footer>
    </div>
  )
}
