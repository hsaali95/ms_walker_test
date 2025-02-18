import React from "react";
import TableCellWithText from "../../components/tables/medium-table/table-cell-with-text";

interface IGroupDataRaw {
  data: any;
}

const GroupDataRaw: React.FC<IGroupDataRaw> = ({ data }) => {
  return (
    <>
      <TableCellWithText text={data?.name} />
      <TableCellWithText text={data?.access_type?.name} />
      <TableCellWithText text={data?.group_members?.length} />
      <TableCellWithText text={`${data?.is_active}`} />
    </>
  );
};

export default GroupDataRaw;
