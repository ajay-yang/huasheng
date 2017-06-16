var express = require('express');
var router = express.Router();
<<<<<<< HEAD
var User = require("../modules/User");
var Msg = require("../modules/Msg");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.locals.loginbean = req.session.loginbean;
  res.render('index', {});
});

function sendMsg(loginbean,rid,message,res){
	  let msg = new Msg({});
	  msg.send = loginbean.id;
	  msg.sendname = loginbean.nicheng;
	  msg.to = rid;
	  msg.message = message;
	  msg.sendtime = new Date();
	  msg.save(function(err,rs){
	  		if(err){
	  			console.log(err);
	  			res.send('0');
	  			return;
	  		}
	  		User.update({_id:rid},{$inc:{msgnum:1}},function(err,rs){
	  			if(err){
		  			console.log(err);
		  			res.send('0');
		  			return;
		  		}
		  		res.send('1');
	  		})
	  })
}

router.post('/reply', function(req, res, next) {
  let loginbean = req.session.loginbean;
  let rid = req.body['rid'];
  let message = req.body['message'];
  sendMsg(loginbean,rid,message,res);
});



router.post('/sendmsg', function(req, res, next) {
  let loginbean = req.session.loginbean;
  let nicheng = req.body['nicheng'];
  let message = req.body['message'];
  //---------查toid-----------------------
  User.findOne({nicheng:nicheng},function(err,rs){
  	if(err){
  			console.log(err);
  			res.send('0');
  			return;
  	}
  	if(rs){	//查到
  		let toid = rs._id;
  		sendMsg(loginbean,toid,message,res);
  	}else{  //没查到
  		res.send('-1');
  	}
  })
  //--------------------------------------
  
});

router.get('/del', function(req, res, next) {
	let loginbean = req.session.loginbean;
	let id = req.query['id'];
	
	
	Msg.remove({_id:id,to:loginbean.id},function(err,rs){
		if(err){
	  			console.log(err);
	  		}
	  	if(loginbean.role>0){
	  		res.redirect('/home/');
	  	}else{
	  		res.redirect('/home/adminhome');
	  	}
	  	
	});
})


=======
var PrivateInfoModel = require('../models/PrivateInfoModel');
var Users = require('../models/UserInfoModel');
var sequelize =require('../models/ModelHeader')();
var Msg = require('../models/MsgModel');

/* GET home page. */
//----------------------发送新消息-----------群发------------
router.post('/sendMessage', function(req, res, next) {
	loginbean = req.session.loginbean;
  	res.locals.loginbean = loginbean;
  //用昵称去查找对应的id --user
  	nicheng = req.body.nicheng;
 //-----------------实现群发--------------------
 	arr = nicheng.split(';');//以分号分割昵称；
 	len = arr.length;
 	sql = 'select id from users where nicheng = ?';
  	sqlmsg = 'insert into msgs set sendid =?,toid =?,message =?';
  	sqluser = 'update users set msgnum = msgnum +1 where id = ?' ;
 	flag = 0;
 	toid = {};
 	ii = 0;
 	for(var i= 0;i<len;i++){
			sequelize.query(sql,{replacements:[arr[i]]}).then(function(rs){
			console.log(rs);
			//rs是一个id 的结果集。
			//然后插入消息表
			rsString = JSON.stringify(rs[0]);
			//将rowdataback数据转换为字符串
			//将rowdataback数据转换为Json
			rsJson = JSON.parse(rsString);
			//判断是否出现不存在的昵称
			if(rsJson.length==0){
				flag++;
				return;
			}
			ii++;
			//无论有没有昵称，都让标志位自增1；
			toid[ii] = rsJson[0].id;
		    sequelize.query(sqlmsg,{replacements:[loginbean.id,toid,req.body.message]}).then(function(){
			  	sequelize.query(sqluser,{replacements:[toid]}).then(function(rs){
			  		
			  		flag++;
			  		if(flag ==len){
			  			res.send('1');
			  		}
			  	});
		  });
  		});	
  		
  		
  		
  		
 	}
 	
  	
  	
});
//-------------------------回复消息------------------------
router.post('/replayMessage', function(req, res, next) {
	loginbean = req.session.loginbean;
  	res.locals.loginbean = loginbean;
  //用昵称去查找对应的id --user
  	nicheng = req.body.rnicheng;
  	sql = 'select id from users where nicheng = ?';
  	sequelize.query(sql,{replacements:[nicheng]}).then(function(rs){
//		console.log(rs);
		//rs是一个id 的结果集。
		//然后插入消息表
		rsString = JSON.stringify(rs[0]);
		//将rowdataback数据转换为字符串
		rsJson = JSON.parse(rsString);
		//将rowdataback数据转换为Json
		toid = rsJson[0].id                                                                                                ;
		
	    sqlmsg = 'insert into msgs set sendid =?,toid =?,message =?';
	    sequelize.query(sqlmsg,{replacements:[loginbean.id,toid,req.body.rmessage]}).then(function(){
	  	sqluser = 'update users set msgnum = msgnum +1 where id = ?' ;
	  	
	  	sequelize.query(sqluser,{replacements:[toid]}).then(function(){
	  		res.send('1');
	  	});
	  	
	  })
  })
});
//----------------------删除消息---------------------
//删除消息表中的数据，只是删除表中的 id即可。
router.get('/deleteMessage', function(req, res, next) {
	loginbean = req.session.loginbean;
  	res.locals.loginbean = loginbean;
  //用昵称去查找对应的id --user
  	id = parseInt(req.query.id);
  	sqldel = 'delete from msgs where id=? and toid=?';
  	sequelize.query(sqldel,{replacements:[id,loginbean.id]}).then(function(err,rs){
	  		if(err){
	  			console.log(err)
	  		}
	  		if(loginbean.role > 0){
	  			res.redirect('/userHome');
	  		}else{
	  			res.redirect('/adminHome/adminHome');
	  		}
	  	});
});
>>>>>>> first commit
module.exports = router;
