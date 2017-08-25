class DesktopNotification {
    send() {
        var notification = new Notification("Test", {
            icon: "https://cryptotrackr.com/logo.png",
            body: "Hey there! You've been notified!"
        });
        notification.onclick = function() {
            window.open("https://cryptotrackr.com");
        };
    }
}

export default DesktopNotification;
