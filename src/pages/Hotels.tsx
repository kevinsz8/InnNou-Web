import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import DashboardLayout from "@/components/DashboardLayout";

import Button from "@/components/ui/Button";
import TextBox from "@/components/ui/TextBox";
import Modal from "@/components/ui/Modal";
import PaginatedTable from "@/components/ui/PaginatedTable";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Loader from "@/components/ui/Loader";
import Select from "@/components/ui/Select";

import { useHotels } from "@/hooks/hotels/useHotels";
//import { useCreateHotel } from "@/hooks/hotels/useCreateHotel";
//import { useUpdateHotel } from "@/hooks/hotels/useUpdateHotel";
//import { useDeleteHotel } from "@/hooks/hotels/useDeleteHotel";

import type { Hotel } from "@/types/hotel";

const Hotels: React.FC = () => {
    const { t } = useTranslation();

    const [mode, setMode] = useState<"create" | "edit">("create");
    const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

    const [name, setName] = useState("");
    const [parentHotelId, setParentHotelId] = useState<number | null>(null);

    const [showModal, setShowModal] = useState(false);
    const [deleteHotel, setDeleteHotel] = useState<Hotel | null>(null);

    const [searchType, setSearchType] = useState("email");
    const [searchValue, setSearchValue] = useState("");

    const {
        hotels,
        pagination,
        fetchHotels,
        initialLoading,
        isPageLoading
    } = useHotels();

    //const { create, saving } = useCreateHotel(() => {
    //    setShowModal(false);
    //    resetForm();
    //    fetchHotels(pagination.pageNumber);
    //});

    //const { update, saving: updating } = useUpdateHotel(() => {
    //    setShowModal(false);
    //    resetForm();
    //    fetchHotels(pagination.pageNumber);
    //});

    //const { remove, deleting } = useDeleteHotel(() => {
    //    setDeleteHotel(null);
    //    fetchHotels(pagination.pageNumber);
    //});

    useEffect(() => {
        fetchHotels(1);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchHotels(1, searchValue, true);
    };

    const handleClearSearch = () => {
        setSearchType("email");
        setSearchValue("");
        fetchHotels(1, searchValue, true);
    };

    const resetForm = () => {
        setMode("create");
        setSelectedHotel(null);
        setName("");
        setParentHotelId(null);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        //if (mode === "create") {
        //    await create({ name, parentHotelId });
        //} else {
        //    await update({
        //        hotelId: selectedHotel!.hotelId,
        //        name,
        //        parentHotelId
        //    });
        //}
    };

    const handleEdit = (hotel: Hotel) => {
        setMode("edit");
        setSelectedHotel(hotel);

        setName(hotel.name);
        setParentHotelId(hotel.parentHotelId ?? null);

        setShowModal(true);
    };

    const confirmDelete = async () => {
        if (!deleteHotel) return;
        //await remove(deleteHotel.hotelId);
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
                        id="txtSearch"
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

                {/* ADD */}
                <div className="flex justify-end mb-4">
                    <Button onClick={() => { resetForm(); setShowModal(true); }}>
                        + {t("hotels.addHotel")}
                    </Button>
                </div>

                <div className="w-full overflow-x-auto">
                    <div className="min-w-[800px]">
                {/* TABLE */}
                <PaginatedTable
                    columns={[
                        { key: "hotelId", label: "ID" },
                        { key: "name", label: t("hotels.nameHotel") },
                        { key: "actions", label: t("common.actions") },
                    ]}
                    data={hotels}
                    pagination={pagination}
                    onPageChange={(p) => fetchHotels(p)}
                    loading={isPageLoading}
                    initialLoading={initialLoading}
                    onRowDoubleClick={handleEdit}
                    renderRow={(hotel) => (
                        <>
                            <td className="px-4 py-2">{hotel.hotelId}</td>
                            <td className="px-4 py-2">{hotel.name}</td>
                            <td className="px-4 py-2 flex gap-2">
                                <Button onClick={() => handleEdit(hotel)}>
                                    {t("common.edit")}
                                </Button>
                                <Button variant="danger" onClick={() => setDeleteHotel(hotel)}>
                                    {t("common.delete")}
                                </Button>
                            </td>
                        </>
                    )}
                        />
                    </div>
                </div>

                {/* MODAL */}
                <Modal open={showModal} onClose={() => setShowModal(false)}>
                    <form onSubmit={handleSave} className="flex flex-col gap-4">

                        <TextBox
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder={t("hotels.name")}
                        />

                        <Select
                            value={parentHotelId ?? ""}
                            onChange={(val) => setParentHotelId(Number(val))}
                            options={hotels.map(h => ({
                                value: h.hotelId,
                                label: h.name
                            }))}
                            placeholder="Parent Hotel"
                        />

                        <div className="flex justify-end gap-2">
                            <Button type="submit">{t("common.save")}</Button>
                            <Button onClick={() => setShowModal(false)}>
                                {t("common.cancel")}
                            </Button>
                        </div>

                    </form>
                    {/*{(saving || updating) && <Loader overlay />}*/}
                </Modal>

                {/*<ConfirmDialog*/}
                {/*    open={!!deleteHotel}*/}
                {/*    title={t("hotels.deleteTitle")}*/}
                {/*    description={deleteHotel?.name}*/}
                {/*    onConfirm={confirmDelete}*/}
                {/*    onCancel={() => setDeleteHotel(null)}*/}
                {/*    loading={deleting}*/}
                {/*/>*/}

            </div>
        </DashboardLayout>
    );
};

export default Hotels;