import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings as SettingsIcon,
  Building2,
  Ruler,
  Wrench,
  Save,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

interface RegulatoryLimits {
  ffa: number;
  tpc: number;
  pv: number;
  standard: string;
}

interface CompanyBranding {
  companyName: string;
  companyAddress: string;
  contactEmail: string;
  contactPhone: string;
  logoUrl: string;
  reportFooter: string;
}

interface CalibrationSettings {
  autoCalibrationEnabled: boolean;
  calibrationInterval: string;
  lastCalibration: string;
  nextCalibration: string;
  calibrationReminder: boolean;
  reminderDays: number;
}

export default function Settings() {
  const [limits, setLimits] = useState<RegulatoryLimits>({
    ffa: 0.3,
    tpc: 25,
    pv: 10,
    standard: "fssai",
  });

  const [branding, setBranding] = useState<CompanyBranding>({
    companyName: "",
    companyAddress: "",
    contactEmail: "",
    contactPhone: "",
    logoUrl: "",
    reportFooter: "AI-assisted screening tool – lab confirmation recommended for borderline cases.",
  });

  const [calibration, setCalibration] = useState<CalibrationSettings>({
    autoCalibrationEnabled: true,
    calibrationInterval: "weekly",
    lastCalibration: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    nextCalibration: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    calibrationReminder: true,
    reminderDays: 1,
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleLimitChange = (key: keyof RegulatoryLimits, value: string | number) => {
    setLimits({ ...limits, [key]: value });
    setHasChanges(true);
  };

  const handleBrandingChange = (key: keyof CompanyBranding, value: string) => {
    setBranding({ ...branding, [key]: value });
    setHasChanges(true);
  };

  const handleCalibrationChange = (key: keyof CalibrationSettings, value: any) => {
    setCalibration({ ...calibration, [key]: value });
    setHasChanges(true);
  };

  const handleSave = () => {
    // Save to localStorage for persistence
    localStorage.setItem('foodoiliq_limits', JSON.stringify(limits));
    localStorage.setItem('foodoiliq_branding', JSON.stringify(branding));
    localStorage.setItem('foodoiliq_calibration', JSON.stringify(calibration));
    
    setHasChanges(false);
    toast.success("Settings saved successfully");
  };

  const handleReset = () => {
    setLimits({ ffa: 0.3, tpc: 25, pv: 10, standard: "fssai" });
    setBranding({
      companyName: "",
      companyAddress: "",
      contactEmail: "",
      contactPhone: "",
      logoUrl: "",
      reportFooter: "AI-assisted screening tool – lab confirmation recommended for borderline cases.",
    });
    setCalibration({
      autoCalibrationEnabled: true,
      calibrationInterval: "weekly",
      lastCalibration: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      nextCalibration: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      calibrationReminder: true,
      reminderDays: 1,
    });
    setHasChanges(false);
    toast.info("Settings reset to defaults");
  };

  const applyStandard = (standard: string) => {
    const standards: Record<string, { ffa: number; tpc: number; pv: number }> = {
      fssai: { ffa: 0.3, tpc: 25, pv: 10 },
      eu: { ffa: 0.3, tpc: 25, pv: 10 },
      china: { ffa: 0.5, tpc: 27, pv: 12 },
      codex: { ffa: 0.3, tpc: 25, pv: 10 },
    };
    
    const selected = standards[standard] || standards.fssai;
    setLimits({ ...selected, standard });
    setHasChanges(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <SettingsIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-sm text-muted-foreground">
              Configure regulatory limits, branding, and device settings
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {hasChanges && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <span className="text-sm text-warning">You have unsaved changes</span>
        </div>
      )}

      <Tabs defaultValue="limits" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="limits" className="flex items-center gap-2">
            <Ruler className="h-4 w-4" />
            Regulatory Limits
          </TabsTrigger>
          <TabsTrigger value="branding" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Company Branding
          </TabsTrigger>
          <TabsTrigger value="calibration" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Calibration
          </TabsTrigger>
        </TabsList>

        {/* Regulatory Limits Tab */}
        <TabsContent value="limits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Regulatory Standard</CardTitle>
              <CardDescription>
                Select a regulatory standard to auto-populate limits, or customize manually
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Standard</Label>
                <Select
                  value={limits.standard}
                  onValueChange={(value) => applyStandard(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fssai">FSSAI (India)</SelectItem>
                    <SelectItem value="eu">European Union</SelectItem>
                    <SelectItem value="china">China (GB 2716-2018)</SelectItem>
                    <SelectItem value="codex">Codex Alimentarius</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Parameter Limits</CardTitle>
              <CardDescription>
                Customize the threshold values for each parameter
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="ffa">FFA Limit (%)</Label>
                  <Input
                    id="ffa"
                    type="number"
                    step="0.01"
                    value={limits.ffa}
                    onChange={(e) => handleLimitChange("ffa", parseFloat(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Free Fatty Acid maximum threshold
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tpc">TPC Limit (%)</Label>
                  <Input
                    id="tpc"
                    type="number"
                    step="1"
                    value={limits.tpc}
                    onChange={(e) => handleLimitChange("tpc", parseFloat(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Total Polar Compounds maximum
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pv">PV Limit (meq/kg)</Label>
                  <Input
                    id="pv"
                    type="number"
                    step="0.5"
                    value={limits.pv}
                    onChange={(e) => handleLimitChange("pv", parseFloat(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Peroxide Value maximum threshold
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Branding Tab */}
        <TabsContent value="branding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                This information will appear on generated PDF reports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    placeholder="Your Company Name"
                    value={branding.companyName}
                    onChange={(e) => handleBrandingChange("companyName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="quality@company.com"
                    value={branding.contactEmail}
                    onChange={(e) => handleBrandingChange("contactEmail", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyAddress">Company Address</Label>
                <Textarea
                  id="companyAddress"
                  placeholder="123 Industrial Ave, City, Country"
                  value={branding.companyAddress}
                  onChange={(e) => handleBrandingChange("companyAddress", e.target.value)}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={branding.contactPhone}
                  onChange={(e) => handleBrandingChange("contactPhone", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Report Customization</CardTitle>
              <CardDescription>
                Customize the footer text for generated reports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reportFooter">Report Footer / Disclaimer</Label>
                <Textarea
                  id="reportFooter"
                  value={branding.reportFooter}
                  onChange={(e) => handleBrandingChange("reportFooter", e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  This text will appear at the bottom of all generated PDF reports
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calibration Tab */}
        <TabsContent value="calibration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Calibration Status</CardTitle>
              <CardDescription>
                View and manage device calibration schedule
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                  <p className="text-xs text-muted-foreground mb-1">Last Calibration</p>
                  <p className="font-semibold text-success">
                    {new Date(calibration.lastCalibration).toLocaleString()}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-xs text-muted-foreground mb-1">Next Scheduled</p>
                  <p className="font-semibold text-primary">
                    {new Date(calibration.nextCalibration).toLocaleString()}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-Calibration</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically calibrate device on schedule
                  </p>
                </div>
                <Switch
                  checked={calibration.autoCalibrationEnabled}
                  onCheckedChange={(checked) =>
                    handleCalibrationChange("autoCalibrationEnabled", checked)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Calibration Interval</Label>
                <Select
                  value={calibration.calibrationInterval}
                  onValueChange={(value) =>
                    handleCalibrationChange("calibrationInterval", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Calibration Reminders</Label>
                  <p className="text-xs text-muted-foreground">
                    Get notified before calibration is due
                  </p>
                </div>
                <Switch
                  checked={calibration.calibrationReminder}
                  onCheckedChange={(checked) =>
                    handleCalibrationChange("calibrationReminder", checked)
                  }
                />
              </div>

              {calibration.calibrationReminder && (
                <div className="space-y-2">
                  <Label>Remind Days Before</Label>
                  <Select
                    value={String(calibration.reminderDays)}
                    onValueChange={(value) =>
                      handleCalibrationChange("reminderDays", parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 day before</SelectItem>
                      <SelectItem value="2">2 days before</SelectItem>
                      <SelectItem value="3">3 days before</SelectItem>
                      <SelectItem value="7">1 week before</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button variant="outline" className="w-full">
                <Wrench className="h-4 w-4 mr-2" />
                Run Manual Calibration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
