import express from "express";
import { addUser,  findUser, updateUser, fetchUser } from "../services/UserServices.js";
import { fetchNearByUsers, loginUser, logoutUser, updateLocation } from "../controller/userController.js";

export const userRoutes = express.Router();

userRoutes.post("/add",addUser);
userRoutes.get("/get/user", fetchUser);
userRoutes.get("/find/user", findUser);
userRoutes.put('/update/user/:id', updateUser);
// userRoutes.delete('/delete/:id',);
userRoutes.put('/update/locations/:id',updateLocation);
userRoutes.post("/fetch/nearBy/users", fetchNearByUsers)
userRoutes.post("/login",loginUser);
userRoutes.post("/user/logout",logoutUser);