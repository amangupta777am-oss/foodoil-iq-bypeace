import { useState } from "react";
import { batchService, type Batch, type FryingStation } from "@/services/batches";
import { ComplianceBadge } from "@/components/dashboard/ComplianceBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, MapPin, Settings2, Beaker, Clock, Filter } from "lucide-react";
import { toast } from "sonner";

export default function Batches() {
  const [batches, setBatches] = useState<Batch[]>(batchService.getBatches());
  const [stations] = useState<FryingStation[]>(batchService.getStations());
  const [filterStation, setFilterStation] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newBatch, setNewBatch] = useState({
    stationId: "",
    oilType: "",
    notes: "",
  });

  const filteredBatches = batches.filter((batch) => {
    if (filterStation !== "all" && batch.stationId !== filterStation) return false;
    if (filterStatus !== "all" && batch.currentStatus !== filterStatus) return false;
    return true;
  });

  const handleCreateBatch = () => {
    if (!newBatch.stationId || !newBatch.oilType) {
      toast.error("Please select a station and oil type");
      return;
    }
    
    const batch = batchService.createBatch(
      newBatch.stationId,
      newBatch.oilType,
      newBatch.notes
    );
    setBatches(batchService.getBatches());
    setIsDialogOpen(false);
    setNewBatch({ stationId: "", oilType: "", notes: "" });
    toast.success(`Batch ${batch.id} created successfully`);
  };

  const stats = batchService.getStatistics();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Batch Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track oil samples across frying stations
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Batch
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Batch</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Frying Station</Label>
                <Select
                  value={newBatch.stationId}
                  onValueChange={(value) =>
                    setNewBatch({ ...newBatch, stationId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select station" />
                  </SelectTrigger>
                  <SelectContent>
                    {stations.map((station) => (
                      <SelectItem key={station.id} value={station.id}>
                        {station.name} - {station.location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Oil Type</Label>
                <Select
                  value={newBatch.oilType}
                  onValueChange={(value) =>
                    setNewBatch({ ...newBatch, oilType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select oil type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Refined Sunflower Oil">
                      Refined Sunflower Oil
                    </SelectItem>
                    <SelectItem value="Palm Olein">Palm Olein</SelectItem>
                    <SelectItem value="Rice Bran Oil">Rice Bran Oil</SelectItem>
                    <SelectItem value="Canola Oil">Canola Oil</SelectItem>
                    <SelectItem value="Vegetable Oil Blend">
                      Vegetable Oil Blend
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Notes (Optional)</Label>
                <Input
                  placeholder="Add batch notes..."
                  value={newBatch.notes}
                  onChange={(e) =>
                    setNewBatch({ ...newBatch, notes: e.target.value })
                  }
                />
              </div>
              <Button onClick={handleCreateBatch} className="w-full">
                Create Batch
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="data-card">
          <p className="text-xs text-muted-foreground">Total Batches</p>
          <p className="text-2xl font-bold mt-1">{stats.totalBatches}</p>
        </div>
        <div className="data-card">
          <p className="text-xs text-muted-foreground">Active Batches</p>
          <p className="text-2xl font-bold mt-1">{stats.activeBatches}</p>
        </div>
        <div className="data-card">
          <p className="text-xs text-muted-foreground">Pass Rate</p>
          <p className="text-2xl font-bold mt-1 text-success">{stats.passRate}%</p>
        </div>
        <div className="data-card">
          <p className="text-xs text-muted-foreground">Alerts</p>
          <p className="text-2xl font-bold mt-1 text-warning">{stats.alertCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        <Select value={filterStation} onValueChange={setFilterStation}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Stations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stations</SelectItem>
            {stations.map((station) => (
              <SelectItem key={station.id} value={station.id}>
                {station.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pass">Pass</SelectItem>
            <SelectItem value="borderline">Borderline</SelectItem>
            <SelectItem value="reject">Reject</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Batches Table */}
      <div className="data-card p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Batch ID</TableHead>
              <TableHead>Station</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Oil Type</TableHead>
              <TableHead>Tests</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Tested</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBatches.map((batch) => (
              <TableRow key={batch.id}>
                <TableCell className="font-mono font-medium">
                  {batch.id}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Settings2 className="h-4 w-4 text-muted-foreground" />
                    {batch.stationName}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {batch.location}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Beaker className="h-4 w-4 text-muted-foreground" />
                    {batch.oilType}
                  </div>
                </TableCell>
                <TableCell>{batch.testsCount}</TableCell>
                <TableCell>
                  {batch.currentScore !== undefined ? (
                    <span className="font-semibold">{batch.currentScore}</span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {batch.currentStatus ? (
                    <ComplianceBadge status={batch.currentStatus} size="sm" />
                  ) : (
                    <span className="text-xs text-muted-foreground">Not tested</span>
                  )}
                </TableCell>
                <TableCell>
                  {batch.lastTestedAt ? (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(batch.lastTestedAt).toLocaleString()}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">Never</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Stations Overview */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Frying Stations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stations.map((station) => (
            <div key={station.id} className="data-card">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{station.name}</h3>
                  <p className="text-sm text-muted-foreground">{station.location}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    station.status === "active"
                      ? "bg-success/10 text-success"
                      : station.status === "maintenance"
                      ? "bg-warning/10 text-warning"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {station.status}
                </span>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                <p>{station.equipment}</p>
                <p>Capacity: {station.capacity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
