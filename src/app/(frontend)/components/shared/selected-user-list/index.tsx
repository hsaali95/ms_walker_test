import { Box, Typography } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import ActionButton from "../../action-buttons";

interface User {
  id: string;
  name: string;
  email: string;
}

interface UsersListProps {
  title?: string;
  users: User[];
  onDelete: (id: string | number) => void;
}

const UsersList: React.FC<UsersListProps> = ({
  title = "Users List",
  users,
  onDelete,
}) => {
  return (
    <Box>
      <Typography
        component="h6"
        variant="h6"
        sx={{ fontSize: "0.8rem", fontWeight: 600, mb: 1 }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          maxHeight: "100px",
          overflowY: "auto",
          overflowX: "hidden",
          mb: 1,
        }}
      >
        {users.map((user) => (
          <Box
            key={user.id}
            sx={{ display: "flex", justifyContent: "space-between", mb: 0.9 }}
          >
            <Typography
              sx={{ color: "#4F131F", fontSize: "0.8rem", fontWeight: 600 }}
            >
              <Box component="span">{user?.name}</Box>
              <Box component="span" sx={{ ml: 1 }}>
                ({user.email})
              </Box>
            </Typography>
            <ActionButton
              onClick={() => onDelete(user.id)}
              icon={<ClearIcon />}
              isIconButton
              sx={{
                color: "#4F131F",
                "& .MuiSvgIcon-root": { fontSize: "1rem" },
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default UsersList;
