
import { app } from "./app.js";
import { dbConnection } from "./config/dbConnection.js";
import {errorMiddleware} from "./middleware/errorMiddleware.js"
import { PORT } from "./config/env.js";
app.get("/",(req,res)=>{
    res.json({success:true,message:"successfully project is running"})
})

app.use(errorMiddleware)
dbConnection().then(res=>{
    app.listen(PORT,()=>{
        console.log("Server is running on PORT :",PORT)
    })
}).catch(err=>{
    console.log("Error Occur while connecting to database")
})
