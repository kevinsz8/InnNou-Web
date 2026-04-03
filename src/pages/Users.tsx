import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useUsers } from "@/hooks/users/useUsers";
import { useCreateUser } from "@/hooks/users/useCreateUser";
import { useUpdateUser } from "@/hooks/users/useUpdateUser";
import { useDeleteUser } from "@/hooks/users/useDeleteUser";
import Button from "@/components/ui/Button";
import TextBox from "@/components/ui/TextBox";
import Modal from "@/components/ui/Modal";
import PaginatedTable from "@/components/ui/PaginatedTable";
import { createUserSchema, updateUserSchema } from "@/types/validation/userSchema";
import Loader from "@/components/ui/Loader";
import type { User } from "@/types/user";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { showGlobalErrorModal } from "../core/auth/errorModalService";

const searchOptions = [
    { value: "email", label: "Email" },
    { value: "firstName", label: "First Name" },
    { value: "lastName", label: "Last Name" },
];

const Users: React.FC = () => {
    const [mode, setMode] = useState<"create" | "edit">("create");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [changePassword, setChangePassword] = useState(false);

    // 🔥 USERS HOOK
    const {
        users,
        pagination,
        initialLoading,
        isPageLoading,
        fetchUsers
    } = useUsers();

    const clearFieldError = (field: string) => {
        setFormErrors(prev => ({
            ...prev,
            [field]: ""
        }));
    };

    // 🔥 CREATE USER HOOK
    const {
        create,
        saving
    } = useCreateUser(() => {
        setShowAddModal(false);
        resetForm();
        fetchUsers(pagination.pageNumber, searchType, searchValue);
    });

    const { update, saving: updating, error: updateError } = useUpdateUser(() => {
        setShowAddModal(false);
        resetForm();
        fetchUsers(pagination.pageNumber, searchType, searchValue);
    });

    const { remove, deleting } = useDeleteUser(() => {
        setDeleteUser(null);
        fetchUsers(pagination.pageNumber, searchType, searchValue);
    });

    // 🔎 SEARCH STATE
    const [searchType, setSearchType] = useState("email");
    const [searchValue, setSearchValue] = useState("");

    // ➕ MODAL STATE
    const [showAddModal, setShowAddModal] = useState(false);

    // 🧾 FORM STATE
    const [addFirstName, setAddFirstName] = useState("");
    const [addLastName, setAddLastName] = useState("");
    const [addEmail, setAddEmail] = useState("");
    const [addPassword, setAddPassword] = useState("");
    const [addUserName, setAddUserName] = useState("");

    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [deleteUser, setDeleteUser] = useState<User | null>(null);


    // 🚀 INITIAL LOAD
    useEffect(() => {
        
        fetchUsers(1, searchType, searchValue, true);
    }, []);

    // 📄 PAGINATION
    const handlePageChange = (page: number) => {
        if (page === pagination.pageNumber) return;
        fetchUsers(page, searchType, searchValue);
    };

    // 🔎 SEARCH
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchUsers(1, searchType, searchValue, true);
    };

    // 🧹 CLEAR SEARCH
    const handleClearSearch = () => {
        setSearchType("email");
        setSearchValue("");
        fetchUsers(1, "email", "", true);
    };

    // 🧹 RESET FORM
    const resetForm = () => {
        setMode("create");
        setSelectedUser(null);

        setAddFirstName("");
        setAddLastName("");
        setAddEmail("");
        setAddPassword("");
        setAddUserName("");
        setChangePassword(false);

        setFormErrors({});
    };

    // ➕ CREATE USER (VALIDATED)
    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();

        const schema = mode === "create"
            ? createUserSchema
            : updateUserSchema;

        const result = schema.safeParse({
            firstName: addFirstName,
            lastName: addLastName,
            email: addEmail,
            userName: addUserName,
            password: addPassword,
            changePassword: changePassword
        });

        if (!result.success) {
            const errors = result.error.flatten().fieldErrors;

            setFormErrors({
                firstName: errors.firstName?.[0] || "",
                lastName: errors.lastName?.[0] || "",
                email: errors.email?.[0] || "",
                userName: errors.userName?.[0] || "",
                password: errors.password?.[0] || "",
            });

            return;
        }

        setFormErrors({});

        if (mode === "create") {
            const res = await create({
                email: addEmail,
                password: addPassword,
                firstName: addFirstName,
                lastName: addLastName,
                username: addUserName
            });

            if (!res.success) {
                const firstError = res.errors?.[0];

                if (firstError?.code === "USER_ALREADY_EXISTS") {
                    setFormErrors(prev => ({
                        ...prev,
                        email: firstError.description
                    }));
                    return;
                }

                if (firstError?.code === "USER_CREATION_FAILED") {
                    setFormErrors(prev => ({
                        ...prev,
                        userName: firstError.description
                    }));
                    return;
                }

                return;
            }
        } else {
            await update({
                userId: selectedUser!.userId,
                email: addEmail,
                firstName: addFirstName,
                lastName: addLastName,
                userName: addUserName,
                password: changePassword ? addPassword : undefined
            });
        }
    };

    const handleEdit = (user: User) => {
        setMode("edit");
        setSelectedUser(user);

        setAddFirstName(user.firstName);
        setAddLastName(user.lastName);
        setAddEmail(user.email);
        setAddUserName(user.userName);
        setAddPassword("");
        setChangePassword(false);

        setShowAddModal(true);
    };


    const handleDelete = (user: User) => {
        setDeleteUser(user);
    };

    const confirmDelete = async () => {
        if (!deleteUser) return;

        await remove(deleteUser.userId);
    };

    const cancelDelete = () => {
        if (deleting) return;
        setDeleteUser(null);
    };

    // 📊 TABLE COLUMNS
    const columns = [
        { key: "userId", label: "User ID" },
        { key: "email", label: "Email" },
        { key: "firstName", label: "First Name" },
        { key: "lastName", label: "Last Name" },
        { key: "userName", label: "User Name" },
        { key: "actions", label: "Actions" },
    ];

    return (
        <DashboardLayout>
            <div className="max-w-1xl bg-white rounded-xl shadow p-6">

                {/* 🔎 SEARCH */}
                <form
                    className="flex flex-col md:flex-row gap-4 items-end mb-6"
                    onSubmit={handleSearch}
                >
                    <div>
                        <select
                            className="border rounded px-3 py-2"
                            value={searchType}
                            onChange={e => setSearchType(e.target.value)}
                        >
                            {searchOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1">
                        <TextBox
                            type="text"
                            value={searchValue}
                            onChange={e => setSearchValue(e.target.value)}
                            placeholder="Search..."
                        />
                    </div>

                    <Button type="submit">Search</Button>
                    <Button type="button" onClick={handleClearSearch}>
                        Clear
                    </Button>
                </form>

                {/* ➕ ADD USER */}
                <Button
                    onClick={() => {
                        resetForm();
                        setShowAddModal(true);
                    }}
                    className="mb-4"
                >
                    + Add User
                </Button>

                {/* 📊 TABLE */}
                <PaginatedTable
                    columns={columns}
                    data={users}
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    loading={isPageLoading}
                    initialLoading={initialLoading}
                    renderRow={(user) => (
                        <tr className="border-t hover:bg-slate-100">
                            <td className="px-4 py-2">{user.userId}</td>
                            <td className="px-4 py-2">{user.email}</td>
                            <td className="px-4 py-2">{user.firstName}</td>
                            <td className="px-4 py-2">{user.lastName}</td>
                            <td className="px-4 py-2">{user.userName}</td>

                            {/* 🔥 ACTIONS */}
                            <td className="px-4 py-2">
                                <div className="flex gap-2">

                                    <Button
                                        variant="secondary"
                                        className="px-2 py-1 text-sm"
                                        onClick={() => handleEdit(user)}
                                    >
                                        Edit
                                    </Button>

                                    <Button
                                        variant="danger"
                                        className="px-2 py-1 text-sm"
                                        onClick={() => handleDelete(user)}
                                    >
                                        Delete
                                    </Button>

                                </div>
                            </td>
                        </tr>
                    )}
                />

                {/* 🧾 MODAL */}
                <Modal
                    open={showAddModal}
                    onClose={() => {
                        if (!saving) setShowAddModal(false);
                    }}
                >
                    <h2 className="text-xl font-bold mb-4">
                        {mode === "create" ? "Add User" : "Edit User"}
                    </h2>
                    <div>
                        <form onSubmit={handleAddUser} className="flex flex-col gap-4">

                            <TextBox
                                value={addFirstName}
                                onChange={e => {
                                    setAddFirstName(e.target.value);
                                    clearFieldError("firstName");
                                }}
                                placeholder="First Name"
                                error={formErrors.firstName}
                                disabled={saving || updating}
                            />

                            <TextBox
                                value={addLastName}
                                onChange={e => {
                                    setAddLastName(e.target.value);
                                    clearFieldError("lastName");
                                }}
                                placeholder="Last Name"
                                error={formErrors.lastName}
                                disabled={saving || updating}
                            />

                            <TextBox
                                value={addEmail}
                                onChange={e => {
                                    setAddEmail(e.target.value);
                                    clearFieldError("email");
                                }}
                                placeholder="Email"
                                error={formErrors.email}
                                disabled={saving || updating}
                            />

                            <TextBox
                                value={addUserName}
                                onChange={e => {
                                    setAddUserName(e.target.value);
                                    clearFieldError("userName");
                                }}
                                placeholder="UserName"
                                error={formErrors.userName}
                                disabled={saving || updating}
                            />

                            {mode === "edit" && (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={changePassword}
                                        onChange={(e) => {
                                            setChangePassword(e.target.checked);
                                            if (!e.target.checked) {
                                                setAddPassword("");
                                            }
                                        }}
                                        disabled={saving || updating}
                                    />
                                    <label className="text-sm text-slate-600">
                                        Change Password
                                    </label>
                                </div>
                            )}

                            <TextBox
                                value={addPassword}
                                onChange={(e) => {
                                    setAddPassword(e.target.value);
                                    clearFieldError("password");
                                }}
                                placeholder="Password"
                                type="password"
                                error={formErrors.password}
                                disabled={
                                    saving ||
                                    updating ||
                                    (mode === "edit" && !changePassword) // 🔥 clave
                                }
                            />

                         

                            <div className="flex justify-end gap-2">
                                <Button type="submit" loading={saving} disabled={saving || updating}>
                                    Save
                                </Button>

                                <Button type="button" onClick={() => setShowAddModal(false)} disabled={saving || updating}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                        {(saving || updating) && <Loader overlay size={8} />}
                    </div>
                </Modal>

                <ConfirmDialog
                    open={!!deleteUser}
                    title="Delete user"
                    description={`Are you sure you want to delete ${deleteUser?.email}?`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    loading={deleting}
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />

            </div>
        </DashboardLayout>
    );
};

export default Users;