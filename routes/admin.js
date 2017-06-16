var express = require('express');
var router = express.Router();
var User = require("../modules/User");
var Msg = require("../modules/Msg");

/* GET home page. */
router.get('/teacherapplylist', function(req, res, next) {
  res.locals.loginbean = req.session.loginbean;
  User.find({role:2},function(err,rs){ 
  		//console.log(rs);   
    	res.render('teacherapplylist', {rs:rs});
  })
});

router.get('/pass', function(req, res, next) {
  let loginbean = req.session.loginbean;
  res.locals.loginbean = loginbean;
  if(loginbean.role==0){
  	let id = req.query['id'];
  	User.update({_id:id},{$set:{role:3}},function(err,rs){ 
  		if(err){
  			res.send('0');
  			return;
  		}
  		res.send('1');
  	})
  }else{
  	res.send('非法操作');
  }
});

router.post('/reject', function(req, res, next) {
  let loginbean = req.session.loginbean;
  res.locals.loginbean = loginbean;
  if(loginbean.role==0){
  	let rid = req.body['rid'];
  	User.update({_id:rid},{$set:{role:1},$inc:{msgnum:1}},function(err,rs){ 
  		if(err){
  			console.log(err);
  			return;
  		}
  		//---------插入消息表-------------
  			let msg = new Msg({});
  			msg.send = loginbean.id;
  			msg.sendname = loginbean.nicheng;
  			msg.to = rid;
  			msg.message = req.body['reason'];
  			msg.islook = 0;
  			msg.sendtime = new Date();
  			msg.save(function(err){
  				if(err){
  					console.log(err);
  					res.send(0);
  					return;
  				}
  				res.send('1');
  			})
  			//--------------------------------
  	})
  }else{
  	res.send('非法操作');
  }
});



module.exports = router; 