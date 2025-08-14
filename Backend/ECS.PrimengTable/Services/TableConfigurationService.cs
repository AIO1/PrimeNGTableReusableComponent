using ECS.PrimengTable.Attributes;
using ECS.PrimengTable.Models;
using System.Reflection;

namespace ECS.PrimengTable.Services;

public static class TableConfigurationService {
    /// <summary>
    /// Retrieves metadata for each property of the provided class <typeparamref name="T"/>
    /// based on the presence of the <see cref="PrimeNGAttributes"/> attribute.
    /// </summary>
    /// <typeparam name="T">The type of the class for which to retrieve column metadata.</typeparam>
    /// <returns>
    /// A list of <see cref="ColumnMetadataModel"/> objects representing
    /// the metadata for each property in the class.
    /// </returns>
    /// <exception cref="ArgumentException">
    /// Thrown when the <see cref="PrimeNGAttributes"/> attribute is missing for a property.
    /// The exception message includes the name of the property that is missing attributes.
    /// </exception>
    public static TableConfigurationModel GetTableConfiguration<T>(int[]? allowedItemsPerPage = null, string? dateFormat = null, string? dateTimezone = null, string? dateCulture = null, bool convertFieldToLower = true) {
        allowedItemsPerPage ??= TableConfigurationDefaults.AllowedItemsPerPage;
        dateFormat ??= TableConfigurationDefaults.DateFormat;
        dateTimezone ??= TableConfigurationDefaults.DateTimezone;
        dateCulture ??= TableConfigurationDefaults.DateCulture;
        List<ColumnMetadataModel> columnsInfo = []; // Prepare the list to be returned
        PropertyInfo[] properties = typeof(T).GetProperties(); // Get the properties of the provided class
        foreach(var property in properties) { // Loop through each property of the class
            ColumnAttributes? colAtt = property.GetCustomAttribute<ColumnAttributes>(); // Try to get the column attributes for the current property
            if(colAtt == null) { // If there are no column properties
                Console.WriteLine($"[WARN] The column '{property.Name}' is missing its ColumnAttributes. Skipping.");
                continue;
            }
            if(!colAtt.SendColumnAttributes) { // If we don't to send the column
                continue;
            }
            string propertyName = convertFieldToLower
                   ? char.ToLower(property.Name[0]) + property.Name.Substring(1)
                   : property.Name; // Get the property name with the first letter to lower
            columnsInfo.Add(new ColumnMetadataModel {
                Field = propertyName,
                Header = colAtt.Header,
                DataType = colAtt.DataType,
                DataAlignHorizontal = colAtt.DataAlignHorizontal,
                DataAlignHorizontalAllowUserEdit = colAtt.DataAlignHorizontalAllowUserEdit,
                DataAlignVertical = colAtt.DataAlignVertical,
                DataAlignVerticalAllowUserEdit = colAtt.DataAlignVerticalAllowUserEdit,
                CanBeHidden = colAtt.CanBeHidden,
                StartHidden = colAtt.StartHidden,
                CanBeResized = colAtt.CanBeResized,
                CanBeReordered = colAtt.CanBeReordered,
                CanBeSorted = colAtt.CanBeSorted,
                CanBeFiltered = colAtt.CanBeFiltered,
                FilterPredifinedValuesName = colAtt.FilterPredifinedValuesName,
                CanBeGlobalFiltered = colAtt.CanBeGlobalFiltered,
                ColumnDescription = colAtt.ColumnDescription,
                DataTooltipShow = colAtt.DataTooltipShow,
                DataTooltipCustomColumnSource = colAtt.DataTooltipCustomColumnSource,
                FrozenColumnAlign = colAtt.FrozenColumnAlign,
                CellOverflowBehaviour = colAtt.CellOverflowBehaviour,
                CellOverflowBehaviourAllowUserEdit = colAtt.CellOverflowBehaviourAllowUserEdit,
                InitialWidth = colAtt.InitialWidth
            });
        }
        return new TableConfigurationModel {
            ColumnsInfo = columnsInfo,
            AllowedItemsPerPage = allowedItemsPerPage,
            DateFormat = dateFormat,
            DateTimezone = dateTimezone,
            DateCulture = dateCulture
        };
    }

    /// <summary>
    /// Validates the items per page size and the presence of columns for filtering.
    /// </summary>
    /// <param name="itemsPerPage">The number of items to display per page.</param>
    /// <param name="columns">A list of column names to be included in the filtering.</param>
    /// <returns>
    ///   <c>true</c> if the items per page is within the allowed values and columns are provided; otherwise, <c>false</c>.
    /// </returns>
    public static bool ValidateItemsPerPageAndCols(byte itemsPerPage, List<string>? columns, int[]? allowedItemsPerPage = null) {
        allowedItemsPerPage ??= TableConfigurationDefaults.AllowedItemsPerPage;
        if(!allowedItemsPerPage.Contains(itemsPerPage)) { // If the items per page is not within the allowed items per page array values
            return false;
        }
        if(columns == null || columns.Count == 0) { // If no columns have been returned for filtering
            return false;
        }
        return true;
    }
}