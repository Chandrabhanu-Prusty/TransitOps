import { z } from 'zod'

export const createMaintenanceSchema = z.object({
  vehicleId: z.string().uuid('Invalid vehicle ID format'),
  type: z.string().min(1, 'Type is required'),
  technician: z.string().optional(),
  description: z.string().min(3, 'Description must be at least 3 characters long'),
  cost: z.number().nonnegative('Cost cannot be negative').default(0.0),
  startDate: z.string().transform((str) => new Date(str)),
  expectedEndDate: z.string().optional().transform((str) => str ? new Date(str) : undefined),
})

export const closeMaintenanceSchema = z.object({
  cost: z.number().nonnegative('Final cost cannot be negative'),
})

export type CreateMaintenanceInput = z.infer<typeof createMaintenanceSchema>
export type CloseMaintenanceInput = z.infer<typeof closeMaintenanceSchema>
