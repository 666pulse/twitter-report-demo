const Client = require("twitter-api-sdk").Client

const argv = require('yargs').argv

const { readFile, writeFile } = require('fs').promises

const bearerToken = argv._[0]
const twitterId = argv._[1]
const fileName = argv._[2]

const client = new Client(bearerToken)


async function getFollowers(uid, next_token, users) {

  const resp = await client.users.usersIdFollowers(uid, {
    "user.fields": ["created_at", "location", "public_metrics", ],
    max_results: 1000, // 最大数值
    pagination_token: next_token,
  })

  const followers = resp.data
  const meta = resp.meta

  const _length = followers.length

  if (_length > 0) {

    for (const ele of followers) {
      let newfollower = {}

      newfollower['1'] = ele['id']
      newfollower['2'] = ele['name']
      newfollower['3'] = ele['username']
      newfollower['4'] = ele['created_at']
      newfollower['5'] = ele['location']

      newfollower['6'] = ele['public_metrics']['followers_count']
      newfollower['7'] = ele['public_metrics']['following_count']
      newfollower['8'] = ele['public_metrics']['tweet_count']

      users.push(newfollower)
    }
  }

  const nextptr = meta["next_token"]

  if (nextptr) {
    await getFollowers(uid, nextptr, users)
  }

  return users.flat()
}

async function main() {

  const users = await getFollowers(twitterId, '', [])

  const jsonObj = JSON.stringify(users)

  console.log(users.length)

  try {
    await writeFile(`./report/${fileName}`, jsonObj, 'utf8')
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

main()
