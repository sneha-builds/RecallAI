'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">RecallAI</h1>
          <p className="text-muted-foreground">Create your account</p>
        </div>

        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="bg-card border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="bg-card border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm" className="text-foreground">Confirm Password</Label>
            <Input
              id="confirm"
              type="password"
              placeholder="••••••••"
              className="bg-card border-border"
            />
          </div>

          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            Create Account
          </Button>
        </form>

        <div className="text-center">
          <p className="text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-accent hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
