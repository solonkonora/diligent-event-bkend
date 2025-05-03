import userModel from "../models/userModel";

export const signUp = async (req, res)=>{
    const { name, emaial, password } = req.body;
    if(!name || !email || !password){
        return res.json({success: false, message: 'Missing Details'})
    }
    try {
        const existingUser = await userModel.findOne({email})
        if(existingUser){
            return res.json({
                success: false, message: "User already exists"
            })
        }
    

const hashedPassword = await bcrypt.hash(password, 10)

//create a new user
const user = new userModel({name, email, password: hashedPassword});
await user.save(); //save in the db

//generate a token
const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

//sending to user by adding it in the cookie
res.cookie('token', token, {
httpOnly: true,
secure: process.env.NODE_ENV === 'production',
sameSite: process.env.NODE_ENV == 'production' ? 'none' : 'strick', maxAge: 7 * 24 * 60 * 1000
});

return res.json({success: true});


   } catch (error) {
       res.json({success: false, message: error.message})
   }
}

export const login = async (req, res)=>{
    const {email, password} = req.body
    if(!email || !password){
        return res.json({success: false, message: 'email and password are required'})
    }

    try{
        const user = await userModel.findOne({email});

        if(!user){
            return res.json({success:false, message: 'invalid email'})

        }
        const isMatch =  await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.json({success:false, message: 'invalid password'})
        }

//generate a token to authenticate user and log them in.
const token = JsonWebTokenError.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

//sending to user by adding it in the cookie
res.cookie('token', token, {
httpOnly: true,
secure: process.env.NODE_ENV === 'production',
sameSite: process.env.NODE_ENV == 'production' ? 'none' : 'strick', maxAge: 7 * 24 * 60 * 1000
})

  return res.json({success: true});

    } catch (error) {
      return res.json({success: false, message: error.message})
 }
}

export const logout = async (req, res)=>{
    try {
        res.clearcookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV == 'production' ? 
            'none' : 'strick',
        })

        return res.json({success: true, message: "logged Out"})

    } catch (error) {
     return res.json({success: false, message: error.message})
    }
}