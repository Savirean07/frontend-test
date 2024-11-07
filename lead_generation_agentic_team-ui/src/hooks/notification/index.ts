import { useState } from "react";

type NotificationLevel = "success" | "error" | "info" | "warning";

interface Notification {
  level: NotificationLevel;
  title: string;
  description: string;
  id: number | string;
  timeStamp: number | Date | string;
}

export const useNotification = (
  notificationLevel: NotificationLevel = "info"
) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const filteredNotification = (
    level: NotificationLevel = notificationLevel
  ) => {
    switch (level) {
      case "info":
        return notifications.filter((notification) =>
          ["success", "info", "warning", "error"].some(
            (level) => notification.level === level
          )
        );
      case "warning":
        return notifications.filter((notification) =>
          ["error", "warning", "success"].some(
            (level) => notification.level === level
          )
        );
      case "success":
        return notifications.filter((notification) =>
          ["error", "success"].some((level) => notification.level === level)
        );
      case "error":
        return notifications.filter((notification) =>
          ["error"].some((level) => notification.level === level)
        );
      default:
        return notifications;
    }
  };

  const pushNotification = (notification: Notification) => {
    setNotifications((prev) => [...prev, notification]);
  };

  const removeNotification = (id: number | string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  return {
    notificationByLevel: filteredNotification,
    pushNotification,
    removeNotification,
  };
};
