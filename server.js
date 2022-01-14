// const express = require('express')//서버오픈하는 문법
// const app =express();//서버오픈하는 새로운 객체
// const bodyParser =require('body-parser');//요청사항을 원하는 형태로 데이터에 파싱
// app.use(bodyParser.urlencoded({extended:true}))
// const MongoClient = require('mongodb').MongoClient;//몽고DB생성
// app.set('View engine','ejs')//DB정보 HTML에 입력해주는 라이브러리
// var db
// MongoClient.connect('mongodb+srv://knh18:knh1579@cluster0.tqghu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', function(에러, client){
// //연결되면 할일    
// if (에러) return console.log(에러);
//     db = client.db('todoapp')   
//     app.listen('8080', function(){
//       console.log('listening on 8080')
//     });

//   })


// //누군가/pet으로 방문을 하면 pet관련 안내문을 띄워주자

// app.get('/pet', (request,response)=>{
//     response.send('pet용품 쇼핑할 수 있는 페이지입니다')

// });

// app.get('/write', (request,response)=>{
//     response.sendFile(__dirname +'/write.html')
// })

// app.get('/', (request,response)=>{
//     response.sendFile(__dirname +'/index.html')
// })

// //어떤사람이 /add경로로 post요청을 하면?? 를 해주세요
// app.post('/add',function(request,response){
//     response.send('전송완료');
//     db.collection('counter').findOne({name:'게시물갯수'},function(에러,결과){
//         console.log(결과.totalpost)
//         var 총게시물갯수 = 결과.totalpost;       
//         db.collection('post').insertOne({_id:총게시물갯수+1, 제목:request.body.title, 날짜:request.body.date},function(에러,결과){
//             console.log('저장완료')
//             db.collection('counter').updateOne({
//                 //어떤데이터를 수정
//                 name:'게시물갯수'
//             },
//             {
//                 //수정값
//                 $inc:{totalpost:1}

//             },function(){

//             })
//         })
//     })

// })

// //API 프로그램간의 통신 규약 웹개발시 서버랑 고객간의 요청방식 서버랑 어떻게 통신하면 되는지 방법의 규약
// //REST API -URL명사로 작성 - 하위문서를 나타낼땐 '/' 사용 -파일확장자'html'쓰지말기 - 띄워쓰기는 '-'사용 -자료하나당 하나의URL
// //list로 get요청하면 실제 DB에 저장된 데이터들로 예쁘게 꾸며진 HTML을 보여줌
// app.get('/list',function(요청,응답){
//     db.collection('post').find().toArray(function(에러,결과){
//         응답.render('list.ejs',{posts:결과})
//     });
//     //디비에 저장된 post라는 collection 안의 (제목, 모든) 데이터를 꺼내주세요 

// })
const express = require('express') //서버를 띄우기 위한 기본세팅
const app = express()
//서버 사용자간 양방향 소통을 위한 셋팅
const http= require('http').createServer(app)
const {Server} = require('socket.io')
const io= new Server(http)

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
    extended: true
}))
const MongoClient = require('mongodb').MongoClient;
const donenv = require('dotenv').config()
const methodOverride = require('method-override')
app.use(methodOverride('_method'))
var db
app.set('view engine', 'ejs')
app.use('/public', express.static('public'))
MongoClient.connect(process.env.DB_URL, function (에러, client) {
    //db접속 연결되면 할일
    if (에러) return console.log(에러)
    db = client.db('todoapp') //todoapp이라는 database에 연결
    app.db=db;

    http.listen(process.env.PORT, function () {
        //서버가 열렸을때 할일 
        console.log('listening on 8080')
    });
})

app.get('/pet', function (요청, 응답) {
    응답.send('펫용품 쇼핑할 수 있는 페이지입니다.')
})
app.get('/beauty', function (요청, 응답) {
    응답.send('뷰티용품 쇼핑할 수 있는 페이지입니다.')
})
app.get('/', function (요청, 응답) {
    응답.render('index.ejs')
})
app.get('/write', function (요청, 응답) {
    응답.render('write.ejs')
})



app.get('/list', function (요청, 응답) {
    //디비에 저장된 포스트라는 collection안의 모든 데이터를 꺼내주세요 
    db.collection('post').find().toArray(function (에러, 결과) {
        응답.render('list.ejs', {
            posts: 결과
        })

    }); //모든데이터 가져오기
})


