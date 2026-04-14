"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { fetchMe, loginWithPassword } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const accessToken = await loginWithPassword(email, password);
      localStorage.setItem("token", accessToken);
      const currentUser = await fetchMe();

      login(accessToken, currentUser);
      toast.success("Login successful!");
      router.push("/dashboard");
    } catch {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center -mt-16">
      <div className="glass p-12 rounded-[48px] w-full max-w-md space-y-8 animate-in zoom-in-95 duration-500">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent">
            Relxena
          </h1>
          <p className="text-zinc-500 font-medium">Enter your credentials to access the venue.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[10px] font-black tracking-widest uppercase text-zinc-500 ml-1">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 rounded-2xl bg-white/5 border-white/5 focus:ring-blue-500/50"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" title="Password" className="text-[10px] font-black tracking-widest uppercase text-zinc-500 ml-1">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-14 rounded-2xl bg-white/5 border-white/5 focus:ring-blue-500/50"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-14 rounded-3xl bg-gradient-to-r from-blue-600 to-pink-500 border-0 font-bold text-white shadow-xl hover:opacity-90 transition-opacity"
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Login to Venue"}
          </Button>
        </form>

        <p className="text-center text-[10px] font-black tracking-widest text-zinc-600 uppercase">
          Protected by Relxena Security
        </p>
      </div>
    </div>
  );
}
