"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  IconBellRinging,
  IconDatabase,
  IconDeviceMobile,
  IconLoader2,
  IconLogout,
  IconSearch,
  IconSettings,
  IconShieldLock,
  IconUser,
  IconUserX,
  IconX,
} from "@tabler/icons-react";

import { useAdminStore } from "@/stores/useAdminStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

type ActionKey =
  | "profile"
  | "maintenance"
  | "broadcast"
  | "app-settings"
  | "revoke"
  | "seed"
  | "logout";

const SEED_OPTIONS = [
  { id: "foods", label: "Foods" },
  { id: "rules", label: "Rules" },
  { id: "config", label: "Config defaults" },
  { id: "users", label: "Demo users" },
] as const;

export default function SettingsPage() {
  const router = useRouter();
  const {
    maintenance,
    appSettings,
    userSearchResults,
    isSearchingUsers,
    lastSeedResult,
    seedPreview,
    getMaintenanceMode,
    setMaintenanceMode,
    getAppSettings,
    getSeedPreview,
    setAppSettings,
    broadcastNotification,
    revokeUserTokens,
    searchUsers,
    runSeed,
  } = useAdminStore();
  const { user, logout, updateMe } = useAuthStore();

  const [activeAction, setActiveAction] = useState<ActionKey | null>(null);
  const [maintenanceEnabled, setMaintenanceEnabled] = useState(false);
  const [maintenanceText, setMaintenanceText] = useState(
    "Gluvia AI is temporarily unavailable for maintenance. Please try again later."
  );
  const [supportPhone, setSupportPhone] = useState("");
  const [googleFormLink, setGoogleFormLink] = useState("");
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationBody, setNotificationBody] = useState("");
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUserLabel, setSelectedUserLabel] = useState("");
  const [revokeReason, setRevokeReason] = useState("Security action");
  const [seedTargets, setSeedTargets] = useState<Array<(typeof SEED_OPTIONS)[number]["id"]>>([
    "foods",
    "rules",
    "config",
  ]);
  const [destructiveSeed, setDestructiveSeed] = useState(false);
  const [includeFoodImages, setIncludeFoodImages] = useState(false);

  useEffect(() => {
    getMaintenanceMode();
    getAppSettings();
    getSeedPreview();
  }, [getAppSettings, getMaintenanceMode, getSeedPreview]);

  useEffect(() => {
    if (!user) {
      return;
    }

    setProfileData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      password: "",
    });
  }, [user]);

  useEffect(() => {
    if (!maintenance) {
      return;
    }

    setMaintenanceEnabled(maintenance.enabled);
    setMaintenanceText(
      maintenance.message ||
        "Gluvia AI is temporarily unavailable for maintenance. Please try again later."
    );
  }, [maintenance]);

  useEffect(() => {
    if (!appSettings) {
      return;
    }

    setSupportPhone(appSettings.supportPhone || "");
    setGoogleFormLink(appSettings.googleFormLink || "");
  }, [appSettings]);

  useEffect(() => {
    if (!userSearchQuery.trim()) {
      return;
    }

    const timer = window.setTimeout(() => {
      searchUsers(userSearchQuery);
    }, 250);

    return () => window.clearTimeout(timer);
  }, [searchUsers, userSearchQuery]);

  const selectedUser = useMemo(() => {
    if (!selectedUserId) {
      return null;
    }

    return (
      userSearchResults.find((candidate) => candidate._id === selectedUserId) || {
        _id: selectedUserId,
        email: selectedUserLabel.split("(")[1]?.replace(")", "") || "",
        name: selectedUserLabel.split(" (")[0] || "Selected User",
        role: "user" as const,
        phone: "",
        deleted: false,
        createdAt: "",
        updatedAt: "",
      }
    );
  }, [selectedUserId, selectedUserLabel, userSearchResults]);

  const runAction = async (action: ActionKey, callback: () => Promise<void>) => {
    setActiveAction(action);
    try {
      await callback();
    } finally {
      setActiveAction(null);
    }
  };

  const handleProfileSave = () =>
    runAction("profile", async () => {
      const payload: Record<string, string | undefined> = {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone || undefined,
      };

      if (profileData.password) {
        payload.password = profileData.password;
      }

      const success = await updateMe(payload as never);

      if (success) {
        setProfileData((current) => ({ ...current, password: "" }));
      }
    });

  const handleLogout = () =>
    runAction("logout", async () => {
      await logout();
      router.push("/auth/login");
    });

  const handleSaveMaintenance = () =>
    runAction("maintenance", async () => {
      await setMaintenanceMode(maintenanceEnabled, maintenanceText);
    });

  const handleSaveAppSettings = () =>
    runAction("app-settings", async () => {
      await setAppSettings(supportPhone, googleFormLink);
    });

  const handleBroadcast = () =>
    runAction("broadcast", async () => {
      if (!notificationTitle.trim() || !notificationBody.trim()) {
        return;
      }

      const success = await broadcastNotification(
        notificationTitle.trim(),
        notificationBody.trim()
      );

      if (success) {
        setNotificationTitle("");
        setNotificationBody("");
      }
    });

  const handleRevoke = () =>
    runAction("revoke", async () => {
      if (!selectedUserId) {
        return;
      }

      const success = await revokeUserTokens(
        selectedUserId,
        revokeReason || "Security action"
      );

      if (success) {
        setSelectedUserId("");
        setSelectedUserLabel("");
        setUserSearchQuery("");
        setRevokeReason("Security action");
      }
    });

  const handleSeed = () =>
    runAction("seed", async () => {
      await runSeed({
        targets: seedTargets,
        destructive: destructiveSeed,
        includeImages: includeFoodImages,
      });
    });

  const resetSelectedUser = () => {
    setSelectedUserId("");
    setSelectedUserLabel("");
    setUserSearchQuery("");
  };

  const toggleSeedTarget = (target: (typeof SEED_OPTIONS)[number]["id"]) => {
    setSeedTargets((current) =>
      current.includes(target)
        ? current.filter((item) => item !== target)
        : [...current, target]
    );
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-3 sm:px-4 lg:px-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Settings</h1>
        <p className="text-muted-foreground">
          Configure admin operations, mobile app behavior, broadcasts, and guarded seed jobs.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <div className="-mx-3 overflow-x-auto px-3 pb-1 sm:mx-0 sm:px-0">
          <TabsList className="inline-flex h-auto min-w-max gap-2 rounded-xl bg-transparent p-0 sm:flex sm:w-full sm:min-w-0 sm:flex-wrap">
            <TabsTrigger value="profile" className="h-10 min-w-[136px] px-4 text-sm sm:min-w-0">
              Profile
            </TabsTrigger>
            <TabsTrigger value="mobile-app" className="h-10 min-w-[136px] px-4 text-sm sm:min-w-0">
              Mobile App
            </TabsTrigger>
            <TabsTrigger value="notifications" className="h-10 min-w-[136px] px-4 text-sm sm:min-w-0">
              Notifications
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="h-10 min-w-[136px] px-4 text-sm sm:min-w-0">
              Maintenance
            </TabsTrigger>
            <TabsTrigger value="database-seed" className="h-10 min-w-[156px] px-4 text-sm sm:min-w-0">
              Database Seed
            </TabsTrigger>
            <TabsTrigger value="security" className="h-10 min-w-[136px] px-4 text-sm sm:min-w-0">
              Security
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Admin Profile</CardTitle>
              <CardDescription>
                Update your identity details without affecting other controls on this page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(event) =>
                      setProfileData((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(event) =>
                      setProfileData((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(event) =>
                      setProfileData((current) => ({
                        ...current,
                        phone: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Leave blank to keep current password"
                    value={profileData.password}
                    onChange={(event) =>
                      setProfileData((current) => ({
                        ...current,
                        password: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="rounded-lg border bg-muted/30 px-4 py-3">
                  <p className="text-sm font-medium">{user?.name || "Admin User"}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    loading={activeAction === "logout"}
                    className="w-full sm:w-auto"
                  >
                    <IconLogout className="mr-2 size-4" />
                    Logout
                  </Button>
                  <Button
                    onClick={handleProfileSave}
                    loading={activeAction === "profile"}
                    className="w-full sm:w-auto"
                  >
                    <IconUser className="mr-2 size-4" />
                    Save Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mobile-app">
          <Card>
            <CardHeader>
              <CardTitle>Mobile App Settings</CardTitle>
              <CardDescription>
                Manage review links and support details shown inside the mobile settings experience.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="supportPhone">Support Phone</Label>
                <Input
                  id="supportPhone"
                  placeholder="+2348000000000"
                  value={supportPhone}
                  onChange={(event) => setSupportPhone(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="googleFormLink">Review / Suggestion Form Link</Label>
                <Input
                  id="googleFormLink"
                  placeholder="https://forms.gle/..."
                  value={googleFormLink}
                  onChange={(event) => setGoogleFormLink(event.target.value)}
                />
              </div>

              <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
                This link opens inside the mobile app so users can submit reviews or suggestions without leaving the experience completely.
              </div>

              <Button
                onClick={handleSaveAppSettings}
                loading={activeAction === "app-settings"}
                className="w-full sm:w-auto"
              >
                <IconDeviceMobile className="mr-2 size-4" />
                Save Mobile App Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Admin Broadcast</CardTitle>
              <CardDescription>
                Send one clean announcement to users without triggering duplicate deliveries.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="notificationTitle">Announcement Title</Label>
                <Input
                  id="notificationTitle"
                  value={notificationTitle}
                  onChange={(event) => setNotificationTitle(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notificationBody">Message</Label>
                <Textarea
                  id="notificationBody"
                  className="min-h-28"
                  value={notificationBody}
                  onChange={(event) => setNotificationBody(event.target.value)}
                />
              </div>
              <Button
                onClick={handleBroadcast}
                loading={activeAction === "broadcast"}
                className="w-full sm:w-auto"
              >
                <IconBellRinging className="mr-2 size-4" />
                Send Announcement
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Mode</CardTitle>
              <CardDescription>
                Keep admin access active while user features stay blocked after login.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-start gap-3 rounded-lg border p-4">
                <Checkbox
                  id="maintenanceEnabled"
                  checked={maintenanceEnabled}
                  onCheckedChange={(checked) =>
                    setMaintenanceEnabled(Boolean(checked))
                  }
                />
                <div>
                  <Label htmlFor="maintenanceEnabled" className="font-medium">
                    Enable maintenance mode
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Users can still access auth screens, but authenticated app features are blocked.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
                <Textarea
                  id="maintenanceMessage"
                  className="min-h-24"
                  value={maintenanceText}
                  onChange={(event) => setMaintenanceText(event.target.value)}
                />
              </div>

              <Button
                onClick={handleSaveMaintenance}
                loading={activeAction === "maintenance"}
                className="w-full sm:w-auto"
              >
                <IconSettings className="mr-2 size-4" />
                Save Maintenance Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database-seed">
          <Card>
            <CardHeader>
              <CardTitle>Selective Seed Jobs</CardTitle>
              <CardDescription>
                Choose exactly what to seed. Additive mode is the default and destructive reseeding is explicit.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-3 md:grid-cols-2">
                {SEED_OPTIONS.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-start gap-3 rounded-lg border p-4"
                  >
                    <Checkbox
                      checked={seedTargets.includes(option.id)}
                      onCheckedChange={() => toggleSeedTarget(option.id)}
                    />
                    <div>
                      <p className="font-medium">{option.label}</p>
                      <p className="text-sm text-muted-foreground">
                        Include {option.label.toLowerCase()} in this seed run.
                      </p>
                    </div>
                  </label>
                ))}
              </div>

              {seedPreview ? (
                <div className="rounded-xl border bg-muted/20 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium">Seed preview</p>
                      <p className="text-sm text-muted-foreground">
                        Foods use `seedFoods.json`, `seedFoodsTwo.json`, and `seedFoodsThree.json`. Rules use `seedRules.json` and `seedRulesTwo.json`.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {seedPreview.availableTargets.map((target) => (
                      <div key={target.id} className="rounded-lg border bg-background p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-medium">{target.label}</p>
                          <span className="text-xs text-muted-foreground">
                            {target.currentItems} current
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {target.description}
                        </p>
                        <p className="mt-3 text-sm">
                          Planned items: <span className="font-medium">{target.plannedItems}</span>
                        </p>
                        {target.files.length > 0 ? (
                          <div className="mt-3 space-y-2 text-xs text-muted-foreground">
                            {target.files.map((file) => (
                              <div
                                key={file.key}
                                className="flex flex-col gap-1 rounded-md bg-muted/40 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
                              >
                                <span>{file.label}</span>
                                <span>{file.items} items</span>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <label className="flex items-start gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4">
                <Checkbox
                  checked={destructiveSeed}
                  onCheckedChange={(checked) => setDestructiveSeed(Boolean(checked))}
                />
                <div>
                  <p className="font-medium text-orange-900">Destructive reseed</p>
                  <p className="text-sm text-orange-700">
                    This clears existing reference data for selected targets before reseeding.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 rounded-lg border p-4">
                <Checkbox
                  checked={includeFoodImages}
                  onCheckedChange={(checked) => setIncludeFoodImages(Boolean(checked))}
                />
                <div>
                  <p className="font-medium">Fetch food images during food seed</p>
                  <p className="text-sm text-muted-foreground">
                    Uses the existing Google image search flow for foods that do not already have an image URL.
                  </p>
                </div>
              </label>

              <Button
                onClick={handleSeed}
                loading={activeAction === "seed"}
                disabled={seedTargets.length === 0}
                className="w-full sm:w-auto"
              >
                <IconDatabase className="mr-2 size-4" />
                Run Seed Job
              </Button>

              {lastSeedResult && (
                <div className="rounded-xl border p-4">
                  <p className="font-medium">
                    Last seed run: {lastSeedResult.mode}
                  </p>
                  <div className="mt-3 space-y-2 text-sm">
                    {lastSeedResult.results.map((result) => (
                      <div
                        key={result.target}
                        className="flex flex-col gap-2 rounded-lg bg-muted/30 px-3 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3"
                      >
                        <span className="font-medium capitalize">{result.target}</span>
                        <span>Processed: {result.processed}</span>
                        <span>Created: {result.created}</span>
                        <span>Updated: {result.updated}</span>
                        <span>Skipped: {result.skipped}</span>
                        {result.imageSearch?.enabled ? (
                          <span>
                            Images: {result.imageSearch.updated} updated / {result.imageSearch.errors} errors
                          </span>
                        ) : null}
                      </div>
                    ))}
                    {lastSeedResult.errors.length > 0 && (
                      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-destructive">
                        {lastSeedResult.errors.map((error) => (
                          <p key={`${error.target}-${error.message}`}>
                            {error.target}: {error.message}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Force Logout User</CardTitle>
              <CardDescription>
                Search for a user, select them from the dropdown, and revoke every active session professionally.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="userSearch">Search user</Label>
                <div className="rounded-xl border bg-background">
                  <div className="relative border-b">
                    <IconSearch className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="userSearch"
                      className="border-0 bg-transparent pl-9 pr-10 shadow-none focus-visible:ring-0"
                      placeholder="Search by name, email, or phone"
                      value={selectedUserLabel || userSearchQuery}
                      onChange={(event) => {
                        setSelectedUserId("");
                        setSelectedUserLabel("");
                        setUserSearchQuery(event.target.value);
                      }}
                    />
                    {isSearchingUsers ? (
                      <IconLoader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                    ) : (selectedUserId || userSearchQuery) ? (
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted"
                        onClick={resetSelectedUser}
                      >
                        <IconX className="size-4" />
                      </button>
                    ) : null}
                  </div>

                  {!selectedUserId && userSearchQuery.trim() ? (
                    <div className="max-h-72 overflow-y-auto p-2">
                      {userSearchResults.length === 0 && !isSearchingUsers ? (
                        <p className="rounded-lg px-3 py-3 text-sm text-muted-foreground">
                          No users found for this search yet.
                        </p>
                      ) : (
                        userSearchResults.map((candidate) => (
                          <button
                            key={candidate._id}
                            type="button"
                            className="flex w-full flex-col gap-3 rounded-lg px-3 py-3 text-left hover:bg-muted/50 sm:flex-row sm:items-start sm:justify-between"
                            onClick={() => {
                              setSelectedUserId(candidate._id);
                              setSelectedUserLabel(
                                `${candidate.name || "Unnamed User"} (${candidate.email})`
                              );
                              setUserSearchQuery("");
                            }}
                          >
                            <div>
                              <p className="font-medium">
                                {candidate.name || "Unnamed User"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {candidate.email}
                              </p>
                              {candidate.phone ? (
                                <p className="text-xs text-muted-foreground">
                                  {candidate.phone}
                                </p>
                              ) : null}
                            </div>
                            <span className="rounded-full bg-muted px-2 py-1 text-xs capitalize text-muted-foreground">
                              {candidate.role.replace("_", " ")}
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  ) : null}
                </div>
                <p className="text-sm text-muted-foreground">
                  Select the user you want to force out of every active session.
                </p>
              </div>

              {selectedUser && (
                <div className="rounded-xl border bg-muted/30 p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="rounded-xl bg-primary/10 p-2 text-primary">
                        <IconShieldLock className="size-4" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {selectedUser.name || "Unnamed User"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {selectedUser.email}
                        </p>
                        <p className="mt-1 text-xs capitalize text-muted-foreground">
                          {selectedUser.role.replace("_", " ")}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetSelectedUser}
                      className="self-start sm:self-auto"
                    >
                      Clear
                    </Button>
                  </div>
                  {selectedUser.phone && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {selectedUser.phone}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="revokeReason">Reason</Label>
                <Textarea
                  id="revokeReason"
                  className="min-h-20"
                  value={revokeReason}
                  onChange={(event) => setRevokeReason(event.target.value)}
                />
              </div>

              <Button
                variant="destructive"
                onClick={handleRevoke}
                loading={activeAction === "revoke"}
                disabled={!selectedUserId}
                className="w-full sm:w-auto"
              >
                <IconUserX className="mr-2 size-4" />
                Force Logout User
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
