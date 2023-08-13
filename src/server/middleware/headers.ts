import { Request, Response, NextFunction } from 'express'

export default () => (req: Request, res: Response, next: NextFunction) => {
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate') // HTTP 1.1
  res.header('Pragma', 'no-cache') // HTTP 1.0
  res.header('Expires', '0') // Proxies
  next()
}