require('dotenv').config()
const express=require('express')
const  cors=require('cors')
const{sequelize}=require('./models')

const helmet=require('helmet')
const app=express()
const{swaggerSpec,swaggerUi}  = require('./swagger');

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: false
}))
//app.use(helmet())

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders(res) {
    res.set('X-Content-Type-Options','nosniff');
    res.set('Content-Security-Policy', "default-src 'none';");
  }
}));

const authRoutes=require('./routes/auth.route')
const adminRoutes=require('./routes/admins.route')
const officeRoutes=require('./routes/offices.route')
const subOfficeRoutes=require('./routes/subOffices.route')
const cycleRoutes=require('./routes/cycles.route')
const vacancyRoutes=require('./routes/vacancies.route')


const internRoutes=require('./routes/interns.route')
const documentRoutes=require('./routes/documents.route')
const applicationRoutes=require('./routes/applications.route')
const preferenceRoutes=require('./routes/preferences.route')



const noticeRoutes=require('./routes/notices.route')
//const analyticsRoutes = require('./routes/analytics.route')

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use('/api/auth',authRoutes)
app.use('/api/admin',adminRoutes)
app.use('/api/office',officeRoutes)
app.use('/api/sub-office',subOfficeRoutes)
app.use('/api/cycles',cycleRoutes)
app.use('/api/vacancies',vacancyRoutes)

app.use('/api/intern',internRoutes)
app.use('/api/document',documentRoutes)
app.use('/api/application',applicationRoutes)
app.use('/api/preferences',preferenceRoutes)



app.use('/api/notice',noticeRoutes)
//app.use('/api/analytics', analyticsRoutes)



app.get('/api/health',(req,res)=>{
    res.json({status:'UP',timestamp:new Date()})
})

const PORT=process.env.PORT

sequelize.authenticate().then(()=>{
    console.log('Connected to the database for MOSPI NISD')
    app.listen(PORT,()=>{
    console.log('MOSPI NISD Server started at port:',PORT)
})
}).catch((err)=>{
    console.log('Failed to connect database for MOSPI NISD')
})


module.exports=app



