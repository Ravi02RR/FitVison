import { Router } from "express";
import config from "../config/congif.js";

const v2EmbededLinkRouter = Router()

v2EmbededLinkRouter.get('/', (req, res) => {
    res.status(200).json({
        data: config.EmbadedLink.uri
    })

})






export default v2EmbededLinkRouter