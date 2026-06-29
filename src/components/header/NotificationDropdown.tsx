import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Dropdown } from "../ui/dropdown/Dropdown";
import {
  AppNotification,
  getNotifications,
  getUnreadCount,
  markAllNotificationsRead,
} from "../../services/notification/notification";

const DOT_COLOR: Record<string, string> = {
  success: "bg-success-500",
  error: "bg-error-500",
  info: "bg-brand-500",
};

function timeAgo(value: string | null): string {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  const diffMs = Date.now() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "indi";
  if (mins < 60) return `${mins} dəq əvvəl`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} saat əvvəl`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} gün əvvəl`;
  return d.toLocaleDateString("az-AZ", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function NotificationDropdown() {
  const token = useSelector((s: RootState) => s.auth.token);
  const [isOpen, setIsOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [items, setItems] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshCount = useCallback(async () => {
    if (!token) return;
    setUnread(await getUnreadCount(token));
  }, [token]);

  // Initial count + periodic poll (every 45s) so the badge stays current.
  useEffect(() => {
    refreshCount();
    const id = setInterval(refreshCount, 45000);
    return () => clearInterval(id);
  }, [refreshCount]);

  const closeDropdown = () => setIsOpen(false);

  const handleClick = async () => {
    const next = !isOpen;
    setIsOpen(next);
    if (next && token) {
      setLoading(true);
      const data = await getNotifications(token);
      setItems(data.notifications);
      setUnread(data.unread);
      setLoading(false);
      // Opening the panel marks everything read and clears the badge.
      if (data.unread > 0) {
        await markAllNotificationsRead(token);
        setUnread(0);
      }
    }
  };

  return (
    <div className="relative">
      <button
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full dropdown-toggle hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={handleClick}
      >
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 z-10 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-error-500 px-1 text-[10px] font-semibold text-white ring-2 ring-white dark:ring-gray-900">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
        <svg
          className="fill-current"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
            fill="currentColor"
          />
        </svg>
      </button>
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute -right-[240px] mt-[17px] flex h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px] lg:right-0"
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Bildirişlər
          </h5>
          <button
            onClick={closeDropdown}
            className="text-gray-500 transition dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <svg
              className="fill-current"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
        <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar">
          {loading ? (
            <li className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
              Yüklənir...
            </li>
          ) : items.length === 0 ? (
            <li className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
              Bildiriş yoxdur
            </li>
          ) : (
            items.map((n) => (
              <li key={n.id}>
                <div
                  className={`flex gap-3 rounded-lg border-b border-gray-100 p-3 dark:border-gray-800 ${
                    n.is_read ? "" : "bg-gray-50 dark:bg-white/5"
                  }`}
                >
                  <span
                    className={`mt-1.5 block h-2 w-2 shrink-0 rounded-full ${
                      DOT_COLOR[n.type] ?? DOT_COLOR.info
                    }`}
                  />
                  <span className="block">
                    <span className="mb-1 block text-theme-sm font-medium text-gray-800 dark:text-white/90">
                      {n.title}
                    </span>
                    <span className="mb-1 block text-theme-sm text-gray-500 dark:text-gray-400">
                      {n.body}
                    </span>
                    <span className="block text-gray-400 text-theme-xs">
                      {timeAgo(n.created_at)}
                    </span>
                  </span>
                </div>
              </li>
            ))
          )}
        </ul>
      </Dropdown>
    </div>
  );
}
