import * as moment from "moment";

export const cache = (key, item, duration = 60 * 10) => {
    const now = moment();

    localStorage.setItem(key, JSON.stringify({ item: item, expiresOn: now.add(duration, "seconds").toDate() }));
};

export const getCache = key => {
    if (localStorage.getItem(key)) {
        const cacheObj = JSON.parse(localStorage.getItem(key));
        return moment(cacheObj.expiresOn) > moment() ? cacheObj.item : false;
    }
    return false;
};

export const remove = key => {
    localStorage.removeItem(key);
};

export const DAY = 60 * 60 * 24;
export const WEEK = 7 * DAY;
export const MONTH = 30 * WEEK;
export const YEAR = 365 * DAY;
export const SHORT = 5 * 60;
