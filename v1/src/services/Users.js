const User = require('../models/Users')

const list = () => {
    return User.find({});
 };

const insert = (data) => {
    //...
    const user = new User(data);
    return user.save();
};

const modify = (where, data) => {
    
    return User.findOneAndUpdate(where, data, {new: true} );
}

const loginUser = (loginData) => {

    return User.findOne(loginData);
};



module.exports = {
    insert,
    list,
    loginUser,
    modify,
};

// update mail bir başkasınınkiiyle aynı olursa ??