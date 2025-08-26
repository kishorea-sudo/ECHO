import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { 
  AlertTriangle, 
  Mail, 
  MessageSquare, 
  Bell, 
  BellOff,
  CheckCircle,
  XCircle,
  Info,
  Zap,
  Droplets,
  Thermometer,
  Wifi,
  Battery,
  Settings
} from "lucide-react";
import { cn } from "./ui/utils";

interface Alert {
  id: string;
  type: 'emergency' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  source: string;
}

interface NotificationSettings {
  email: boolean;
  sms: boolean;
  emailAddress: string;
  phoneNumber: string;
  emergencyOnly: boolean;
}

export function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'warning',
      title: 'Low Battery Warning',
      message: 'Battery level has dropped to 25%. Consider returning to dock.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      acknowledged: false,
      source: 'Power Management'
    },
    {
      id: '2',
      type: 'info',
      title: 'Hyacinth Detected',
      message: 'Large patch of water hyacinth detected at coordinates 46.7712°N, 92.1004°W',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      acknowledged: true,
      source: 'AI Vision System'
    },
    {
      id: '3',
      type: 'success',
      title: 'Harvest Complete',
      message: 'Successfully harvested 15.3 kg of aquatic vegetation from zone Alpha-7',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      acknowledged: true,
      source: 'Harvest Controller'
    },
    {
      id: '4',
      type: 'emergency',
      title: 'Obstacle Collision Risk',
      message: 'URGENT: Large obstacle detected 2.1m ahead. Emergency stop engaged.',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      acknowledged: false,
      source: 'Collision Avoidance'
    }
  ]);

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email: true,
    sms: false,
    emailAddress: 'operator@aquaharvest.com',
    phoneNumber: '+1-555-0123',
    emergencyOnly: false
  });

  const [testMessage, setTestMessage] = useState('');

  // Simulate new alerts
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance every 5 seconds
        const alertTypes = ['info', 'warning'] as const;
        const randomType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
        
        const messages = {
          info: [
            'Water quality readings updated',
            'GPS location synchronized',
            'Camera feed optimized'
          ],
          warning: [
            'Motor Runtime exceeded safe limits',
            'Network latency increased',
            'Sensor calibration drift detected'
          ]
        };

        const newAlert: Alert = {
          id: Date.now().toString(),
          type: randomType,
          title: `${randomType === 'info' ? 'System Update' : 'System Warning'}`,
          message: messages[randomType][Math.floor(Math.random() * messages[randomType].length)],
          timestamp: new Date(),
          acknowledged: false,
          source: 'System Monitor'
        };

        setAlerts(prev => [newAlert, ...prev].slice(0, 20)); // Keep only latest 20
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'emergency': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info': return <Info className="w-5 h-5 text-blue-400" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-[#00ff41]" />;
      default: return <Info className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'emergency': return 'border-red-500 bg-red-500/10';
      case 'warning': return 'border-yellow-500 bg-yellow-500/10';
      case 'info': return 'border-blue-400 bg-blue-400/10';
      case 'success': return 'border-[#00ff41] bg-[#00ff41]/10';
      default: return 'border-border bg-card';
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const clearAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const sendTestNotification = () => {
    if (!testMessage.trim()) return;
    
    const testAlert: Alert = {
      id: `test-${Date.now()}`,
      type: 'info',
      title: 'Test Notification',
      message: testMessage,
      timestamp: new Date(),
      acknowledged: false,
      source: 'Manual Test'
    };
    
    setAlerts(prev => [testAlert, ...prev]);
    setTestMessage('');
  };

  const unacknowledgedCount = alerts.filter(alert => !alert.acknowledged).length;
  const emergencyCount = alerts.filter(alert => alert.type === 'emergency' && !alert.acknowledged).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-[#00ffff] text-glow-cyan">Alerts & Notifications</h1>
          {unacknowledgedCount > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              {unacknowledgedCount} unread
            </Badge>
          )}
          {emergencyCount > 0 && (
            <Badge variant="destructive" className="bg-red-600 animate-pulse glow-red">
              {emergencyCount} EMERGENCY
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAlerts(prev => prev.map(alert => ({ ...alert, acknowledged: true })))}
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Acknowledge All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAlerts([])}
          >
            <XCircle className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Alerts */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-glow-cyan">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-[#00ffff]" />
                <span>Active Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {alerts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No active alerts</p>
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={cn(
                        "p-4 rounded-lg border transition-all duration-200",
                        getAlertColor(alert.type),
                        !alert.acknowledged && "animate-pulse"
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          {getAlertIcon(alert.type)}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium">{alert.title}</h4>
                              {!alert.acknowledged && (
                                <Badge variant="outline" className="text-xs">
                                  NEW
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {alert.message}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span>{alert.source}</span>
                              <span>{alert.timestamp.toLocaleTimeString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {!alert.acknowledged && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => acknowledgeAlert(alert.id)}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => clearAlert(alert.id)}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Test Notifications */}
          <Card className="border-glow-green">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-[#00ff41]" />
                <span>Test Notification</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter test message..."
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                className="min-h-20"
              />
              <Button
                onClick={sendTestNotification}
                disabled={!testMessage.trim()}
                className="w-full"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Test Notification
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Notification Settings */}
        <div className="space-y-4">
          <Card className="border-glow-cyan">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-[#00ffff]" />
                <span>Notification Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Email Settings */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-[#00ffff]" />
                    <span className="text-sm">Email Alerts</span>
                  </div>
                  <Switch
                    checked={notificationSettings.email}
                    onCheckedChange={(checked) =>
                      setNotificationSettings(prev => ({ ...prev, email: checked }))
                    }
                  />
                </div>
                
                {notificationSettings.email && (
                  <Input
                    placeholder="Email address"
                    value={notificationSettings.emailAddress}
                    onChange={(e) =>
                      setNotificationSettings(prev => ({ ...prev, emailAddress: e.target.value }))
                    }
                    className="text-sm"
                  />
                )}
              </div>

              {/* SMS Settings */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-[#00ff41]" />
                    <span className="text-sm">SMS Alerts</span>
                  </div>
                  <Switch
                    checked={notificationSettings.sms}
                    onCheckedChange={(checked) =>
                      setNotificationSettings(prev => ({ ...prev, sms: checked }))
                    }
                  />
                </div>
                
                {notificationSettings.sms && (
                  <Input
                    placeholder="Phone number"
                    value={notificationSettings.phoneNumber}
                    onChange={(e) =>
                      setNotificationSettings(prev => ({ ...prev, phoneNumber: e.target.value }))
                    }
                    className="text-sm"
                  />
                )}
              </div>

              {/* Emergency Only */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="text-sm">Emergency Only</span>
                </div>
                <Switch
                  checked={notificationSettings.emergencyOnly}
                  onCheckedChange={(checked) =>
                    setNotificationSettings(prev => ({ ...prev, emergencyOnly: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Alert Statistics */}
          <Card className="border-glow-green">
            <CardHeader>
              <CardTitle>Alert Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Alerts</span>
                  <span className="text-sm text-[#00ffff]">{alerts.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Unacknowledged</span>
                  <span className="text-sm text-yellow-500">{unacknowledgedCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Emergency</span>
                  <span className="text-sm text-red-500">{emergencyCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Success</span>
                  <span className="text-sm text-[#00ff41]">
                    {alerts.filter(a => a.type === 'success').length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card className="border-glow-cyan">
            <CardHeader>
              <CardTitle>System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Battery className="w-4 h-4 text-[#00ff41]" />
                    <span className="text-sm">Power System</span>
                  </div>
                  <Badge variant="outline" className="border-[#00ff41] text-[#00ff41]">
                    GOOD
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Wifi className="w-4 h-4 text-[#00ffff]" />
                    <span className="text-sm">Communication</span>
                  </div>
                  <Badge variant="outline" className="border-[#00ffff] text-[#00ffff]">
                    CONNECTED
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Droplets className="w-4 h-4 text-blue-400" />
                    <span className="text-sm">Sensors</span>
                  </div>
                  <Badge variant="outline" className="border-[#00ff41] text-[#00ff41]">
                    OPTIMAL
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-orange-400" />
                    <span className="text-sm">Motors</span>
                  </div>
                  <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                    WARM
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}