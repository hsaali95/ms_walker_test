import { Typography } from "@mui/material";

interface ITableHeading {
  title: string;
  tableHeadingStyle?: any;
}

const TableHeading = (props: ITableHeading) => {
  return (
    <Typography
      component="h4"
      variant="h4"
      sx={{
        fontWeight: 700,
        color: "#4F131F",
        fontSize: { xs: "1.5rem", sm: "2.125rem" },
        mb: { xs: 1, sm: 2, xl: 3 },
        ...props.tableHeadingStyle,
      }}
    >
      {props.title}
    </Typography>
  );
};

export default TableHeading;
