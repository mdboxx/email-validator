import { Switch } from '@headlessui/react';
import { useValidationStore } from '../../stores/validationStore';
import { cn } from '../../utils/cn';

export default function ValidationSettings() {
  const { settings, updateSettings } = useValidationStore();

  return (
    <div className="space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Validation Settings</h2>
        
        <div className="space-y-8">
          <SettingSection title="Email Validation">
            <SettingToggle
              label="Syntax Validation"
              description="Check email format and structure"
              enabled={settings.syntax.enabled}
              onChange={(enabled) => updateSettings('syntax', { enabled })}
            />
            
            <SettingToggle
              label="MX Record Verification"
              description="Verify domain mail server records"
              enabled={settings.mx.enabled}
              onChange={(enabled) => updateSettings('mx', { enabled })}
            />
            
            <SettingToggle
              label="SMTP Verification"
              description="Test email server connection"
              enabled={settings.smtp.enabled}
              onChange={(enabled) => updateSettings('smtp', { enabled })}
            />
          </SettingSection>

          <SettingSection title="Advanced Features">
            <SettingToggle
              label="Catch-all Detection"
              description="Detect catch-all email domains"
              enabled={settings.catchAll.enabled}
              onChange={(enabled) => updateSettings('catchAll', { enabled })}
            />
            
            <SettingToggle
              label="Role-based Detection"
              description="Detect role-based email addresses"
              enabled={settings.roleBased.enabled}
              onChange={(enabled) => updateSettings('roleBased', { enabled })}
            />
            
            <SettingToggle
              label="Disposable Email Detection"
              description="Detect temporary email services"
              enabled={settings.disposable.enabled}
              onChange={(enabled) => updateSettings('disposable', { enabled })}
            />

            <SettingToggle
              label="Typo Detection"
              description="Detect and suggest corrections for common typos"
              enabled={settings.typo?.enabled}
              onChange={(enabled) => updateSettings('typo', { enabled })}
            />
          </SettingSection>

          <SettingSection title="Batch Processing">
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Batch Size
                </label>
                <input
                  type="number"
                  value={settings.batch?.size || 50}
                  onChange={(e) => updateSettings('batch', { size: parseInt(e.target.value) })}
                  className={cn(
                    "w-full rounded-lg border-gray-300 dark:border-gray-600",
                    "focus:ring-2 focus:ring-blue-500"
                  )}
                  min="1"
                  max="1000"
                />
                <p className="mt-1 text-sm text-gray-500">Number of emails to process simultaneously</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Concurrent Connections
                </label>
                <input
                  type="number"
                  value={settings.batch?.concurrency || 5}
                  onChange={(e) => updateSettings('batch', { concurrency: parseInt(e.target.value) })}
                  className={cn(
                    "w-full rounded-lg border-gray-300 dark:border-gray-600",
                    "focus:ring-2 focus:ring-blue-500"
                  )}
                  min="1"
                  max="20"
                />
                <p className="mt-1 text-sm text-gray-500">Maximum number of simultaneous connections</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Retry Attempts
                </label>
                <input
                  type="number"
                  value={settings.batch?.retryAttempts || 3}
                  onChange={(e) => updateSettings('batch', { retryAttempts: parseInt(e.target.value) })}
                  className={cn(
                    "w-full rounded-lg border-gray-300 dark:border-gray-600",
                    "focus:ring-2 focus:ring-blue-500"
                  )}
                  min="0"
                  max="5"
                />
                <p className="mt-1 text-sm text-gray-500">Number of retry attempts for failed validations</p>
              </div>
            </div>
          </SettingSection>

          <SettingSection title="Performance">
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Connection Timeout (seconds)
                </label>
                <input
                  type="number"
                  value={settings.timeout}
                  onChange={(e) => updateSettings('timeout', parseInt(e.target.value))}
                  className={cn(
                    "w-full rounded-lg border-gray-300 dark:border-gray-600",
                    "focus:ring-2 focus:ring-blue-500"
                  )}
                  min="1"
                  max="30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Cache Duration (minutes)
                </label>
                <input
                  type="number"
                  value={settings.cache?.duration || 60}
                  onChange={(e) => updateSettings('cache', { duration: parseInt(e.target.value) })}
                  className={cn(
                    "w-full rounded-lg border-gray-300 dark:border-gray-600",
                    "focus:ring-2 focus:ring-blue-500"
                  )}
                  min="1"
                  max="1440"
                />
              </div>
            </div>
          </SettingSection>
        </div>
      </div>
    </div>
  );
}

function SettingSection({ title, children }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</h3>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

function SettingToggle({ label, description, enabled, onChange }) {
  return (
    <Switch.Group>
      <div className="flex items-center justify-between">
        <div className="flex-grow">
          <Switch.Label className="text-sm font-medium">{label}</Switch.Label>
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        <Switch
          checked={enabled}
          onChange={onChange}
          className={cn(
            enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700',
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors'
          )}
        >
          <span
            className={cn(
              enabled ? 'translate-x-6' : 'translate-x-1',
              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform'
            )}
          />
        </Switch>
      </div>
    </Switch.Group>
  );
}