import prisma from '../../lib/prisma';
import { VehicleStatus, DriverStatus, TripStatus } from '@prisma/client';

export class ReportsService {
  static async getDashboardKPIs(filters?: { type?: string; status?: VehicleStatus; region?: string }) {
    const vehicleWhere: any = {};
    if (filters?.type) vehicleWhere.type = filters.type;
    if (filters?.status) vehicleWhere.status = filters.status;
    if (filters?.region) vehicleWhere.region = filters.region;

    const [
      totalVehicles,
      activeVehicles,
      availableVehicles,
      maintenanceVehicles,
      activeTrips,
      pendingTrips,
      driversOnDuty,
    ] = await Promise.all([
      prisma.vehicle.count({ where: vehicleWhere }),
      prisma.vehicle.count({ where: { ...vehicleWhere, status: VehicleStatus.on_trip } }),
      prisma.vehicle.count({ where: { ...vehicleWhere, status: VehicleStatus.available } }),
      prisma.vehicle.count({ where: { ...vehicleWhere, status: VehicleStatus.in_shop } }),
      prisma.trip.count({
        where: {
          status: TripStatus.dispatched,
          vehicle: Object.keys(vehicleWhere).length > 0 ? vehicleWhere : undefined,
        },
      }),
      prisma.trip.count({
        where: {
          status: TripStatus.draft,
          vehicle: Object.keys(vehicleWhere).length > 0 ? vehicleWhere : undefined,
        },
      }),
      prisma.driver.count({
        where: {
          status: { in: [DriverStatus.available, DriverStatus.on_trip] },
          trips: Object.keys(vehicleWhere).length > 0 ? {
            some: {
              status: { in: [TripStatus.dispatched, TripStatus.completed] },
              vehicle: vehicleWhere,
            },
          } : undefined,
        },
      }),
    ]);

    const fleetUtilization = totalVehicles > 0 
      ? Math.round((activeVehicles / totalVehicles) * 100) 
      : 0;

    return {
      activeVehicles,
      availableVehicles,
      vehiclesInMaintenance: maintenanceVehicles,
      activeTrips,
      pendingTrips,
      driversOnDuty,
      fleetUtilization,
    };
  }

  static async getVehicleMetrics() {
    const vehicles = await prisma.vehicle.findMany({
      include: {
        fuelLogs: true,
        maintenances: true,
        expenses: true,
        trips: {
          where: { status: TripStatus.completed },
        },
      },
    });

    return vehicles.map((vehicle) => {
      const fuelCost = vehicle.fuelLogs.reduce((sum, log) => sum + log.cost, 0);
      const maintenanceCost = vehicle.maintenances.reduce((sum, log) => sum + log.cost, 0);
      const miscExpense = vehicle.expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const totalOpCost = fuelCost + maintenanceCost + miscExpense;

      const revenue = vehicle.trips.reduce((sum, trip) => sum + (trip.revenue || 0), 0);
      const totalDistance = vehicle.trips.reduce((sum, trip) => sum + trip.plannedDistance, 0);
      const totalFuelConsumed = vehicle.trips.reduce((sum, trip) => sum + (trip.fuelConsumed || 0), 0);

      // Distance / Fuel
      const fuelEfficiency = totalFuelConsumed > 0 
        ? parseFloat((totalDistance / totalFuelConsumed).toFixed(2)) 
        : 0;

      // ROI: (Revenue - OpCost) / AcquisitionCost
      const roi = vehicle.acquisitionCost > 0
        ? parseFloat(((revenue - totalOpCost) / vehicle.acquisitionCost).toFixed(4))
        : 0;

      return {
        id: vehicle.id,
        registrationNumber: vehicle.registrationNumber,
        nameModel: vehicle.nameModel,
        status: vehicle.status,
        acquisitionCost: vehicle.acquisitionCost,
        totalRevenue: revenue,
        totalFuelCost: fuelCost,
        totalMaintenanceCost: maintenanceCost,
        totalMiscExpense: miscExpense,
        totalOperationalCost: totalOpCost,
        fuelEfficiency, // km per liter
        roi, // decimal percentage
      };
    });
  }

  static async generateCSVReport() {
    const metrics = await this.getVehicleMetrics();
    
    // Header
    let csv = 'Registration Number,Name/Model,Status,Acquisition Cost,Total Revenue,Operational Cost,Fuel Efficiency (km/L),ROI\n';
    
    metrics.forEach((m) => {
      csv += `"${m.registrationNumber}","${m.nameModel}","${m.status}",${m.acquisitionCost},${m.totalRevenue},${m.totalOperationalCost},${m.fuelEfficiency},${(m.roi * 100).toFixed(2)}%\n`;
    });

    return csv;
  }
}
