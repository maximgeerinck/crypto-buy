export const setDocumentTitle = (title) => {
    document.title = title;
};
export const resetDocumentTitle = () => {
    document.title = window.cryptotrackr.originalDocumentTitle;
    console.log(window.cryptotrackr.originalDocumentTitle);
};
