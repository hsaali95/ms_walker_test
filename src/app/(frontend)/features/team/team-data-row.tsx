import React, { useEffect, useState } from "react";
import TableCellWithText from "../../components/tables/medium-table/table-cell-with-text";
import EditTeamModal from "./edit-team-form";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hook";
import { API_STATUS, ROLE } from "@/utils/enums";
import BasicModal from "../../components/modal/basic-modal";
import { deleteTeam } from "../../redux/slices/team/delete-team-slice";
import { userContext } from "../../sections/layout/dashboard";

interface IGroupDataRaw {
  data: any;
}

const TeamDataRaw: React.FC<IGroupDataRaw> = ({ data }) => {
  const { userData } = userContext();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [teamData, setTeamData] = useState<any>({});
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [teamId, setId] = useState<number>(0);
  const dispatch = useAppDispatch();

  const { status: TEAM_STATUS } = useAppSelector(
    (state) => state.getDeleteTeam
  );
  const closeDeleteModal = () => {
    setDeleteModal(false);
  };
  useEffect(() => {
    if (TEAM_STATUS === API_STATUS.SUCCEEDED) {
      setDeleteModal(false);
    }
  }, [TEAM_STATUS]);

  //hide deleted button for the manager
  const isDeleteButton = userData?.role_id != ROLE.MANAGER;

  return (
    <>
      <TableCellWithText text={data?.name} />
      <TableCellWithText text={data?.team_managers[0]?.user?.name} />
      <TableCellWithText text={data?.team_members?.length} />
      <TableCellWithText text={`${data?.is_active ? "active" : "inactive"}`} />
      <TableCellWithText
        isEditButton
        isDeleteButton={isDeleteButton}
        onEdit={() => {
          setOpenModal(true);
          setTeamData(data);
        }}
        onDelete={() => {
          setDeleteModal(true);
          setId(data.id);
        }}
      />
      <EditTeamModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        teamData={teamData}
      />
      <BasicModal
        open={deleteModal}
        cancelModal={closeDeleteModal}
        isDialogActions
        deleteLoading={API_STATUS.PENDING === TEAM_STATUS}
        onDelete={() =>
          dispatch(
            deleteTeam({
              id: teamId,
            })
          )
        }
        modalMessage={"Are you sure you want to delete this team?"}
      />
    </>
  );
};

export default TeamDataRaw;
