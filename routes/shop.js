var router = require('express').Router();

router.get('/shirts',function(요청,응답){
    응답.send('셔츠 파는 페이지입니다.')
})
router.get('/pants',function(요청,응답){
    응답.send('바지 파는 페이지입니다.')
})

//module.export: 이파일에서 어떤 변수를 배출하겠습니다., require :파일혹은 라이브러리를 갖다쓰겠습니다.
module.exports= router;