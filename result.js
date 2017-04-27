'use strict'

const _ = require('lodash')
const fs = require('fs')

const folderS1 = `${__dirname}/pilot_study/1`
const folderS2 = `${__dirname}/pilot_study/2`
const folderS3 = `${__dirname}/pilot_study/3`

const folderFormalS1 = `${__dirname}/study/1`
const folderFormalS2 = `${__dirname}/study/2`

const folderFormalS3 = `${__dirname}/study/3`
const folderFormalS3Makey = `${__dirname}/study/4`


const Accuracy = (records) => {
  let totalCorrect = 0;

  for(let rec of records) {
    totalCorrect += (rec.quest == rec.result)
  }

  let accuracy = totalCorrect / records.length
  return accuracy
}

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
      let posErrors = [];
      let posErrorFirst4 = [];

      //count 0~3 stats
      let first4RightCount = 0
      let first4PosErrorSum = 0
      let first4ErrorSum = 0

      //study1 segtime
      let study1SegTimeSum = 0;

      for(let test of _.groupBy(elem, 'mode').testing) {
        
        for(let rec of test.records) {
          posErrors.push((rec.result - rec.quest))


          if(rec.quest < 4) {
            posErrorFirst4.push((rec.result - rec.quest))
          }

          if(rec.result == rec.quest) {
            rightCount ++

            if(rec.quest < 4) {
              first4RightCount ++
            }

            if(rec.quest != 0) {
              study1SegTimeSum += rec.segTime
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

      finalResult[key].mean_segment_time = study1SegTimeSum/(testNum-4)
      finalResult[key].every_pos_error = posErrors
      finalResult[key].every_pos_error_first_four = posErrorFirst4

    })

    console.log(finalResult)

    study[role] = finalResult
  }

  return study
}


function displayStudy1(folder, groupParam, testNum) {
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

      //study1 segtime
      let study1SegTimeSum = 0;
      let study1SegTime = [];

      for(let test of _.groupBy(elem, 'mode').testing) {
        
        for(let rec of test.records) {
          if(rec.quest != 0 && rec.quest == rec.result) {
            study1SegTime.push(rec.segTime)
          }
        }
      }
      finalResult[key].segment_times = study1SegTime;


    })

    study[role] = finalResult
  }

  return study
}

function displayStudy2(folder, groupParam, testNum) {
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

      //study1 segtime
      let study1SegTimeSum = 0;
      let study1SegTime = [];
      let study2EveryTime = {};

      for(let test of _.groupBy(elem, 'mode').testing) {
        for(let rec of test.records) {
            if(!study2EveryTime[rec.quest]) study2EveryTime[rec.quest] = [];

            study2EveryTime[rec.quest].push((rec.result == rec.quest) ? 'O' : 'X')
        }
      }
      finalResult[key] = study2EveryTime;


    })

    study[role] = finalResult
  }

  return study
}

function displayFormalStudy1 (name) {
  let tests = fs.readdirSync(`${folderFormalS1}/${name}`)

  if(!tests || tests.length == 0) {
    return null
  }
  console.log(`${folderFormalS1}/${name}`)
  let result = `---------------------------\n`

  for (let test of tests) {  
    let context = JSON.parse(fs.readFileSync(`${folderFormalS1}/${name}/${test}`))
    let groupedRecord = _.groupBy(context.records, 'mode')

    result += `${context.name} - ${context.finger}\n`

    let trainAverageTime = 0
    let trainCorrectCount = 0
    let trainCorrectAccuracy = 0;

    let testAverageTime = 0
    let testCorrectCount = 0
    let testCorrectAccuracy = 0;

    for (let t of groupedRecord.training) {
      if(t.time > 0) {
        trainCorrectCount ++
        trainAverageTime += t.time
      }
    }

    trainAverageTime = trainAverageTime/trainCorrectCount
    trainCorrectAccuracy = trainCorrectCount/20


    for (let t of groupedRecord.testing) {
      if(t.time > 0) {
        testCorrectCount ++
        testAverageTime += t.time
      }
    }

    testAverageTime = testAverageTime/testCorrectCount
    testCorrectAccuracy = testCorrectCount/50


    result += `Train\n avg: ${trainAverageTime} \n accuracy: ${trainCorrectAccuracy}\n`
    result += `Test\n avg: ${testAverageTime} \n accuracy: ${testCorrectAccuracy}\n`
    result += `---------------------------\n`
  }

  return result
}

