//import React, { useEffect, useState } from "react";
//import { useTranslation } from "react-i18next";

//import DashboardLayout from "@/components/DashboardLayout";

//import Button from "@/components/ui/Button";
//import TextBox from "@/components/ui/TextBox";
//import Modal from "@/components/ui/Modal";
//import PaginatedTable from "@/components/ui/PaginatedTable";
//import ConfirmDialog from "@/components/ui/ConfirmDialog";
//import Loader from "@/components/ui/Loader";

//import { useRoles } from "@/hooks/roles/useRoles";
//import { useCreateRole } from "@/hooks/roles/useCreateRole";
//import { useUpdateRole } from "@/hooks/roles/useUpdateRole";
//import { useDeleteRole } from "@/hooks/roles/useDeleteRole";

//import type { Role } from "@/types/role";

//const Roles: React.FC = () => {
//    const { t } = useTranslation();

//    const [mode, setMode] = useState<"create" | "edit">("create");
//    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

//    const [searchValue, setSearchValue] = useState("");
//    const [showModal, setShowModal] = useState(false);

//    const [name, setName] = useState("");
//    const [level, setLevel] = useState<number>(0);

//    const [deleteRole, setDeleteRole] = useState<Role | null>(null);

//    const {
//        roles,
//        pagination,
//        initialLoading,
//        isPageLoading,
//        fetchRoles
//    } = useRoles();

//    const { create, saving } = useCreateRole(() => {
//        setShowModal(false);
//        resetForm();
//        fetchRoles(pagination.pageNumber, searchValue);
//    });

//    const { update, saving: updating } = useUpdateRole(() => {
//        setShowModal(false);
//        resetForm();
//        fetchRoles(pagination.pageNumber, searchValue);
//    });

//    const { remove, deleting } = useDeleteRole(() => {
//        setDeleteRole(null);
//        fetchRoles(pagination.pageNumber, searchValue);
//    });

//    useEffect(() => {
//        fetchRoles(1, "");
//    }, []);

//    const resetForm = () => {
//        setMode("create");
//        setSelectedRole(null);
//        setName("");
//        setLevel(0);
//    };

//    const handleSave = async (e: React.FormEvent) => {
//        e.preventDefault();

//        if (mode === "create") {
//            await create({ name, level });
//        } else {
//            await update({
//                roleId: selectedRole!.roleId,
//                name,
//                level
//            });
//        }
//    };

//    const handleEdit = (role: Role) => {
//        setMode("edit");
//        setSelectedRole(role);

//        setName(role.name);
//        setLevel(role.level);

//        setShowModal(true);
//    };

//    const confirmDelete = async () => {
//        if (!deleteRole) return;
//        await remove(deleteRole.roleId);
//    };

//    return (
//        <DashboardLayout>
//            <div className="bg-white rounded-xl shadow p-6">

//                {/* SEARCH */}
//                <form className="flex gap-2 mb-4">
//                    <TextBox
//                        value={searchValue}
//                        onChange={e => setSearchValue(e.target.value)}
//                        placeholder={t("common.search")}
//                    />
//                    <Button onClick={() => fetchRoles(1, searchValue)}>
//                        {t("common.search")}
//                    </Button>
//                </form>

//                {/* ADD */}
//                <div className="flex justify-end mb-4">
//                    <Button onClick={() => { resetForm(); setShowModal(true); }}>
//                        + {t("roles.add")}
//                    </Button>
//                </div>

//                {/* TABLE */}
//                <PaginatedTable
//                    columns={[
//                        { key: "roleId", label: "ID" },
//                        { key: "name", label: t("roles.name") },
//                        { key: "level", label: t("roles.level") },
//                        { key: "actions", label: t("common.actions") },
//                    ]}
//                    data={roles}
//                    pagination={pagination}
//                    onPageChange={(p) => fetchRoles(p, searchValue)}
//                    loading={isPageLoading}
//                    initialLoading={initialLoading}
//                    onRowDoubleClick={handleEdit}
//                    renderRow={(role) => (
//                        <>
//                            <td>{role.roleId}</td>
//                            <td>{role.name}</td>
//                            <td>{role.level}</td>
//                            <td className="flex gap-2">
//                                <Button onClick={() => handleEdit(role)}>
//                                    {t("common.edit")}
//                                </Button>
//                                <Button variant="danger" onClick={() => setDeleteRole(role)}>
//                                    {t("common.delete")}
//                                </Button>
//                            </td>
//                        </>
//                    )}
//                />

//                {/* MODAL */}
//                <Modal open={showModal} onClose={() => setShowModal(false)}>
//                    <form onSubmit={handleSave} className="flex flex-col gap-4">

//                        <TextBox
//                            value={name}
//                            onChange={e => setName(e.target.value)}
//                            placeholder={t("roles.name")}
//                        />

//                        <TextBox
//                            value={level}
//                            onChange={e => setLevel(Number(e.target.value))}
//                            placeholder={t("roles.level")}
//                        />

//                        <div className="flex justify-end gap-2">
//                            <Button type="submit">{t("common.save")}</Button>
//                            <Button onClick={() => setShowModal(false)}>
//                                {t("common.cancel")}
//                            </Button>
//                        </div>

//                    </form>
//                    {(saving || updating) && <Loader overlay />}
//                </Modal>

//                <ConfirmDialog
//                    open={!!deleteRole}
//                    title={t("roles.deleteTitle")}
//                    description={deleteRole?.name}
//                    onConfirm={confirmDelete}
//                    onCancel={() => setDeleteRole(null)}
//                    loading={deleting}
//                />

//            </div>
//        </DashboardLayout>
//    );
//};

//export default Roles;