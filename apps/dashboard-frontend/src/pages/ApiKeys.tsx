import { useElysiaClient } from '@/providers/Eden'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Navbar } from '@/components/Navbar'
import {
  Key,
  Plus,
  Trash2,
  Copy,
  Check,
  Loader2,
  Eye,
  EyeOff,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react'

export const ApiKeys = () => {
  const client = useElysiaClient()
  const queryClient = useQueryClient()
  const [newKeyName, setNewKeyName] = useState('')
  const [createdKey, setCreatedKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())

  const keysQuery = useQuery({
    queryKey: ['api-keys'],
    queryFn: async () => {
      const res = await client['api-keys'].get()
      return res.data
    },
  })

  const createMutation = useMutation({
    mutationFn: (name: string) => client['api-keys'].post({ name }),
    onSuccess: (res) => {
      if (res.data && 'apiKey' in res.data) {
        setCreatedKey(res.data.apiKey)
        setNewKeyName('')
        queryClient.invalidateQueries({ queryKey: ['api-keys'] })
      }
    },
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, disabled }: { id: string; disabled: boolean }) =>
      client['api-keys'].put({ id, disabled }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => client['api-keys']({ id }).delete(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] })
    },
  })

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const toggleVisibility = (id: string) => {
    setVisibleKeys((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const apiKeys = keysQuery.data?.apiKeys ?? []

  return (
    <div className="min-h-screen w-full bg-background">
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
          <p className="mt-1 text-muted-foreground">
            Create and manage your API keys for accessing models.
          </p>
        </div>

        {/* Create Key */}
        <Card className="mb-8 border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Create a New Key</CardTitle>
            <CardDescription>Give your key a memorable name.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <div className="flex-1">
                <Label htmlFor="key-name" className="sr-only">
                  Key Name
                </Label>
                <Input
                  id="key-name"
                  placeholder="e.g. Production, Development, Testing..."
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newKeyName.trim()) {
                      createMutation.mutate(newKeyName.trim())
                    }
                  }}
                />
              </div>
              <Button
                onClick={() => {
                  if (newKeyName.trim()) createMutation.mutate(newKeyName.trim())
                }}
                disabled={!newKeyName.trim() || createMutation.isPending}
              >
                {createMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Create
              </Button>
            </div>

            {/* Newly created key */}
            {createdKey && (
              <div className="mt-4 rounded-lg border border-chart-2/30 bg-chart-2/5 p-4">
                <p className="mb-2 text-sm font-medium text-chart-2">
                  Key created! Copy it now — you won't be able to see the full key again.
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 rounded bg-muted/50 px-3 py-2 text-sm font-mono break-all">
                    {createdKey}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleCopy(createdKey)}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-chart-2" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Keys List */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Your API Keys</CardTitle>
            <CardDescription>
              {apiKeys.length} key{apiKeys.length !== 1 ? 's' : ''} total
            </CardDescription>
          </CardHeader>
          <CardContent>
            {keysQuery.isLoading ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                Loading keys...
              </div>
            ) : apiKeys.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Key className="mb-3 h-10 w-10 text-muted-foreground/50" />
                <p className="text-muted-foreground">No API keys yet.</p>
                <p className="mt-1 text-sm text-muted-foreground/70">
                  Create one above to get started.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {apiKeys.map((key) => (
                  <div
                    key={key.id}
                    className={`rounded-lg border px-4 py-3 transition-colors ${
                      key.disabled
                        ? 'border-border/30 bg-muted/20 opacity-60'
                        : 'border-border/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{key.name}</p>
                          {key.disabled && (
                            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                              Disabled
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <code className="text-sm text-muted-foreground font-mono">
                            {visibleKeys.has(key.id) ? key.apiKey : key.apiKey.slice(0, 12) + '••••••••'}
                          </code>
                          <button
                            onClick={() => toggleVisibility(key.id)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            {visibleKeys.has(key.id) ? (
                              <EyeOff className="h-3.5 w-3.5" />
                            ) : (
                              <Eye className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="hidden sm:block text-right">
                          <p>Credits: {key.creditsConsumed.toFixed(2)}</p>
                          {key.lastUsed && (
                            <p className="mt-0.5">
                              Last used: {new Date(key.lastUsed).toLocaleDateString()}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() =>
                              toggleMutation.mutate({
                                id: key.id,
                                disabled: !key.disabled,
                              })
                            }
                            title={key.disabled ? 'Enable' : 'Disable'}
                          >
                            {key.disabled ? (
                              <ToggleLeft className="h-4 w-4" />
                            ) : (
                              <ToggleRight className="h-4 w-4 text-chart-2" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => deleteMutation.mutate(key.id)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
