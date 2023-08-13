import redis from 'redis'
import credentials from '../credentials/redis'

export default redis.createClient({
  password: credentials.password,
})