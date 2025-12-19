// Batch Management Service for tracking oil samples

export interface FryingStation {
  id: string;
  name: string;
  location: string;
  equipment: string;
  capacity: string;
  status: 'active' | 'maintenance' | 'inactive';
}

export interface Batch {
  id: string;
  stationId: string;
  stationName: string;
  location: string;
  equipment: string;
  oilType: string;
  createdAt: string;
  lastTestedAt?: string;
  testsCount: number;
  currentScore?: number;
  currentStatus?: 'pass' | 'borderline' | 'reject';
  notes?: string;
}

export interface TestRecord {
  id: string;
  batchId: string;
  timestamp: string;
  ffa: number;
  tpc: number;
  pv: number;
  score: number;
  classification: 'pass' | 'borderline' | 'reject';
  confidence: number;
  operatorId?: string;
}

// In-memory storage
let stations: FryingStation[] = [
  { id: 'STATION-A1', name: 'Fryer A1', location: 'Kitchen Zone A', equipment: 'Industrial Fryer 50L', capacity: '50L', status: 'active' },
  { id: 'STATION-A2', name: 'Fryer A2', location: 'Kitchen Zone A', equipment: 'Industrial Fryer 50L', capacity: '50L', status: 'active' },
  { id: 'STATION-A3', name: 'Fryer A3', location: 'Kitchen Zone A', equipment: 'Industrial Fryer 30L', capacity: '30L', status: 'active' },
  { id: 'STATION-B1', name: 'Fryer B1', location: 'Kitchen Zone B', equipment: 'Commercial Fryer 25L', capacity: '25L', status: 'maintenance' },
  { id: 'STATION-B2', name: 'Fryer B2', location: 'Kitchen Zone B', equipment: 'Commercial Fryer 25L', capacity: '25L', status: 'active' },
];

let batches: Batch[] = [
  {
    id: 'BATCH-2024-0115-A',
    stationId: 'STATION-A1',
    stationName: 'Fryer A1',
    location: 'Kitchen Zone A',
    equipment: 'Industrial Fryer 50L',
    oilType: 'Refined Sunflower Oil',
    createdAt: '2024-01-15T08:00:00Z',
    lastTestedAt: '2024-01-15T14:32:00Z',
    testsCount: 3,
    currentScore: 84,
    currentStatus: 'pass',
  },
  {
    id: 'BATCH-2024-0115-B',
    stationId: 'STATION-A2',
    stationName: 'Fryer A2',
    location: 'Kitchen Zone A',
    equipment: 'Industrial Fryer 50L',
    oilType: 'Palm Olein',
    createdAt: '2024-01-15T07:30:00Z',
    lastTestedAt: '2024-01-15T11:15:00Z',
    testsCount: 2,
    currentScore: 91,
    currentStatus: 'pass',
  },
  {
    id: 'BATCH-2024-0115-C',
    stationId: 'STATION-A3',
    stationName: 'Fryer A3',
    location: 'Kitchen Zone A',
    equipment: 'Industrial Fryer 30L',
    oilType: 'Refined Sunflower Oil',
    createdAt: '2024-01-14T08:00:00Z',
    lastTestedAt: '2024-01-15T09:45:00Z',
    testsCount: 5,
    currentScore: 62,
    currentStatus: 'borderline',
  },
];

let testRecords: TestRecord[] = [];

export const batchService = {
  // Stations
  getStations(): FryingStation[] {
    return [...stations];
  },

  getStation(id: string): FryingStation | undefined {
    return stations.find(s => s.id === id);
  },

  addStation(station: Omit<FryingStation, 'id'>): FryingStation {
    const newStation: FryingStation = {
      ...station,
      id: `STATION-${Date.now()}`,
    };
    stations.push(newStation);
    return newStation;
  },

  updateStation(id: string, updates: Partial<FryingStation>): FryingStation | null {
    const index = stations.findIndex(s => s.id === id);
    if (index >= 0) {
      stations[index] = { ...stations[index], ...updates };
      return stations[index];
    }
    return null;
  },

  // Batches
  getBatches(filters?: { stationId?: string; status?: string }): Batch[] {
    let filtered = [...batches];
    if (filters?.stationId) {
      filtered = filtered.filter(b => b.stationId === filters.stationId);
    }
    if (filters?.status) {
      filtered = filtered.filter(b => b.currentStatus === filters.status);
    }
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getBatch(id: string): Batch | undefined {
    return batches.find(b => b.id === id);
  },

  createBatch(stationId: string, oilType: string, notes?: string): Batch {
    const station = stations.find(s => s.id === stationId);
    if (!station) throw new Error('Station not found');

    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const count = batches.filter(b => b.id.includes(dateStr)).length;
    const suffix = String.fromCharCode(65 + count); // A, B, C...

    const batch: Batch = {
      id: `BATCH-${dateStr}-${suffix}`,
      stationId: station.id,
      stationName: station.name,
      location: station.location,
      equipment: station.equipment,
      oilType,
      createdAt: today.toISOString(),
      testsCount: 0,
      notes,
    };

    batches.unshift(batch);
    return batch;
  },

  updateBatchFromTest(
    batchId: string,
    score: number,
    status: 'pass' | 'borderline' | 'reject'
  ): void {
    const batch = batches.find(b => b.id === batchId);
    if (batch) {
      batch.lastTestedAt = new Date().toISOString();
      batch.testsCount += 1;
      batch.currentScore = score;
      batch.currentStatus = status;
    }
  },

  // Test Records
  addTestRecord(record: Omit<TestRecord, 'id'>): TestRecord {
    const newRecord: TestRecord = {
      ...record,
      id: `TEST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    testRecords.unshift(newRecord);
    return newRecord;
  },

  getTestRecords(batchId?: string): TestRecord[] {
    if (batchId) {
      return testRecords.filter(r => r.batchId === batchId);
    }
    return [...testRecords];
  },

  // Statistics
  getStatistics(): {
    totalBatches: number;
    activeBatches: number;
    passRate: number;
    alertCount: number;
  } {
    const activeBatches = batches.filter(b => b.currentStatus);
    const passBatches = activeBatches.filter(b => b.currentStatus === 'pass');
    
    return {
      totalBatches: batches.length,
      activeBatches: activeBatches.length,
      passRate: activeBatches.length > 0 
        ? Math.round((passBatches.length / activeBatches.length) * 100) 
        : 100,
      alertCount: batches.filter(b => b.currentStatus !== 'pass').length,
    };
  },
};
