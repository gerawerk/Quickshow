import express from "express";
import { addShow, getNowplayingMovies, getShow, getShows } from "../controllers/showController.js";
import { protectAdmin } from "../middlewares/auth.js";

const showRouter = express.Router();

showRouter.get('/now-playing', protectAdmin, getNowplayingMovies );
showRouter.post('/add', protectAdmin,addShow)
showRouter.get('/all',getShows)
showRouter.get('/:movieId',getShow)

export default showRouter;