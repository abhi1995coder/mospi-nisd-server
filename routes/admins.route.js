const express=require('express')
const router=express.Router()
const adminController=require('../controllers/admin.controller')
const{authMiddleware,roleCheck}=require('../middlewares/auth.middleware')

router.post('/create',authMiddleware,roleCheck('super_admin'),adminController.createAdmin)
router.put('/:user_id',authMiddleware,roleCheck('super_admin'),adminController.editAdmin)
router.patch('/:user_id/disable',authMiddleware,roleCheck('super_admin'),adminController.disableAdmin)
router.get('/list',authMiddleware,roleCheck('super_admin'),adminController.getAllAdmins)


module.exports=router