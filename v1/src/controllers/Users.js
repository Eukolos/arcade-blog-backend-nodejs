const { list, insert, loginUser, modify } = require('../services/Users');
const projectService = require('../services/Projects');
const httpStatus = require('http-status');
const { passwordToHash, generateAccessToken, generateRefreshToken } = require('../scripts/utils/helper');
const uuid = require('uuid');
const eventEmitter = require('../scripts/events/eventEmitter');

const index = (req, res) => {
    list().then((response) => {
        res.status(httpStatus.OK).send(response);
    })
    .catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
    });
};

const create = (req, res) => {
    
    req.body.password = passwordToHash(req.body.password);
  
    insert(req.body)
    .then((response) => {
        
        res.status(httpStatus.CREATED).send(response);
    })
    .catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
    });
};

const login = (req, res) => {
    req.body.password = passwordToHash(req.body.password);
    
    loginUser(req.body)
    .then((user) => {
        if(!user) return res.status(httpStatus.NOT_FOUND).send({ message : "Böyle bir kullancı veya şifre bulunmamaktadır."});
        
        user = {
            ...user.toObject(),
            tokens: {
                access_token: generateAccessToken(user),
                refresh_token: generateRefreshToken(user)
            },
        };
        delete user.password;
        res.status(httpStatus.OK).send(user);
    })
    .catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
    });
};

const projectList = (req, res) => {

    projectService
    .list({user_id : req.user?._id})
    .then((projects) => {
        res.status(httpStatus.OK).send(projects)
    })
    .catch(() => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error : "Projeleri getirirken beklenmedik bir hata oluştu."}));
};

const resetPassword = (req, res) => {
    
    const new_password = uuid.v4()?.split("-")[0] || `user-${new Date().getTime()}`;
    
    modify({email: req.body.email} , {password: passwordToHash(new_password) })
    .then((updatedUser) => {
        if(!updatedUser) return res.status(httpStatus.NOT_FOUND).send({error: "Böyle bir kullanıcı bulunamadı"});
     eventEmitter.emit('send_email',{
        to: updatedUser.email,
        subject: "Şifre Sıfırlama",
        html: `Talebiniz üzerine şifre sıfırlama işleminiz gerçekleşmiştir. <b> giriş yaptıktan sonra şifrenizi değiştirmeyi unutmayanız</b> Yeni Şifreniz: <b> ${new_password} </b>`
      });
      
      res.status(httpStatus.OK).send({
        message: 'şifre sıfırlama işlemi için sisteme kayıtlı e-posta adresinize gereken bilgiler gönderildi'
      });
    })
    .catch(() => res.status(httpStatus.INTERNAL_SERVER_ERROR)
    .send({error : "Şifre resetleme sırasında bir problem oluştu"}));
    
    
};

const update = (req, res) => {
    modify({_id : req.user?._id}, req.body).then(updatedUser => {
        res.status(httpStatus.OK).send(updatedUser);
    }).catch(() => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error: "Güncelleme işlemi sırasında bir problem oluştu."}));
};


module.exports = {
    index,
    create,
    login,
    projectList,
    resetPassword,
    update,
    
};