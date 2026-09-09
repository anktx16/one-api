import { useElysiaClient } from '@/providers/Eden'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { LogoMark } from '@/components/LogoMark'

export const SignIn = () => {
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const elysiaClient = useElysiaClient()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      elysiaClient.auth['sign-in'].post({ email, password }),
    onSuccess: async (res) => {
      if (res.error || !res.data) {
        setError('Invalid email or password.')
        return
      }

      // Populate the auth cache before changing routes. This avoids the route
      // guard seeing the old unauthenticated result immediately after sign-in.
      const profile = await elysiaClient.auth.profile.get()
      if (profile.error || !profile.data) {
        setError('Sign in succeeded, but the session could not be verified. Please try again.')
        return
      }

      queryClient.setQueryData(['auth'], profile.data)
      navigate('/dashboard', { replace: true })
    },
    onError: () => {
      setError('Invalid email or password.')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const email = emailRef.current?.value ?? ''
    const password = passwordRef.current?.value ?? ''
    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }
    mutation.mutate({ email, password })
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <LogoMark className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">oneApi</span>
        </Link>

        <Card className="border-border/50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>Sign in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  ref={emailRef}
                  autoComplete="email"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  ref={passwordRef}
                  autoComplete="current-password"
                />
              </div>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              <Button type="submit" className="mt-2 w-full" disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-primary underline-offset-4 hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
