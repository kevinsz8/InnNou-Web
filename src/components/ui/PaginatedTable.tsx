import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Loader from "./Loader";

interface Column {
    key: string;
    label: string;
}

interface Pagination {
    pageNumber: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    previousPageNumber: number;
    nextPageNumber: number;
}

interface PaginatedTableProps<T> {
    columns: Column[];
    data: T[];
    renderRow: (item: T) => React.ReactNode;

    pagination: Pagination;
    onPageChange: (page: number) => void;
    onRowClick?: (item: T) => void;
    onRowDoubleClick?: (item: T) => void;
    loading?: boolean;
    initialLoading?: boolean;
}

function PaginatedTable<T>({
    columns,
    data,
    renderRow,
    pagination,
    onPageChange,
    loading = false,
    initialLoading = false,
    onRowClick,
    onRowDoubleClick
}: PaginatedTableProps<T>) {

    const [selectedRow, setSelectedRow] = useState<number | null>(null);

    const {
        pageNumber,
        totalPages,
        hasPreviousPage,
        hasNextPage,
        previousPageNumber,
        nextPageNumber
    } = pagination;

    // 🔥 Skeleton
    const SkeletonRows = () => (
        <>
            {[...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                    {columns.map((_, j) => (
                        <td key={j} className="px-4 py-3">
                            <div className="h-4 bg-slate-200 rounded w-full"></div>
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );

    // 🔥 Pagination logic
    function getVisiblePages(current: number, total: number, delta = 1) {
        const pages: (number | string)[] = [];

        if (total <= 7) {
            for (let i = 1; i <= total; i++) pages.push(i);
            return pages;
        }

        const left = Math.max(2, current - delta);
        const right = Math.min(total - 1, current + delta);

        pages.push(1);

        if (left > 2) pages.push("...");

        for (let i = left; i <= right; i++) pages.push(i);

        if (right < total - 1) pages.push("...");

        pages.push(total);

        return pages;
    }

    const pages = getVisiblePages(pageNumber, totalPages);

    return (
        <div className="w-full">

            {/* 🔥 SCROLL WRAPPER */}
            <div className="w-full overflow-x-auto">

                <div className="min-w-[700px]">

                    <div className="relative border">

                        <table className="w-full text-sm">

                            <thead className="bg-slate-100">
                                <tr>
                                    {columns.map(col => (
                                        <th
                                            key={col.key}
                                            className="text-left px-4 py-2 font-medium text-slate-700 whitespace-nowrap"
                                        >
                                            {col.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody className={loading ? "opacity-60" : ""}>
                                {initialLoading ? (
                                    <SkeletonRows />
                                ) : data.length === 0 ? (
                                    <tr>
                                        <td colSpan={columns.length} className="text-center py-6 text-slate-400">
                                            No data found
                                        </td>
                                    </tr>
                                ) : (
                                    data.map((item, index) => {
                                        const isSelected = selectedRow === index;

                                        return (
                                            <tr
                                                key={index}
                                                onClick={() => {
                                                    setSelectedRow(index);
                                                    onRowClick?.(item);
                                                }}
                                                onDoubleClick={() => onRowDoubleClick?.(item)}
                                                className={`"border-t hover:bg-slate-100 cursor-pointer transition
                        ${isSelected
                                                        ? "bg-blue-100"
                                                        : "hover:bg-slate-100"}
                    `}
                                            >
                                                {renderRow(item)}
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>

                        </table>

                        {/* LOADER */}
                        {loading && !initialLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
                                <Loader size={8} />
                            </div>
                        )}

                    </div>

                </div>

            </div>

            {/* PAGINATION */}
            <div className="flex flex-wrap justify-center mt-4 gap-2 items-center">

                {hasPreviousPage && (
                    <Button onClick={() => onPageChange(previousPageNumber)} disabled={loading}>
                        Previous
                    </Button>
                )}

                {pages.map((page, index) => {

                    if (page === "...") {
                        return (
                            <span key={`ellipsis-${index}`} className="px-2 py-2 text-slate-400">
                                ...
                            </span>
                        );
                    }

                    return (
                        <Button
                            key={page}
                            onClick={() => pageNumber !== page && onPageChange(page as number)}
                            disabled={pageNumber === page || loading}
                            className={`min-w-[40px]
                                ${pageNumber === page
                                    ? "bg-slate-900 text-white"
                                    : "bg-slate-200 hover:bg-slate-300"}
                            `}
                        >
                            {page}
                        </Button>
                    );
                })}

                {hasNextPage && (
                    <Button onClick={() => onPageChange(nextPageNumber)} disabled={loading}>
                        Next
                    </Button>
                )}
            </div>

        </div>
    );
}

export default PaginatedTable;