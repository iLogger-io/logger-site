function pushNotification(title: string, message: string) {
  if (Notification.permission === "granted") {
    navigator.serviceWorker.getRegistration().then(function(reg) {
      if (reg == undefined) {
        console.log("[serviceWorker] only works online");
        return;
      }
      const options = {
        body: message,
        icon: "./static/img/notification-flat.png",
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          primaryKey: 1
        },
        actions: [
          {
            action: "explore",
            title: "Go to the site",
            icon: "./static/img/checkmark.png"
          },
          {
            action: "close",
            title: "Close the notification",
            icon: "./static/img/xmark.png"
          }
        ]
      };
      reg.showNotification(title, options);
    });
  }
}

export default pushNotification;
