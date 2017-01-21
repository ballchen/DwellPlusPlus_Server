const _ = require('lodash')
const fs = require('fs')

const folderFormalS1Forcast = `${__dirname}/study/1_forcast`



let names = fs.readdirSync(`${folderFormalS1Forcast}`);
let result = '';

for(let name of names) {
	if(name.indexOf('_thumb') < 0) { continue }
	let tests = fs.readdirSync(`${folderFormalS1Forcast}/${name}`)

	let totalCount = 0;
	let correctCount = 0;
	let nameResult = `${name.split('_thumb')[0]}\t`

	for (let test of tests) {
		
			let data = JSON.parse(fs.readFileSync(`${folderFormalS1Forcast}/${name}/${test}`))

			if(data.mode == 'testing') {
				data.records = _.sortBy(data.records, ['quest'])
				for(let record of data.records) {
					if(record.quest != 0 ) {
						totalCount ++;
						if(record.quest == record.result) {
							correctCount ++;
							nameResult += `${record.segTime}\t`
						}

						if(record.quest != record.result) {
							
							nameResult += `\t`
						}
					}
				}
			}
		
	}
	nameResult += `${correctCount/totalCount}\t`
	nameResult += `\n`

	result += nameResult;
}

console.log(result)

fs.writeFileSync(`./result_forcast_s1_thumb.txt`, result)