'use strict'

const _ = require('lodash')
const fs = require('fs')

const folderS1 = `${__dirname}/pilot_study/1`
const folderS2 = `${__dirname}/pilot_study/2`
const folderS3 = `${__dirname}/pilot_study/3`

const analyzeStudy1 = () => {
  let roles = fs.readdirSync(folderS1)
  let study = {};

  for(let role of roles) {
    let files = fs.readdirSync(`${folderS1}/${role}`) 
    let dataSets = []
    for(let file of files) {
      let data = fs.readFileSync(`${folderS1}/${role}/${file}`).toString()
      data = JSON.parse(data)
      dataSets.push(data)
    }

    let classifiedDatas = _.groupBy(dataSets, 'vt')

    let finalResult = {}
    _.each(classifiedDatas, function(elem, key) {
      finalResult[key] = {}
      let rightCount = 0
      let errorSum = 0
      for(let test of _.groupBy(elem, 'mode').testing) {
        for(let rec of test.records) {
          if(rec.result == rec.quest) {
            rightCount ++
          }
          else {
            if(rec.result > rec.quest) {
              errorSum += ((rec.result - rec.quest - 1) * (test.dt + test.vt) + rec.segTime)
            }
            else if(rec.result < rec.quest) {
              errorSum += ((test.dt + test.vt) - rec.segTime + (rec.quest - rec.result - 1) * (test.dt + test.vt))
            }
          }
        }
      }

      finalResult[key].accuracy = rightCount/40
      finalResult[key].mean_error = errorSum/(40-rightCount)
      finalResult[key].error_sum = errorSum

      errorSum = 0;

    })

    console.log(finalResult)

    study[role] = finalResult

  }

  return study
}

const analyzeStudy2 = () => {
  let roles = fs.readdirSync(folderS2)
  let study = {};

  for(let role of roles) {
    let files = fs.readdirSync(`${folderS2}/${role}`) 
    let dataSets = []
    for(let file of files) {
      let data = fs.readFileSync(`${folderS2}/${role}/${file}`).toString()
      data = JSON.parse(data)
      dataSets.push(data)
    }

    let classifiedDatas = _.groupBy(dataSets, 'dt')

    let finalResult = {}
    _.each(classifiedDatas, function(elem, key) {
      finalResult[key] = {}
      let rightCount = 0
      let wrongCount = 0
      let errorSum = 0
      for(let test of _.groupBy(elem, 'mode').testing) {
        for(let rec of test.records) {
          if(rec.result == rec.quest) {
            rightCount ++
          }
          else {
            wrongCount ++ 
            if(rec.result > rec.quest) {
              errorSum += ((rec.result - rec.quest - 1) * (test.dt + test.vt) + rec.segTime)
            }
            else if(rec.result < rec.quest) {
              errorSum += ((test.dt + test.vt) - rec.segTime + (rec.quest - rec.result - 1) * (test.dt + test.vt))
            }
          }
        }
      }

      finalResult[key].accuracy = rightCount/40
      finalResult[key].mean_error = errorSum/(40-rightCount)
      finalResult[key].error_sum = errorSum

      errorSum = 0;
    })

    console.log(finalResult)

    study[role] = finalResult
  }

  return study
}


