import React, { useEffect, useState } from "react";
import TableCellWithText from "../../components/tables/medium-table/table-cell-with-text";
import EditGroupModal from "./edit-group-form";
import BasicModal from "../../components/modal/basic-modal";
import { deleteGroup } from "../../redux/slices/group/delete-group-slice";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hook";
import { API_STATUS } from "@/utils/enums";

interface IGroupDataRaw {
  data: any;
}

const GroupDataRaw: React.FC<IGroupDataRaw> = ({ data }) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [groupData, setGroupData] = useState<any>({});
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [groupId, setId] = useState<number>(0);
  const dispatch = useAppDispatch();
  const { status: GROUP_STATUS } = useAppSelector((state) => state.deleteGroup);
  const closeDeleteModal = () => {
    setDeleteModal(false);
  };
  useEffect(() => {
    if (GROUP_STATUS === API_STATUS.SUCCEEDED) {
      setDeleteModal(false);
    }
  }, [GROUP_STATUS]);
  return (
    <>
      <TableCellWithText text={data?.name} />
      <TableCellWithText text={data?.access_type?.name} />
      <TableCellWithText text={data?.group_members?.length} />
      <TableCellWithText text={`${data?.is_active ? "active" : "inactive"}`} />
      <TableCellWithText
        isEditButton
        isDeleteButton
        onEdit={() => {
          setOpenModal(true);
          setGroupData(data);
        }}
        onDelete={() => {
          setDeleteModal(true);
          setId(data.id);
        }}
      />
      <EditGroupModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        groupData={groupData}
      />
      <BasicModal
        open={deleteModal}
        cancelModal={closeDeleteModal}
        isDialogActions
        deleteLoading={API_STATUS.PENDING === GROUP_STATUS}
        onDelete={() =>
          dispatch(
            deleteGroup({
              id: groupId,
            })
          )
        }
        modalMessage={"Are you sure you want delete this group?"}
      />
    </>
  );
};

export default GroupDataRaw;
