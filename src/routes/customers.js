import express from 'express'
import CustomerController from '../controllers/customers.js'
import Auth from '../common/auth.js'

const router = express.Router()

router.post('/signup',CustomerController.signup)
router.post('/create',Auth.validate,Auth.adminGaurd,CustomerController.create)
router.post('/login',CustomerController.login)
router.get('/getcustomers',Auth.validate,Auth.adminGaurd,CustomerController.getAllCustomers)
router.get('/getcustomer/:id',Auth.validate, Auth.adminGaurd,CustomerController.getCustomerById)
router.put('/editcustomer/:id',Auth.validate,Auth.adminGaurd, CustomerController.editCustomer)
router.delete('/deletecustomer/:id', Auth.validate,Auth.adminGaurd,CustomerController.deleteCustomerById);

export default router