import { Student } from "../models/student.model.js"


const register=async (req,res,next) => {
    const {name,rollno,batch}=req.body
    
    if([name,rollno,batch].some(item=>item.trim()=="")){
        return next(new ApiError(400,"All fields are required"))
    }
    
    const exitsRollno=await Student.findOne({rollno})
    
    if(exitsRollno){
        return next(new ApiError(400,"This Student is Already Created"))
    }
    const student=await Student.create({name,rollno,batch,department:req.user.department})
    
    if(!student){
        return next(new ApiError(400,"Error while creating student"))
    }

    res.status(201).json({message:"Student Registered Successfully",student})
}


const getStudents=async(req,res,next)=>{
    const students=await Student.find({department:req.user.department})
    
    if(!students){
        return next(new ApiError(404,"No Students Found"))
    }
    
    res.status(200).json({success:true,message:"successfully get all students",students})
}


const getStudentByBatch=async(req,res,next)=>{
    const {batch} = req.params
    const students=await Student.find({$and:[{department:req?.user.department},{batch}]})
    
    if(!students){
        return next(new ApiError(404,"No Students Found"))
    }
    
    res.status(200).json({success:true,message:"successfully get students by batch ",students})
}

const getStudentByRollno=async(req,res,next)=>{
    const {rollno} = req.params
    const students=await Student.find({$and:[{department:req?.user.department},{rollno}]})
    
    if(!students){
        return next(new ApiError(404,"No Student Found"))
    }
    
    res.status(200).json({success:true,message:"successfully get student by rollno ",students})
}


export {getStudents,register,getStudentByBatch,getStudentByRollno}