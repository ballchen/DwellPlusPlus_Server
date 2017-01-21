const _ = require('lodash')
const fs = require('fs')

const folderFormalS1 = `${__dirname}/study/1`

let names = fs.readdirSync(`${folderFormalS1}`);



let result = {
	thumb: [],
	index: []
};

console.log(names.join(`\n`))

for(let name of names) {
	let tests = fs.readdirSync(`${folderFormalS1}/${name}`)

	if(!tests || tests.length == 0) {
		return null
	}
	console.log(`${folderFormalS1}/${name}`)




	for (let test of tests) {  
		let context = JSON.parse(fs.readFileSync(`${folderFormalS1}/${name}/${test}`))
		let groupedRecord = _.groupBy(context.records, 'mode')

		

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
		console.log(testAverageTime)

		result[context.finger].push(testAverageTime);


	}

	
}

console.log(result)
console.log('thumb')
console.log(result.thumb.join('\n'))
console.log('index')
console.log(result.index.join('\n'))


