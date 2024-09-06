// authContorller.js
// Import necessary modules
const asyncHandler = require("../middleware/asyncHandler.js");
const Admin = require('../models/adminModel.js');
const Trainer = require('../models/trainerModel.js');
const Client = require('../models/clientModel.js');
const {generateTokenAdmin, generateTokenTrainer, generateTokenClient} = require('../utils/generateToken.js');

// @desc    Auth admin and get token
// @route   POST /apiv1/auth/signin/admin
// @access  Private
const signinAdmin = asyncHandler( async(req, res) => {
    const {email, password} = req.body;

    try {
        const admin = await Admin.findOne({ email });
        
        if (admin && (await admin.matchPassword(password)) ) {
            generateTokenAdmin(res, admin._id);

            res.status(200).json({
                _id: admin._id,
                name: `${admin.firstName} ${admin.fatherName}`,
                email: admin.email,
                isAdmin: admin.isAdmin,
                isTrainer: admin.isTrainer,
                isClient: admin.isClient,
            })
        } else {
            res.status(401);
            throw new Error('Invalid email or password')
        }
    } catch (error) {
        throw new Error(error);
    }
})

// @desc    Auth trainer and get token
// @route   POST /apiv1/auth/signin/trainer
// @access  Private
const signinTrainer = asyncHandler( async(req, res) => {
    const {email, password} = req.body;

    try {
        const trainer = await Trainer.findOne({ email });
        
        if (trainer && (await trainer.matchPassword(password)) ) {
            generateTokenTrainer(res, trainer._id);

            res.status(200).json({
                _id: trainer._id,
                name: `${trainer.firstName} ${trainer.fatherName}`,
                email: trainer.email,
                isAdmin: trainer.isAdmin,
                isTrainer: trainer.isTrainer,
                isClient: trainer.isClient,
            })
        } else {
            res.status(401);
            throw new Error('Invalid email or password')
        }
    } catch (error) {
        throw new Error(error);
    }
})

// @desc    Auth client and get token
// @route   POST /apiv1/auth/signin/client
// @access  Private
const signinClient = asyncHandler( async(req, res) => {
    const {email, password} = req.body;

    try {
        const client = await Client.findOne({ email });
        
        if (client && (await client.matchPassword(password)) ) {
            generateTokenClient(res, client._id);

            res.status(200).json({
                _id: client._id,
                name: `${client.firstName} ${client.fatherName}`,
                email: client.email,
                isAdmin: client.isAdmin,
                isTrainer: client.isTrainer,
                isClient: client.isClient,
            })
        } else {
            res.status(401);
            throw new Error('Invalid email or password')
        }
    } catch (error) {
        throw new Error(error);
    }
})

// @desc    Add an admin
// @route   POST /apiv1/auth/signup/admin
// @access  Private
const signupAdmin = asyncHandler( async (req, res) => {
    const { firstName, fatherName, picture, email, password } = req.body;

    try {
        const adminExists = await Admin.findOne({ email });

        if (adminExists) {
            res.status(400);
            throw new Error('Admin already exists')
        } else {
            const admin = await Admin.create({
                firstName, fatherName, picture, email, password, isAdmin: true
            })

            if (admin) {
                generateTokenAdmin(res, admin._id);
                res.status(201).json({
                    _id: admin._id,
                    name: `${admin.firstName} ${admin.fatherName}`,
                    email: admin.email,
                    isAdmin: admin.isAdmin
                });
            } else {
                res.status(400);
                throw new Error('Invalid admin data');
            }
        }
    } catch (error) {
        throw new Error(error);
    }
})

// @desc    Add a trainer
// @route   POST /apiv1/auth/signup/trainer
// @access  Private
const signupTrainer = asyncHandler( async (req, res) => {
    const { firstName, fatherName, sex, picture, email, phoneNo, password } = req.body;

    try {
        const trainerExists = await Trainer.findOne({ email });

        if (trainerExists) {
            res.status(400);
            throw new Error('Trainer already exists')
        } else {
            const trainer = await Trainer.create({
                firstName,
                fatherName,
                sex,
                picture,
                email,
                phoneNo,
                password,
                isTrainer: true
            })

            if (trainer) {
                generateTokenTrainer(res, trainer._id);
                res.status(201).json({
                    _id: trainer._id,
                    name: `${trainer.firstName} ${trainer.fatherName}`,
                    email: trainer.email,
                    isTrainer: trainer.isTrainer
                });
            } else {
                res.status(400);
                throw new Error('Invalid trainer data');
            }
        }
    } catch (error) {
        throw new Error(error);
    }
})

// @desc    Add a client
// @route   POST /apiv1/auth/signup/client
// @access  Private
const signupClient = asyncHandler( async (req, res) => {
    const { firstName, fatherName, sex, DOB, picture, email, phoneNo, password } = req.body;

    try {
        const clientExists = await Client.findOne({ email });

        if (clientExists) {
            res.status(400);
            throw new Error('Client already exists')
        } else {
            const client = await Client.create({
                firstName,
                fatherName,
                sex,
                DOB,
                picture,
                email,
                phoneNo,
                password,
                isClient: true
            })

            if (client) {
                generateTokenClient(res, client._id);
                res.status(201).json({
                    _id: client._id,
                    name: `${client.firstName} ${client.fatherName}`,
                    email: client.email,
                    isClient: client.isClient
                });
            } else {
                res.status(400);
                throw new Error('Invalid Client data');
            }
        }
    } catch (error) {
        throw new Error(error);
    }
})

// @desc    signout user and clear token
// @route   POST /apiv1/auth/signout
// @access  Private
const signout = asyncHandler( async (req, res) => { 
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ message: 'Signed out successfully' })
});

module.exports = {
    signinAdmin,
    signinTrainer,
    signinClient,
    signupAdmin,
    signupTrainer,
    signupClient,
    signout
}