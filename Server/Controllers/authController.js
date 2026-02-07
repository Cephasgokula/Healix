const jwt=require('jsonwebtoken');
const User=require('./../Models/userModel');
const catchAsync=require('./../utils/catchAsync');
const AppError=require('./../utils/appError');
const Cryption=require('../utils/Cryption');


const signToken=id=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    });
}


exports.signup=catchAsync(async(req,res,next)=>{

// console.log(req.body.name);
// console.log(req.body.email);
// console.log(req.body.password);
// console.log(req.body.passwordConfirm);
    
    const {name,email,password,passwordConfirm} = req.body;

    const newUser =await User.create({
        name,
        email,
        password,
        passwordConfirm
    });


    const token=signToken(newUser._id);
    const {iv,encryptedData}= Cryption.encrypt(newUser._id.toString());

    res.status(201).json({
        status: 'success',
        token,
        data:{
            user:newUser,
            "encryptedData":  encryptedData
        },
        email,
        name  // Add name to response
    })
})

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    // ============================================
    // HARDCODED ADMIN CREDENTIALS
    // ============================================
    const ADMIN_EMAIL = 'admin@healix.com';
    const ADMIN_PASSWORD = 'Admin@123';

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const token = jwt.sign({ id: 'admin' }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });
        return res.status(200).json({
            status: 'success',
            token,
            data: { encryptedData: 'admin-user' },
            email: ADMIN_EMAIL,
            name: 'Admin',
            role: 'admin'
        });
    }
    // ============================================

    const user = await User.findOne({ email }).select('+password');
    

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    console.log(user);
    const name = user.name;
    const role = user.role || 'user';
    console.log(name, role);
    const token = signToken(user._id);
    const {iv,encryptedData}= Cryption.encrypt(user._id.toString());
    res.status(200).json({
        status: 'success',
        token,
        data: {
        "encryptedData":  encryptedData 
        },
        email,
        name,
        role
    });
});