function displayFormalStudy1Raw (name) {
  let tests = fs.readdirSync(`${folderFormalS1}/${name}`)

  if(!tests || tests.length == 0) {
    return null
  }

  let result = `---------------------------\n`

  for (let test of tests) {  
    let context = JSON.parse(fs.readFileSync(`${folderFormalS1}/${name}/${test}`))
    let groupedRecord = _.groupBy(context.records, 'mode')

    result += `${context.name} - ${context.finger}\n`

    for (let t of groupedRecord.training) {
      result += `${t.round} - time: ${t.time}, dt: ${t.dt}\n`
    }


    for (let t of groupedRecord.testing) {
      result += `${t.round} - time: ${t.time}, dt: ${t.dt}\n`
    }

    result += `---------------------------\n`
  }

  return result
}



function displayFormalStudy2 (name) {
  let folder = `${folderFormalS2}/${name}`;
  let thumbFolder = `${folder}/thumb`
  let indexFolder = `${folder}/index`

  let indexTests = fs.readdirSync(indexFolder)
  let thumbTests = fs.readdirSync(thumbFolder)

  let result ={};

  result.name = name;
  result.index = {};
  result.index.blockAccuracy = {};
  result.index.blockAccuracy0to4 = {}
  result.thumb = {};
  result.thumb.blockAccuracy = {};
  result.thumb.blockAccuracy0to4 = {}


  let totalIndexRecords = [];
  let totalIndexFirstRecord = [];
  let totalThumbRecords = [];
  let totalThumbFirstRecord = []

  let firstBlkIndexRecord = []
  let firstBlkThumbRecord = []

  for(let test of indexTests) {
    if(test.indexOf('train') < 0) {
      let data = JSON.parse(fs.readFileSync(`${indexFolder}/${test}`))
      result.dt = data.dt


      totalIndexFirstRecord.push(data.records[0])
      totalIndexRecords = totalIndexRecords.concat(data.records)
      let blockAccu = Accuracy(data.records)
       let blockAccu024 = Accuracy(_.filter(data.records, function(o){return o.quest <= 3}))
      let blkNum  = test.match(/testing_\d+_\d+_(\d).json/)[1]

      if(parseInt(blkNum) < 5) {
        console.log(parseInt(blkNum))
        firstBlkIndexRecord = firstBlkIndexRecord.concat(data.records)
      }

      result.index.blockAccuracy[blkNum] = blockAccu
      result.index.blockAccuracy0to4[blkNum] = blockAccu024

    }
  }

  for(let test of thumbTests) {
    if(test.indexOf('train') < 0) {
      let data = JSON.parse(fs.readFileSync(`${thumbFolder}/${test}`))
      result.dt = data.dt

      totalThumbFirstRecord.push(data.records[0])
      totalThumbRecords = totalThumbRecords.concat(data.records)
      let blockAccu = Accuracy(data.records)
      let blockAccu024 = Accuracy(_.filter(data.records, function(o){return o.quest <= 3}))
      console.log(test)
      let blkNum  = test.match(/testing_\d+_\d+_(\d+).json/)[1]

      if(parseInt(blkNum) < 5) {
        firstBlkThumbRecord = firstBlkThumbRecord.concat(data.records)
      }

      result.thumb.blockAccuracy[blkNum] = blockAccu
      result.thumb.blockAccuracy0to4[blkNum] = blockAccu024
    }
  }


  let IndexfirstTryAccuracy = Accuracy(totalIndexFirstRecord)
  let Indexaccuracys = {}

  let IndexGroupedByQuest = _.groupBy(totalIndexRecords, 'quest')

  for (let key of Object.keys(IndexGroupedByQuest)) {
    Indexaccuracys[key] = Accuracy(IndexGroupedByQuest[key]);
    
  }

  let firstBlkIndexAccuracys = {}
  let firstBlkIndexGroupedByQuest = _.groupBy(firstBlkIndexRecord, 'quest')

  for (let key of Object.keys(firstBlkIndexGroupedByQuest)) {
    firstBlkIndexAccuracys[key] = Accuracy(firstBlkIndexGroupedByQuest[key])
  }

  let ThumbfirstTryAccuracy = Accuracy(totalThumbFirstRecord)
  let Thumbaccuracys = {}

  let ThumbGroupedByQuest = _.groupBy(totalThumbRecords, 'quest')

  for (let key of Object.keys(ThumbGroupedByQuest)) {
    Thumbaccuracys[key] = Accuracy(ThumbGroupedByQuest[key]);
    
  }

  let firstBlkThumbAccuracys = {}
  let firstBlkThumbGroupedByQuest = _.groupBy(firstBlkThumbRecord, 'quest')

  for (let key of Object.keys(firstBlkThumbGroupedByQuest)) {
    firstBlkThumbAccuracys[key] = Accuracy(firstBlkThumbGroupedByQuest[key])
  }

  result.index.questAccuracy = Indexaccuracys;
  result.index.firstTryAccuracy = IndexfirstTryAccuracy;
  result.index.first4blkAccuracy = firstBlkIndexAccuracys;

  result.thumb.questAccuracy = Thumbaccuracys;
  result.thumb.firstTryAccuracy = ThumbfirstTryAccuracy;
  result.thumb.first4blkAccuracy = firstBlkThumbAccuracys;

  return result;

}

