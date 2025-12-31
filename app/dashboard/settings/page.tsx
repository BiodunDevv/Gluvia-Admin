"use client";

import { useState, useEffect } from "react";
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
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  IconDatabase,
  IconUserX,
  IconLoader2,
  IconUser,
  IconMail,
  IconLogout,
  IconEdit,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const { isLoading, runInitialSeed, revokeUserTokens } = useAdminStore();
  const { user, logout, updateMe, isLoading: authLoading } = useAuthStore();
  const [revokeUserId, setRevokeUserId] = useState("");
  const [revokeReason, setRevokeReason] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        password: "",
      });
    }
  }, [user]);

  const handleSeedDatabase = async () => {
    await runInitialSeed();
  };

  const handleRevokeTokens = async () => {
    if (!revokeUserId) return;
    const success = await revokeUserTokens(revokeUserId, revokeReason);
    if (success) {
      setRevokeUserId("");
      setRevokeReason("");
    }
  };

  const handleUpdateProfile = async () => {
    const updateData: any = {
      name: profileData.name,
      email: profileData.email,
    };

    if (profileData.phone) {
      updateData.phone = profileData.phone;
    }

    if (profileData.password) {
      updateData.password = profileData.password;
    }

    const success = await updateMe(updateData);
    if (success) {
      setIsEditingProfile(false);
      setProfileData({ ...profileData, password: "" });
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        password: "",
      });
    }
    setIsEditingProfile(false);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  return (
    <div className="space-y-6 px-4 lg:px-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage system settings and administrative operations
        </p>
      </div>

      <div className="grid gap-6">
        {/* Admin Profile */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Admin Profile</CardTitle>
                <CardDescription>Your account information</CardDescription>
              </div>
              {!isEditingProfile && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingProfile(true)}
                >
                  <IconEdit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isEditingProfile ? (
              <>
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <IconUser className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-semibold">{user?.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <IconMail className="h-4 w-4" />
                      {user?.email}
                    </div>
                    {user?.phone && (
                      <p className="text-sm text-muted-foreground">
                        Phone: {user.phone}
                      </p>
                    )}
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Role</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {user?.role}
                    </p>
                  </div>
                  <Button variant="outline" onClick={handleLogout}>
                    <IconLogout className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      disabled={authLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        })
                      }
                      disabled={authLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          phone: e.target.value,
                        })
                      }
                      disabled={authLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">
                      New Password (Leave blank to keep current)
                    </Label>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={profileData.password}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          password: e.target.value,
                        })
                      }
                      disabled={authLoading}
                      placeholder="Enter new password"
                    />
                    <div className="flex items-center space-x-2 mt-2">
                      <Checkbox
                        id="show-password"
                        checked={showPassword}
                        onCheckedChange={(checked) =>
                          setShowPassword(checked as boolean)
                        }
                      />
                      <label
                        htmlFor="show-password"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        Show password
                      </label>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="flex gap-2">
                  <Button onClick={handleUpdateProfile} disabled={authLoading}>
                    {authLoading ? (
                      <>
                        <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <IconCheck className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancelEdit}
                    disabled={authLoading}
                  >
                    <IconX className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Database Operations */}
        <Card>
          <CardHeader>
            <CardTitle>Database Operations</CardTitle>
            <CardDescription>
              Manage database seeding and initialization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950">
              <div className="flex items-start gap-3">
                <IconDatabase className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">
                    Database Seeding
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    This will populate the database with initial data including
                    sample foods and rule templates. This operation is safe to
                    run multiple times.
                  </p>
                </div>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <IconDatabase className="mr-2 h-4 w-4" />
                      Run Database Seed
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Run Database Seed?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will populate your database with initial data. Existing
                    data will not be affected. Are you sure you want to
                    continue?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSeedDatabase}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>

        {/* User Token Management */}
        <Card>
          <CardHeader>
            <CardTitle>User Token Management</CardTitle>
            <CardDescription>Revoke user authentication tokens</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
              <div className="flex items-start gap-3">
                <IconUserX className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                <div>
                  <p className="font-medium text-red-800 dark:text-red-200">
                    Revoke User Tokens
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    This will immediately log out the user from all devices and
                    invalidate all their active tokens. Use this for security
                    purposes.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userId">User ID</Label>
                <Input
                  id="userId"
                  placeholder="Enter user ID"
                  value={revokeUserId}
                  onChange={(e) => setRevokeUserId(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason (optional)</Label>
                <Textarea
                  id="reason"
                  placeholder="Security concern, account compromised, etc."
                  value={revokeReason}
                  onChange={(e) => setRevokeReason(e.target.value)}
                  rows={3}
                />
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    disabled={!revokeUserId || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                        Revoking...
                      </>
                    ) : (
                      <>
                        <IconUserX className="mr-2 h-4 w-4" />
                        Revoke User Tokens
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Revoke User Tokens?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will immediately log out the user from all devices.
                      This action cannot be undone. Are you sure you want to
                      continue?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleRevokeTokens}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Revoke Tokens
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>API and environment details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between py-2">
              <span className="text-sm font-medium">API URL</span>
              <span className="text-sm text-muted-foreground font-mono">
                {process.env.NEXT_PUBLIC_API_URL || "Not configured"}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between py-2">
              <span className="text-sm font-medium">Environment</span>
              <span className="text-sm text-muted-foreground">
                {process.env.NODE_ENV}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between py-2">
              <span className="text-sm font-medium">App Version</span>
              <span className="text-sm text-muted-foreground">1.0.0</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
