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
  IconPlus,
  IconLoader2,
  IconRefresh,
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react";
import { AdminsDataTable } from "@/components/admins-data-table";

export default function AdminsPage() {
  const {
    admins,
    isLoading,
    stats,
    listAdmins,
    createAdmin,
    getAdminById,
    updateAdmin,
    deactivateAdmin,
    activateAdmin,
    resetAdminPassword,
    getAdminStats,
  } = useAdminStore();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
  });
  const [editFormData, setEditFormData] = useState({
    email: "",
    name: "",
    phone: "",
  });
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<
    "deactivate" | "activate" | "reset" | null
  >(null);
  const [resetToken, setResetToken] = useState<string | null>(null);

  useEffect(() => {
    listAdmins();
    getAdminStats();
  }, []);

  const handleCreateAdmin = async () => {
    const success = await createAdmin(createFormData);
    if (success) {
      setIsCreateDialogOpen(false);
      setCreateFormData({ email: "", password: "", name: "", phone: "" });
      listAdmins();
      getAdminStats();
    }
  };

  const handleDeactivate = async () => {
    if (!selectedAdminId) return;
    const success = await deactivateAdmin(selectedAdminId);
    if (success) {
      setActionType(null);
      setSelectedAdminId(null);
      listAdmins();
      getAdminStats();
    }
  };

  const handleActivate = async () => {
    if (!selectedAdminId) return;
    const success = await activateAdmin(selectedAdminId);
    if (success) {
      setActionType(null);
      setSelectedAdminId(null);
      listAdmins();
      getAdminStats();
    }
  };

  const handleResetPassword = async (adminId: string) => {
    const token = await resetAdminPassword(adminId);
    if (token) {
      setResetToken(token);
      setActionType("reset");
    }
  };

  const handleEditAdmin = async (adminId: string) => {
    setSelectedAdminId(adminId);
    const success = await getAdminById(adminId);
    if (success) {
      const admin = admins.find((a) => a._id === adminId);
      if (admin) {
        setEditFormData({
          email: admin.email,
          name: admin.name,
          phone: admin.phone || "",
        });
        setIsEditDialogOpen(true);
      }
    }
  };

  const handleUpdateAdmin = async () => {
    if (!selectedAdminId) return;
    const success = await updateAdmin(selectedAdminId, editFormData);
    if (success) {
      setIsEditDialogOpen(false);
      setSelectedAdminId(null);
      setEditFormData({ email: "", name: "", phone: "" });
      listAdmins();
      getAdminStats();
    }
  };

  const closeResetDialog = () => {
    setActionType(null);
    setSelectedAdminId(null);
    setResetToken(null);
  };

  return (
    <div className="space-y-6 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Admin Management
          </h1>
          <p className="text-muted-foreground">
            Manage admin users and their permissions
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <IconPlus className="mr-2 h-4 w-4" />
              Create Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Admin</DialogTitle>
              <DialogDescription>
                Add a new administrator to the system
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
                  placeholder="admin@gluvia.com"
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
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateAdmin} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Admin"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Admins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.active}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Deactivated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.deactivated}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Admins Data Table */}
      <AdminsDataTable
        data={admins}
        isLoading={isLoading}
        onEdit={handleEditAdmin}
        onDeactivate={(id) => {
          setSelectedAdminId(id);
          setActionType("deactivate");
        }}
        onActivate={(id) => {
          setSelectedAdminId(id);
          setActionType("activate");
        }}
        onResetPassword={async (id) => {
          setSelectedAdminId(id);
          await handleResetPassword(id);
        }}
      />

      {/* Edit Admin Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Admin</DialogTitle>
            <DialogDescription>
              Update administrator information
            </DialogDescription>
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
                placeholder="admin@gluvia.com"
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
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setSelectedAdminId(null);
                setEditFormData({ email: "", name: "", phone: "" });
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateAdmin} disabled={isLoading}>
              {isLoading ? (
                <>
                  <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Admin"
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
            setSelectedAdminId(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate Admin?</AlertDialogTitle>
            <AlertDialogDescription>
              This will deactivate the admin user. They will no longer be able
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
            setSelectedAdminId(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reactivate Admin?</AlertDialogTitle>
            <AlertDialogDescription>
              This will restore the admin user's access to the system.
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
              Provide this token to the admin to reset their password
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
              💡 The admin can use this link to reset their password. The token
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
