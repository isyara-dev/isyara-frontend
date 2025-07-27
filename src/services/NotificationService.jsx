import { createRoot } from "react-dom/client";
import React from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";

class NotificationService {
  constructor() {
    this.container = null;
    this.notifications = [];
    this.initContainer();
  }

  initContainer() {
    // Buat container untuk notifications jika belum ada
    if (
      typeof document !== "undefined" &&
      !document.getElementById("notification-container")
    ) {
      this.container = document.createElement("div");
      this.container.id = "notification-container";
      this.container.style.position = "fixed";
      this.container.style.top = "1rem";
      this.container.style.right = "1rem";
      this.container.style.zIndex = "9999";
      this.container.style.display = "flex";
      this.container.style.flexDirection = "column";
      this.container.style.gap = "0.5rem";
      this.container.style.maxWidth = "20rem";
      this.container.style.width = "calc(100% - 2rem)";
      this.container.style.pointerEvents = "none";

      document.body.appendChild(this.container);
      this.root = createRoot(this.container);
      this.renderNotifications();

      // Tambahkan CSS untuk animasi
      const style = document.createElement("style");
      style.textContent = `
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideOut {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(100%); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .notification-slide-in { animation: slideIn 0.3s ease-out forwards; }
        .notification-slide-out { animation: slideOut 0.3s ease-in forwards; }
        .notification-fade-in { animation: fadeIn 0.2s ease-out forwards; }
        .toast-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 3px;
          background-color: rgba(255, 255, 255, 0.7);
          transition: width linear;
        }
        @media (max-width: 640px) {
          #notification-container {
            left: 1rem;
            max-width: none;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  getIcon(type) {
    switch (type) {
      case "success":
        return <FaCheckCircle className="text-white text-lg flex-shrink-0" />;
      case "error":
        return <FaTimesCircle className="text-white text-lg flex-shrink-0" />;
      case "warning":
        return (
          <FaExclamationTriangle className="text-white text-lg flex-shrink-0" />
        );
      default:
        return <FaInfoCircle className="text-white text-lg flex-shrink-0" />;
    }
  }

  getBgColor(type) {
    switch (type) {
      case "success":
        return "bg-green-600/90";
      case "error":
        return "bg-red-600/90";
      case "warning":
        return "bg-yellow-600/90";
      default:
        return "bg-blue-600/90";
    }
  }

  show(message, type = "info", duration = 3000, category = null) {
    const id = Date.now().toString();

    // Jika ada kategori, hapus notifikasi lama dengan kategori yang sama
    if (category) {
      const existingIndex = this.notifications.findIndex(
        (n) => n.category === category
      );
      if (existingIndex !== -1) {
        // Hapus notifikasi lama
        this.notifications.splice(existingIndex, 1);
      }
    }

    const notification = {
      id,
      message,
      type,
      visible: true,
      category, // Tambahkan kategori ke objek notifikasi
    };

    this.notifications.push(notification);
    this.renderNotifications();

    if (duration > 0) {
      setTimeout(() => this.hide(id), duration);
    }

    return id;
  }

  hide(id) {
    const index = this.notifications.findIndex((n) => n.id === id);
    if (index !== -1) {
      // Mark as invisible first for animation
      this.notifications[index].visible = false;
      this.renderNotifications();

      // Remove after animation completes
      setTimeout(() => {
        this.notifications = this.notifications.filter((n) => n.id !== id);
        this.renderNotifications();
      }, 300);
    }
  }

  renderNotifications() {
    if (!this.root) return;

    // Gunakan notifikasi yang dikelompokkan
    const displayNotifications = this.notifications.slice(0, 5); // Batasi maksimal 5 notifikasi yang ditampilkan

    this.root.render(
      <div className="w-full">
        {displayNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-3 sm:p-4 rounded-lg shadow-lg flex items-center gap-2 sm:gap-3 backdrop-blur-sm ${this.getBgColor(
              notification.type
            )} 
              ${
                notification.visible
                  ? "notification-slide-in opacity-100 transform translate-x-0"
                  : "notification-slide-out opacity-0 transform translate-x-full"
              } transition-all duration-300 relative pointer-events-auto mb-2 w-full`}
          >
            {this.getIcon(notification.type)}
            <p className="text-white flex-grow text-sm sm:text-base">
              {notification.message}
            </p>
            <button
              onClick={() => this.hide(notification.id)}
              className="text-white hover:text-gray-200 transition-colors text-xl font-bold"
              aria-label="Close notification"
            >
              ×
            </button>
            {/* Progress bar */}
            {notification.progress !== undefined && (
              <div
                className="toast-progress"
                style={{ width: `${notification.progress}%` }}
              />
            )}
          </div>
        ))}
        {this.notifications.length > 5 && (
          <div className="bg-gray-600/90 p-2 rounded-lg text-center text-white text-sm mt-2 pointer-events-auto">
            +{this.notifications.length - 5} notifikasi lainnya
            <button
              onClick={() => this.clearAll()}
              className="ml-2 underline hover:text-gray-200"
            >
              Bersihkan semua
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default new NotificationService();
