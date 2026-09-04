import { useElysiaClient } from '@/providers/Eden'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/Navbar'
import { CreditCard, Plus, Loader2, Sparkles, Check } from 'lucide-react'

export const Credits = () => {
  const client = useElysiaClient()
  const [success, setSuccess] = useState(false)
  const queryClient = useQueryClient()

  const onrampMutation = useMutation({
    mutationFn: () => client.payments.onramp.post({}),
    onSuccess:async (res) => {
      if (res.data && 'credits' in res.data) {
       await queryClient.invalidateQueries({ queryKey: ["user-profile"]})
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    },
  })

  const userProfileQuery  = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const response = await client["auth"].profile.get()
      if(response.error) throw new Error("error while fetching user details")
       return response.data
    }
  })

  const credits = userProfileQuery.data?.credits

  return (
    <div className="min-h-screen w-full bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Credits</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your credit balance to pay for API usage.
          </p>
        </div>

        {/* Balance Card */}
        <Card className="mb-8 border-border/50 overflow-hidden">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-chart-2/5" />
            <CardContent className="relative flex flex-col items-center py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                <CreditCard className="h-8 w-8" />
              </div>
              <p className="text-sm text-muted-foreground mb-2">Current Balance</p>
              <p className="text-5xl font-bold tracking-tight">
                {credits !== null ? (
                  <>
                    <span className="text-2xl font-normal text-muted-foreground align-top mr-1">$</span>
                    {credits}
                  </>
                ) : (
                  <span className="text-muted-foreground/50">—</span>
                )}
              </p>
              {credits === null && (
                <p className="mt-2 text-sm text-muted-foreground">Add credits to see your balance</p>
              )}
            </CardContent>
          </div>
        </Card>

        {/* Add Credits */}
        <Card className="mb-8 border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Add Credits</CardTitle>
            <CardDescription>
              Top up your balance to continue using the API.
            </CardDescription>
          </CardHeader>
          <CardContent>

            <div className="mt-6 flex justify-center">
              <Button
                size="lg"
                onClick={() => onrampMutation.mutate()}
                disabled={onrampMutation.isPending}
                className="h-12 px-8"
              >
                {onrampMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : success ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                {success ? 'Credits Added!' : 'Add Credits'}
              </Button>
            </div>

            {success && credits !== null && (
              <div className="mt-4 rounded-lg border border-chart-2/30 bg-chart-2/5 p-3 text-center">
                <p className="text-sm font-medium text-chart-2">
                  Your balance is now ${credits}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">How Credits Work</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 text-sm text-muted-foreground">
              <div className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  1
                </div>
                <p>Add credits to your account using the options above.</p>
              </div>
              <div className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  2
                </div>
                <p>Each API call deducts credits based on the model and token usage.</p>
              </div>
              <div className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  3
                </div>
                <p>Track per-key usage on the API Keys page to monitor your spending.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
