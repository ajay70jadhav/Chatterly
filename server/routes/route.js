import express from "express";

import { addUser, getUsers } from "../controller/user-controller.js";
const route = express.Router();

route.post("/add", addUser); //when "/add" will call then addUser function will can which is in user-controller.js
route.get("/users", getUsers);
export default route;