function displayFormalStudy3 (name) {
  let folder = `${folderFormalS3}/${name}`;
  let thumbFolder = `${folder}/thumb`
  let indexFolder = `${folder}/index`

  let indexTests = fs.readdirSync(indexFolder)
  let thumbTests = fs.readdirSync(thumbFolder)

  let result ={};

  result.name = name;
  result.index = {};
  result.index.blockAccuracy = {};
  result.index.blockAccuracy0to4 = {}
  result.thumb = {};
  result.thumb.blockAccuracy = {};
  result.thumb.blockAccuracy0to4 = {}


  let totalIndexRecords = [];
  let totalIndexFirstRecord = [];
  let totalThumbRecords = [];
  let totalThumbFirstRecord = []

  for(let test of indexTests) {
    if(test.indexOf('train') < 0) {
      let data = JSON.parse(fs.readFileSync(`${indexFolder}/${test}`))
      result.dt = data.dt


      totalIndexFirstRecord.push(data.records[0])
      totalIndexRecords = totalIndexRecords.concat(data.records)
      let blockAccu = Accuracy(data.records)
       let blockAccu024 = Accuracy(_.filter(data.records, function(o){return o.quest <= 3}))
      let blkNum  = test.match(/testing_\d+_\d+_(\d).json/)[1]
      result.index.blockAccuracy[blkNum] = blockAccu
      result.index.blockAccuracy0to4[blkNum] = blockAccu024

    }
  }

  for(let test of thumbTests) {
    if(test.indexOf('train') < 0) {
      let data = JSON.parse(fs.readFileSync(`${thumbFolder}/${test}`))
      result.dt = data.dt

      totalThumbFirstRecord.push(data.records[0])
      totalThumbRecords = totalThumbRecords.concat(data.records)
      let blockAccu = Accuracy(data.records)
      let blockAccu024 = Accuracy(_.filter(data.records, function(o){return o.quest <= 3}))
      console.log(test)
      let blkNum  = test.match(/testing_\d+_\d+_(\d+).json/)[1]
      result.thumb.blockAccuracy[blkNum] = blockAccu
      result.thumb.blockAccuracy0to4[blkNum] = blockAccu024
    }
  }


  let IndexfirstTryAccuracy = Accuracy(totalIndexFirstRecord)
  let Indexaccuracys = {}

  let IndexGroupedByQuest = _.groupBy(totalIndexRecords, 'quest')

  for (let key of Object.keys(IndexGroupedByQuest)) {
    Indexaccuracys[key] = Accuracy(IndexGroupedByQuest[key]);
    
  }


  let ThumbfirstTryAccuracy = Accuracy(totalThumbFirstRecord)
  let Thumbaccuracys = {}

  let ThumbGroupedByQuest = _.groupBy(totalThumbRecords, 'quest')

  for (let key of Object.keys(ThumbGroupedByQuest)) {
    Thumbaccuracys[key] = Accuracy(ThumbGroupedByQuest[key]);
    
  }

  result.index.questAccuracy = Indexaccuracys;
  result.index.firstTryAccuracy = IndexfirstTryAccuracy;

  result.thumb.questAccuracy = Thumbaccuracys;
  result.thumb.firstTryAccuracy = ThumbfirstTryAccuracy;

  return result;

}


