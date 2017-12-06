export const setCookie = (name, expires, data) => {
    var d = new Date();
    d.setTime(d.getTime() + expires);
    document.cookie = `${name}=${JSON.stringify(data)};${expires};path=/`;
};

export const getCookie = name => {
    name = `${name}=`;
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(";");
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return JSON.parse(c.substring(name.length, c.length));
        }
    }
    return undefined;
};

export const DAY = 60 * 60 * 24;
export const WEEK = 7 * DAY;
export const MONTH = 30 * WEEK;
export const YEAR = 365 * DAY;
export const SHORT = 5 * 60;
