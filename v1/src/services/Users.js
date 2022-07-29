const User = require('../models/Users')

const list = () => {
    return User.find({});
 };

const insert = (data) => {
    //...
    const user = new User(data);
    return user.save();
};

const loginUser = (loginData) => {

    return User.findOne(loginData);
};

const modify = (where, data) => {
    
    return User.findOneAndUpdate(where, data, {new: true} );
}

module.exports = {
    insert,
    list,
    loginUser,
    modify,
};

// update mail bir başkasınınkiiyle aynı olursa ??