function displayFormalStudy3Makey (name) {
  let folder = `${folderFormalS3Makey}/${name}`;
  let thumbFolder = `${folder}/index`
  let indexFolder = `${folder}/index`

  let indexTests = fs.readdirSync(indexFolder)
  let thumbTests = fs.readdirSync(thumbFolder)

  let result ={};

  result.name = name;
  result.index = {};
  result.index.blockAccuracy = {};
  result.index.blockAccuracy0to4 = {}
  result.thumb = {};
  result.thumb.blockAccuracy = {};
  result.thumb.blockAccuracy0to4 = {}


  let totalIndexRecords = [];
  let totalIndexFirstRecord = [];
  let totalThumbRecords = [];
  let totalThumbFirstRecord = []

  for(let test of indexTests) {
    if(test.indexOf('train') < 0) {
      let data = JSON.parse(fs.readFileSync(`${indexFolder}/${test}`))
      result.dt = data.dt


      totalIndexFirstRecord.push(data.records[0])
      totalIndexRecords = totalIndexRecords.concat(data.records)
      let blockAccu = Accuracy(data.records)
       let blockAccu024 = Accuracy(_.filter(data.records, function(o){return o.quest <= 3}))
      let blkNum  = test.match(/testing_\d+_\d+_(\d).json/)[1]
      result.index.blockAccuracy[blkNum] = blockAccu
      result.index.blockAccuracy0to4[blkNum] = blockAccu024

    }
  }

  for(let test of thumbTests) {
    if(test.indexOf('train') < 0) {
      let data = JSON.parse(fs.readFileSync(`${thumbFolder}/${test}`))
      result.dt = data.dt

      totalThumbFirstRecord.push(data.records[0])
      totalThumbRecords = totalThumbRecords.concat(data.records)
      let blockAccu = Accuracy(data.records)
      let blockAccu024 = Accuracy(_.filter(data.records, function(o){return o.quest <= 3}))
      console.log(test)
      let blkNum  = test.match(/testing_\d+_\d+_(\d+).json/)[1]
      result.thumb.blockAccuracy[blkNum] = blockAccu
      result.thumb.blockAccuracy0to4[blkNum] = blockAccu024
    }
  }


  let IndexfirstTryAccuracy = Accuracy(totalIndexFirstRecord)
  let Indexaccuracys = {}

  let IndexGroupedByQuest = _.groupBy(totalIndexRecords, 'quest')

  for (let key of Object.keys(IndexGroupedByQuest)) {
    Indexaccuracys[key] = Accuracy(IndexGroupedByQuest[key]);
    
  }


  let ThumbfirstTryAccuracy = Accuracy(totalThumbFirstRecord)
  let Thumbaccuracys = {}

  let ThumbGroupedByQuest = _.groupBy(totalThumbRecords, 'quest')

  for (let key of Object.keys(ThumbGroupedByQuest)) {
    Thumbaccuracys[key] = Accuracy(ThumbGroupedByQuest[key]);
    
  }

  result.index.questAccuracy = Indexaccuracys;
  result.index.firstTryAccuracy = IndexfirstTryAccuracy;

  result.thumb.questAccuracy = Thumbaccuracys;
  result.thumb.firstTryAccuracy = ThumbfirstTryAccuracy;

  return result;

}

exports.displayStudy1 = displayStudy1;
exports.displayStudy2 = displayStudy2;
exports.displayFormalStudy1 = displayFormalStudy1;
exports.displayFormalStudy1Raw = displayFormalStudy1Raw;
exports.displayFormalStudy2 = displayFormalStudy2;
exports.displayFormalStudy3 = displayFormalStudy3;
exports.displayFormalStudy3Makey = displayFormalStudy3Makey;
// let s1 = analyzeStudy1()
// let s2 = analyzeStudy2()


// let s3 = analyzeStudy(folderS3, 'dt', 40)
// let s2 = analyzeStudy(folderS2, 'vt', 40)
// let s1 = analyzeStudy(folderS1, 'dt', 40)

// console.log(s1)
// // console.log(s2)
// // console.log(s3)

exports.analyzeStudy = analyzeStudy;

