'use strict'

const {displayFormalStudy3Makey} = require('./result')
const fs = require('fs')
const folderFormalS3 = `${__dirname}/study/4`

function getStat(finger) {
	const names = fs.readdirSync(folderFormalS3);

	let resultObj = {}
	let resultObj2 = {}
	let resultObjQuest = {}
	let resultObjFirstTry = {}

	for(let name of names) {

		let result = ''
		let result2 = ''

		let result3 = ''
		let result4 = ''
		
		result += `${name}\t`
		result2 += `${name}\t`
		result3 += `${name}\t`
		result4 += `${name}\t`

		let eachStatic = displayFormalStudy3Makey(name)

		if(!resultObj[eachStatic.dt]) {
			resultObj[eachStatic.dt] = ''
		}

		if(!resultObj2[eachStatic.dt]) {
			resultObj2[eachStatic.dt] = ''
		}

		if(!resultObjQuest[eachStatic.dt]) {
			resultObjQuest[eachStatic.dt] = ''
		}

		if(!resultObjFirstTry[eachStatic.dt]) {
			resultObjFirstTry[eachStatic.dt] = ''
		}
		
		for(let i = 1; i < 9; i ++) {
			if(eachStatic[finger].blockAccuracy[i]) {
				result += eachStatic[finger].blockAccuracy0to4[i]
				result += '\t'
				result2 += eachStatic[finger].blockAccuracy[i]
				result2 += '\t'
			}
			
		}
			
		result += '\n'
		result2 += '\n'

		resultObj[eachStatic.dt] += result;
		resultObj2[eachStatic.dt] += result2;

		for(let i = 0; i < 10; i ++) {
			if(eachStatic[finger].questAccuracy[i]) {

				result3 += eachStatic[finger].questAccuracy[i]
				result3 += '\t'
				
			}

			
		}
		
		result3 += '\n'
		resultObjQuest[eachStatic.dt] += result3;

		result4 += eachStatic[finger].firstTryAccuracy
		result4 += '\n'
		resultObjFirstTry[eachStatic.dt] += result4;
	}

	


	for (let key of Object.keys(resultObj)) {
		console.log('yo')
		fs.writeFileSync(`result_3Makey_blockAccu_${finger}_${key}.txt`, `0~3\n${resultObj[key]}\n\ntotal\n${resultObj2[key]}\neach\n${resultObjQuest[key]}\nfirst\n${resultObjFirstTry[key]}`)
	}
}


exports.getStat = getStat;
