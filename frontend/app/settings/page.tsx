"use client";

import { useAuthStore } from "@/stores/authStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Bell, 
  Shield, 
  Moon, 
  Smartphone,
  Globe,
  CircleHelp
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-4xl font-black text-white tracking-tighter">Settings</h1>
        <p className="text-muted-foreground text-sm font-medium mt-1">Manage your account preferences and venue experience</p>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <section className="space-y-4">
          <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] px-2">Account Profile</h3>
          <Card className="bg-surface border-border overflow-hidden">
            <CardContent className="p-0">
              <div className="p-8 flex items-center gap-6 border-b border-border bg-black/20">
                <div className="w-20 h-20 rounded-3xl bg-primary/20 border border-primary/30 flex items-center justify-center font-black text-2xl text-primary">
                  {user?.full_name?.[0] || 'A'}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">{user?.full_name || 'Agniv Dutta'}</h4>
                  <p className="text-sm text-muted-foreground">{user?.email || 'agniv.dutta@example.com'}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-border text-[10px] font-black text-primary uppercase tracking-widest">
                      {user?.role || 'Spectator'}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-bold">Verified Member</span>
                  </div>
                </div>
                <Button className="ml-auto rounded-xl bg-white text-black hover:bg-white/90 font-bold text-xs">
                  Edit Profile
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
                  <Switch />
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

        {/* Notifications Section */}
        <section className="space-y-4">
          <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] px-2">Venue Notifications</h3>
          <Card className="bg-surface border-border overflow-hidden">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold text-white">Queue Status Alerts</Label>
                  <p className="text-xs text-muted-foreground">Get notified when your turn is approaching</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold text-white">Safety & Security Alerts</Label>
                  <p className="text-xs text-muted-foreground">Real-time alerts about venue conditions</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold text-white">Match Highlights</Label>
                  <p className="text-xs text-muted-foreground">Instant updates for goals and key plays</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Preferences Section */}
        <section className="space-y-4">
          <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] px-2">App Preferences</h3>
          <Card className="bg-surface border-border">
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-sm font-bold text-white">
                  <Moon className="w-4 h-4 text-secondary" /> Appearance
                </Label>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 rounded-xl border-primary bg-primary/10 text-primary font-bold text-xs">Dark</Button>
                  <Button variant="outline" className="flex-1 rounded-xl border-border bg-transparent text-muted-foreground font-bold text-xs">Light</Button>
                  <Button variant="outline" className="flex-1 rounded-xl border-border bg-transparent text-muted-foreground font-bold text-xs">System</Button>
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
            <span className="text-xs font-medium">ArenaFlow App v2.4.0 (Build 982)</span>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Button variant="ghost" className="flex-1 sm:flex-none rounded-xl text-muted-foreground hover:text-white font-bold text-xs">Privacy Policy</Button>
            <Button className="flex-1 sm:flex-none rounded-xl bg-danger hover:bg-danger/90 text-white font-bold text-xs">Delete Account</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Separator } from "@/components/ui/separator";
import { ChevronRight } from "lucide-react";
