'use strict'

const _ = require('lodash');
const fs = require('fs');

const folderS1 = `${__dirname}/pilot_study/1`
const folderS2 = `${__dirname}/pilot_study/2`
const folderS3 = `${__dirname}/pilot_study/3`


let roles = fs.readdirSync(folderS1)

for(let role of roles) {
  fs.readdirSync(`${folderS1}/role`) {

  }
}