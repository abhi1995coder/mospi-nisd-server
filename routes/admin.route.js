const express=require('express')
const router=express.Router()
const adminController=require('../controllers/admin.controller')
const{authMiddleware,roleCheck}=require('../middlewares/auth.middleware')

router.post('/create',authMiddleware,roleCheck('superadmin'),adminController.createAdmin)
router.put('/:user_id',authMiddleware,roleCheck('superadmin'),adminController.editAdmin)
router.patch('/:user_id/disable',authMiddleware,roleCheck('superadmin'),adminController.disableAdmin)
router.get('/list',authMiddleware,roleCheck('superadmin'),adminController.getAllAdmins)


module.exports=router