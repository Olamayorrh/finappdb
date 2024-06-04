const express =require("express");
const userRoute = express.Router();

const {createUser,createAccount,makeCredit,makeDeposit,generateAcctStatement,transactHistory,users,updateUser,deleteUser} = require("../controllers/userController");

userRoute.post("/createuser",createUser);
userRoute.get("/users",users);
userRoute.put("/updateUser/:email",updateUser);
userRoute.delete("/deleteUser/:email",deleteUser);
userRoute.post("/createAccount/",createAccount);
userRoute.post("/credit/:accountNumber",makeCredit);
userRoute.post("/deposit/:accountNumber",makeDeposit);
userRoute.get("/account/transactHistory/:id",transactHistory);
userRoute.get("/account/statement/:id",generateAcctStatement);



module.exports = userRoute;

