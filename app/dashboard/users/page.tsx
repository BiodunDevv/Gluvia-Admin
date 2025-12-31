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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { IconPlus, IconLoader2, IconRefresh } from "@tabler/icons-react";
import { UsersDataTable } from "@/components/AllTables/users-data-table";
import { CreateUserModal } from "@/components/Modals/CreateUserModal";
import { EditUserModal } from "@/components/Modals/EditUserModal";
import { ResetPasswordModal } from "@/components/Modals/ResetPasswordModal";

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            User Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage regular users and health workers
          </p>
        </div>
        <Button
          className="w-full sm:w-auto"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <IconPlus className="mr-2 h-4 w-4" />
          Create User
        </Button>
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

      <CreateUserModal
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        formData={createFormData}
        setFormData={setCreateFormData}
        onSubmit={handleCreateUser}
        isLoading={isLoading}
      />

      <EditUserModal
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        formData={editFormData}
        setFormData={setEditFormData}
        onSubmit={handleUpdateUser}
        onCancel={() => {
          setIsEditDialogOpen(false);
          setSelectedUserId(null);
          setEditFormData({
            email: "",
            name: "",
            phone: "",
            role: "user",
          });
        }}
        isLoading={isLoading}
      />

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

      {/* Reset Password Token Modal */}
      <ResetPasswordModal
        open={actionType === "reset" && !!resetToken}
        onOpenChange={(open) => {
          if (!open) closeResetDialog();
        }}
        resetToken={resetToken}
        userType="user"
        onCopyToken={() => {
          if (resetToken) {
            navigator.clipboard.writeText(resetToken);
            toast.success("Token copied to clipboard!");
          }
        }}
        onCopyFullUrl={() => {
          if (resetToken && typeof window !== "undefined") {
            const fullUrl = `${window.location.origin}/auth/reset-password?token=${resetToken}`;
            navigator.clipboard.writeText(fullUrl);
            toast.success("Full URL copied to clipboard!");
          }
        }}
      />
    </div>
  );
}
