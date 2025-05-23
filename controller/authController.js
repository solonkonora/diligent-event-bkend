import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";

export const signUp = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password ||!role) {
    return res.json({ success: false, message: "Missing Details" });
  }

  // Only allow specific roles to sign up
  if (role !== "admin") {
    return res.status(403).json({ success: false, message: "Unauthorized signup" });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    //create a new user
    const user = new userModel({ name, email, password: hashedPassword });
    await user.save(); //save in the db

    //generate a token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    //sending to user by adding it in the cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV == "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 1000,
    });

    // sending welcome email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to NNS",
      text: `Welcome to Diligent Events Website, your account has been created with email id: ${email}`,
    };
    await transporter.sendMail(mailOptions);

    return res.json({ success: true });
    
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({
      success: false,
      message: "email and password are required",
    });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "invalid email" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "invalid password" });
    }

    //generate a token to authenticate user and log them in.
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    //sending to user by adding it in the cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV == "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 1000,
    });

    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV == "production" ? "none" : "strict",
    });

    return res.json({ success: true, message: "logged Out" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const sendVerifyOTP = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await userModel.dindById(userId);
    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account Already exist" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOtp = otp;
    user.sendVerifyOTPExpiredAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      text: ` Your OTP is ${otp}. Verify your account using this OTP `,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Verify the email using the OTP
export const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    res.json({ success: false, message: "Missing Details" });
  }
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.sendVerifyOTPExpiredAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.sendVerifyOTPExpiredAt = 0;

    await user.save();

    return res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//check if user is authenticated
export const isAuthenticated = async (req, res)=>{
    try {
        return res.json({ success: true});
    }  catch (error) {
        res.json({ success: false, message: error.message });
      }
}

// send password reset otp
export const sendResetOTP = async (req, res)=>{
    const {email} = req.body;

    if(!email){
        return res.json({success: false, message: 'email is requiree'})
    }
    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success: false, message: 'user not found'});
            }

            const otp = String(Math.floor(100000 + Math.random() * 900000));

            user.verifyOtp = otp;
            user.sendVerifyOTPExpiredAt = Date.now() + 15 * 60 * 1000;
        
            await user.save();
        
            const mailOptions = {
              from: process.env.SENDER_EMAIL,
              to: user.email,
              subject: "Password Reset OTP",
              text: ` Your OTP for resetting your password is ${otp}. use this OTP to proceed with resetting your password`,
            };
            await transporter.sendMail(mailOptions);

            return res.json({ success: true, message: 'OTP sent to your email'});


          } catch (error) {
            res.json({ success: false, message: error.message });
          }

        
}

// reset user password
export const resetPassword = async (req, res)=>{
    const {email, otp, newPassword} = req.body;

    if(!email || !otp || !newPassword){
        return res.json({})
    }


    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({ success: false, message: 'User not found'});
        }
        if(user.resetOtp === "" || user.resetOtp !== otp){
            res.json({ success: false, message: 'Invalid OTP' });

        }

        if(user.resetOtpExpireAt < Date.now()){
            return res.json({ success: false, message: 'OTP Expired' });
        }

        const hashedPassword =  await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;

        await user.save();

        return res.json({ success: true, message: 'password has been updated successfully' });


    }catch (error) {
        res.json({ success: false, message: error.message });
    }
}