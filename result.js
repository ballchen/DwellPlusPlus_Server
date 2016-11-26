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
      for(let test of _.groupBy(elem, 'mode').testing) {
        
        for(let rec of test.records) {
          if(rec.result == rec.quest) {
            rightCount ++
          }
          else {
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
      finalResult[key].mean_error = errorSum/(40-rightCount)
      finalResult[key].error_sum = errorSum

    })

    console.log(finalResult)

    study[role] = finalResult
  }

  return study
}

analyzeStudy1()
analyzeStudy2()
analyzeStudy3()