import { useElysiaClient } from '@/providers/Eden'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Navbar } from '@/components/Navbar'
import { Search, Globe, ExternalLink, ChevronRight, Box, Building2, CircleDot } from 'lucide-react'

export const Dashboard = () => {
  const client = useElysiaClient()
  const [search, setSearch] = useState('')
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null)

  const modelsQuery = useQuery({
    queryKey: ['models'],
    queryFn: async () => {
      const res = await client.models.get()
      return res.data
    },
  })

  const providersQuery = useQuery({
    queryKey: ['providers'],
    queryFn: async () => {
      const res = await client.models.providers.get()
      return res.data
    },
  })

  const modelProvidersQuery = useQuery({
    queryKey: ['model-providers', selectedModelId],
    queryFn: async () => {
      if (!selectedModelId) return null
      const res = await client.models({ id: selectedModelId }).providers.get()
      return res.data
    },
    enabled: !!selectedModelId,
  })

  const models = modelsQuery.data?.models ?? []
  const providers = providersQuery.data?.providers ?? []
  const selectedModel = models.find((model) => model.id === selectedModelId)

  const filteredModels = models.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.slug.toLowerCase().includes(search.toLowerCase()) ||
      m.company.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <div aria-hidden="true" className="pointer-events-none absolute -top-56 right-0 h-[31.25rem] w-[31.25rem] rounded-full bg-primary/8 blur-3xl" />
      <Navbar />
      <main className="relative z-10 mx-auto max-w-7xl px-6 pt-28 pb-16">
        {/* Header */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <CircleDot className="h-3.5 w-3.5" />
              Model workspace
            </div>
            <h1 className="mt-4 text-4xl font-bold tracking-[-0.04em]">Find the right route.</h1>
            <p className="mt-2 text-muted-foreground">Browse models, compare available providers, and inspect the details that matter.</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-card/60 px-4 py-3 text-sm backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Current selection</p>
            <p className="mt-1 font-medium text-foreground">{selectedModel?.name ?? 'Choose a model'}</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card className="border-white/10 bg-card/70 transition-colors hover:border-primary/35">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/25">
                <Box className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{models.length}</p>
                <p className="text-sm text-muted-foreground">Model catalog</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-card/70 transition-colors hover:border-primary/35">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{providers.length}</p>
                <p className="text-sm text-muted-foreground">Provider connections</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-card/70 transition-colors hover:border-primary/35">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {new Set(models.map((m) => m.company.name)).size}
                </p>
                <p className="text-sm text-muted-foreground">Model makers</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Models list */}
          <div className="lg:col-span-2">
            <Card className="border-white/10 bg-card/75 backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Model catalog</CardTitle>
                    <CardDescription className="mt-1">
                      {filteredModels.length} model{filteredModels.length !== 1 ? 's' : ''} available
                    </CardDescription>
                  </div>
                </div>
                <div className="relative mt-3">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search models..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border-white/10 bg-background/60 pl-9 focus-visible:border-primary/50"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {modelsQuery.isLoading ? (
                  <div className="flex items-center justify-center py-12 text-muted-foreground">
                    Loading models...
                  </div>
                ) : filteredModels.length === 0 ? (
                  <div className="flex items-center justify-center py-12 text-muted-foreground">
                    No models found.
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {filteredModels.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => setSelectedModelId(model.id)}
                        className={`group flex items-center justify-between rounded-xl border px-4 py-3.5 text-left transition-all hover:-translate-y-px hover:border-primary/35 hover:bg-primary/5 ${
                          selectedModelId === model.id
                            ? 'border-primary/60 bg-primary/10 shadow-[0_0_24px_oklch(0.64_0.235_28_/_10%)]'
                            : 'border-white/8 bg-background/20'
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="font-medium truncate">{model.name}</p>
                          <p className="mt-0.5 text-sm text-muted-foreground truncate">
                            {model.company.name} &middot; {model.slug}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar — model providers or providers list */}
          <div className="flex flex-col gap-6">
            {selectedModelId && modelProvidersQuery.data ? (
              <Card className="border-primary/25 bg-card/80 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-lg">Model Providers</CardTitle>
                  <CardDescription>{selectedModel?.name ?? 'Selected model'} · available providers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3">
                    {(modelProvidersQuery.data.modelProviders ?? []).map((mp) => (
                      <div
                        key={mp.id}
                        className="rounded-xl border border-white/8 bg-background/30 p-3.5 transition-colors hover:border-primary/30"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">{mp.providerName}</p>
                          <a
                            href={mp.providerWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                          <div className="rounded-lg bg-muted/60 px-2 py-1.5">
                            <span className="text-muted-foreground">Input: </span>
                            <span className="font-medium">${mp.inputTokenCost}/1K</span>
                          </div>
                          <div className="rounded-lg bg-muted/60 px-2 py-1.5">
                            <span className="text-muted-foreground">Output: </span>
                            <span className="font-medium">${mp.outputTokenCost}/1K</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {(modelProvidersQuery.data.modelProviders ?? []).length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No providers available.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-white/10 bg-card/75 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-lg">Providers</CardTitle>
                  <CardDescription>All available providers</CardDescription>
                </CardHeader>
                <CardContent>
                  {providersQuery.isLoading ? (
                    <div className="py-8 text-center text-muted-foreground">Loading...</div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {providers.map((provider) => (
                        <div
                          key={provider.id}
                          className="flex items-center justify-between rounded-xl border border-white/8 bg-background/25 px-3.5 py-3 transition-colors hover:border-primary/30"
                        >
                          <p className="text-sm font-medium">{provider.name}</p>
                          <a
                            href={provider.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {selectedModelId && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedModelId(null)}
              >
                Show all providers
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
