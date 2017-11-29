var express = require('express');
var router = express.Router();

var userDao = require('../dao/userDao');

/* GET users listing. */
router.get('/', function(req, res, next) {
    // res.send('respond with a resource');
    res.render('updateUser');
    // res.redirect('/html/abc.html');
});



//增加用户
router.get('/addUser',function (req,res,next) {
    userDao.add(req,res,next);
});

//修改用戶
router.post('/updateUser',function (req, res, next) {
    userDao.update(req,res,next);
})

//刪除用戶
router.get('/deleteUser',function (req,res,next) {
    userDao.delete(req,res,next);
})

//通过Id查詢用戶
router.get('/queryById',function (req, res, next) {
    userDao.queryById(req,res,next);
})

//查詢所有用戶
router.get('/queryAll',function (req, res, next) {
    userDao.queryAll(req,res,next);
})

module.exports = router;
