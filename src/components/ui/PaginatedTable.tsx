import React from "react";
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
}: PaginatedTableProps<T>) {

    const {
        pageNumber,
        totalPages,
        hasPreviousPage,
        hasNextPage,
        previousPageNumber,
        nextPageNumber
    } = pagination;

    // 🔥 Skeleton rows (initial load)
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

    // 🔥 Pagination logic with ellipsis
    function getVisiblePages(current: number, total: number, delta = 1) {
        const pages: (number | string)[] = [];

        // Caso simple: pocas páginas → mostrar todas
        if (total <= 7) {
            for (let i = 1; i <= total; i++) {
                pages.push(i);
            }
            return pages;
        }

        const left = Math.max(2, current - delta);
        const right = Math.min(total - 1, current + delta);

        pages.push(1);

        // Si hay gap entre 1 y left → elipsis
        if (left > 2) {
            pages.push("...");
        }

        // Páginas centrales (sin duplicar 1 ni total)
        for (let i = left; i <= right; i++) {
            pages.push(i);
        }

        // Si hay gap entre right y total → elipsis
        if (right < total - 1) {
            pages.push("...");
        }

        pages.push(total);

        return pages;
    }

    const pages = getVisiblePages(pageNumber, totalPages,1);

    return (
        <div>
            {/* TABLE */}
            <div className="relative border min-h-[350px] overflow-hidden rounded-xl">

                <table className="w-full text-sm">
                    <thead className="bg-slate-100">
                        <tr>
                            {columns.map(col => (
                                <th
                                    key={col.key}
                                    className="text-left px-4 py-2 font-medium text-slate-700"
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className={loading ? "opacity-60 transition-opacity" : ""}>
                        {initialLoading ? (
                            <SkeletonRows />
                        ) : data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="text-center py-6 text-slate-400"
                                >
                                    No data found
                                </td>
                            </tr>
                        ) : (
                            data.map((item, index) => (
                                <React.Fragment key={index}>
                                    {renderRow(item)}
                                </React.Fragment>
                            ))
                        )}
                    </tbody>
                </table>

                {/* 🔥 OVERLAY LOADER */}
                {loading && !initialLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[1px] pointer-events-none">
                        <Loader size={8} />
                    </div>
                )}
            </div>

            {/* PAGINATION */}
            <div className="flex justify-center mt-4 gap-2 flex-wrap items-center">

                {/* PREVIOUS */}
                {hasPreviousPage && (
                    <Button
                        onClick={() => onPageChange(previousPageNumber)}
                        disabled={loading}
                    >
                        Previous
                    </Button>
                )}

                {/* PAGE NUMBERS */}
                {pages.map((page, index) => {

                    if (page === "...") {
                        return (
                            <span
                                key={`ellipsis-${index}`}
                                className="px-2 py-2 text-slate-400"
                            >
                                ...
                            </span>
                        );
                    }

                    return (
                        <Button
                            key={page}
                            type="button"
                            onClick={() => pageNumber !== page && onPageChange(page as number)}
                            disabled={pageNumber === page || loading}
                            className={`min-w-[40px] text-center px-3 py-2 rounded transition
                                ${pageNumber === page
                                    ? "bg-slate-900 text-white cursor-default shadow-inner"
                                    : "bg-slate-200 hover:bg-slate-300"}
                            `}
                        >
                            {page}
                        </Button>
                    );
                })}

                {/* NEXT */}
                {hasNextPage && (
                    <Button
                        onClick={() => onPageChange(nextPageNumber)}
                        disabled={loading}
                    >
                        Next
                    </Button>
                )}
            </div>
        </div>
    );
}

export default PaginatedTable;