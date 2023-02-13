const argv = require('yargs').argv
const { readFile, appendFile } = require('fs').promises

const today = argv._[0]
const fileName = argv._[1]
const yesterdayFile = argv._[2]

function arraydiff(_yesterday, _now) {
  const ids1 = _yesterday.map((ele) => {
    return ele['1']
  })

  const ids2 = _now.map((ele) => {
    return ele['1']
  })

  const addition = ids2.filter(x => !ids1.includes(x))
  const deletion = ids1.filter(x => !ids2.includes(x))
  const netincrease = addition.length - deletion.length

  return {
    addition_num: addition.length,
    deletion_num: deletion.length,
    net_increase: netincrease
  }
}

async function main() {
  try {
    const _yesterdayData = await readFile(`./report/${yesterdayFile}`, { encoding: 'utf8' })
    const _todayData = await readFile(`./report/${fileName}`, { encoding: 'utf8' })

    const yesterdayData = JSON.parse(_yesterdayData)
    const todayData = JSON.parse(_todayData)

    const result = arraydiff(yesterdayData, todayData)

    const content = `${today} 新增：${result.addition_num} 取消：${result.deletion_num} 净增：${result.net_increase} 累计：${todayData.length}\n`

    await appendFile('./report/result.txt', content, 'utf-8')

  } catch (err) {
    console.log(err)
    process.exit(2)
  }
}

main()
