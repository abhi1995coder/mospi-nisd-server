require('dotenv').config()
const express=require('express')
const  cors=require('cors')
const{sequelize}=require('./models')
const helmet=require('helmet')
const app=express()


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}))
app.use(helmet())

const authRoutes=require('./routes/auth.route')
const adminRoutes=require('./routes/admin.route')

app.use('/api/auth',authRoutes)
app.use('/api/admin',adminRoutes)

app.get('/api/health',(req,res)=>{
    res.json({staus:'UP',timestamp:new Date()})
})

const PORT=process.env.PORT

sequelize.authenticate().then(()=>{
    console.log('Connected to the database for MOSPI NISD')
    app.listen(PORT,()=>{
    console.log('MOSPI NISD Server started at port:'+PORT)
})
}).catch((err)=>{
    console.log('Failed to connect database for MOSPI NISD')
})

module.exports=app
