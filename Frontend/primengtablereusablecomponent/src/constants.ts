
const isDevelopment = window.location.hostname === 'localhost'; // To determine if we are not in development
export const Constants: any = {
    APIbaseURL: getApiBaseUrl(),
    timeoutTime: 60000,
    waitingHTTP: false
};
//#region getApiBaseUrl
    /**
    * Gets the URL to the API depending if we are in development or in production.
    */
    function getApiBaseUrl(): string {
        if (isDevelopment) { // Check if we are in development
            return 'https://localhost:7020/';
        } else { // If we are in production
            return 'yourproductionAPIURL';
        }
    }
//#endregion