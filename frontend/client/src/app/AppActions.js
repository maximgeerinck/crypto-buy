export const setDocumentTitle = (title) => {
    document.title = title;
};
export const resetDocumentTitle = () => {
    document.title = window.cryptotrackr.originalDocumentTitle;    
};
