"use client";

import { useState, useEffect } from "react";
import { useAdminStore } from "@/stores/useAdminStore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconPlus,
  IconLoader2,
  IconRefresh,
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react";
import { UsersDataTable } from "@/components/users-data-table";

export default function UsersPage() {
  const {
    users,
    isLoading,
    userStats,
    listUsers,
    createUser,
    getUserById,
    updateUser,
    deactivateUser,
    activateUser,
    resetUserPassword,
    getUserStats,
  } = useAdminStore();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    role: "user" as "user" | "health_worker",
  });
  const [editFormData, setEditFormData] = useState({
    email: "",
    name: "",
    phone: "",
    role: "user" as "user" | "health_worker",
  });
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<
    "deactivate" | "activate" | "reset" | null
  >(null);
  const [resetToken, setResetToken] = useState<string | null>(null);

  useEffect(() => {
    listUsers();
    getUserStats();
  }, []);

  const handleCreateUser = async () => {
    const success = await createUser(createFormData);
    if (success) {
      setIsCreateDialogOpen(false);
      setCreateFormData({
        email: "",
        password: "",
        name: "",
        phone: "",
        role: "user",
      });
      listUsers();
      getUserStats();
    }
  };

  const handleDeactivate = async () => {
    if (!selectedUserId) return;
    const success = await deactivateUser(selectedUserId);
    if (success) {
      setActionType(null);
      setSelectedUserId(null);
      listUsers();
      getUserStats();
    }
  };

  const handleActivate = async () => {
    if (!selectedUserId) return;
    const success = await activateUser(selectedUserId);
    if (success) {
      setActionType(null);
      setSelectedUserId(null);
      listUsers();
      getUserStats();
    }
  };

  const handleResetPassword = async (userId: string) => {
    const token = await resetUserPassword(userId);
    if (token) {
      setResetToken(token);
      setActionType("reset");
    }
  };

  const handleEditUser = async (userId: string) => {
    setSelectedUserId(userId);
    const success = await getUserById(userId);
    if (success) {
      const user = users.find((u) => u._id === userId);
      if (user) {
        setEditFormData({
          email: user.email,
          name: user.name,
          phone: user.phone || "",
          role: user.role,
        });
        setIsEditDialogOpen(true);
      }
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUserId) return;
    const success = await updateUser(selectedUserId, editFormData);
    if (success) {
      setIsEditDialogOpen(false);
      setSelectedUserId(null);
      setEditFormData({ email: "", name: "", phone: "", role: "user" });
      listUsers();
      getUserStats();
    }
  };

  const closeResetDialog = () => {
    setActionType(null);
    setSelectedUserId(null);
    setResetToken(null);
  };

  return (
    <div className="space-y-6 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage regular users and health workers
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <IconPlus className="mr-2 h-4 w-4" />
              Create User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Add a new user to the system
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={createFormData.name}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      name: e.target.value,
                    })
                  }
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={createFormData.email}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      email: e.target.value,
                    })
                  }
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="SecurePass123!"
                    value={createFormData.password}
                    onChange={(e) =>
                      setCreateFormData({
                        ...createFormData,
                        password: e.target.value,
                      })
                    }
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <IconEye className="h-4 w-4" />
                    ) : (
                      <IconEyeOff className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  placeholder="+1234567890"
                  value={createFormData.phone}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      phone: e.target.value,
                    })
                  }
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={createFormData.role}
                  onValueChange={(value: "user" | "health_worker") =>
                    setCreateFormData({ ...createFormData, role: value })
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="health_worker">Health Worker</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateUser} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create User"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      {userStats && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {userStats.active}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Deactivated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {userStats.deactivated}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Users Data Table */}
      <UsersDataTable
        data={users}
        isLoading={isLoading}
        onEdit={handleEditUser}
        onDeactivate={(id) => {
          setSelectedUserId(id);
          setActionType("deactivate");
        }}
        onActivate={(id) => {
          setSelectedUserId(id);
          setActionType("activate");
        }}
        onResetPassword={async (id) => {
          setSelectedUserId(id);
          await handleResetPassword(id);
        }}
      />

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                placeholder="John Doe"
                value={editFormData.name}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    name: e.target.value,
                  })
                }
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="user@example.com"
                value={editFormData.email}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    email: e.target.value,
                  })
                }
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone (Optional)</Label>
              <Input
                id="edit-phone"
                placeholder="+1234567890"
                value={editFormData.phone}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    phone: e.target.value,
                  })
                }
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select
                value={editFormData.role}
                onValueChange={(value: "user" | "health_worker") =>
                  setEditFormData({ ...editFormData, role: value })
                }
                disabled={isLoading}
              >
                <SelectTrigger id="edit-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="health_worker">Health Worker</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setSelectedUserId(null);
                setEditFormData({
                  email: "",
                  name: "",
                  phone: "",
                  role: "user",
                });
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateUser} disabled={isLoading}>
              {isLoading ? (
                <>
                  <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update User"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deactivate Confirmation Dialog */}
      <AlertDialog
        open={actionType === "deactivate"}
        onOpenChange={(open) => {
          if (!open) {
            setActionType(null);
            setSelectedUserId(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate User?</AlertDialogTitle>
            <AlertDialogDescription>
              This will deactivate the user account. They will no longer be able
              to access the system. This action can be reversed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeactivate}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Activate Confirmation Dialog */}
      <AlertDialog
        open={actionType === "activate"}
        onOpenChange={(open) => {
          if (!open) {
            setActionType(null);
            setSelectedUserId(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reactivate User?</AlertDialogTitle>
            <AlertDialogDescription>
              This will restore the user's access to the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleActivate}>
              Reactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Password Token Dialog */}
      <Dialog
        open={actionType === "reset" && !!resetToken}
        onOpenChange={(open) => {
          if (!open) closeResetDialog();
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Password Reset Token Generated</DialogTitle>
            <DialogDescription>
              Provide this token to the user to reset their password
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Reset Token
              </Label>
              <div className="rounded-lg border bg-muted p-4">
                <p className="font-mono text-sm break-all select-all">
                  {resetToken}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Full Reset URL
              </Label>
              <div className="rounded-lg border bg-muted p-4">
                <p className="font-mono text-xs break-all select-all">
                  {typeof window !== "undefined" &&
                    `${window.location.origin}/auth/reset-password?token=${resetToken}`}
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              💡 The user can use this link to reset their password. The token
              will be automatically filled from the URL.
            </p>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                if (resetToken) {
                  navigator.clipboard.writeText(resetToken);
                  toast.success("Token copied to clipboard!");
                }
              }}
            >
              Copy Token
            </Button>
            <Button
              onClick={() => {
                if (resetToken && typeof window !== "undefined") {
                  const fullUrl = `${window.location.origin}/auth/reset-password?token=${resetToken}`;
                  navigator.clipboard.writeText(fullUrl);
                  toast.success("Full URL copied to clipboard!");
                }
              }}
            >
              Copy Full URL
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
