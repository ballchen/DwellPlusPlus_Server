const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const fs = require('fs');
const mkdirp = require('mkdirp');

// routers
function getTestingCount(files) {
  let count = 0;
  for(let file of files) {
    if(file.indexOf('testing') >= 0) count ++
  }
  return count;
}

function getTrainingCount(files) {
  let count = 0;
  for(let file of files) {
    if(file.indexOf('training') >= 0) count ++
  }
  return count;
}

router.get('/', async (ctx, body) => {
  return ctx.body = 'Hello World!';
})

router.post('/pilot_study/:id', async (ctx, body) => {
  console.log(ctx.request.body);
  const id = ctx.params.id;
  const {name, mode} = ctx.request.body;
  const folder = `${__dirname}/pilot_study/${id}/${name}`;
  mkdirp.sync(folder);
  const files = fs.readdirSync(folder);
  let count = 0;

  if(mode == 'training') {
    count = getTrainingCount(files);
  } else if(mode == 'testing') {
    count = getTestingCount(files);
  }
  let fname = `${mode}_${count+1}.json`

  fs.writeFileSync(`${folder}/${fname}`, JSON.stringify(ctx.request.body));
  return ctx.body = JSON.stringify({status: 'ok'});
})

router.post('/pilot_study/2', async (ctx, body) => {

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