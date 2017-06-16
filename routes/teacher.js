var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var Course = require("../modules/Course");
var Chapter = require("../modules/ChapterModel");

function showCourseList(id,req,res,url){
    Course.find({uid:id},function(err,courseRs){
      if(err){
        console.log(err);
        return;
      }
      res.render(url, {coursers:courseRs});
    })
}

/* GET home page. */
router.get('/', function(req, res, next) {
  let loginbean = req.session.loginbean;
  res.locals.loginbean = loginbean;
  if(loginbean.role>0){
        showCourseList(loginbean.id,req,res,'teacher');
  }else{
    res.send('<script>alert("你无权访问");location.href="/";</script>');
  }
});


router.get('/pubcourse', function(req, res, next) {
  res.locals.loginbean = req.session.loginbean;
  res.render('pubcourse', {});
});

router.post('/pubcourse', function(req, res, next) {
  let loginbean = req.session.loginbean
  res.locals.loginbean = loginbean;
  
  var form = new formidable.IncomingForm();   //创建上传表单
  form.encoding = 'utf-8';        //设置编辑
  form.uploadDir = './public/images/courselogo/';     //设置上传目录 文件会自动保存在这里
  form.keepExtensions = true;     //保留后缀
  form.maxFieldsSize = 5 * 1024 * 1024 ;   //文件大小5M
  form.parse(req, function (err, fields, files) {
        if(err){
            console.log(err);
        }
       //console.log( fields)//这里就是post的XXX 的数据
       // console.log('上传的文件名:'+files.photo.name);//与客户端file同名
       // console.log('文件路径:'+files.photo.path);
       // res.send('接到参数,真名:'+fields.realname);
       let course = new Course({});
       course.title=fields.title;
       course.type = fields.type;
       course.logo = (files.cphoto.path).replace('public\\','');
       course.brief = fields.brief;
       course.uid = loginbean.id;
       course.uname = loginbean.nicheng;
       course.status = 0;
       course.pubtime = new Date();

       course.save(function(err,rs){
       	  if(err){
       			console.log(err);
       			res.send('数据库错误');
       			return;
       		}
       		res.send('<script>alert("创建课程成功");location.href="/teacher/";</script>');
       })
   })
});

router.get('/chapter', function(req, res, next) {
  let loginbean = req.session.loginbean;
  res.locals.loginbean = loginbean;
  if(loginbean.role>0){
        let page = parseInt(req.query.page); //第几页
        if(!page){
          page = 1;
        }
        if(page<1){
          page=1;
        }
        let cid = req.query['id'];
        let title = req.query['title'];
        //---------获得总条目数-----------------
        Chapter.count({courseid:cid,uid:loginbean.id},function(err,countRs){
          let pageLimit = 3;
          let sumPage = Math.ceil(countRs/pageLimit);
          if(page>sumPage){
            page = sumPage;
          }
          let start = (page-1)*pageLimit;
          //---------获得章节列表-----------------
          Chapter.find({courseid:cid,uid:loginbean.id}).skip(start).limit(pageLimit).exec(function(err,coursers){    
              if(!coursers){
                  coursers=[];
              }
              res.render('chapter', {cid:cid,title:title,coursers:coursers,page:page,sumpage:sumPage,countrs:countRs});
          })
        })
        
        // Chapter.find({courseid:cid,uid:loginbean.id},function(err,coursers){    
        //     if(coursers){
        //         res.render('chapter', {cid:cid,title:title,coursers:coursers});
        //     }
        // });
        //--------------------------------------
        
  }else{
    res.send('<script>alert("你无权访问");location.href="/";</script>');
  }
});


router.post('/addchapter', function(req, res, next) {
  let loginbean = req.session.loginbean;
  res.locals.loginbean = loginbean;
  if(loginbean.role>0){
        let chapter = new Chapter({});
        chapter.title = req.body.title;
        chapter.content = req.body.content;
        chapter.courseid = req.body.courseid;
        chapter.uid = loginbean.id;
        chapter.save(function(err,rs){
          if(err){
            console.log(err);
            res.send('创建章节错误,稍后重试');
            return;
          }
          res.redirect(req.body.chapterurl);
          return;
        })
  }else{
    res.send('<script>alert("你无权访问");location.href="/";</script>');
  }
});

router.post('/updchapter', function(req, res, next) {
  let loginbean = req.session.loginbean;
  res.locals.loginbean = loginbean;
  if(loginbean.role>0){
        let chapterid = req.body.chapterid;
        let chapter = {};
        chapter.title = req.body.title;
        chapter.content = req.body.content;
        Chapter.update({_id:chapterid,uid:loginbean.id},{$set:chapter},function(err,rs){
          if(err){
            console.log(err);
            res.send('修改章节错误,稍后重试');
            return;
          }
          res.redirect(req.body.chapterurl);
          return;
        })
  }else{
    res.send('<script>alert("你无权访问");location.href="/";</script>');
  }
});


router.get('/delchapter', function(req, res, next) {
  let loginbean = req.session.loginbean;
  res.locals.loginbean = loginbean;
  if(loginbean.role>0){
        let chapterid = req.query['chapterid'];
        Chapter.remove({_id:chapterid,uid:loginbean.id},function(err,rs){
          if(err){
            res.send('数据库错误');
            return;
          }
          res.redirect(req.query['url']);
        })
  }else{
    res.send('<script>alert("你无权访问");location.href="/";</script>');
  }
});


router.get('/getChapter', function(req, res, next) {
  let loginbean = req.session.loginbean;
  res.locals.loginbean = loginbean;
  let chapterid = req.query.chapterid;
  Chapter.findOne({_id:chapterid,uid:loginbean.id},function(err,rs){
    if(err){
      res.send('查询错误');
      return;
    }
    let jsonRs = JSON.parse('{}');
    jsonRs.id = rs._id;
    jsonRs.title = rs.title;
    jsonRs.content = rs.content;
    res.send(jsonRs);
  })
})

router.get('/showchapter', function(req, res, next) {
  let loginbean = req.session.loginbean;
  res.locals.loginbean = loginbean;
  let chapterid = req.query.chapterid;
  Chapter.findOne({_id:chapterid,uid:loginbean.id},function(err,rs){
    if(err){
      res.send('查询错误');
      return;
    }
    res.render('showchapter',{rs:rs});
  })
})

router.get('/reviewcourse', function(req, res, next) {
  let loginbean = req.session.loginbean;
  res.locals.loginbean = loginbean;
  let cid = req.query.cid;
  Course.update({_id:cid,uid:loginbean.id},{$set:{status:1}},function(err,rs){
    if(err){
      res.send('查询错误');
      return;
    }
    res.redirect('/teacher');
  })
})

module.exports = router;
