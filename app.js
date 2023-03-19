
const express = require('express')
require('dotenv').config()
const hbs = require('hbs')
const path = require('path');
const multer = require('multer')
const { StatusCodes } =require('http-status-codes')
const dbConnenction = require('./src/configs/DbConfig');
const EmployeeModel = require('./src/models/EmployeeModel.js');
// const EmployeeRouter  = require('./src/routers/EmployeeRouter');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = express();

app.use(express.urlencoded({ extended: false }))
const viewPath = path.join(__dirname, "/templets/views")
const partialPath = path.join(__dirname, "/templets/partials")
hbs.registerPartials(partialPath)
// app.use(EmployeeRouter)
app.set("view engine", "hbs")
app.set("views", viewPath)
const imagePath = path.join(__dirname, '/public/uploads')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, imagePath)
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}--${file.originalname}`)
    }
})

const upload = multer({ storage: storage })


app.get("/", (req, res) => {
    res.render('index.hbs')
})


app.post("/registration", upload.single("image"), async (req, res) => {
    try {
        const encryptedPassword = await bcrypt.hashSync(req.body.password, 12)
        req.body['password'] = encryptedPassword
        const {fname,email,phone,age,gender,password,image} =req.body

        // const employee = new EmployeeModel({
        //     fname: req.body.fname,
        //     email: req.body.email,
        //     phone: req.body.phone,
        //     age: req.body.age,
        //     gender: req.body.gender,
        //     password: req.body.password,
        //     image: req.file.filename

        // })
        const employee = new EmployeeModel({fname,email,phone,age,gender,password,image})
        // console.log( "first " , employee)

        const token = await employee.generateAuthToken();
        // console.log(token)
        const savedEmployee = await employee.save();
        
        // console.log("second ", savedEmployee)
        res.status(StatusCodes.CREATED).render("login.hbs")
        // res.status(201).json(savedEmployee)

    } catch (error) {
        console.log(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "error in registation " })
    }
})
app.get("/registration", (req, res) => {
    res.render("registration.hbs")
})


app.post('/login', async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password
        const employee = await EmployeeModel.findOne({ email: email })
        const isPassword = await bcrypt.compareSync(password,employee.password) 

        if(employee){
            if(isPassword){
                const token =await employee.generateAuthToken();
                // console.log("login token is ",token)
                // res.status(StatusCodes.CREATED).json({token:token})
                res.status(StatusCodes.OK).render("index.hbs")
            }
            else{
                res.status(StatusCodes.BAD_REQUEST).json({message:"password is invalid"})
            }
        }
        else{
            res.status(StatusCodes.BAD_REQUEST).json({message:"Email is Invalid"})
        }


        // yadi password bcrypted nahi ho to normal  compare code
        // console.log(employee.password)
        // if (employee) {
            
        //     if (password === employee.password) {
        //        res.status(201).render("index.hbs")
        //     }
        //     else {
        //         res.status(404).json({ message: "Incorrect password" })
        //     }

        // } else {
        //     res.status(404).json({ message: "Incorrect email" })
        // }


    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }

})
app.get('/login', (req, res) => {
    res.render("login.hbs")
})

app.listen(3000, () => {
    console.log(`server is listning on port ${process.env.SERVER_PORT}`)
    dbConnenction()
})