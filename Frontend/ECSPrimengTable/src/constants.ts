import { Constant } from "./app/interfaces/constant.interface";
const isDevelopment = getIsDevelopment(); // To determine if we are not in development
export const Constants: Constant = {
    isDevelopment,
    APIbaseURL: getApiBaseUrl(),
    timeoutTime: 60000
};
function getIsDevelopment(): boolean {
  return typeof window !== 'undefined' && window.location.hostname === 'localhost';
}
//#region getApiBaseUrl
    /**
    * Gets the URL to the API depending if we are in development or in production.
    */
    function getApiBaseUrl(): string {
        if (isDevelopment) { // Check if we are in development
            log(1, "POINTING TO DEVELOPMENT API");
            return 'https://localhost:7020/';
        } else { // If we are in production
            return 'YourProdURL';
        }
    }
//#endregion
//#region log
    /**
    * Used to log to console (only in dev).
    * @remarks If in dev enviroment, it will log the information to console
    * @param {number} logType - The type of log to perform: 
    * - 0 - Log
    * - 1 - Info
    * - 2 - Error 
    * - Other - Log
    * @param {any[]} messages - An array of all the messages to log to console.
    */
    export function log(logType: number = 0, ...messages: any[]): void{
        if (isDevelopment) { // If we are in development
            switch (logType) { // Depending on the log type
                case 0: { // Log
                    console.log(...messages);
                    break;
                }
                case 1: { // Info
                    console.info(...messages);
                    break;
                }
                case 2: { // Error
                    console.error(...messages);
                    break;
                }
                default:
                    console.log(...messages);
            };
        }
    }
//#endregion