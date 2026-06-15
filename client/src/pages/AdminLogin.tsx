import { useState } from "react";
import { Link } from "wouter";
import { ShieldAlert, Loader2, LockKeyhole, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AdminLogin() {
  const isDev = import.meta.env.DEV;
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fillCredentials = (nextIdentifier: string, nextPassword: string) => {
    setIdentifier(nextIdentifier);
    setPassword(nextPassword);
    setError("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier, password }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        setError(payload?.message || "Admin login failed");
        setSubmitting(false);
        return;
      }

      localStorage.setItem("stellar_username", payload?.user?.username || identifier);
      localStorage.setItem("stellar_password", password);
      window.location.href = "/admin";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Admin login failed");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border border-red-500/20 shadow-2xl shadow-red-950/30 bg-slate-950/95 text-slate-100">
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20">
              <ShieldAlert className="h-6 w-6 text-red-300" />
            </div>
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/5">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
            </Link>
          </div>
          <div>
            <CardTitle className="font-orbitron text-2xl tracking-wide">Admin Control Login</CardTitle>
            <CardDescription className="text-slate-400">
              Sign in with an administrator account to open the imported OGameX-style control systems.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isDev ? (
              <div className="space-y-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
                <div>Local dev defaults: `admin` / `Admin@12345` or `devadmin` / `dev-password`</div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-amber-300 text-amber-100 hover:bg-amber-500/20"
                    onClick={() => fillCredentials("admin", "Admin@12345")}
                  >
                    Use admin
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-amber-300 text-amber-100 hover:bg-amber-500/20"
                    onClick={() => fillCredentials("devadmin", "dev-password")}
                  >
                    Use devadmin
                  </Button>
                </div>
              </div>
            ) : null}
            <div>
              <Label htmlFor="admin-identifier" className="text-slate-200">Username or Email</Label>
              <Input
                id="admin-identifier"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                className="mt-1 border-slate-700 bg-slate-900 text-slate-100"
                placeholder="admin or admin@example.com"
                autoComplete="username"
                required
              />
            </div>
            <div>
              <Label htmlFor="admin-password" className="text-slate-200">Password</Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-1 border-slate-700 bg-slate-900 text-slate-100"
                placeholder="Enter administrator password"
                autoComplete="current-password"
                required
              />
            </div>
            {error ? (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {error}
              </div>
            ) : null}
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-500 text-white" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Authenticating
                </>
              ) : (
                <>
                  <LockKeyhole className="w-4 h-4 mr-2" /> Enter Admin Control
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-xs text-slate-500">
          Admin sessions are audited and privileged actions are recorded in the control log.
        </CardFooter>
      </Card>
    </div>
  );
}
