const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const fs = require('fs');
const mkdirp = require('mkdirp');
const _ = require('lodash');

const {analyzeStudy, displayStudy1, displayStudy2, displayFormalStudy1, displayFormalStudy1Raw} = require('./result');
const folderS1 = `${__dirname}/pilot_study/1`
const folderS2 = `${__dirname}/pilot_study/2`
const folderS3 = `${__dirname}/pilot_study/3`

const folderFormalStudy1 = `${__dirname}/study/1`

// routers
function getCount(files, query) {
  let count = 0;
  for(let file of files) {
    if(file.indexOf(query) >= 0) count ++
  }
  return count;
}

router.get('/', async (ctx, body) => {
  return ctx.body = 'ok';
})

router.post('/pilot_study/:id', async (ctx, body) => {
  console.log(ctx.request.body);
  const id = ctx.params.id;
  const {name, mode, vt, dt} = ctx.request.body;
  const folder = `${__dirname}/study/${id}_forcast/${name}`;
  mkdirp.sync(folder);
  const files = fs.readdirSync(folder);


  let searchQuery = `${mode}_${vt}_${dt}`;

  let  count = getCount(files, searchQuery);
  let fname = `${searchQuery}_${count+1}.json`

  fs.writeFileSync(`${folder}/${fname}`, JSON.stringify(ctx.request.body));
  return ctx.body = JSON.stringify({status: 'ok', count: count+1});
})

router.post('/study/1', async (ctx, body) => {
  console.log(ctx.request.body);
  const id = 1;
  const {name, finger} = ctx.request.body;
  const folder = `${__dirname}/study/${id}/${name}`;
  mkdirp.sync(folder);
  const files = fs.readdirSync(folder);

  let searchQuery = `${finger}`;


  let  count = getCount(files, searchQuery);
  let fname = `${searchQuery}_${count+1}.json`

  fs.writeFileSync(`${folder}/${fname}`, JSON.stringify(ctx.request.body));
  return ctx.body = JSON.stringify({status: 'ok', count: count+1});
})

router.post('/study/2', async (ctx, body) => {
  console.log(ctx.request.body);
  const id = 2;
  const {name, finger, mode, vt, dt} = ctx.request.body;
  const folder = `${__dirname}/study/${id}/${name}/${finger}`;
  mkdirp.sync(folder);
  const files = fs.readdirSync(folder);

  let searchQuery = `${mode}_${vt}_${dt}`;

  let  count = getCount(files, searchQuery);
  let fname = `${searchQuery}_${count+1}.json`

  fs.writeFileSync(`${folder}/${fname}`, JSON.stringify(ctx.request.body));
  return ctx.body = JSON.stringify({status: 'ok', count: count+1});
})

router.post('/study/3', async (ctx, body) => {
  console.log(ctx.request.body);
  const id = 3;
  const {name, finger, mode, vt, dt} = ctx.request.body;
  const folder = `${__dirname}/study/${id}/${name}/${finger}`;
  mkdirp.sync(folder);
  const files = fs.readdirSync(folder);

  let searchQuery = `${mode}_${vt}_${dt}`;

  let  count = getCount(files, searchQuery);
  let fname = `${searchQuery}_${count+1}.json`

  fs.writeFileSync(`${folder}/${fname}`, JSON.stringify(ctx.request.body));
  return ctx.body = JSON.stringify({status: 'ok', count: count+1});
})



router.get('/results', async (ctx, body) => {
  let result = {};
  let s3 = analyzeStudy(folderS3, 'dt', 40)
  let s2 = analyzeStudy(folderS2, 'vt', 40)
  let s1 = analyzeStudy(folderS1, 'dt', 40)

  result['study1'] = s1;
  result['study2'] = s2;
  result['study3'] = s3;

  ctx.body = result;
})

router.get('/results/study1/:name/raw', async (ctx, body) => {
  const name = ctx.params.name;
  let result = displayFormalStudy1Raw(name)
  
  ctx.body = result;
})

router.get('/results/study1/:name', async (ctx, body) => {
  const name = ctx.params.name;
  let result = displayFormalStudy1(name)
  
  ctx.body = result;
})


router.get('/study2/progress/:name', async (ctx, body) => {
  const name = ctx.params.name;
  const folder = `${__dirname}/study/2/${name}/`;
  try {
      const fingers = fs.readdirSync(folder);
    if(!fingers) {
      return ctx.body = [];
    }
    let result = {};

    for(let f of fingers) {
      let datas = fs.readdirSync(`${folder}/${f}`) 
      
      result[f] = datas;
      
    }

    return ctx.body = result;
  } catch(e) {
    return ctx.body = [];
  }


})


router.get('/results/study2', async (ctx, body) => {
  let s1 = displayStudy2(folderS2, 'vt', 40)
  let result = ''
  _.each(s1, function(elem, key) {
    let name = key
    let data
    result += name;
    result += `\n`;
    _.each(elem, function(e, k) {
      let vt = k;
      result += vt;
      result += `\n`;

      _.each(e, function(j, i) {
        console.log(j)
        result += j.join(' ')
      })

      result += '\n'

    })
    
  })

  ctx.body = result;
})


router.post('/pilot_study/1', async (ctx, body) => {

})
// x-response-time

app.use(bodyParser());

app.use(async function (ctx, next) {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// logger

app.use(async function (ctx, next) {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});

app.use(router.routes());

app.listen(3000);