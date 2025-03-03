import React from "react";
import TableCellWithText from "../../components/tables/basic-table/table-cell-with-text";
import { helper } from "@/utils/helper";

interface ActivityDataRowProps {
  data: any;
}

const ActivityDataRow: React.FC<ActivityDataRowProps> = ({ data }) => {
  return (
    <>
      <TableCellWithText text={data?.id} />
      <TableCellWithText text={data?.merch_rep_id} />
      <TableCellWithText text={helper.formatDate(data?.date)} />
      <TableCellWithText text={helper.formatTime(data?.start_time)} />
      <TableCellWithText text={helper.formatTime(data?.end_time)} />
      <TableCellWithText text={data?.activity_account?.customerName} />
      <TableCellWithText text={data?.activity_account?.city} />
      <TableCellWithText text={data?.activity_log} />
      <TableCellWithText text={data?.is_complete ? "Yes" : "No"} />
      <TableCellWithText text={data?.notes} />
      <TableCellWithText text={"null"} />
    </>
  );
};

export default ActivityDataRow;