//detail로 겟요청을 하면 detail.ejs로 들어가게
// app.get('/detail/:id', function (요청, 응답) {
//     db.collection('post').findOne({
//         _id: parseInt(요청.params.id)
//     }, function (에러, 결과) {
//         console.log(결과)
//         응답.render('detail.ejs', {
//             data: 결과
//         })
//     })

// })

// app.get('/edit/:id', function (요청, 응답) {
//     db.collection('post').findOne({
//         _id: parseInt(요청.params.id)
//     }, function (에러, 결과) {
//         응답.render('edit.ejs', {
//             post: 결과
//         })
//     })

// })

app.put('/edit', function (요청, 응답) {
    //폼에 담긴 제목데이터, 날짜데이터를 가지고 db.collection에다가 업데이트함
    db.collection('post').updateOne({
            //어떤값을 수정
            _id: parseInt(요청.body.id)
        }, {
            //수정값
            $set: {
                할일: 요청.body.title,
                날짜: 요청.body.date
            }
        },
        function () {

        })

})

const passport = require('passport')
const LocalStrategy = require('passport-local')
const session = require('express-session');
const router = require('./routes/shop.js');


app.use(session({
    secret: '비밀코드',
    resave: true,
    saveUninitialized: false
}));
app.use(passport.initialize())
app.use(passport.session())
//app.use는 미들웨어: 웹서버 요청-응답 중간에 실행되는 코드

app.post('/login', passport.authenticate('local', {
    failureRedirect: 'fail'
}), function (요청, 응답) {
    응답.redirect('/')
})

app.get('/login', function (요청, 응답) {
    응답.render('login.ejs')
})

passport.use(new LocalStrategy({
    usernameField: 'id',
    passwordField: 'pw',
    session: true,
    passReqToCallback: false,
}, function (입력한아이디, 입력한비번, done) {
    //console.log(입력한아이디, 입력한비번);
    db.collection('login').findOne({
        id: 입력한아이디
    }, function (에러, 결과) {
        if (에러) return done(에러)

        if (!결과) return done(null, false, {
            message: '존재하지않는 아이디요'
        })
        if (입력한비번 == 결과.pw) {
            return done(null, 결과)
        } else {
            return done(null, false, {
                message: '비번틀렸어요'
            })
        }
    })
}));

passport.serializeUser(function (user, done) {
    done(null, user.id)
})
passport.deserializeUser(function (아이디, done) {
    db.collection('login').findOne({
        id: 아이디
    }, function (에러, 결과) {
        //DB에서 위에 있는 USER.ID로 유저를 찾은 뒤에 유저 정보를 아래 결과에 넣음 개인정보를 DB에서 찾는 역할
        done(null, 결과)
    })
});

app.post('/register', function (요청, 응답) {
    db.collection('login').findOne({
        id: 요청.body.id
    }, function (에러, 결과) {
        if (결과) {
            console.log("에러")
        } else {
            db.collection('login').insertOne({
                id: 요청.body.id,
                pw: 요청.body.pw
            }, function (에러, 결과) {
                //저장전에 id가 이미 있는지 먼저 찾아봐야
                //id에 알파벳숫자만 잘들어있나
                //비번저장전에 암호화했나
                응답.redirect('/')
            })
        }
    })


})
//delete요청방법 1.method-override라이브러리 이용 2.ajax를 이용
app.delete('/delete', function (요청, 응답) {
    요청.body._id = parseInt(요청.body._id)

    var 삭제할데이터 = {
        _id: 요청.body._id,
        작성자: 요청.user.id
    }
    db.collection('post').deleteOne(삭제할데이터, function (에러, 결과) {
        console.log('삭제완료')
        if (에러) console.log(에러)
        응답.status(200).send({
            message: '성공했습니다.'
        })
    })

})
app.post('/add', function (요청, 응답) {
    console.log(요청.user.id)
    응답.send('전송완료')
    db.collection('counter').findOne({
        name: '게시물갯수'
    }, function (에러, 결과) {
        var 총게시물갯수 = 결과.totalPost;
        var 저장할거 = {
            _id: 총게시물갯수 + 1,
            할일: 요청.body.title,
            날짜: 요청.body.date,
            작성자: 요청.user.id
        }
        db.collection('post').insertOne(저장할거, function (에러, 결과) {
            console.log('저장완료')
            db.collection('counter').updateOne({
                //어떤데이터를 수정할지
                name: '게시물갯수'
            }, {
                //수정값 $set바꿔주세요 $ind증가시켜주세요
                $inc: {
                    totalPost: 1
                }
            }, function () {
                if (에러) {
                    return 에러
                }
            })
        });
        //counter에 totalpost 항목도 1증가
    })
});

