import apiClient from "../../util/apiClient";

export type NotificationType = "success" | "error" | "info";

export interface AppNotification {
    id: number;
    title: string;
    body: string;
    type: NotificationType;
    is_read: boolean;
    created_at: string | null;
}

// Latest notifications + unread count for the current user.
export const getNotifications = async (
    token: string | null
): Promise<{ notifications: AppNotification[]; unread: number }> => {
    try {
        const response = await apiClient.get("/api/notifications", {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data?.statusCode === 200) {
            return {
                notifications: response.data.notifications ?? [],
                unread: response.data.unread ?? 0,
            };
        }
        return { notifications: [], unread: 0 };
    } catch {
        return { notifications: [], unread: 0 };
    }
};

// Just the unread count — cheap to poll.
export const getUnreadCount = async (token: string | null): Promise<number> => {
    try {
        const response = await apiClient.get("/api/notifications/unread-count", {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data?.statusCode === 200) {
            return response.data.unread ?? 0;
        }
        return 0;
    } catch {
        return 0;
    }
};

export const markNotificationRead = async (id: number, token: string | null) => {
    try {
        const response = await apiClient.patch(
            `/api/notifications/${id}/read`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (err: any) {
        return err?.response?.data ?? { statusCode: 500, message: "error" };
    }
};

export const markAllNotificationsRead = async (token: string | null) => {
    try {
        const response = await apiClient.patch(
            "/api/notifications/read-all",
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (err: any) {
        return err?.response?.data ?? { statusCode: 500, message: "error" };
    }
};
