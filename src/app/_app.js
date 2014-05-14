angular.module("app", ["app.templates", "services", "ui.router", "ui.bootstrap"])
    .constant("DIALOG_DEFAULTS", {
        backdrop: true,
        keyboard: true,
        backdropClick: true,
        backdropFade: true
    });
