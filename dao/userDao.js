// dao/userDao.js
// 实现与MySQL交互
const mysql = require('mysql');
const $conf = require('../conf/db');
const $util = require('../util/util');
const $sql = require('./userSqlMapping');

//使用连接池,提升性能
const pool = mysql.createPool($util.extend({},$conf.mysql));

//向前台返回JSON方法的简单封装
const jsonWrite = function (res,ret) {
    if(typeof ret === 'undefined'){
        res.json({
            code : '1',
            msg : '操作失败'
        });
    }else{
        res.json(ret);
    }
};

module.exports = {
    add:function (req,res,next) {
        pool.getConnection(function (err,connection) {
           const param = req.query || req.params;

           //建立连接,向表中插入值
            //'ISNERT INTO USER(ID,NAME,AGE) VALUES(0,?,?)',
            connection.query($sql.insert,[param.name,param.age],function (err, result) {
                if(result){
                    result = {
                        code:200,
                        msg:'增加成功'
                    };
                }

                //以JSON形式,把操作结果返回给前台页面
                jsonWrite(res,result);

                //释放连接
                connection.release();
            })
        });
    },
    delete:function (req, res, next) {
        //delete By Id
        pool.getConnection(function (err, connection) {
            const id = req.query.id;
            connection.query($sql.delete,id,function (err, result) {
                if(result.affectedRows>0){
                    result = {
                        code : 200,
                        msg : '刪除成功'
                    }
                }else{
                    result = void 0;
                }
                jsonWrite(res,result);
                connection.release();
            });
        });
    },
    update :function (req, res, next) {
        //update By Id

        var param = req.body;
        if (param.name === null || param.age === null || param.id === null){
            jsonWrite(res,undefined);
            return;
        }

        pool.getConnection(function (err, connection) {
            connection.query($sql.update,[param.name,param.age,param.id],function (err, result) {
                // 使用页面进行跳转提示
                if(result.affectedRows > 0) {
                    res.render('suc', {
                        result: result
                    }); // 第二个参数可以直接在jade中使用
                } else {
                    res.render('fail',  {
                        result: result
                    });
                }
                console.log(result);

                connection.release();
            });
        });
    },
    queryById : function (req, res, next) {
        //select By Id
        const id = +req.query.id;
        pool.getConnection(function (err, connection) {
            connection.query($sql.queryById,id,function (err, result) {
                jsonWrite(res,result);
                connection.release();

            })
        })
    },
    queryAll : function (req, res, next) {
        //select All
        pool.getConnection(function (err, connection) {
            connection.query($sql.queryAll,function (err, result) {
                jsonWrite(res,result);
                connection.release();

            })
        })
    }
}