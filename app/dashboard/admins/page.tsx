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
import { AdminsDataTable } from "@/components/AllTables/admins-data-table";
import { CreateAdminModal } from "@/components/Modals/CreateAdminModal";
import { EditAdminModal } from "@/components/Modals/EditAdminModal";
import { ResetPasswordModal } from "@/components/Modals/ResetPasswordModal";

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Admin Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage admin users and their permissions
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <IconPlus className="mr-2 h-4 w-4" />
          Create Admin
        </Button>
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

      {/* Create Admin Modal */}
      <CreateAdminModal
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        formData={createFormData}
        setFormData={setCreateFormData}
        onSubmit={handleCreateAdmin}
        isLoading={isLoading}
      />

      {/* Edit Admin Modal */}
      <EditAdminModal
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        formData={editFormData}
        setFormData={setEditFormData}
        onSubmit={handleUpdateAdmin}
        onCancel={() => {
          setIsEditDialogOpen(false);
          setSelectedAdminId(null);
          setEditFormData({ email: "", name: "", phone: "" });
        }}
        isLoading={isLoading}
      />

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

      {/* Reset Password Token Modal */}
      <ResetPasswordModal
        open={actionType === "reset" && !!resetToken}
        onOpenChange={(open) => {
          if (!open) closeResetDialog();
        }}
        resetToken={resetToken}
        userType="admin"
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
