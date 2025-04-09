"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import CustomCheckbox from "../../check-box";
import BackdropLoader from "../../backdrop-loader";

interface IAdvanceTable {
  isPagination?: boolean;
  tableColumns?: string[];
  tableBody?: React.ReactNode;
  size?: "small" | "small";
  count?: number;
  rowsPerPage?: number;
  page?: number;
  handleChangePage?: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    page: number
  ) => void;
  handleChangeRowsPerPage?: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  >;
  handleSortChange?: (column: string, order: "asc" | "desc") => void; // Add this prop
  onSelectAllClick?: any;
  checkedData?: number[];
  tableLoading?: boolean;
}

const AdvanceTable = ({
  isPagination = false,
  tableColumns,
  tableBody,
  size,
  count = 0,
  rowsPerPage = 10,
  page = 0,
  handleChangePage = () => {},
  handleChangeRowsPerPage = () => {},
  handleSortChange = () => {},
  onSelectAllClick,
  checkedData = [],
  tableLoading,
}: IAdvanceTable) => {
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>("");
  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === "asc";
    const newOrder = isAsc ? "desc" : "asc";
    setOrder(newOrder);
    setOrderBy(property);
    handleSortChange(property, newOrder); // Pass sorting data to the parent
  };

  return (
    <>
      {tableLoading && <BackdropLoader />}

      <TableContainer
        sx={{
          overflowX: "auto",
          "&::-webkit-scrollbar": {
            height: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#4F131F",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f4f4f4",
          },
        }}
      >
        <Table size={size || "small"} sx={{ minWidth: 650 }}>
          {/* ******
           *********************Table head************************* */}
          <TableHead
            sx={{
              background: "#4F131F",
              borderRadius: "10px",
            }}
          >
            <TableRow>
              <TableCell padding="none" sx={{ px: 2 }} align="left">
                <CustomCheckbox
                  checkStyles={{
                    "& .MuiSvgIcon-root": {
                      fill: "#fff !important",
                    },
                    "& .MuiTypography-body1": {
                      fontWeight: "600 !important",
                      color: "#fff !important",
                    },
                  }}
                  checked={
                    Array.isArray(checkedData) && checkedData.length
                      ? true
                      : false
                  }
                  onChange={onSelectAllClick}
                />
              </TableCell>
              {tableColumns?.map((column: string, index: number) => (
                <TableCell
                  key={index}
                  padding={"none"}
                  sx={{ px: 2 }}
                  align="left"
                >
                  <TableSortLabel
                    active={orderBy === column}
                    direction={orderBy === column ? order : "asc"}
                    onClick={() => handleRequestSort(column)}
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fill: "#fff",
                      },
                    }}
                  >
                    <Typography
                      component={"p"}
                      sx={{
                        textWrap: "nowrap",
                        color: "#fff",
                        fontWeight: 600,
                      }}
                    >
                      {column}
                    </Typography>
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          {/* ***************************Table body************************* */}
          <TableBody>{tableBody}</TableBody>

          {/* ***************************Table data not found************************* */}
          {+count === 0 ? (
            <TableBody>
              <TableRow>
                <TableCell align="center" colSpan={tableColumns?.length || 5}>
                  Result not found
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            ""
          )}
          {/* *******************************Table footer************************* */}
        </Table>
      </TableContainer>
      {isPagination && (
        <TablePagination
          rowsPerPageOptions={[10, 15, 20]}
          className="pagination"
          component="div"
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            overflowX: "hidden",
            m: 0,
            p: 0,
            "& .MuiTablePagination-selectLabel": {
              color: "#4F131F",
            },
            "& .MuiInputBase-root": {
              color: "#4F131F",
              mx: { xs: 0, sm: 3 },
            },
            "& .MuiTablePagination-displayedRows": {
              color: "#4F131F",
            },
            "& .MuiToolbar-root": {
              p: 0,
              m: 0,
            },
            "& .MuiTablePagination-actions": {
              ml: { xs: 0, sm: 2.5 },
            },
          }}
        />
      )}
    </>
  );
};

export default AdvanceTable;
