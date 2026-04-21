"use client";

import { useAuthStore } from "@/stores/authStore";
import { useUIStore } from "@/stores/uiStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";
import {
  CircleHelp,
  ChevronRight,
  Globe,
  Moon,
  Shield,
  Smartphone,
  Sparkles,
  User,
} from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { setTheme, theme } = useTheme();
  const {
    reduceMotion,
    compactMode,
    setReduceMotion,
    setCompactMode,
    toggles,
    setToggle,
  } = useUIStore();

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-4xl font-black text-white tracking-tighter">Settings</h1>
        <p className="text-muted-foreground text-sm font-medium mt-1">Manage your account preferences and venue experience</p>
      </div>

      <div className="space-y-6">
        <section className="space-y-4">
          <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] px-2">Account Profile</h3>
          <Card className="bg-surface border-border overflow-hidden">
            <CardContent className="p-0">
              <div className="p-8 flex items-center gap-6 border-b border-border bg-black/20">
                <div className="w-20 h-20 rounded-3xl bg-primary/20 border border-primary/30 flex items-center justify-center font-black text-2xl text-primary">
                  {user?.full_name?.[0] || "R"}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">{user?.full_name || "Relaxena User"}</h4>
                  <p className="text-sm text-muted-foreground">{user?.email || "user@relaxena.app"}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-border text-[10px] font-black text-primary uppercase tracking-widest">
                      {user?.role || "Spectator"}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-bold">Verified Member</span>
                  </div>
                </div>
                <Button className="ml-auto rounded-xl bg-white text-black hover:bg-white/90 font-bold text-xs">
                  <User className="w-4 h-4 mr-2" /> Edit Profile
                </Button>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/50 border border-border">
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-xs font-bold text-white">Two-Factor Authentication</p>
                      <p className="text-[10px] text-muted-foreground">Extra security for your digital pass</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/50 border border-border">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-xs font-bold text-white">Biometric Login</p>
                      <p className="text-[10px] text-muted-foreground">Fast access via FaceID/TouchID</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] px-2">Notifications</h3>
          <Card className="bg-surface border-border">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold text-white">Queue Ready Alerts</Label>
                  <p className="text-xs text-muted-foreground">Get notified when your turn is close</p>
                </div>
                <Switch checked={toggles.queueReady} onCheckedChange={(v) => setToggle("queueReady", v)} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold text-white">Crowd Surge Alerts</Label>
                  <p className="text-xs text-muted-foreground">Receive proactive congestion warnings</p>
                </div>
                <Switch checked={toggles.crowdSurge} onCheckedChange={(v) => setToggle("crowdSurge", v)} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold text-white">Broadcast Notifications</Label>
                  <p className="text-xs text-muted-foreground">Announcements and venue-wide updates</p>
                </div>
                <Switch checked={toggles.broadcasts} onCheckedChange={(v) => setToggle("broadcasts", v)} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold text-white">Rexi Proactive Tips</Label>
                  <p className="text-xs text-muted-foreground">AI nudges every 30 seconds in-session</p>
                </div>
                <Switch checked={toggles.proactiveTips} onCheckedChange={(v) => setToggle("proactiveTips", v)} />
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] px-2">App Preferences</h3>
          <Card className="bg-surface border-border">
            <CardContent className="p-6 space-y-8">
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-sm font-bold text-white">
                  <Moon className="w-4 h-4 text-secondary" /> Appearance
                </Label>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setTheme("dark")} className={`flex-1 rounded-xl font-bold text-xs ${theme === "dark" ? "border-primary bg-primary/10 text-primary" : "border-border bg-transparent text-muted-foreground"}`}>
                    Dark
                  </Button>
                  <Button variant="outline" onClick={() => setTheme("light")} className={`flex-1 rounded-xl font-bold text-xs ${theme === "light" ? "border-primary bg-primary/10 text-primary" : "border-border bg-transparent text-muted-foreground"}`}>
                    Light
                  </Button>
                  <Button variant="outline" onClick={() => setTheme("system")} className={`flex-1 rounded-xl font-bold text-xs ${theme === "system" ? "border-primary bg-primary/10 text-primary" : "border-border bg-transparent text-muted-foreground"}`}>
                    System
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/50 border border-border">
                  <div>
                    <p className="text-xs font-bold text-white">Reduce Motion</p>
                    <p className="text-[10px] text-muted-foreground">Use calmer transitions for comfort</p>
                  </div>
                  <Switch checked={reduceMotion} onCheckedChange={setReduceMotion} />
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/50 border border-border">
                  <div>
                    <p className="text-xs font-bold text-white">Compact Mode</p>
                    <p className="text-[10px] text-muted-foreground">Tighter cards and denser layout</p>
                  </div>
                  <Switch checked={compactMode} onCheckedChange={setCompactMode} />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-sm font-bold text-white">
                  <Globe className="w-4 h-4 text-secondary" /> Language
                </Label>
                <Button variant="outline" className="w-full justify-between rounded-xl border-border bg-zinc-900 text-white font-bold text-xs group">
                  English (International) <ChevronRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CircleHelp className="w-4 h-4" />
            <span className="text-xs font-medium">Relaxena App v2.4.0 (Build 982)</span>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Button variant="ghost" className="flex-1 sm:flex-none rounded-xl text-muted-foreground hover:text-white font-bold text-xs">
              Privacy Policy
            </Button>
            <Button className="flex-1 sm:flex-none rounded-xl bg-danger hover:bg-danger/90 text-white font-bold text-xs">
              <Sparkles className="w-4 h-4 mr-2" /> Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
