import { Department } from "../models/department.model.js";
import {ApiError} from "../utlis/ApiError.js"


const register=async(req,res,next)=>{
    const {name,code}=req.body;


    if([name,code].some(item=>item.trim()=="")){
        return next(new ApiError(400,"All fields are required"))
    
    }

    const exitsCode=await Department.findOne({code})

    if(exitsCode){
        return next(new ApiError(400,"This Department is Already Created"))
    }

    const department= await Department.create({name,code})

    if(!department){
        return next(new ApiError(400,"This Department is Already Created"))
    }


    res.status(201).json({message:"Department Created Successfully",department})

}


const getDepartments=async(req,res,next)=>{
    const departments=await Department.find()

    if(!departments){
        return next(new ApiError(404,"No Department Found"))
    }

    res.status(200).json({success:true,message:"Departments retrieved successfully",departments})
}
export {register,getDepartments}