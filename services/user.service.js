const bcrypt = require('bcrypt');
const customException = require('../errorHandler/customException');
const jwt = require('jsonwebtoken');
const jwt_secret =  process.env.jwt_secret;
const { DATA_ALREADY_EXISTS, NOT_FOUND, BAD_REQUEST } = require('../utils/statusCode');
const User = require('../models/users.model');
const userRole = require('../models/userRole.model')
// const userSchema = require('../joidata/users.schema');

module.exports = {
    newUser : async function (req,t){
        try{
            const { first_name, last_name, email, password } = req.body;
            const hashpass = await bcrypt.hash(password,10)
            const created = await User.findOne({
                where:{email}
            })
            if(created) return {data:created, httpStatusCode: DATA_ALREADY_EXISTS,message: 'Please provide a different village name',displayMessage: 'Village data already Created'}
            const user = await User.create({
                first_name:first_name,
                last_name:last_name,
                email:email,
                password:hashpass,

            },t)
            if(!user) throw customException.error(BAD_REQUEST,'Error while creating User Data','User data not Succefully created'); 
            return { data: user, message: 'Created Successfully', displayMessage: 'User Created Successfully' };
        }
        catch(err){
            console.error('Error in creating user:', err);
            return { err: err };  
        }
    },
    userRole: async function (newRole, targetUserId, userId, transaction) {
        try {
            const permissionCheck = await userRole.findOne({
                where: {
                    userId: userId,
                    permission: "Global Admin"
                }
            });
            if (!permissionCheck) throw customException.error(BAD_REQUEST, 'Permission denied the role is not global admin for this userId', 'You do not have permission to create users with this role');
            
            const targetUser = await User.findByPk(targetUserId);
            if (!targetUser) throw customException.error(NOT_FOUND, 'Target user not found', 'Invalid user');

            const created = await userRole.findOne({
                where: {
                    userId: targetUserId
                }
            })
            if(created) return {data:created, httpStatusCode: DATA_ALREADY_EXISTS,message: 'Please provide a different User name',displayMessage: 'User data already Created'}
            const newuserRole =  await userRole.create({
                userId: targetUserId,
                permission: newRole || 'User'

            },transaction)
            if(!newuserRole) throw customException.error(BAD_REQUEST,'Error while creating UserRole ','UserRole not Succefully created'); 
            return { data: newuserRole, message: 'Created Successfully', displayMessage: 'UserRole Created Successfully' };

        } 
        catch (err) {
            console.error('Error in assigning role:', err);
            return { err: err }; 
        }
    },

    login : async function(req){
        try{
            const { email, password } = req;
            const user = await User.findOne({
                where:{email}
            })
            if (!user) throw customException.error(NOT_FOUND,'User not found','Invalid email or password');
            let match = await bcrypt.compare(password,user.password)
            if(!match) throw customException.error(NOT_FOUND,'Invalid password','Please enter a correct password')

            const newToken = jwt.sign({ userId: user.user_id, email: user.email }, jwt_secret, { expiresIn: '1h' });
            const [updateCount] = await User.update(
                { token:newToken },
                { where: { user_id: user.user_id } }
            );  

            if (updateCount?.[0]===0) throw customException.error(NOT_FOUND, 'Please provide a valid village_id', 'Data Not Found');
            const updatedUser = await User.findOne({ where: { email } });
            return {data:updatedUser,token:newToken}
        }
        catch(err){
            return { err: err };
        }
    }
    

}
// {
//     "first_name":"Komala",
//     "last_name":"G",
//     "email":"Komala@yopmail.com",
//     "password":"Asha@2000"
//   }

// {
//     "permission":"Super Admin",
//     "targetUserId":1
//   }

// {
//     "email":"Asha@yopmail.com",
//     "password":"Asha@2000"
//   }