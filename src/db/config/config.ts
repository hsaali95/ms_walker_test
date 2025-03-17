import { Sequelize } from "sequelize";
import pg from "pg";

const sequelize = new Sequelize(
  process.env.POSTGRESQL_CONNECTION_STRING || "",
  {
    logging: true,
    dialect: "postgres" /* 'postgres' */,
    dialectModule: pg,
    schema: "public",
    pool: {
      max: 2,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

sequelize
  .authenticate()
  .then(() => console.log("Connection has been established successfully."))
  .catch((error) =>
    console.error("Unable to connect to the database: ", error)
  );

export default sequelize;