const analyzeStudy3 = () => {
  let roles = fs.readdirSync(folderS3)
  let study = {};

  for(let role of roles) {
    let files = fs.readdirSync(`${folderS3}/${role}`) 
    let dataSets = []
    for(let file of files) {
      let data = fs.readFileSync(`${folderS3}/${role}/${file}`).toString()
      data = JSON.parse(data)
      dataSets.push(data)
    }

    let classifiedDatas = _.groupBy(dataSets, 'dt')

    let finalResult = {}
    _.each(classifiedDatas, function(elem, key) {
      finalResult[key] = {}
      let rightCount = 0
      let wrongCount = 0
      let errorSum = 0
      let posErrorSum = 0
      for(let test of _.groupBy(elem, 'mode').testing) {
        
        for(let rec of test.records) {
          if(rec.result == rec.quest) {
            rightCount ++
          }
          else {
            posErrorSum += Math.abs(rec.result - rec.quest)
            wrongCount ++
            if(rec.result > rec.quest) {
              errorSum = errorSum + ((((rec.result - rec.quest - 1) * (test.dt + test.vt)) + rec.segTime))
            }
            else if(rec.result < rec.quest) {
              errorSum = errorSum + ((test.dt + test.vt) - rec.segTime + (rec.quest - rec.result - 1) * (test.dt + test.vt))
            }
          }
        }
      }
      finalResult[key].accuracy = rightCount/40
      finalResult[key].time_mean_error = errorSum/(40-rightCount)
      finalResult[key].time_sum_error = errorSum
      finalResult[key].pos_mean_error = posErrorSum/40

    })

    console.log(finalResult)

    study[role] = finalResult
  }

  return study
}

function analyzeStudy(folder, groupParam, testNum) {
  let roles = fs.readdirSync(folder)
  let study = {};

  for(let role of roles) {
    let files = fs.readdirSync(`${folder}/${role}`) 
    let dataSets = []
    for(let file of files) {
      let data = fs.readFileSync(`${folder}/${role}/${file}`).toString()
      data = JSON.parse(data)
      dataSets.push(data)
    }

    let classifiedDatas = _.groupBy(dataSets, groupParam)

    let finalResult = {}
    _.each(classifiedDatas, function(elem, key) {
      finalResult[key] = {}
      let rightCount = 0
      let wrongCount = 0
      let errorSum = 0
      let posErrorSum = 0

      //count 0~3 stats
      let first4RightCount = 0
      let first4PosErrorSum = 0
      let first4ErrorSum = 0

      for(let test of _.groupBy(elem, 'mode').testing) {
        
        for(let rec of test.records) {
          if(rec.result == rec.quest) {
            rightCount ++

            if(rec.quest < 4) {
              first4RightCount ++
            }
          }
          else {
            posErrorSum += Math.abs(rec.result - rec.quest)

            if(rec.quest < 4) {
              first4PosErrorSum += Math.abs(rec.result - rec.quest)
            }

            wrongCount ++
            if(rec.result > rec.quest) {
              errorSum = errorSum + ((((rec.result - rec.quest - 1) * (test.dt + test.vt)) + rec.segTime))
              if(rec.quest < 4) {
                first4ErrorSum += ((((rec.result - rec.quest - 1) * (test.dt + test.vt)) + rec.segTime))
              }
            }
            else if(rec.result < rec.quest) {
              errorSum = errorSum + Math.abs((test.dt + test.vt) - rec.segTime + Math.abs(rec.quest - rec.result - 1) * (test.dt + test.vt))

              if(rec.quest < 4) {
                first4ErrorSum += Math.abs((test.dt + test.vt) - rec.segTime + Math.abs(rec.quest - rec.result - 1) * (test.dt + test.vt))

              }
            }
          }
        }
      }
      finalResult[key].accuracy = rightCount/testNum
      finalResult[key].time_mean_error = errorSum/(testNum-rightCount)
      finalResult[key].pos_mean_error = posErrorSum/testNum

      finalResult[key].first_4_accuracy = first4RightCount/(testNum*0.4)
      finalResult[key].first_4_time_mean_error = first4ErrorSum/((testNum*0.4)-first4RightCount)
      finalResult[key].first_4_pos_mean_error = first4PosErrorSum/(testNum*0.4)

    })

    console.log(finalResult)

    study[role] = finalResult
  }

  return study
}

// let s1 = analyzeStudy1()
// let s2 = analyzeStudy2()


let s3 = analyzeStudy(folderS3, 'dt', 40)
let s2 = analyzeStudy(folderS2, 'dt', 40)
let s1 = analyzeStudy(folderS1, 'vt', 40)

// console.log(s1)
// console.log(s2)
console.log(s3)

