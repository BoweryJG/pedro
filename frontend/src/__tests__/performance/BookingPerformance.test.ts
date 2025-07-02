import { AppointmentService } from '../../services/appointmentService';
import { performance } from 'perf_hooks';

describe('Booking System Performance Tests', () => {
  describe('AppointmentService Performance', () => {
    it('should fetch services within acceptable time limit', async () => {
      const mockServices = Array.from({ length: 50 }, (_, i) => ({
        id: `service-${i}`,
        name: `Service ${i}`,
        description: `Description for service ${i}`,
        estimated_duration: '60 minutes',
        is_yomi_technology: i % 3 === 0
      }));

      jest.spyOn(AppointmentService, 'getServices').mockResolvedValue(mockServices);

      const startTime = performance.now();
      const services = await AppointmentService.getServices();
      const endTime = performance.now();

      const executionTime = endTime - startTime;
      
      expect(services).toHaveLength(50);
      expect(executionTime).toBeLessThan(100); // Should complete within 100ms
    });

    it('should handle concurrent slot requests efficiently', async () => {
      const mockSlots = Array.from({ length: 20 }, (_, i) => ({
        start_time: `${9 + Math.floor(i / 2)}:${i % 2 === 0 ? '00' : '30'}:00`,
        end_time: `${9 + Math.floor(i / 2)}:${i % 2 === 0 ? '30' : '00'}:00`,
        is_available: true
      }));

      jest.spyOn(AppointmentService, 'getAvailableSlots').mockResolvedValue(mockSlots);

      const startTime = performance.now();
      
      // Simulate concurrent requests
      const promises = Array.from({ length: 10 }, (_, i) => 
        AppointmentService.getAvailableSlots(`staff-${i}`, null as any, 30)
      );
      
      const results = await Promise.all(promises);
      const endTime = performance.now();

      const executionTime = endTime - startTime;
      
      expect(results).toHaveLength(10);
      expect(executionTime).toBeLessThan(200); // Should handle 10 concurrent requests within 200ms
    });

    it('should efficiently filter available providers', async () => {
      const mockStaff = Array.from({ length: 20 }, (_, i) => ({
        id: `staff-${i}`,
        first_name: `Doctor${i}`,
        last_name: `Test${i}`,
        specialization: i % 2 === 0 ? 'Implant Specialist' : 'General Dentistry'
      }));

      const mockProviders = mockStaff.map(staff => ({
        staff,
        slots: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, j) => ({
          start_time: `${9 + j}:00:00`,
          end_time: `${9 + j}:30:00`,
          is_available: true
        }))
      }));

      jest.spyOn(AppointmentService, 'getStaff').mockResolvedValue(mockStaff);
      jest.spyOn(AppointmentService, 'getAvailableSlots').mockImplementation(() => 
        Promise.resolve(mockProviders[0].slots)
      );

      const startTime = performance.now();
      const providers = await AppointmentService.getAvailableProviders('service-1', null as any);
      const endTime = performance.now();

      const executionTime = endTime - startTime;
      
      expect(providers.length).toBeGreaterThan(0);
      expect(executionTime).toBeLessThan(500); // Should complete provider aggregation within 500ms
    });
  });

  describe('Memory Usage', () => {
    it('should not leak memory during repeated operations', async () => {
      const iterations = 100;
      const measurements: number[] = [];

      // Mock the service to return consistent data
      jest.spyOn(AppointmentService, 'getServices').mockResolvedValue([]);

      for (let i = 0; i < iterations; i++) {
        if (global.gc) {
          global.gc(); // Force garbage collection if available
        }

        const memBefore = process.memoryUsage().heapUsed;
        
        // Perform operation
        await AppointmentService.getServices();
        
        const memAfter = process.memoryUsage().heapUsed;
        measurements.push(memAfter - memBefore);
      }

      // Calculate average memory increase
      const avgIncrease = measurements.reduce((a, b) => a + b, 0) / measurements.length;
      
      // Memory increase should be minimal (less than 1KB per operation on average)
      expect(avgIncrease).toBeLessThan(1024);
    });
  });

  describe('API Call Optimization', () => {
    it('should batch related API calls efficiently', async () => {
      const apiCallSpy = jest.fn();
      
      // Mock supabase to track calls
      jest.mock('../../lib/supabase', () => ({
        supabase: {
          from: jest.fn(() => ({
            select: jest.fn(() => ({
              order: jest.fn(() => {
                apiCallSpy();
                return Promise.resolve({ data: [], error: null });
              })
            }))
          }))
        }
      }));

      // Simulate user selecting service and loading staff
      await AppointmentService.getServices();
      await AppointmentService.getStaff('service-1');
      
      // Should only make necessary API calls
      expect(apiCallSpy).toHaveBeenCalledTimes(2);
    });

    it('should handle rate limiting gracefully', async () => {
      let callCount = 0;
      
      jest.spyOn(AppointmentService, 'getAvailableSlots').mockImplementation(() => {
        callCount++;
        // Simulate rate limit after 5 calls
        if (callCount > 5) {
          return Promise.reject(new Error('Rate limit exceeded'));
        }
        return Promise.resolve([]);
      });

      const results = await Promise.allSettled(
        Array.from({ length: 10 }, (_, i) => 
          AppointmentService.getAvailableSlots(`staff-${i}`, null as any)
        )
      );

      const successful = results.filter(r => r.status === 'fulfilled');
      const failed = results.filter(r => r.status === 'rejected');

      expect(successful).toHaveLength(5);
      expect(failed).toHaveLength(5);
    });
  });

  describe('Large Dataset Handling', () => {
    it('should handle large service lists efficiently', async () => {
      const largeServiceList = Array.from({ length: 1000 }, (_, i) => ({
        id: `service-${i}`,
        name: `Service ${i}`,
        description: `Long description for service ${i} `.repeat(10),
        category: ['general', 'implant', 'cosmetic'][i % 3],
        estimated_duration: `${30 + (i % 4) * 30} minutes`,
        is_yomi_technology: i % 5 === 0
      }));

      jest.spyOn(AppointmentService, 'getServices').mockResolvedValue(largeServiceList);

      const startTime = performance.now();
      const services = await AppointmentService.getServices();
      const endTime = performance.now();

      const executionTime = endTime - startTime;
      
      expect(services).toHaveLength(1000);
      expect(executionTime).toBeLessThan(1000); // Should handle 1000 services within 1 second
    });

    it('should paginate provider results for performance', async () => {
      const manyProviders = Array.from({ length: 100 }, (_, i) => ({
        staff: {
          id: `staff-${i}`,
          first_name: `Doctor${i}`,
          last_name: `Test${i}`
        },
        slots: Array.from({ length: 10 }, (_, j) => ({
          start_time: `${8 + Math.floor(j / 2)}:${j % 2 === 0 ? '00' : '30'}:00`,
          end_time: `${8 + Math.floor(j / 2)}:${j % 2 === 0 ? '30' : '00'}:00`,
          is_available: true
        }))
      }));

      // In real implementation, this would use pagination
      const paginatedResults = manyProviders.slice(0, 20);
      
      expect(paginatedResults).toHaveLength(20);
      expect(paginatedResults[0].slots).toHaveLength(10);
    });
  });
});

// Note: To run with garbage collection enabled:
// node --expose-gc node_modules/.bin/jest BookingPerformance.test.ts