import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";

interface IBasicTable {
  tableColumns: string[];
  tableBody?: React.ReactNode;
  size?: "small" | "small";
}

const BasicTable = ({ tableColumns, tableBody, size }: IBasicTable) => {
  return (
    <>
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
            }}
          >
            <TableRow>
              {tableColumns?.map((data: string, index: number) => (
                <TableCell key={index} padding={"normal"}>
                  <Typography
                    component={"p"}
                    sx={{
                      textWrap: "nowrap",
                      color: "#fff",
                      fontWeight: 600,
                    }}
                  >
                    {data}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          {/* ***************************Table body************************* */}
          <TableBody>{tableBody}</TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default BasicTable;
