/**
 * Interface representing the configuration for action buttons in a PrimeNG table.
 */
export interface IprimengRowActionButtons {
    /** 
     * Gets or sets the icon to be displayed on the button.
     * The value should be a string representing the PrimeIcons class name.
     */
    icon: string;

    /** 
     * Gets or sets the color style class to be applied to the button.
     * The value should be a string representing a CSS class for styling the button.
     */
    color?: string

    /**
     * Gets or sets the condition for displaying the button.
     * It is a function that takes row data as input and returns a boolean indicating
     * whether the button should be displayed for that row.
     */
    condition?: (rowData: any) => boolean;

    /**
     * Represents the action to be executed when the button is clicked.
     * This function takes the row data of the clicked row as input and performs
     * specific actions based on that data.
     */
    action?: (rowData: any) => void;
}