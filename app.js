const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const fs = require('fs');
const mkdirp = require('mkdirp');
const _ = require('lodash');

const {analyzeStudy, displayStudy1, displayStudy2} = require('./result');
const folderS1 = `${__dirname}/pilot_study/1`
const folderS2 = `${__dirname}/pilot_study/2`
const folderS3 = `${__dirname}/pilot_study/3`

// routers
function getCount(files, query) {
  let count = 0;
  for(let file of files) {
    if(file.indexOf(query) >= 0) count ++
  }
  return count;
}

router.get('/', async (ctx, body) => {
  return ctx.body = 'Hello World!';
})

router.post('/pilot_study/:id', async (ctx, body) => {
  console.log(ctx.request.body);
  const id = ctx.params.id;
  const {name, mode, vt, dt} = ctx.request.body;
  const folder = `${__dirname}/study/${id}/${name}`;
  mkdirp.sync(folder);
  const files = fs.readdirSync(folder);


  let searchQuery = `${mode}_${vt}_${dt}`;

  let  count = getCount(files, searchQuery);
  let fname = `${searchQuery}_${count+1}.json`

  fs.writeFileSync(`${folder}/${fname}`, JSON.stringify(ctx.request.body));
  return ctx.body = JSON.stringify({status: 'ok'});
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

router.get('/results/study1', async (ctx, body) => {
   let s1 = displayStudy1(folderS1, 'dt', 40)
   let result = ''
   _.each(s1, function(elem, key) {
    let name = key
    let data
    if(elem['150']) {
      data = elem['150'].segment_times.join(' ')
      result += `${key} ${data}\n`
    }
   })
   ctx.body = result;
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