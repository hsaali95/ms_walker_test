"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
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

const MediumTable = ({
  isPagination = false,
  tableColumns,
  tableBody,
  size,
  count = 0,
  rowsPerPage = 10,
  page = 0,
  handleChangePage = () => {},
  handleChangeRowsPerPage = () => {},
  tableLoading,
}: IAdvanceTable) => {
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
              {tableColumns?.map((column: string, index: number) => (
                <TableCell
                  key={index}
                  padding={"none"}
                  sx={{ px: 2, py: 1, color: "#fff", fontWeight: 600 }}
                  align="left"
                >
                  <Typography component={"p"} sx={{ textWrap: "nowrap" }}>
                    {column}
                  </Typography>
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

export default MediumTable;
