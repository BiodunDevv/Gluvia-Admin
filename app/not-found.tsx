"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  SearchIcon, 
  Home01Icon, 
  ArrowLeft01Icon,
  FileNotFoundIcon
} from "@hugeicons/core-free-icons"

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="relative w-full max-w-lg overflow-hidden pt-0">
        <div className="bg-primary absolute inset-0 z-30 aspect-video opacity-30 mix-blend-color" />
        <div className="relative z-20 flex aspect-video w-full items-center justify-center bg-linear-to-br from-muted/50 to-muted">
          <div className="text-center">
            <HugeiconsIcon 
              icon={FileNotFoundIcon} 
              strokeWidth={1.5} 
              className="mx-auto h-32 w-32 text-muted-foreground/40"
            />
            <div className="mt-4 text-9xl font-bold text-muted-foreground/20">
              404
            </div>
          </div>
        </div>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl">Page Not Found</CardTitle>
              <CardDescription className="mt-2">
                The page you&apos;re looking for doesn&apos;t exist or has been moved.
                Please check the URL or navigate back to a safe place.
              </CardDescription>
            </div>
            <Badge variant="secondary" className="ml-4">
              Error
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="flex items-start gap-3">
              <HugeiconsIcon 
                icon={SearchIcon} 
                strokeWidth={2} 
                className="h-5 w-5 text-muted-foreground mt-0.5"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">What can you do?</p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>• Check if the URL is correct</li>
                  <li>• Go back to the previous page</li>
                  <li>• Return to the dashboard</li>
                  <li>• Contact support if the problem persists</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:flex-row">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/dashboard">
              <HugeiconsIcon 
                icon={Home01Icon} 
                strokeWidth={2} 
                data-icon="inline-start"
              />
              Go to Dashboard
            </Link>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="w-full sm:w-auto"
          >
            <HugeiconsIcon 
              icon={ArrowLeft01Icon} 
              strokeWidth={2} 
              data-icon="inline-start"
            />
            Go Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
