
const isDevelopment = window.location.hostname === 'localhost'; // To determine if we are not in development
export const Constants: any = {
    APIbaseURL: getApiBaseUrl(),
    timeoutTime: 60000, // The maximun allowed time to consider an HTTP call as timedout
    waitingHTTP: false // Used to show a modal with a spinner if we are waiting for an HTTP response
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