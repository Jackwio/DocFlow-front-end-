/**
 * ToastContainer component
 * Manages the notification queue and positioning
 */

import { useUIStore } from '@/state/useUIStore';
import { Toast } from './Toast';

export function ToastContainer() {
  const notifications = useUIStore((state) => state.notifications);
  const removeNotification = useUIStore((state) => state.removeNotification);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed top-4 right-4 z-toast flex flex-col gap-2"
      aria-live="polite"
      aria-atomic="false"
    >
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
}
