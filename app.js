const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const fs = require('fs');
const mkdirp = require('mkdirp');

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
  const folder = `${__dirname}/pilot_study/${id}/${name}`;
  mkdirp.sync(folder);
  const files = fs.readdirSync(folder);


  let searchQuery = `${mode}_${vt}_${dt}`;

  let  count = getCount(files, searchQuery);
  let fname = `${searchQuery}_${count+1}.json`

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