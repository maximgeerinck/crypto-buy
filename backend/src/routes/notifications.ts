import NotificationController from "../notification/NotificationController";

module.exports = [
  {
    method: "GET",
    path: "/notifications/active",
    handler: NotificationController.active,
    config: { auth: false }
  },
];
