import { Link } from "react-router";
import { LogoMark } from "./LogoMark";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function Navbar2() {

      const { data, isLoading } = useAuth();
      const isSignedIn = !!data;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background/55 shadow-[0_10px_30px_oklch(0_0_0_/_22%)] backdrop-blur-2xl backdrop-saturate-150">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" >
            <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <LogoMark className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">oneApi</span>
          </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/docs">
              <Button variant="ghost" size="sm">Docs</Button>
            </Link>
            {!isLoading && !isSignedIn && (
              <Link to="/signin">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            )}
            <Link to={isSignedIn ? "/dashboard" : "/signup"}>
              <Button disabled={isLoading} size="sm">
                {isLoading ? "loading..." : isSignedIn ? "Dashboard" : "Get Started"}
                {!isLoading && <ArrowRight className="h-4 w-4" />}
              </Button>
            </Link>
          </div>
        </div>
      </header>
    )
}
