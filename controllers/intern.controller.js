exports.createProfile=async(req,res)=>{
    const user_id=req.user.user_id
    const{
      //
    }=req.body
    try{
        //
    }catch(err){
        console.log(err)
        res.status(500).json({message:'Internal Server error'})
    }
}