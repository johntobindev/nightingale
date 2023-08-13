import { Application as App } from 'express'

export default (app: App) => {
  app.get('/favicon.ico', (req, res) => res.sendStatus(204))
}