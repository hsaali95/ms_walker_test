import React from "react";
import TableCellWithText from "../../components/tables/medium-table/table-cell-with-text";

interface IGroupDataRaw {
  data: any;
}

const TeamDataRaw: React.FC<IGroupDataRaw> = ({ data }) => {
  return (
    <>
      <TableCellWithText text={data?.name} />
      <TableCellWithText text={data?.team_managers[0]?.user?.name} />
      <TableCellWithText text={data?.team_members?.length} />
      <TableCellWithText
        text={`${data?.is_active ? "active" : "inactive"}`}
      />
    </>
  );
};

export default TeamDataRaw;
