import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bot, Edit3, LayoutGrid } from 'lucide-react';
import { AppLogo } from '@/components/icons/logo';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
            <AppLogo className="h-8 w-8" />
            <span>FormEase</span>
          </Link>
          <Button asChild variant="ghost">
            <Link href="/dashboard">Go to App</Link>
          </Button>
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground">
              Build Smarter Forms, Effortlessly
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground">
              FormEase leverages AI to help you create optimal forms with intelligent suggestions for question types and validation rules. Streamline your data collection today.
            </p>
            <div className="mt-10">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/dashboard">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">Features That Simplify Form Creation</h2>
              <p className="mt-4 text-lg text-muted-foreground">Everything you need to design effective and engaging forms.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-card rounded-xl shadow-lg flex flex-col items-center text-center">
                <div className="p-3 bg-primary/10 rounded-full mb-4">
                  <Bot className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-2">AI-Assisted Creation</h3>
                <p className="text-muted-foreground">Get smart suggestions for question types and validation rules, tailored to your form's context.</p>
              </div>
              <div className="p-6 bg-card rounded-xl shadow-lg flex flex-col items-center text-center">
                <div className="p-3 bg-accent/10 rounded-full mb-4">
                 <Edit3 className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-2">Intuitive Form Building</h3>
                <p className="text-muted-foreground">Easily add and configure fields to build your perfect form (drag & drop coming soon!).</p>
              </div>
              <div className="p-6 bg-card rounded-xl shadow-lg flex flex-col items-center text-center">
                <div className="p-3 bg-secondary/20 rounded-full mb-4">
                  <LayoutGrid className="h-8 w-8 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-2">Form Management</h3>
                <p className="text-muted-foreground">Save, preview, and manage all your forms in one centralized dashboard.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 bg-muted border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} FormEase. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
