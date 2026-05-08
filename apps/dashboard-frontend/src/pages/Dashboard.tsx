import { useElysiaClient } from '@/providers/Eden'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Navbar } from '@/components/Navbar'
import { Search, Globe, ExternalLink, ChevronRight, Box, Building2 } from 'lucide-react'

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

  const filteredModels = models.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.slug.toLowerCase().includes(search.toLowerCase()) ||
      m.company.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="min-h-screen w-full bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 pt-24 pb-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Browse available models and providers.</p>
        </div>

        {/* Stats row */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card className="border-border/50">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Box className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{models.length}</p>
                <p className="text-sm text-muted-foreground">Models</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/10 text-chart-2">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{providers.length}</p>
                <p className="text-sm text-muted-foreground">Providers</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-4/10 text-chart-4">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {new Set(models.map((m) => m.company.name)).size}
                </p>
                <p className="text-sm text-muted-foreground">Companies</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Models list */}
          <div className="lg:col-span-2">
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Models</CardTitle>
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
                    className="pl-9"
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
                        className={`flex items-center justify-between rounded-lg border px-4 py-3 text-left transition-colors hover:bg-muted/50 ${
                          selectedModelId === model.id
                            ? 'border-primary/50 bg-primary/5'
                            : 'border-border/50'
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="font-medium truncate">{model.name}</p>
                          <p className="mt-0.5 text-sm text-muted-foreground truncate">
                            {model.company.name} &middot; {model.slug}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
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
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Model Providers</CardTitle>
                  <CardDescription>
                    Available providers for this model
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3">
                    {(modelProvidersQuery.data.modelProviders ?? []).map((mp) => (
                      <div
                        key={mp.id}
                        className="rounded-lg border border-border/50 p-3"
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
                          <div className="rounded bg-muted/50 px-2 py-1">
                            <span className="text-muted-foreground">Input: </span>
                            <span className="font-medium">${mp.inputTokenCost}/1K</span>
                          </div>
                          <div className="rounded bg-muted/50 px-2 py-1">
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
              <Card className="border-border/50">
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
                          className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2.5"
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
