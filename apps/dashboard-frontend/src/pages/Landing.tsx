import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Shield, Globe, ArrowRight, ArrowUpRight, Braces, Code2, Layers, Route } from 'lucide-react'
import { LogoMark } from '@/components/LogoMark'
import { useAuth } from '@/hooks/useAuth'
import { Navbar2 } from '@/components/Navbar2'

const features = [
  {
    icon: Globe,
    title: 'One familiar interface',
    description: 'A consistent API shape for trying models without rewriting the same request each time.',
  },
  {
    icon: Shield,
    title: 'Keys and access',
    description: 'A simple place to create keys and keep the project’s access flow understandable.',
  },
  {
    icon: Layers,
    title: 'Model routing',
    description: 'A routing layer for sending the same kind of request to different model providers.',
  },
  {
    icon: Code2,
    title: 'Built for learning',
    description: 'An ongoing project for exploring API design, provider integrations, and product UX.',
  },
]

const featureColors = [
  'bg-chart-2/10 text-chart-2 ring-chart-2/20',
  'bg-chart-4/10 text-chart-4 ring-chart-4/20',
  'bg-primary/10 text-primary ring-primary/20',
  'bg-chart-5/10 text-chart-5 ring-chart-5/20',
]

const modelRoutes = [
  { name: 'GPT-OSS', detail: 'Open-weight reasoning', tone: 'bg-primary text-primary-foreground border-primary' },
  { name: 'Qwen', detail: 'Multilingual tasks', tone: 'bg-card border-border hover:border-primary/60' },
  { name: 'Grok Compound Mini', detail: 'Fast tool use', tone: 'bg-card border-border hover:border-primary/60' },
  { name: 'DeepSeek V4', detail: 'Deep analysis', tone: 'bg-card border-border hover:border-primary/60' },
  { name: 'Kimi K3', detail: 'Long context', tone: 'bg-card border-border hover:border-primary/60' },
]

