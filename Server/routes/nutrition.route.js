import { Router } from 'express'
import { getFoodDetail } from '../controller/nutrition.controller.js'


const nutritionRouter = Router()


nutritionRouter.post('/getfooddetail', getFoodDetail)



export default nutritionRouter