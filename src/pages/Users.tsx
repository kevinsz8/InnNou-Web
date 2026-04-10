import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import DashboardLayout from "@/components/DashboardLayout";
import { useUsers } from "@/hooks/users/useUsers";
import { useCreateUser } from "@/hooks/users/useCreateUser";
import { useUpdateUser } from "@/hooks/users/useUpdateUser";
import { useDeleteUser } from "@/hooks/users/useDeleteUser";

import Button from "@/components/ui/Button";
import TextBox from "@/components/ui/TextBox";
import Modal from "@/components/ui/Modal";
import PaginatedTable from "@/components/ui/PaginatedTable";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

import { buildCreateUserSchema, buildUpdateUserSchema } from "@/types/validation/userSchema";
import type { User } from "@/types/user";
import { useGetHotels } from "../hooks/hotels/useGetHotels";
import { useGetRoles } from "../hooks/roles/useGetRoles";
import Select from "../components/ui/Select";
import Loader from "../components/ui/Loader";
import toast from "react-hot-toast";
import PasswordInput from "../components/ui/PasswordInput";
import { useImpersonateUser } from "../hooks/users/useImpersonateUser";
import FullScreenLoader from "../components/ui/FullScreenLoader";

const Users: React.FC = () => {
    const { t } = useTranslation();

    const [mode, setMode] = useState<"create" | "edit">("create");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [changePassword, setChangePassword] = useState(false);

    //const [hotels, setHotels] = useState<{ hotelId: number; name: string }[]>([]);
    //const [roles, setRoles] = useState<{ roleId: number; name: string }[]>([]);

    const [selectedHotelId, setSelectedHotelId] = useState<number | null>(null);
    const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);

    const { hotels } = useGetHotels();
    const { roles } = useGetRoles();
    const { impersonate, loading: impersonating } = useImpersonateUser();

    const {
        users,
        pagination,
        initialLoading,
        isPageLoading,
        fetchUsers
    } = useUsers();

    const { create, saving } = useCreateUser(() => {
        setShowAddModal(false);
        resetForm();
        fetchUsers(pagination.pageNumber, searchType, searchValue);
    });

    const { update, saving: updating } = useUpdateUser(() => {
        setShowAddModal(false);
        resetForm();
        fetchUsers(pagination.pageNumber, searchType, searchValue);
    });

    const { remove, deleting } = useDeleteUser(() => {
        setDeleteUser(null);
        fetchUsers(pagination.pageNumber, searchType, searchValue);
    });

    const [searchType, setSearchType] = useState("email");
    const [searchValue, setSearchValue] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);

    const [addFirstName, setAddFirstName] = useState("");
    const [addLastName, setAddLastName] = useState("");
    const [addEmail, setAddEmail] = useState("");
    const [addPassword, setAddPassword] = useState("");
    const [addUserName, setAddUserName] = useState("");

    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [deleteUser, setDeleteUser] = useState<User | null>(null);

    const clearFieldError = (field: string) => {
        setFormErrors(prev => ({ ...prev, [field]: "" }));
    };

    useEffect(() => {
        fetchUsers(1, searchType, searchValue, true);
    }, []);

    const handlePageChange = (page: number) => {
        if (page === pagination.pageNumber) return;
        fetchUsers(page, searchType, searchValue);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchUsers(1, searchType, searchValue, true);
    };

    const handleClearSearch = () => {
        setSearchType("email");
        setSearchValue("");
        fetchUsers(1, "email", "", true);
    };

    const resetForm = () => {
        setMode("create");
        setSelectedUser(null);
        setAddFirstName("");
        setAddLastName("");
        setAddEmail("");
        setAddPassword("");
        setAddUserName("");

        setSelectedHotelId(null);
        setSelectedRoleId(null);

        setChangePassword(false);
        setFormErrors({});
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();

        const schema = mode === "create"
            ? buildCreateUserSchema(t)
            : buildUpdateUserSchema(t);

        
       

        const result = schema.safeParse({
            firstName: addFirstName,
            lastName: addLastName,
            email: addEmail,
            userName: addUserName,
            password: addPassword,
            changePassword
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

            if (!selectedRoleId) {
                setFormErrors(prev => ({
                    ...prev,
                    roleId: "Role is required"
                }));
                return;
            }


            return;
        }

        setFormErrors({});

        if (mode === "create") {

            if (!isPasswordStrong(addPassword)) {
                setFormErrors(prev => ({
                    ...prev,
                    password: t("users.validation.PasswordStrong")
                }));
                return;
            }

            const res = await create({
                email: addEmail,
                password: addPassword,
                firstName: addFirstName,
                lastName: addLastName,
                username: addUserName,
                roleId: selectedRoleId!,
                hotelId: selectedHotelId
            });

            if (!res.success) {
                const error = res.errors?.[0];

                if (error?.code === "USER_ALREADY_EXISTS") {
                    setFormErrors(prev => ({
                        ...prev,
                        email: t("errors.USER_ALREADY_EXISTS")
                    }));
                    return;
                }

                if (error?.code === "USER_CREATION_FAILED") {
                    setFormErrors(prev => ({
                        ...prev,
                        userName: t("errors.USER_CREATION_FAILED")
                    }));
                    return;
                }

                const message =
                    error?.description ||
                    t("errors.GENERIC_ERROR") ||
                    "Something went wrong";

                toast.error(message);
                return;
            }
        } else {

            if (changePassword && addPassword && !isPasswordStrong(addPassword)) {
                setFormErrors(prev => ({
                    ...prev,
                    password: t("users.validation.PasswordStrong")
                }));
                return;
            }

            await update({
                userToken: selectedUser!.userToken,
                email: addEmail,
                firstName: addFirstName,
                lastName: addLastName,
                userName: addUserName,
                roleId: selectedRoleId!,
                hotelId: selectedHotelId,
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

        setSelectedHotelId(user.hotelId ?? null);
        setSelectedRoleId(user.roleId ?? null);

        setShowAddModal(true);
    };

    const handleDelete = (user: User) => {
        setDeleteUser(user);
    };

    const confirmDelete = async () => {
        if (!deleteUser) return;

        await remove(deleteUser.userToken);
    };

    const cancelDelete = () => {
        if (deleting) return;
        setDeleteUser(null);
    };

    const isPasswordStrong = (password: string) => {
        return (
            password.length >= 8 &&
            /[A-Z]/.test(password) &&
            /[a-z]/.test(password) &&
            /[0-9]/.test(password) &&
            /[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\\/]/.test(password)
        );
    };


    return (
        <DashboardLayout>
            <div className="w-full bg-white rounded-xl shadow p-4 md:p-6">

                {/* SEARCH */}
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 items-center mb-6">
                    <select
                        id="selectSearch"
                        className="border rounded px-3 py-2 w-full md:w-auto"
                        value={searchType}
                        onChange={e => setSearchType(e.target.value)}
                    >
                        <option value="email">{t("users.email")}</option>
                        <option value="firstName">{t("users.firstName")}</option>
                        <option value="lastName">{t("users.lastName")}</option>
                    </select>

                    <TextBox
                        id = "txtSearch"
                        value={searchValue}
                        onChange={e => setSearchValue(e.target.value)}
                        placeholder={t("common.search")}
                        className="w-full md:w-100"
                    />

                    <div className="flex gap-2">
                        <Button id="btnSearch" type="submit" className="hover:scale-105 transition">{t("common.search")}</Button>
                        <Button id="btnClearSearch" type="button" onClick={handleClearSearch} className="hover:scale-105 transition">{t("common.clear")}</Button>
                    </div>
                </form>

                {/* ADD USER */}
                <div className="flex justify-end mb-4">
                    <Button id="btnAddUser" className="bg-blue-600 hover:bg-blue-700 text-white shadow-md w-full md:w-auto hover:scale-105 transition" onClick={() => { resetForm(); setShowAddModal(true); }}>
                        + {t("users.addUser")}
                    </Button>
                </div>

                {/* TABLE */}
                <div className="w-full overflow-x-auto">
                    <div className="min-w-[800px]">
                        <PaginatedTable
                            columns={[
                                { key: "userId", label: t("users.userId") },
                                { key: "email", label: t("users.email") },
                                { key: "firstName", label: t("users.firstName") },
                                { key: "lastName", label: t("users.lastName") },
                                { key: "userName", label: t("users.username") },
                                { key: "actions", label: t("common.actions") },
                            ]}
                            data={users}
                            pagination={pagination}
                            onPageChange={handlePageChange}
                            loading={isPageLoading}
                            initialLoading={initialLoading}
                            onRowDoubleClick={(user) => handleEdit(user)}
                            renderRow={(user) => (
                                <>
                                    <td className="px-4 py-2">{user.userId}</td>
                                    <td className="px-4 py-2">{user.email}</td>
                                    <td className="px-4 py-2">{user.firstName}</td>
                                    <td className="px-4 py-2">{user.lastName}</td>
                                    <td className="px-4 py-2">{user.userName}</td>
                                    <td className="px-4 py-2 flex gap-2">
                                        <Button onClick={() => handleEdit(user)} className="hover:scale-105 transition">
                                            {t("common.edit")}
                                        </Button>
                                        <Button variant="danger" onClick={() => handleDelete(user)} className="hover:scale-105 transition">
                                            {t("common.delete")}
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            onClick={() => impersonate(user.userToken)}
                                            className="hover:scale-105 transition"
                                        >
                                            {t("common.impersonate")}
                                        </Button>
                                    </td>
                                </>
                            )}
                        />
                    </div>
                </div>

                {/* MODAL */}
                <Modal open={showAddModal} onClose={() => { setShowAddModal(false); setFormErrors({}); } }>
                    <h2>{mode === "create" ? t("users.addUser") : t("users.editUser")}</h2>

                    <form onSubmit={handleAddUser} className="flex flex-col gap-4">
                        <TextBox
                            id="txtFirstName"
                            value={addFirstName}
                            onChange={e => {
                                setAddFirstName(e.target.value);
                                clearFieldError("firstName");
                            }}
                            error={formErrors.firstName}
                            disabled={saving || updating}
                            placeholder={t("users.firstName")} />
                        <TextBox
                            id="txtLastName"
                            value={addLastName}
                            onChange={e => {
                                setAddLastName(e.target.value);
                                clearFieldError("lastName");
                            }}
                            error={formErrors.lastName}
                            disabled={saving || updating}
                            placeholder={t("users.lastName")} />
                        <TextBox
                            id="txtEmail"
                            value={addEmail}
                            onChange={e => {
                                setAddEmail(e.target.value);
                                clearFieldError("email");
                            }}
                            error={formErrors.email}
                            disabled={saving || updating}
                            placeholder={t("users.email")} />
                        <TextBox
                            id="txtUserName"
                            value={addUserName}
                            onChange={e => {
                                setAddUserName(e.target.value);
                                clearFieldError("userName");
                            }}
                            error={formErrors.userName}
                            disabled={saving || updating}
                            placeholder={t("users.username")} />

                        <Select
                            id="selectHotel"
                            value={selectedHotelId ?? ""}
                            onChange={(val) => setSelectedHotelId(Number(val))}
                            options={hotels.map(h => ({
                                value: h.hotelId,
                                label: h.name
                            }))}
                            placeholder="Select Hotel"
                        />

                        <Select
                            id="selectRole"
                            value={selectedRoleId ?? ""}
                            onChange={(val) => setSelectedRoleId(Number(val))}
                            options={roles.map(r => ({
                                value: r.roleId,
                                label: r.name
                            }))}
                            placeholder="Select Role"
                            error={formErrors.roleId}
                        />


                        {mode === "edit" && (
                            <div className="flex items-center gap-2">
                                <input
                                    id="chkChangePassword"
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
                                    {t("users.changePassword")}
                                </label>
                            </div>
                        )}

                        <PasswordInput
                            id="txtPassword"
                            value={addPassword}
                            onChange={(val) => {
                                setAddPassword(val);
                                clearFieldError("password");
                            }}
                            placeholder={t("users.password")}
                            error={formErrors.password}
                            disabled={
                                saving ||
                                updating ||
                                (mode === "edit" && !changePassword)
                            }
                        />

                        <div className="flex justify-end gap-2">
                            <Button id="btnSaveUsers" type="submit" loading={saving} disabled={saving || updating}>{t("common.save")}</Button>
                            <Button id="btnCancelUsers" type="button" onClick={() => setShowAddModal(false)} disabled={saving || updating}>
                                {t("common.cancel")}
                            </Button>
                        </div>
                    </form>
                    {(saving || updating) && <Loader overlay size={8} />}
                </Modal>

                <ConfirmDialog
                    open={!!deleteUser}
                    title={t("users.deleteTitle")}
                    description={t("users.deleteConfirm", { email: deleteUser?.email })}
                    confirmText={t("common.delete")}
                    cancelText={t("common.cancel")}
                    loading={deleting}
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />

            </div>
            <FullScreenLoader
                open={impersonating}
                title="Switching user..."
                subtitle="Applying permissions and loading context"
            />
        </DashboardLayout>

    );
};

export default Users;