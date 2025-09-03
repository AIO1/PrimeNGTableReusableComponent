export interface IPredifinedFilter {
    /** 
     * The value of the PrimeNG icon.
     */
    icon?: string;

    iconURL?:string


    iconBlobSourceEndpoint?: string
    iconBlobSourceEndpointResponseError?: boolean

    /** 
     * The icon as a blob.
     */
    iconBlob?: Blob;
    
    /** 
     * A string representing the name to be shown in the UI.
     */
    name?: string;

    /** 
     * If the name needs to be shown in the UI
     */
    displayName?: boolean;

    /**
     * The underlying value of the option. The value can be of any type and represents the data managed behind the scenes.
     */
    value: any;

    /**
     * If the value needs to be displayed with a tag
     */
    displayTag?: boolean

    tagStyle?: { [key: string]: string }
    iconColor?: string;
    iconStyle?: string;
}