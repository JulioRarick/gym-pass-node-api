import { createCheckIn } from '@controllers/check-ins/create-check-in-controller'
import { getHistoryCheckIns } from '@controllers/check-ins/history-check-ins-controller'
import { getMetricsCheckIns } from '@controllers/check-ins/metrics-check-ins-controller'
import { validateCheckIn } from '@controllers/check-ins/validate-check-in-controller'
import { FastifyInstance } from 'fastify'

import { verifyJWT } from '../hooks/verify-jwt'

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/gyms/:gymId/check-ins', createCheckIn)

  app.patch('/check-ins/:checkInId/validate', validateCheckIn)

  app.get('/check-ins/history', getHistoryCheckIns)
  app.get('/check-ins/metrics', getMetricsCheckIns)
}
