import mongoose from "mongoose"
import { Student } from "../models/student.model.js"
import { ApiError } from "../utlis/ApiError.js"


const register = async (req, res, next) => {
    const { name, rollno, batch } = req.body

    if ([name, rollno, batch].some(item => item.trim() == "")) {
        return next(new ApiError(400, "All fields are required"))
    }

    const exitsRollno = await Student.findOne({ rollno })

    if (exitsRollno) {
        return next(new ApiError(400, "This Student is Already Created"))
    }
    const student = await Student.create({ name, rollno, batch, department: req.user.department })

    if (!student) {
        return next(new ApiError(400, "Error while creating student"))
    }

    res.status(201).json({ message: "Student Registered Successfully", student })
}


const getStudents = async (req, res, next) => {
    const students = await Student.find({ department: req.user.department })

    if (!students) {
        return next(new ApiError(404, "No Students Found"))
    }

    res.status(200).json({ success: true, message: "successfully get all students", students })
}


const getStudentByBatch = async (req, res, next) => {
    const { batch } = req.params
    const students = await Student.find({ $and: [{ department: req?.user.department }, { batch }] })

    if (!students) {
        return next(new ApiError(404, "No Students Found"))
    }

    res.status(200).json({ success: true, message: "successfully get students by batch ", students })
}

const getStudentByRollno = async (req, res, next) => {
    const { rollno } = req.params
    const students = await Student.find({ $and: [{ department: req?.user.department }, { rollno }] })

    if (!students) {
        return next(new ApiError(404, "No Student Found"))
    }

    res.status(200).json({ success: true, message: "successfully get student by rollno ", students })
}

const deleteStudent = async (req, res, next) => {
    try {
        const { studentId } = req.params

        const student = await Student.findOne({ _id: studentId })

        if (!student) {
            return next(new ApiError(404, "student not found with this id"))
        }

        const delStudent = await Student.deleteOne({ _id: student._id })

        res.status(200).json({ success: true, message: "successfully delete student" })
    } catch (error) {
        next(error)
    }
}


const updateStudent = async (req, res, next) => {
    const { name, rollno, batch } = req.body

    try {
        const { studentId } = req.params

        const student = await Student.findOne({ _id: studentId })

        if (!student) {
            return next(new ApiError(404, "student not found with this id"))
        }

        student.name = name || student.name
        student.rollno = rollno || student.rollno
        student.batch = batch || student.batch

        await student.save()

        res.status(200).json({ success: true, message: "successfully update student" })
    } catch (error) {
        next(error)
    }
}


const getStudentProfile = async (req, res, next) => {
    const { studentId } = req.params

    try {
        const student = await Student.aggregate(
            [
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(studentId)
                    }
                },
                {
                    $lookup: {
                        from: "fees",
                        localField: "_id",
                        foreignField: "student",
                        as: "fees"
                    }
                }
            ]
        )


        res.status(200).json({ success: true, message: "successfully get student profile",student })
    } catch (error) {
        next(error)
    }
}


const getStudentProfileByRollno = async (req, res, next) => {
    const { rollno } = req.params

    try {
        const student = await Student.aggregate(
            [
                {
                    $match: {
                        rollno:rollno
                    }
                },
                {
                    $lookup: {
                        from: "fees",
                        localField: "_id",
                        foreignField: "student",
                        as: "fees"
                    }
                }
            ]
        )


        res.status(200).json({ success: true, message: "successfully get student profile ",student })
    } catch (error) {
        next(error)
    }
}
export {
    getStudents,
    register,
    getStudentByBatch,
    getStudentByRollno,
    deleteStudent,
    updateStudent,
    getStudentProfile,
    getStudentProfileByRollno
}