app.get('/mypage', 로그인했니, function (요청, 응답) {
    console.log(요청.user)
    응답.render('mypage.ejs', {
        사용자: 요청.user
    })
})

function 로그인했니(요청, 응답, next) {
    if (요청.user) {
        next()
    } else {
        응답.send('로그인 안하셨는데요')
    }
}

app.get('/search', (요청, 응답) => {
    var 검색조건 = [{
            $search: {
                index: 'titleSearch',
                text: {
                    query: 요청.query.value,
                    path: ['할일', '날짜'] // 제목날짜 둘다 찾고 싶으면 ['제목', '날짜']
                }
            }
        },
        // {$sort:{_id:1}},
        // {$limit:10}
        {
            $project: {
                할일: 1,
                _id: 0,
                score: {
                    $meta: "searchScore"
                }
            }
        }
    ]
    db.collection('post').aggregate(검색조건).toArray((에러, 결과) => {
        응답.render('search.ejs', {
            posts: 결과
        })
    })
});
router.use('shirts', 로그인했니);
app.use('/shop', require('./routes/shop.js'))
app.use('/board/sub', require('./routes/board.js'))
let multer = require('multer');
const { ChangeStream } = require('mongodb');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/image')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    },
    filefilter: function (req, file, cb) {
        var ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
            return callback(new Error('PNG, JPG만 업로드하세요'))
        }
        callback(null, true)
    },
    limits: {
        fileSize: 1024 * 1024
    }
})
var upload = multer({
    storage: storage
})
app.get('/upload', function (요청, 응답) {
    응답.render('upload.ejs')
})
app.post('/upload', upload.array('profile', 10), function (요청, 응답) {
    응답.send('업로드완료')
});

app.get('/image/:imgName', function (요청, 응답) {
    응답.sendFile(__dirname + '/public/image/' + 요청.params.imgName)
})

app.post('/chatroom', 로그인했니, function (요청, 응답) {
    console.log(요청.body.당한사람id)
    var 저장할거 = {
        title: '채팅방이름',
        member: [요청.body.당한사람id, 요청.user.id],
        date: new Date()
    }
    db.collection('chatroom').insertOne(저장할거).then((결과) => {
        응답.send('저장완료')
    })
})

app.get('/chat', 로그인했니, function (요청, 응답) {
    db.collection('chatroom').find({
        member: 요청.user.id
    }).toArray().then((결과) => {
        응답.render('chat.ejs', {
            data: 결과
        })
    })
    //모든데이터 가져오기

})

app.post('/message', 로그인했니, function (요청, 응답) {
    console.log(요청.body)
    var 저장할거 = {
        parent: 요청.body.parent,
        content: 요청.body.content,
        userid: 요청.user.id,
        date: new Date()
    }
    db.collection('message').insertOne(저장할거).then(() => {
        console.log('성공')
    })
})
app.get('/message/:id', 로그인했니, function (요청, 응답) {

    응답.writeHead(200, {
        "Connection": "keep-alive",
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
    });
    //messageDB에 DATA요청
    db.collection('message').find({
        parent: 요청.params.id
    }).toArray().then((결과) => {
        응답.write('event: test\n');
        응답.write('data:' + JSON.stringify(결과) + '\n\n');
    })
    //DB에 변동시 실시간으로 나오게
    const pipeline = [{
        $match: { 'fullDocument.parent': 요청.params.id}
    }]
    const collection = db.collection('message')
    const changeStream = collection.watch(pipeline)
    changeStream.on('change',(result)=>{
        응답.write('event: test\n');
        응답.write('data:' + JSON.stringify([result.fullDocument]) + '\n\n');
    })

});
app.get('/socket',function(요청,응답){
    응답.render('socket.ejs')
})
io.on('connection',function(socket){
    socket.on('user-send',function(data){
      console.log(data)
      io.emit('broadcast','반가워')
    })
  
})