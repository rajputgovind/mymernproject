const mongoose =require('mongoose')
const jwt = require('jsonwebtoken')

const employeeSchema = new mongoose.Schema({
    fname:{type:String,required:true },
    email:{type:String ,required:true},
    phone:{type:String ,required:true},
    age:{type:Number,required:true},
    gender:{type:String,required:true},
    password:{type:String , required:true},
    image:{type:String },
    tokens:[{
        token:{type:String,required:true}
    }]


})

    employeeSchema.methods.generateAuthToken = async function(){
        try {
            const token = await jwt.sign({employeeId:this._id}, process.env.SECRET_KEY)
            // console.log(token)
            this.tokens = this.tokens.concat({token:token}) 
            await this.save()

            return token;

        } catch (error) {
            console.log("error in generating error", error)
        }
    }
    


 const EmployeeModel = new mongoose.model('EmployeeData',employeeSchema);
 module.exports = EmployeeModel