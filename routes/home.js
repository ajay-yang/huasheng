var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var User = require("../modules/User");
var Msg = require("../modules/Msg");

//查询msg表---------------------

function showMsgList(id,req,res,url){
		Msg.find({to:id},function(err,msgrs){
			if(err){
				console.log(err);
				return;
			}
			
			User.update({_id:id},{$set:{msgnum:0}},function(err,rs1){
					req.session.loginbean.msgnum=0;
					res.render(url, {msgrs:msgrs});
			});
			
		})
}

/* GET home page. */
router.get('/', function(req, res, next) {
  let loginbean = req.session.loginbean;
  res.locals.loginbean = loginbean;
  
  if(loginbean.role>0){
  			showMsgList(loginbean.id,req,res,'home');
  		//res.render('home', {});
  }else{
  	res.send('<script>alert("你无权访问");location.href="/";</script>');
  }
  
});

router.get('/admin', function(req, res, next) {
  let login = req.session.loginbean
  res.locals.loginbean = login;
  if(login.role==0){
  		showMsgList(login.id,req,res,'adminhome');
  		//res.render('adminhome', {});
  }else{
  	res.send('<script>alert("你无权访问");location.href="/";</script>');
  }
  
});

router.get('/apply', function(req, res, next) {
  res.locals.loginbean = req.session.loginbean;
  res.render('apply', {});
});

router.post('/apply', function(req, res, next) {
  res.locals.loginbean = req.session.loginbean;
  var form = new formidable.IncomingForm();   //创建上传表单
  form.encoding = 'utf-8';        //设置编辑
  form.uploadDir = './public/images/';     //设置上传目录 文件会自动保存在这里
  form.keepExtensions = true;     //保留后缀
  form.maxFieldsSize = 5 * 1024 * 1024 ;   //文件大小5M
  form.parse(req, function (err, fields, files) {
        if(err){
            console.log(err);
        }
        console.log( fields)//这里就是post的XXX 的数据
       // console.log('上传的文件名:'+files.photo.name);//与客户端file同名
       // console.log('文件路径:'+files.photo.path);
       // res.send('接到参数,真名:'+fields.realname);
       let teacher = {};
       teacher.role=2;
       teacher.realname = fields.realname;
       teacher.idnumber = fields.idnumber;
       teacher.photopath = (files.photo.path).replace('public\\','');
       teacher.brief = fields.brief;

       User.update({_id:res.locals.loginbean.id},{$set:teacher},function(err,rs){
       		if(err){
       			console.log(err);
       			res.send('数据库错误');
       			return;
       		}
       		req.session.loginbean.role=2;
       		res.send('<script>alert("申请成功");location.href="/home/";</script>');
       })
   })
});



module.exports = router;
