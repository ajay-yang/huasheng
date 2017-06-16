var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var PrivateInfoModel = require('../models/PrivateInfoModel');
var Users = require('../models/UserInfoModel');
var sequelize =require('../models/ModelHeader')();
var Msg = require('../models/MsgModel');
var ShopModel = require('../models/ShopModel');

/* GET home page. */
router.get('/', function(req, res, next) {
  loginbean = req.session.loginbean;
  res.locals.loginbean = loginbean;
  if(loginbean.role > 0){
//-------------------分页------------------
  	pageNum = 1;//页码数，第一页，第二页，，，，，
  	if(req.query.pageNum){
  		pageNum = req.query.pageNum;
  	}
  	pageItem = 3;//每页显示的条目数；
  	startPoint = (pageNum-1)*pageItem;//每页的起始位置索引
  	sqlNum = 'select count(*) as count from msgs where toid = ?';
  	rowCount = 0; //定义总的行数
    sumPage = 0;//定义总的页数 
  	sequelize.query(sqlNum,{replacements: [loginbean.id],type: sequelize.QueryTypes.QUERY}).then(function(rs){
//---拿到的结果集，仍然是个rowdataback数据。	    
	    rsString = JSON.stringify(rs[0]);
			//将rowdataback数据转换为字符串
			rsJson = JSON.parse(rsString);
			//将rowdataback数据转换为Json
			 rowCount = rsJson[0].count;
			 sumPage = Math.ceil(rowCount/pageItem);
		   sql = 'select m.*,u.nicheng from msgs m,users u where m.toid=? and m.sendid = u.id limit ?,?';
//---------------------查询消息列表------------------
		   sequelize.query(sql,{replacements: [loginbean.id,startPoint,pageItem],type: sequelize.QueryTypes.QUERY}).then(function(rs){
	        sqlmsgnum = 'update users set msgnum =0 where id=? ';
	        sequelize.query(sqlmsgnum,{replacements: [loginbean.id],type: sequelize.QueryTypes.QUERY}).then(function(rs1){
							req.session.loginbean.msgnum=0;	
							res.render('userHome/userHome', {rs:rs[0]});
	        });
   });
   });
  }else{
    res.send('<script>alert("你无权访问此页面");location.href="/";</script>');
  }
});



router.post('/privateAuth', function(req, res, next) {
	var form = new formidable.IncomingForm();   //创建上传表单 
    form.encoding = 'utf-8';        //设置编辑 
    form.uploadDir = './public/images/privateauth/';     //设置上传目录 文件会自动保存在这里 
    form.keepExtensions = true;     //保留后缀 
    form.maxFieldsSize = 5 * 1024 * 1024 ;   //文件大小5M 
    form.parse(req, function (err, fields, files) { 
        if(err){ 
            console.log(err); 
            return;
        } 
       //res.send('rname='+fields.realname);
       //-----------入库------------
       loginbean = req.session.loginbean;
       fields.id = loginbean.id;
       fields.idphoto=files.idphoto.path.replace('public','');
       fields.userphoto=files.userphoto.path.replace('public','');
       fields.updtime=new Date();
       //------------启动事物----------------------------------
       sequelize.transaction().then(function (t) {
           return PrivateInfoModel.create(fields).then(function(rs){
            //------修改User表中的role为2------
	            return Users.update({role:2},{where:{'id':loginbean.id}}).then(function(rs){
	              //console.log(rs);
	              loginbean.role=2;
	              req.session.loginbean=loginbean;
	              res.send('身份认证已提交,请耐心等待审核');
	            });
            
          }).then(t.commit.bind(t)).catch(function(err){
            t.rollback.bind(t);
            console.log(err);
            if(err.errors[0].path=='PRIMARY'){
              res.send('你已经申请过');
            }else if(err.errors[0].path=='idcodeuniq')
            {
              res.send('身份证号已用过');
            }else if(err.errors[0].path=='prphoneuniq'){
              res.send('电话号码已用过');
            }else if(err.errors[0].path=='premailuniq'){
              res.send('此email已用过');
            }else{
              res.send('数据库错误,稍后再试');
            }
          })
          
        });
      //-----------------结束事物---------------------------------------
    })
});
//----------------------------发布租赁点----------------------------
//显示地图
router.get('/pubShop', function(req, res, next) {
  sql = 'select id,typename from shoptypes';
  sequelize.query(sql).then(function(rs){
    res.render('userHome/pubShop', {shoptypeRs:rs[0]});
  });
});

//店铺信息提交数据库
router.post('/pubShop', function(req, res, next) {
	loginbean = req.session.loginbean;
  res.locals.loginbean = loginbean;
	var form = new formidable.IncomingForm();   //创建上传表单 
    form.encoding = 'utf-8';        //设置编辑 
    form.uploadDir = './public/images/shop/';     //设置上传目录 文件会自动保存在这里 
    form.keepExtensions = true;     //保留后缀 
    form.maxFieldsSize = 5 * 1024 * 1024 ;   //文件大小5M 
    form.parse(req, function (err, fields, files) { 
        if(err){ 
            console.log(err); 
            return;
        } 
       //----------------------------入库------------
       fields.uid = loginbean.id;
       fields.photourl=files.photourl.path.replace('public','');
       //------------启动事物----------------------------------
       sequelize.transaction().then(function (t) {
           return ShopModel.create(fields).then(function(rs){
            //------修改User表中的role为2------
            return Users.update({role:4},{where:{'id':loginbean.id}}).then(function(rs){
              //console.log(rs);
              loginbean.role=4;
              req.session.loginbean=loginbean;
              res.redirect('./shopManage');
            });
          }).then(t.commit.bind(t)).catch(function(err){
            t.rollback.bind(t);
            console.log(err);
            res.send('店铺发布失败，请重新发布');
          })   
        });
      //-----------------结束事物---------------------------------------
    });
});
//----------------插库完成，直接查看在地图上显示信息。-------------------
router.get('/shopManage', function(req, res, next) {
		loginbean = req.session.loginbean;
  	res.locals.loginbean = loginbean;
//-----------判定权限问题
  	if(loginbean.role==4){
//------查询出店铺位置信息--------------
    sql = 'select id,shopname,lng,lat from shops where uid=?';
    sequelize.query(sql,{replacements: [loginbean.id]}).then(function(shopRs){
        //------用店铺信息渲染地图界面----------
        	sql = 'select id,typename from shoptypes';
	        sequelize.query(sql).then(function(shoptypeRs){
	 //------------用店铺信息渲染前端页面。
	 					
	          res.render('userHome/shopManage', {shoptypeRs:shoptypeRs[0],shopRs:shopRs[0]});
	        });
	        
	        
    })
  }else{
    res.send("你还没发布营业点");
  }
});

module.exports = router;