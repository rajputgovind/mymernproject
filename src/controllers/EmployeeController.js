// const EmployeeModel = require("../models/EmployeeModel.js")


//  async function saveEmployee(req,res){
//     try {
//         const employee = new EmployeeModel({
//             fname:req.body.name,
//             email:req.body.email,
//             phone:req.body.phone,
//             age:req.body.age,
//             email:req.body.image,
//         }) 
        
//         const savedEmployee = await employee.save();
//         res.status(201).json(savedEmployee)

//     } catch (error) {
//         console.log(error)
//         res.status(500).json({message:"error in registation "})
//     }
// }


// module.exports = saveEmployee