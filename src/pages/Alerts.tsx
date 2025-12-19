import { useState } from "react";
import { alertService, type Alert, type NotificationPreferences } from "@/services/alerts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertTriangle,
  XCircle,
  Bell,
  Mail,
  Phone,
  Check,
  Settings,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>(alertService.getAlerts());
  const [prefs, setPrefs] = useState<NotificationPreferences>(
    alertService.getNotificationPreferences()
  );
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const unacknowledgedCount = alertService.getUnacknowledgedCount();

  const handleAcknowledge = (alertId: string) => {
    alertService.acknowledgeAlert(alertId, "Current User");
    setAlerts(alertService.getAlerts());
    toast.success("Alert acknowledged");
  };

  const handleAddEmail = () => {
    if (!newEmail || !newEmail.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    const updated = {
      ...prefs,
      emailAddresses: [...prefs.emailAddresses, newEmail],
    };
    alertService.updateNotificationPreferences(updated);
    setPrefs(updated);
    setNewEmail("");
    toast.success("Email added");
  };

  const handleAddPhone = () => {
    if (!newPhone || newPhone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    const updated = {
      ...prefs,
      phoneNumbers: [...prefs.phoneNumbers, newPhone],
    };
    alertService.updateNotificationPreferences(updated);
    setPrefs(updated);
    setNewPhone("");
    toast.success("Phone number added");
  };

  const handleRemoveEmail = (email: string) => {
    const updated = {
      ...prefs,
      emailAddresses: prefs.emailAddresses.filter((e) => e !== email),
    };
    alertService.updateNotificationPreferences(updated);
    setPrefs(updated);
  };

  const handleRemovePhone = (phone: string) => {
    const updated = {
      ...prefs,
      phoneNumbers: prefs.phoneNumbers.filter((p) => p !== phone),
    };
    alertService.updateNotificationPreferences(updated);
    setPrefs(updated);
  };

  const handleTogglePref = (key: keyof NotificationPreferences, value: boolean) => {
    const updated = { ...prefs, [key]: value };
    alertService.updateNotificationPreferences(updated);
    setPrefs(updated);
  };

  const handleToggleNotifyOn = (key: keyof typeof prefs.notifyOn, value: boolean) => {
    const updated = {
      ...prefs,
      notifyOn: { ...prefs.notifyOn, [key]: value },
    };
    alertService.updateNotificationPreferences(updated);
    setPrefs(updated);
  };

  const getAlertIcon = (type: Alert["type"], severity: Alert["severity"]) => {
    if (severity === "critical") {
      return <XCircle className="h-5 w-5 text-destructive" />;
    }
    return <AlertTriangle className="h-5 w-5 text-warning" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Alerts & Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor quality alerts and manage notification settings
          </p>
        </div>
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Notification Settings</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 pt-4">
              {/* Notification Channels */}
              <div className="space-y-4">
                <h3 className="font-medium">Notification Channels</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>Email Notifications</span>
                  </div>
                  <Switch
                    checked={prefs.email}
                    onCheckedChange={(v) => handleTogglePref("email", v)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>SMS Notifications</span>
                  </div>
                  <Switch
                    checked={prefs.sms}
                    onCheckedChange={(v) => handleTogglePref("sms", v)}
                  />
                </div>
              </div>

              {/* Alert Types */}
              <div className="space-y-4">
                <h3 className="font-medium">Notify On</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Borderline Results</span>
                  <Switch
                    checked={prefs.notifyOn.borderline}
                    onCheckedChange={(v) => handleToggleNotifyOn("borderline", v)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Rejected Results</span>
                  <Switch
                    checked={prefs.notifyOn.reject}
                    onCheckedChange={(v) => handleToggleNotifyOn("reject", v)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Equipment Alerts</span>
                  <Switch
                    checked={prefs.notifyOn.equipment}
                    onCheckedChange={(v) => handleToggleNotifyOn("equipment", v)}
                  />
                </div>
              </div>

              {/* Email Recipients */}
              <div className="space-y-2">
                <Label>Email Recipients</Label>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="supervisor@company.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                  <Button onClick={handleAddEmail} size="sm">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {prefs.emailAddresses.map((email) => (
                    <Badge key={email} variant="secondary" className="gap-1">
                      {email}
                      <button
                        onClick={() => handleRemoveEmail(email)}
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Phone Recipients */}
              <div className="space-y-2">
                <Label>SMS Recipients</Label>
                <div className="flex gap-2">
                  <Input
                    type="tel"
                    placeholder="+1234567890"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                  />
                  <Button onClick={handleAddPhone} size="sm">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {prefs.phoneNumbers.map((phone) => (
                    <Badge key={phone} variant="secondary" className="gap-1">
                      {phone}
                      <button
                        onClick={() => handleRemovePhone(phone)}
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unacknowledged
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-warning" />
              <span className="text-3xl font-bold">{unacknowledgedCount}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Critical Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-destructive" />
              <span className="text-3xl font-bold">
                {alerts.filter((a) => a.severity === "critical" && !a.acknowledged).length}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Notifications Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Mail className={`h-4 w-4 ${prefs.email ? "text-success" : "text-muted-foreground"}`} />
                <span className="text-sm">{prefs.email ? "On" : "Off"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Phone className={`h-4 w-4 ${prefs.sms ? "text-success" : "text-muted-foreground"}`} />
                <span className="text-sm">{prefs.sms ? "On" : "Off"}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Recent Alerts</h2>
        {alerts.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Check className="h-12 w-12 mx-auto text-success mb-2" />
              <p className="text-muted-foreground">No alerts at this time</p>
            </CardContent>
          </Card>
        ) : (
          alerts.map((alert) => (
            <Card
              key={alert.id}
              className={`${
                !alert.acknowledged
                  ? alert.severity === "critical"
                    ? "border-destructive/50 bg-destructive/5"
                    : "border-warning/50 bg-warning/5"
                  : ""
              }`}
            >
              <CardContent className="py-4">
                <div className="flex items-start gap-4">
                  {getAlertIcon(alert.type, alert.severity)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{alert.title}</h3>
                      <Badge
                        variant={
                          alert.severity === "critical"
                            ? "destructive"
                            : alert.severity === "warning"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {alert.severity}
                      </Badge>
                      {alert.acknowledged && (
                        <Badge variant="outline" className="text-success border-success">
                          Acknowledged
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {alert.message}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(alert.timestamp).toLocaleString()}
                      </div>
                      {alert.batchId && (
                        <span className="font-mono">{alert.batchId}</span>
                      )}
                      {alert.stationId && <span>{alert.stationId}</span>}
                    </div>
                    {alert.acknowledged && alert.acknowledgedBy && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Acknowledged by {alert.acknowledgedBy} at{" "}
                        {new Date(alert.acknowledgedAt!).toLocaleString()}
                      </p>
                    )}
                  </div>
                  {!alert.acknowledged && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAcknowledge(alert.id)}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Acknowledge
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
