"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Eye, Pencil, Trash2, Copy, X } from "lucide-react";

// Importez vos modals préconfigurées
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import { Button } from "@/components/ui/button";
import { PaginationControls } from "@/components/ui/paginations";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { usersQueryOptions } from "../../api/queries/queries.client";
import { User } from "../../api/types";
import { ApiError } from "@/lib/_/errors/api-error";
import { Result } from "@/lib/_/errors/response.model";
import { deleteUserMutation } from "../../api/mutations";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import UserViewPage from "../user-view-page";

type RoleFilter = "All" | "ADMIN" | "USER";
type StatusFilter = "All" | "Active" | "Inactive";

export function UsersTable() {
  const route = useRouter();
  const { data } = useSuspenseQuery(usersQueryOptions({}));

  const users = data.ok ? data?.data?.data || [] : [];
  const meta = data.ok ? data?.data?.meta : undefined;

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("All");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modals
  const viewModal = useModal();
  const editModal = useModal();
  const createModal = useModal();
  const deleteModal = useModal();

  // Filter users based on search query, role and status
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "All" || user.role === roleFilter;

    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Active" && user.isActive === true) ||
      (statusFilter === "Inactive" && user.isActive === false);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document
      .getElementById("table-top")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleExport = () => {
    console.log("Exporting data...");
    const csvContent = filteredUsers.map((user) => ({
      Name: `${user.firstName} ${user.lastName}`,
      Email: user.email,
      Phone: user.phoneNumber,
      Role: user.role,
      Status: user.isActive ? "Active" : "Inactive",
    }));
    console.log("Export data:", csvContent);
  };

  const handleView = (user: User) => {
    setSelectedUser(user);
    viewModal.openModal();
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    editModal.openModal();
  };

  const handleCreate = () => {
    createModal.openModal();
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    deleteModal.openModal();
  };

  const confirmDelete = () => {
    if (selectedUser) {
      deleteMutation.mutate(selectedUser.id);
    }
    return;
  };

  const deleteMutation = useMutation({
    ...deleteUserMutation,
    onSuccess: (result: Result<{ success: boolean }, ApiError>) => {
      if (!result.ok) {
        toast.error(result.error?.detail || "Failed to delete user");
        return;
      }
      toast.success("User deleted successfully");
      deleteModal.closeModal();
    },
  });

  // Reset to first page when filters change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleRoleFilterChange = (filter: RoleFilter) => {
    setRoleFilter(filter);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (filter: StatusFilter) => {
    setStatusFilter(filter);
    setCurrentPage(1);
  };

  const getRoleBadgeColor = (role: string) => {
    return role === "ADMIN" ? "primary" : "success";
  };

  const getStatusBadgeColor = (isActive: boolean) => {
    return isActive ? "success" : "error";
  };

  const getUserAvatar = (user: User) => {
    return user.avatarUrl || "/images/user/default-avatar.jpg";
  };

  const getFullName = (user: User) => {
    return `${user.firstName} ${user.lastName}`;
  };

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Users List
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your users and their roles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export
          </Button>

          <Button
            onClick={() => handleCreate()}
            className="gap-2 bg-brand-500 hover:bg-brand-600"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add User
          </Button>
        </div>
      </div>
      {/* Search and Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <Input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          {/* Role Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                Role
                {roleFilter !== "All" && (
                  <span className="ml-1 rounded-full bg-brand-500 px-1.5 py-0.5 text-xs text-white">
                    {roleFilter}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => handleRoleFilterChange("All")}>
                <div className="flex items-center gap-2">
                  {roleFilter === "All" && (
                    <svg
                      className="h-4 w-4 text-brand-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                  All
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleRoleFilterChange("ADMIN")}>
                <div className="flex items-center gap-2">
                  {roleFilter === "ADMIN" && (
                    <svg
                      className="h-4 w-4 text-brand-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                  ADMIN
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleRoleFilterChange("USER")}>
                <div className="flex items-center gap-2">
                  {roleFilter === "USER" && (
                    <svg
                      className="h-4 w-4 text-brand-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                  USER
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Status
                {statusFilter !== "All" && (
                  <span className="ml-1 rounded-full bg-brand-500 px-1.5 py-0.5 text-xs text-white">
                    {statusFilter}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => handleStatusFilterChange("All")}>
                <div className="flex items-center gap-2">
                  {statusFilter === "All" && (
                    <svg
                      className="h-4 w-4 text-brand-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                  All
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusFilterChange("Active")}
              >
                <div className="flex items-center gap-2">
                  {statusFilter === "Active" && (
                    <svg
                      className="h-4 w-4 text-brand-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                  Active
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusFilterChange("Inactive")}
              >
                <div className="flex items-center gap-2">
                  {statusFilter === "Inactive" && (
                    <svg
                      className="h-4 w-4 text-brand-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                  Inactive
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* Results count */}
      <div className="text-sm text-gray-500 dark:text-gray-400" id="table-top">
        Showing {filteredUsers.length > 0 ? startIndex + 1 : 0} to{" "}
        {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length}{" "}
        users
      </div>
      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-225">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/5">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    User
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Email
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Phone
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Role
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Status
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            {user.avatarUrl ? (
                              <Image
                                width={40}
                                height={40}
                                src={getUserAvatar(user)}
                                alt={getFullName(user)}
                                className="object-cover"
                              />
                            ) : (
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                {user.firstName[0]}
                                {user.lastName[0]}
                              </span>
                            )}
                          </div>
                          <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {getFullName(user)}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {user.email}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {user.phoneNumber}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start">
                        <Badge size="sm" color={getRoleBadgeColor(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start">
                        <Badge
                          size="sm"
                          color={getStatusBadgeColor(user.isActive)}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="sm"
                              className="h-8 w-8 p-0 rounded-full bg-slate-700
                             hover:bg-gray-600 dark:bg-brand-400 dark:hover:bg-brand-200"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => handleView(user)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(user)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit user
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(user)}
                            >
                              <Trash2 className="mr-2 h-4 w-4 text-error-500" />
                              <span className="text-error-500">Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="px-5 py-8 text-center text-gray-500 dark:text-gray-400"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <svg
                          className="h-12 w-12 text-gray-300 dark:text-gray-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p>No users found</p>
                        <p className="text-sm">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
      {/* Modals Details */}
      <Modal
        isOpen={viewModal.isOpen}
        onClose={viewModal.closeModal}
        className="max-w-2xl p-6 lg:p-10"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              {selectedUser?.avatarUrl ? (
                <Image
                  width={64}
                  height={64}
                  src={getUserAvatar(selectedUser)}
                  alt={getFullName(selectedUser)}
                  className="object-cover"
                />
              ) : (
                <span className="text-xl font-medium text-gray-600 dark:text-gray-300">
                  {selectedUser?.firstName?.[0]}
                  {selectedUser?.lastName?.[0]}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedUser && getFullName(selectedUser)}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {selectedUser?.role}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Email
              </label>
              <p className="text-gray-900 dark:text-white">
                {selectedUser?.email}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Phone Number
              </label>
              <p className="text-gray-900 dark:text-white">
                {selectedUser?.phoneNumber}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Status
              </label>
              <div>
                <Badge
                  size="sm"
                  color={getStatusBadgeColor(selectedUser?.isActive || false)}
                >
                  {selectedUser?.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Created At
              </label>
              <p className="text-gray-900 dark:text-white">
                {selectedUser &&
                  new Date(selectedUser.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={viewModal.closeModal}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal Create */}
      <Modal
        isOpen={createModal.isOpen}
        onClose={createModal.closeModal}
        className="relative max-w-4xl p-6 lg:p-10 max-h-[90vh] overflow-y-auto"
      >
        <UserViewPage userId="new" />
      </Modal>

      {/* Modal Edit */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={editModal.closeModal}
        className="relative max-w-4xl p-6 lg:p-10 max-h-[90vh] overflow-y-auto"
      >
        <UserViewPage userId={selectedUser ? String(selectedUser.id) : "new"} />
      </Modal>

      {/* Modal Delete */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        className="max-w-md p-6 lg:p-10"
      >
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-error-100 dark:bg-error-500/20">
            <Trash2 className="h-6 w-6 text-error-600 dark:text-error-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Delete User
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Are you sure you want to delete{" "}
            {selectedUser && getFullName(selectedUser)}? This action cannot be
            undone.
          </p>
          <div className="flex justify-center gap-3 pt-4">
            <Button variant="outline" onClick={deleteModal.closeModal}>
              Cancel
            </Button>
            <Button
              className="bg-error-600 hover:bg-error-700"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
