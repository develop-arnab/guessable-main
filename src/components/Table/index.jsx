/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import { useTable, usePagination } from "react-table";
import { MdOutlineSkipNext, MdOutlineSkipPrevious } from "react-icons/md";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "antd";

const PaginatedTable = ({
  columns,
  data,
  totalDocuments,
  setQuery,
  query,
  route,
  isLoading,
  pagination,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
      manualPagination: true,
      pageCount: Math.ceil(totalDocuments / query?.limit),
    },
    usePagination,
  );
  const navigate = useNavigate();

  const handleNextPage = () => {
    nextPage();
    setQuery({ ...query, page: (currentPage) => currentPage + 1 });
  };

  const handlePreviousPage = () => {
    previousPage();
    setQuery({ ...query, page: (currentPage) => currentPage - 1 });
  };

  const from = pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, data.length);

  useEffect(() => {
    setQuery({ ...query, page: pageIndex + 1 });
  }, [setQuery, pageIndex]);

  const renderSkeleton = () => {
    // Adjust the number of skeleton rows as per your need
    const skeletonRows = new Array(10).fill(null);

    return skeletonRows.map((_, rowIndex) => (
      <tr key={rowIndex}>
        {columns.map((_, colIndex) => (
          <td
            key={colIndex}
            className="px-4 py-2 border-b border-r border-gray-300 text-center"
          >
            <Skeleton.Input
              // style={{ width: "100%" }}
              active={true}
              size="small"
            />
          </td>
        ))}
      </tr>
    ));
  };
  return (
    <>
      <div className="overflow-auto">
        <table
          className="min-w-full border-collapse border"
          {...getTableProps()}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps()}
                    className="px-4 py-2 border-b border-r border-gray-300 bg-gray1 text-center text-sm font-semibold text-gray-900 tracking-normal"
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          {isLoading ? (
            renderSkeleton()
          ) : (
            <tbody {...getTableBodyProps()}>
              {page.map((row, i) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    className={`${i % 2 === 0 ? "bg-gray2" : "bg-white"}`}
                  >
                    {row.cells.map((cell) => {
                      return (
                        <td
                          {...cell.getCellProps()}
                          className={`px-4 py-2 border-b border-r border-gray-300 text-center ${
                            route && "cursor-pointer"
                          } `}
                          onClick={() => {
                            if (route) {
                              navigate(`${route}${cell?.row?.original?._id}`);
                            }
                          }}
                        >
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
      </div>
      {pagination && (
        <div className="flex justify-end items-center py-3 gap-3">
          <div>Rows per pages</div>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setQuery({ ...query, limit: Number(e.target.value) });
            }}
          >
            {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
          <div>{`${from} - ${to} `}</div>
          <div>{totalDocuments}</div>
          <div className="flex gap-4">
            <button onClick={handlePreviousPage} disabled={!canPreviousPage}>
              <MdOutlineSkipPrevious
                className={`text-xl ${
                  !canPreviousPage ? "text-gray-500" : "text-gray-950"
                }`}
              />
            </button>
            <button onClick={handleNextPage} disabled={!canNextPage}>
              <MdOutlineSkipNext
                className={`text-xl ${
                  !canNextPage ? "text-gray-500" : "text-gray-950"
                }`}
              />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PaginatedTable;
