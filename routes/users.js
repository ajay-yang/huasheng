var express = require('express');
var router = express.Router();
<<<<<<< HEAD

var User = require("../modules/User");
 

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function(req, res, next) {
  res.render('login', {});
});

router.post('/login', function(req, res, next) {
  email = req.body['email'];
  pwd = req.body['pwd'];
  User.findOne({email:email,pwd:pwd},function(err,rs){    
    	if(rs){
    		loginbean = {};
    		loginbean.id=rs._id;
    		loginbean.nicheng = rs.nicheng;
    		loginbean.role = rs.role;
        loginbean.msgnum = rs.msgnum;
    		req.session.loginbean = loginbean;
    		//res.send('登陆成功');
    		 res.redirect('/');    //跳转回index页  
    	}else{
    		res.send('<script>alert("email/密码错误");location.href="/";</script>');
    	}
  })
  //res.send('收到参数email:'+email);
});

router.post('/zhuce', function(req, res, next) {
  email = req.body['email'];
  pwd = req.body['pwd'];
  nicheng = req.body['nicheng'];
  //----0管理员,1老师,2学生
  
  
  var user = new User({});
	user.email = email;
	user.pwd = pwd;
	user.nicheng = nicheng;
	user.role = 1;
  user.msgnum = 0;
   user.save(function(err){
   		if(err){
   			console.log(err);
   			if(err.toString().indexOf('emailuiq')>0){
   				res.send('email重复');
   			}else if(err.toString().indexOf('nichenguiq')>0){
   				res.send('昵称重复');
   			}else{
   				res.send('数据库错误,稍后再试');
   			}
   			return;
   		}
	    //res.send(user._id);
      res.redirect(307,'./login'); 
	});

  //res.send('收到参数email:'+email);
});
=======
var Users = require('../models/UserInfoModel');

router.post('/zhuce', function(req, res, next) {
	Users.create(req.body).then(function(rs){
		res.redirect(307,'./login');
		
	}).catch(function(err){

		if(err.errors[0].path=='emailuniq')
		{
			res.send('email重复');
		}else if(err.errors[0].path=='nichenguniq'){
			res.send('昵称重复');
		}else{
			res.send('数据库错误,稍后再试');
		}
		
	})
}); 

router.post('/login', function(req, res, next) {
	Users.findOne({where:{email:req.body.email,pwd:req.body.pwd}}).then(function(rs){
		if(rs!=null){
			loginbean=new Object();
			loginbean.id = rs.id;
			loginbean.nicheng = rs.nicheng;
			loginbean.role = rs.role;
			loginbean.msgnum = rs.msgnum;
			req.session.loginbean=loginbean;
			res.redirect('/');
		}else{
			res.send("<script>alert('email/密码错误');location.href='/';</script>");
		}
	});
})
>>>>>>> first commit

router.get('/logout', function(req, res, next) {
	delete req.session.loginbean;
	res.redirect('/');
<<<<<<< HEAD
});
=======
})
>>>>>>> first commit

module.exports = router;
