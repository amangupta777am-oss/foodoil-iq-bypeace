// Alert Notification Service for borderline and rejected samples

export type AlertSeverity = 'info' | 'warning' | 'critical';
export type AlertType = 'borderline' | 'reject' | 'equipment' | 'calibration';

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  batchId?: string;
  stationId?: string;
  timestamp: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  emailAddresses: string[];
  phoneNumbers: string[];
  notifyOn: {
    borderline: boolean;
    reject: boolean;
    equipment: boolean;
  };
}

// In-memory storage for alerts (would be replaced with database)
let alerts: Alert[] = [];
let notificationPrefs: NotificationPreferences = {
  email: true,
  sms: false,
  emailAddresses: [],
  phoneNumbers: [],
  notifyOn: {
    borderline: true,
    reject: true,
    equipment: true,
  },
};

export const alertService = {
  // Create a new alert
  createAlert(
    type: AlertType,
    severity: AlertSeverity,
    title: string,
    message: string,
    batchId?: string,
    stationId?: string
  ): Alert {
    const alert: Alert = {
      id: `ALT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      severity,
      title,
      message,
      batchId,
      stationId,
      timestamp: new Date().toISOString(),
      acknowledged: false,
    };

    alerts.unshift(alert);
    
    // Trigger notifications based on preferences
    this.triggerNotifications(alert);
    
    return alert;
  },

  // Trigger email/SMS notifications
  async triggerNotifications(alert: Alert): Promise<void> {
    const prefs = notificationPrefs;
    
    if (!prefs.notifyOn[alert.type as keyof typeof prefs.notifyOn]) {
      return;
    }

    if (prefs.email && prefs.emailAddresses.length > 0) {
      // In production, this would call an email API
      console.log(`[Email Alert] To: ${prefs.emailAddresses.join(', ')}`);
      console.log(`Subject: FoodOil IQ Alert - ${alert.title}`);
      console.log(`Body: ${alert.message}`);
    }

    if (prefs.sms && prefs.phoneNumbers.length > 0) {
      // In production, this would call an SMS API
      console.log(`[SMS Alert] To: ${prefs.phoneNumbers.join(', ')}`);
      console.log(`Message: ${alert.title} - ${alert.message}`);
    }
  },

  // Get all alerts
  getAlerts(filters?: { type?: AlertType; acknowledged?: boolean }): Alert[] {
    let filtered = [...alerts];
    
    if (filters?.type) {
      filtered = filtered.filter(a => a.type === filters.type);
    }
    if (filters?.acknowledged !== undefined) {
      filtered = filtered.filter(a => a.acknowledged === filters.acknowledged);
    }
    
    return filtered;
  },

  // Get unacknowledged alerts count
  getUnacknowledgedCount(): number {
    return alerts.filter(a => !a.acknowledged).length;
  },

  // Acknowledge an alert
  acknowledgeAlert(alertId: string, acknowledgedBy: string): Alert | null {
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      alert.acknowledgedBy = acknowledgedBy;
      alert.acknowledgedAt = new Date().toISOString();
    }
    return alert || null;
  },

  // Get notification preferences
  getNotificationPreferences(): NotificationPreferences {
    return { ...notificationPrefs };
  },

  // Update notification preferences
  updateNotificationPreferences(prefs: Partial<NotificationPreferences>): void {
    notificationPrefs = { ...notificationPrefs, ...prefs };
  },

  // Create alert for test result
  createTestResultAlert(
    classification: 'pass' | 'borderline' | 'reject',
    score: number,
    batchId: string,
    stationId?: string
  ): Alert | null {
    if (classification === 'pass') return null;

    const type: AlertType = classification === 'borderline' ? 'borderline' : 'reject';
    const severity: AlertSeverity = classification === 'borderline' ? 'warning' : 'critical';
    
    const title = classification === 'borderline' 
      ? 'Borderline Oil Quality Detected'
      : 'Oil Quality Below Acceptable Limits';
    
    const message = classification === 'borderline'
      ? `Batch ${batchId} shows borderline oil quality (Score: ${score}). Increased monitoring recommended.`
      : `Batch ${batchId} has been REJECTED (Score: ${score}). Immediate oil replacement required.`;

    return this.createAlert(type, severity, title, message, batchId, stationId);
  },

  // Initialize with sample alerts for demo
  initializeSampleAlerts(): void {
    if (alerts.length === 0) {
      this.createAlert(
        'borderline',
        'warning',
        'Borderline TPC Level',
        'Station A3 showing elevated TPC levels (22.5%). Monitor closely.',
        'BATCH-2024-0115-C',
        'STATION-A3'
      );
      this.createAlert(
        'reject',
        'critical',
        'Oil Quality Rejected',
        'Station B1 oil failed quality test. Immediate replacement required.',
        'BATCH-2024-0114-B',
        'STATION-B1'
      );
    }
  },
};

// Initialize sample alerts
alertService.initializeSampleAlerts();
