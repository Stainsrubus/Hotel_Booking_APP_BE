import customerModel from '../models/customers.js'
import Auth from '../common/auth.js'

const create = async (req, res) => {
    try {
        const { email, password, name, mobile, gender } = req.body;

        let customer = await customerModel.findOne({ email });

        if (!customer) {
            const hashedPassword = await Auth.hashPassword(password);
            await customerModel.create({ email, password: hashedPassword, name, mobile, gender });

            return res.status(201).send({ message: "Customer created successfully" });
        } else {
            return res.status(400).send({ message: `Customer with email ${email} already exists` });
        }
    } catch (error) {
        console.error("Error creating customer:", error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};
const signup = async(req,res)=>{
    try {
        let customer = await customerModel.findOne({email:req.body.email})
        if(!customer){
            req.body.password = await Auth.hashPassword(req.body.password)
            await customerModel.create({...req.body})
            res.status(201).send({
                message:"customer Created Successfully"
             })
        }
        else
        {
            res.status(400).send({message:`customer with ${req.body.email} already exists`})
        }
    } catch (error) {
        res.status(500).send({
            message:"Internal Server Error",
            error:error.message
        })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        let customer = await customerModel.findOne({ email });

        if (customer) {
            const isPasswordValid = await Auth.hashCompare(password, customer.password);

            if (isPasswordValid) {
                const token = await Auth.createToken({
                    id: customer._id,
                    name: customer.name,
                    email: customer.email,
                    role: customer.role
                });

                const customerData = await customerModel.findOne({ email }, { _id: 0, password: 0, status: 0, createdAt: 0, email: 0 });

                return res.status(200).send({ message: "Login Successful", token, customerData });
            } else {
                return res.status(400).send({ message: "Invalid Password" });
            }
        } else {
            return res.status(400).send({ message: `Account with email ${email} does not exist` });
        }
    } catch (error) {
        console.error("Error logging in:", error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};

const getAllCustomers = async (req, res) => {
    try {
        const customers = await customerModel.find({}, { password: 0, status: 0, createdAt: 0 });

        return res.status(200).send({ message: "Customers retrieved successfully", customers });
    } catch (error) {
        console.error("Error retrieving customers:", error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};

const editCustomer = async (req, res) => {
    try {
        const customerId = req.params.id;
        const { name, email, mobile, membership_status, gender } = req.body;

        let customer = await customerModel.findById(customerId);

        if (customer) {
            customer.name = name;
            customer.email = email;
            customer.mobile = mobile;
            customer.membership_status = membership_status;
            customer.gender = gender;
            customer.modifiedAt = Date.now();

            await customer.save();

            return res.status(200).send({ message: "Customer edited successfully" });
        } else {
            return res.status(400).send({ message: "Customer ID not found" });
        }
    } catch (error) {
        console.error("Error editing customer:", error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};

const getCustomerById = async (req, res) => {
    try {
        const customerId = req.params.id;
        const customer = await customerModel.findById(customerId, { password: 0, status: 0, createdAt: 0 });

        if (!customer) {
            return res.status(404).send({ message: "Customer not found" });
        }

        return res.status(200).send({ message: "Customer retrieved successfully", customer });
    } catch (error) {
        console.error("Error retrieving customer by ID:", error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};
        
const deleteCustomerById = async (req, res) => {
    try {
        const customerId = req.params.id;
        const customer = await customerModel.findByIdAndDelete(customerId);

        if (customer) {
            return res.status(200).send({ message: "Customer deleted successfully" });
        } else {
            return res.status(404).send({ message: "Customer not found" });
        }
    } catch (error) {
        console.error("Error deleting customer:", error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};

export default {
    create,
    signup,
    login,
    getAllCustomers,
    getCustomerById ,
    editCustomer,
    deleteCustomerById
}