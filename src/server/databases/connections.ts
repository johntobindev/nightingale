import mysql from 'mysql2/promise'
import credentials from '../credentials/mysql'

export const auk = mysql.createPool({
  host: credentials.host,
  user: credentials.user,
  password: credentials.password,
  database: 'auk',
  charset: 'utf8mb4',
  timezone: 'Z',
})

export const music = mysql.createPool({
  host: credentials.host,
  user: credentials.user,
  password: credentials.password,
  database: 'music',
  charset: 'utf8mb4',
  timezone: 'Z',
})