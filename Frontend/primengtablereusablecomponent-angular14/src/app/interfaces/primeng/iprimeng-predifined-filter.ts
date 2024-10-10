/**
 * Interface representing the configuration for filter options in a PrimeNG table.
 */
export interface IPrimengPredifinedFilter {
    /** 
     * Gets or sets the URL of the icon to be displayed for the option.
     * The value should be a string representing the URL of the icon image.
     */
    icon?: string;
    iconURL?:string
    iconBlob?: Blob;
    
    /** 
     * Gets or sets the display name of the option.
     * The value should be a string representing the name to be shown in the UI.
     */
    name?: string;
    displayName?: boolean;
    /**
     * Gets or sets the underlying value of the option.
     * The value can be of any type and represents the data managed behind the scenes.
     */
    value: any;

    displayTag?: boolean
    tagStyle?: { [key: string]: string }
}