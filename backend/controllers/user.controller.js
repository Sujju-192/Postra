import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = ((req, res) => {
    res.status(200).json({
        message: "Ok"
    })

    // res.send("Hey u reached finally")
})  

export {registerUser}