const {displayStudy2, analyzeStudy} = require('./result')
const _ = require('lodash')
const fs = require('fs')
const folderS2 = `${__dirname}/pilot_study/2`
const folderS3 = `${__dirname}/pilot_study/3`

let s1 = analyzeStudy(folderS3, 'dt', 40)
let result = ''
_.each(s1, function(elem, key) {
  let name = key
  let data
  result += name;
  result += `\n`;
  _.each(elem, function(e, k) {
    let vt = k;
    result += vt +' ';
    // result += e.accuracy + ' ';
    // result += `\n`
    // result += e.first_4_accuracy  + ' ';
    // result += `\n`;
    result += e.every_pos_error_first_four.join(' ');
    result += `\n`;
 

  })
  
})

console.log(result)

fs.writeFileSync('./result_3_first4.txt', result)