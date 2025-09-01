import express from "express";
import { CreateSos, getNearbySos, UpdateSos } from "../services/SosServices.js";
export const sosRoutes = express.Router();

sosRoutes.post("/create/sos", CreateSos);
sosRoutes.put("/update/sos", UpdateSos);
sosRoutes.get("/fetch/nearby/sos", getNearbySos)