export const Landing = () => {

  const { data, isLoading } = useAuth();
  const isSignedIn = !!data;

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute -top-52 left-1/2 h-[31.25rem] w-[31.25rem] -translate-x-1/2 rounded-full border border-primary/20 bg-primary/8 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute top-80 -right-64 h-[31.25rem] w-[31.25rem] rounded-full bg-chart-4/8 blur-3xl" />
      {/* Header */}
      <Navbar2/>

      {/* Hero */}
      <section className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pt-36 pb-24">
        <div className="relative mb-7 inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-4 py-1.5 text-sm text-primary shadow-[0_0_32px_oklch(0.64_0.235_28_/_18%)]">
          <Braces className="h-3.5 w-3.5" />
          oneApi / model gateway
        </div>
        <h1 className="max-w-5xl text-center text-5xl font-bold leading-[1.02] tracking-[-0.06em] sm:text-6xl lg:text-8xl">
          One api.
          <br />
          <span className="bg-gradient-to-r from-chart-2 via-primary to-chart-4 bg-clip-text text-transparent">
            for every AI model.
          </span>
        </h1>
        <p className="mt-7 max-w-xl text-center text-base text-muted-foreground leading-relaxed sm:text-lg">
          One API surface for moving between GPT-OSS, Qwen, Grok Compound Mini, DeepSeek V4, Kimi K3, and the next model worth trying.
        </p>
        <div className="mt-10 flex items-center gap-4">
          <Link to={isSignedIn ? "/dashboard" : "/signup"}>
            <Button size="lg" disabled={isLoading} className="h-12 px-8 text-base shadow-[0_0_30px_oklch(0.64_0.235_28_/_28%)]">
              {isLoading ? "loading..." : isSignedIn ? "Open Dashboard" : "Get Started"}
              {!isLoading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </Link>
          <Link target='blank' to="https://www.linkedin.com/in/ankit-yadav-55a93b27b/">
            <Button variant="outline" size="lg" className="h-12 px-8 text-base">
              Contact Dev
            </Button>
          </Link>
        </div>

        {/* Code snippet preview */}
        <div className="mt-16 w-full max-w-2xl">
          <Card className="overflow-hidden border-border/70 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="flex items-center gap-2 border-b border-border/50 px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-destructive/60" />
                <div className="h-3 w-3 rounded-full bg-chart-4/60" />
                <div className="h-3 w-3 rounded-full bg-chart-2/60" />
                <span className="ml-2 text-xs text-muted-foreground">request.ts</span>
              </div>
              <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
                <code className="text-muted-foreground">
                  <span className="text-primary/80">const</span> response = <span className="text-primary/80">await</span> fetch(<span className="text-chart-2">'/api/v1/chat/completions'</span>, {'{\n'}
                  {'  '}method: <span className="text-chart-2">'POST'</span>,{'\n'}
                  {'  '}headers: {'{ '}Authorization: <span className="text-chart-2">`Bearer ${'${'}API_KEY{'}'}`</span> {'}'},  {'\n'}
                  {'  '}body: JSON.stringify({'{\n'}
                  {'    '}model: <span className="text-chart-2">'openai/gpt-oss-120b'</span>,{'\n'}
                  {'    '}messages: [{'{ '}role: <span className="text-chart-2">'user'</span>, content: <span className="text-chart-2">'Hello!'</span> {'}'}]{'\n'}
                  {'  '}{'}'})  {'\n'}
                  {'}'});
                </code>
              </pre>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Model routes */}
      <section className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-10">
        <div className="overflow-hidden rounded-2xl border border-border/80 bg-card/70 shadow-[0_24px_80px_oklch(0_0_0_/_35%)]">
          <div className="grid gap-6 border-b border-border/70 px-6 py-7 sm:grid-cols-[0.9fr_2fr] sm:items-end sm:px-8">
            <div className="flex items-center gap-3 text-primary">
              <Route className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em]">Model switchboard</span>
            </div>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-right">
              Keep the request shape familiar. Pick the model that fits the task.
            </p>
          </div>
          <div className="grid gap-px bg-border sm:grid-cols-5">
            {modelRoutes.map((model) => (
              <div key={model.name} className={`group min-h-36 border-border p-5 transition-colors ${model.tone}`}>
                <ArrowUpRight className="mb-8 h-4 w-4 opacity-65 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                <div className="text-sm font-semibold leading-tight">{model.name}</div>
                <div className="mt-1 text-xs opacity-65">{model.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-28">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            The details that make it useful
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Less ceremony around model access. More room to test ideas.
          </p>
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {features.map((feature, index) => (
            <Card key={feature.title} className="border-border/70 bg-card/65 transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:bg-card">
              <CardContent className="flex items-start gap-4 p-6">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ring-1 ${featureColors[index] ?? featureColors[0]}`}>
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
      <section className="relative z-10 px-6 pt-10 pb-20 sm:pt-14 sm:pb-28">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-card/75 shadow-[0_24px_80px_oklch(0_0_0_/_42%)] backdrop-blur-xl">
          <div aria-hidden="true" className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
          <div aria-hidden="true" className="absolute bottom-0 left-1/3 h-px w-2/3 bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
          <div className="relative grid items-center gap-10 px-7 py-10 sm:px-12 sm:py-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">One request · many routes</p>
              <h2 className="mt-4 max-w-xl text-3xl font-bold tracking-[-0.04em] sm:text-5xl">Make room for model choice.</h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
                Start with one request, then send it where it makes the most sense for the work in front of you.
              </p>
              <Link to="/signup" className="mt-8 inline-block">
                <Button size="lg" className="h-12 px-7 text-base shadow-[0_0_28px_oklch(0.64_0.235_28_/_30%)]">
                  {isLoading ? "loading..." : isSignedIn ? "Open the interface" : "Signin to see models"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="relative hidden min-h-64 lg:block">
              <div className="absolute left-4 top-1/2 h-px w-14 bg-primary/70" />
              <div className="absolute left-18 top-[17%] h-[66%] w-px bg-primary/35" />
              <div className="absolute left-4 top-[calc(50%-1.15rem)] flex h-9 w-9 items-center justify-center rounded-xl border border-primary/50 bg-primary text-xs font-bold text-primary-foreground shadow-[0_0_24px_oklch(0.64_0.235_28_/_35%)]">1</div>
              <div className="absolute left-31 top-[11%] h-px w-9 bg-primary/35" />
              <div className="absolute left-31 top-1/2 h-px w-9 bg-primary/35" />
              <div className="absolute bottom-[11%] left-31 h-px w-9 bg-primary/35" />
              <div className="absolute left-41 top-[2%] w-52 rounded-xl border border-white/10 bg-background/70 px-4 py-3">
                <p className="text-xs font-medium">GPT-OSS</p><p className="mt-0.5 text-[11px] text-muted-foreground">reasoning route</p>
              </div>
              <div className="absolute left-41 top-[39%] w-52 rounded-xl border border-primary/40 bg-primary/10 px-4 py-3">
                <p className="text-xs font-medium text-primary">Qwen</p><p className="mt-0.5 text-[11px] text-muted-foreground">selected route</p>
              </div>
              <div className="absolute bottom-[2%] left-41 w-52 rounded-xl border border-white/10 bg-background/70 px-4 py-3">
                <p className="text-xs font-medium">DeepSeek V4</p><p className="mt-0.5 text-[11px] text-muted-foreground">analysis route</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/70 py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <LogoMark className="h-5 w-5 text-primary" />
            <span>oneApi</span>
          </div>
          <span>One API surface. Many model paths.</span>
        </div>
      </footer>
    </div>
  )
}
