const express=require('express')
const  cors=require('cors')
const{sequelize}=require('./models')
require('dotenv').config()
const app=express()

const authRoutes=require('./routes/auth.route')
app.use(express.json())

app.use('/api/auth',authRoutes)

const PORT=process.env.PORT

sequelize.authenticate().then(()=>{
    console.log('Connected to database')
    app.listen(PORT,()=>{
    console.log('Server started at port:'+PORT)
})
}).catch((err)=>{
    console.log('Failed to connect database')
})

