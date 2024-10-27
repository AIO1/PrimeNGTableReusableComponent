using System.Linq.Expressions;
using System.Linq.Dynamic.Core;
using System.Reflection;
using LinqKit;
using Microsoft.EntityFrameworkCore;
using PrimeNG.DTOs;
using PrimeNG.Attributes;
using System.Text.Json;
namespace PrimeNG.HelperFunctions {
    public static class PrimeNGHelper {
        public static readonly int[] allowedItemsPerPage = new int[] { 10, 25, 50, 75, 100 }; // The number of items per page allowed

        private const string MatchModeEquals = "equals"; // To avoid SonarQube warnings

        public static PrimeNGPostReturn PerformDynamicQuery<T>(PrimeNGPostRequest inputData, IQueryable<T> baseQuery, MethodInfo stringDateFormatMethod, string? defaultSortColumnName=null, int defaultSortOrder = 1) {
            if(inputData.Columns != null) {
                for(int i = 0; i < inputData.Columns.Count; i++) {
                    string column = inputData.Columns[i];
                    inputData.Columns[i] = char.ToUpper(column[0]) + column.Substring(1);
                }
            }
            if(inputData.Sort != null) {
                foreach(var sortItem in inputData.Sort) {
                    sortItem.Field = char.ToUpper(sortItem.Field[0]) + sortItem.Field.Substring(1);
                }
            }
            var updatedFilter = new Dictionary<string, List<PrimeNGTableFilterModel>>();
            foreach(var entry in inputData.Filter) {
                string updatedKey = char.ToUpper(entry.Key[0]) + entry.Key.Substring(1);
                updatedFilter[updatedKey] = entry.Value;
            }
            inputData.Filter = updatedFilter;
            baseQuery = ApplySorting(baseQuery, inputData.Sort, defaultSortColumnName, defaultSortOrder); // Apply the sorting
            long totalRecordsNotFiltered = baseQuery.Count(); // Count all the available records (before applying filters)
            baseQuery = ApplyGlobalFilter(baseQuery, inputData.GlobalFilter, inputData.Columns!, stringDateFormatMethod, inputData.DateFormat, inputData.DateTimezone, inputData.DateCulture); // Apply the global filter
            baseQuery = ApplyColumnFilters(baseQuery, inputData.Filter, inputData.Columns!, stringDateFormatMethod); // Apply the column filters
            long totalRecords = baseQuery.Count(); // Count all the available records (after applying filters)
            int currentPage = inputData.Page; // Get the current page that the user is viewing
            IQueryable<T> pagedItems = PerformPagination(baseQuery, totalRecords, ref currentPage, inputData.PageSize); // Perform the pagination
            List<dynamic> dataResult = GetDynamicSelect(pagedItems, inputData.Columns!); // Limit the columns that are going to be selected
            return new PrimeNGPostReturn {
                Page = currentPage,
                TotalRecords = totalRecords,
                TotalRecordsNotFiltered = totalRecordsNotFiltered,
                Data = dataResult
            };
        }

        /// <summary>
        /// Retrieves metadata for each property of the provided class <typeparamref name="T"/>
        /// based on the presence of the <see cref="PrimeNGAttributes"/> attribute.
        /// </summary>
        /// <typeparam name="T">The type of the class for which to retrieve column metadata.</typeparam>
        /// <returns>
        /// A list of <see cref="PrimeNGTableReturnColumnMetadata"/> objects representing
        /// the metadata for each property in the class.
        /// </returns>
        /// <exception cref="ArgumentException">
        /// Thrown when the <see cref="PrimeNGAttributes"/> attribute is missing for a property.
        /// The exception message includes the name of the property that is missing attributes.
        /// </exception>
        public static PrimeNGTableColsAndAllowedPagination GetColumnsInfo<T>(string dateFormat = "dd-MMM-yyyy HH:mm:ss zzzz", string dateTimezone = "+00:00", string dateCulture = "en-US") {
            List<PrimeNGTableReturnColumnMetadata> columnsInfo = new List<PrimeNGTableReturnColumnMetadata>(); // Prepare the list to be returned
            PropertyInfo[] properties = typeof(T).GetProperties(); // Get the properties of the provided class
            foreach(var property in properties) { // Loop through each property of the class
                PrimeNGAttribute? primeNGAttributes = property.GetCustomAttribute<PrimeNGAttribute>() ?? throw new ArgumentException("The following column is missing its PrimeNG attributes ", property.Name); // Try to get the PrimeNG attributes for the current property, and if its null throw an error
                if(primeNGAttributes.SendColumnAttributes) { // If we have to send the column
                    string propertyName = char.ToLower(property.Name[0]) + property.Name.Substring(1); // Get the property name with the first letter to lower
                    columnsInfo.Add(new PrimeNGTableReturnColumnMetadata {
                        Field = propertyName,
                        Header = primeNGAttributes.Header,
                        DataType = primeNGAttributes.DataType,
                        DataAlignHorizontal = primeNGAttributes.DataAlignHorizontal,
                        DataAlignHorizontalAllowUserEdit = primeNGAttributes.DataAlignHorizontalAllowUserEdit,
                        DataAlignVertical = primeNGAttributes.DataAlignVertical,
                        DataAlignVerticalAllowUserEdit = primeNGAttributes.DataAlignVerticalAllowUserEdit,
                        CanBeHidden = primeNGAttributes.CanBeHidden,
                        StartHidden = primeNGAttributes.StartHidden,
                        CanBeResized = primeNGAttributes.CanBeResized,
                        CanBeReordered = primeNGAttributes.CanBeReordered,
                        CanBeSorted = primeNGAttributes.CanBeSorted,
                        CanBeFiltered = primeNGAttributes.CanBeFiltered,
                        FilterPredifinedValuesName = primeNGAttributes.FilterPredifinedValuesName,
                        CanBeGlobalFiltered = primeNGAttributes.CanBeGlobalFiltered,
                        ColumnDescription = primeNGAttributes.ColumnDescription,
                        DataTooltipShow = primeNGAttributes.DataTooltipShow,
                        DataTooltipCustomColumnSource = primeNGAttributes.DataTooltipCustomColumnSource,
                        FrozenColumnAlign = primeNGAttributes.FrozenColumnAlign,
                        CellOverflowBehaviour = primeNGAttributes.CellOverflowBehaviour,
                        CellOverflowBehaviourAllowUserEdit = primeNGAttributes.CellOverflowBehaviourAllowUserEdit,
                        InitialWidth = primeNGAttributes.InitialWidth
                    });
                }
            }
            return new PrimeNGTableColsAndAllowedPagination {
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
        public static bool ValidateItemsPerPageSizeAndCols(byte itemsPerPage, List<string>? columns) {
            if(!allowedItemsPerPage.Contains(itemsPerPage)) { // If the items per page is not within the allowed items per page array values
                return false;
            }
            if(columns == null || columns.Count == 0) { // If no columns have been returned for filtering
                return false;
            }
            return true;
        }

        /// <summary>
        /// Performs pagination on a list of items.
        /// </summary>
        /// <typeparam name="T">The type of items in the list.</typeparam>
        /// <param name="itemList">The list of items to paginate.</param>
        /// <param name="page">The current page number (updated after pagination).</param>
        /// <param name="itemsPerPage">The number of items to display per page.</param>
        /// <returns>An IQueryable representing the paginated items.</returns>
        private static IQueryable<T> PerformPagination<T>(IQueryable<T> itemList, long totalRecords, ref int page, byte itemsPerPage) {
            int totalPages = (int)Math.Ceiling((double)totalRecords / itemsPerPage); // Determine the number of total pages of the dataset
            page = Math.Max(0, Math.Min(page, totalPages)); // Ensure page is within valid range
            int startIndex = page * itemsPerPage; // Determine the start index
            IQueryable<T> pagedItems = itemList.Skip(startIndex).Take(itemsPerPage).AsQueryable(); // Perform pagination using Skip and Take
            return pagedItems; // Return the new IQueryable of the paginated items
        }

        /// <summary>
        /// Selects a dynamic set of properties from a query result.
        /// </summary>
        /// <typeparam name="T">The type of items in the original query.</typeparam>
        /// <param name="query">The original query containing items of type T.</param>
        /// <param name="columns">The list of column names to be included in the selection.</param>
        /// <returns>A list of dynamic objects representing the dynamic selection of properties.</returns>
        private static List<dynamic> GetDynamicSelect<T>(IQueryable<T> query, List<string> columns) {
            PropertyInfo[] properties = typeof(T).GetProperties(); // Get properties of the class T
            List<string> additionalColumns = properties
                .Where(p => p.GetCustomAttribute<PrimeNGAttribute>()?.SendColumnAttributes == false)
                .Select(p => p.Name)
                .ToList();
            IEnumerable<PropertyInfo> selectedProperties = properties.Where(p => columns.Contains(p.Name) || (additionalColumns != null && additionalColumns.Contains(p.Name))); // Filter only the properties that are in the list of columns
            string select = string.Join(", ", selectedProperties.Select(p => p.Name)); // Build the SELECT part of the dynamic query
            return query.Select($"new ({select})").ToDynamicList(); // Build and execute the dynamic query, return the result
        }

        /// <summary>
        /// Applies sorting to a query based on a list of PrimeNGTableSortModel.
        /// </summary>
        /// <typeparam name="T">The type of items in the query.</typeparam>
        /// <param name="query">The original query containing items of type T.</param>
        /// <param name="sortModels">The list of PrimeNGTableSortModel specifying sorting details.</param>
        /// <param name="defaultSortColumnName">The default column name for sorting when no explicit sorting is provided.</param>
        /// <param name="defaultSortColumnOrder">The default sorting order (1 for ascending, -1 for descending) when no explicit sorting is provided.</param>
        /// <returns>An IQueryable representing the query after applying sorting.</returns>
        private static IQueryable<T> ApplySorting<T>(IQueryable<T> query, List<PrimeNGTableSortModel>? sortModels, string? defaultSortColumnName = null, int defaultSortColumnOrder = 1) {
            if(sortModels != null && sortModels.Count != 0) { // Check if explicit sorting details are provided
                string orderByExpression = string.Join(",", sortModels.Select(s => $"{s.Field} {(s.Order == 1 ? "ascending" : "descending")}")); // Apply sorting using dynamic LINQ library
                query = query.OrderBy(orderByExpression);
            }
            else if(!string.IsNullOrWhiteSpace(defaultSortColumnName)) { // If no explicit sorting is provided, check if default sorting is specified
                query = defaultSortColumnOrder == 1
                    ? query.OrderBy(u => EF.Property<object>(u!, defaultSortColumnName))
                    : query.OrderByDescending(u => EF.Property<object>(u!, defaultSortColumnName)); // Use OrderBy or OrderByDescending for default sorting based on the specified column and order
            }
            return query; // Return the modified query with applied sorting
        }

        /// <summary>
        /// Applies a global filter to a list based on the specified filter text and visible columns.
        /// </summary>
        /// <typeparam name="T">The type of items in the list.</typeparam>
        /// <param name="sourceList">The original list containing items of type T.</param>
        /// <param name="globalFilter">The text used for global filtering.</param>
        /// <param name="visibleColumns">The list of column names that are currently visible.</param>
        /// <returns>A filtered list based on the global filter and visible columns.</returns>
        private static IQueryable<T> ApplyGlobalFilter<T>(IQueryable<T> query, string? globalFilter, List<string> visibleColumns, MethodInfo stringDateFormatMethod, string dateFormat, string dateTimezone, string dateCulture) {
            if(string.IsNullOrEmpty(globalFilter) || string.IsNullOrWhiteSpace(globalFilter)) { // If the global filter is empty or whitespace, return the original list
                return query;
            }
            var predicate = PredicateBuilder.New<T>(); // Create a predicate to combine filter conditions
            foreach(PropertyInfo property in typeof(T).GetProperties().Where(x => visibleColumns.Contains(x.Name))) { // Iterate through properties of type T where the property is visible
                PrimeNGAttribute? attribute = (PrimeNGAttribute?)property.GetCustomAttributes(typeof(PrimeNGAttribute), false).FirstOrDefault(); // Retrieve PrimeNGAttributes attribute
                if(attribute != null && attribute.CanBeGlobalFiltered) {  // Check if the property can be globally filtered
                    var filterPredicate = GetGlobalFilterPredicate<T>(property.Name, globalFilter, attribute.DataType, stringDateFormatMethod, dateFormat, dateTimezone, dateCulture); // Get the filter predicate for the property
                    if(filterPredicate != null) { // If a valid filter predicate is obtained, combine it with the existing predicate using OR
                        predicate = predicate.Or(filterPredicate);
                    }
                }
            }
            return query.Where(predicate); // Apply the combined predicate to filter the list
        }

        /// <summary>
        /// Applies column filters to a list based on the specified column filters and visible columns.
        /// </summary>
        /// <typeparam name="T">The type of items in the list.</typeparam>
        /// <param name="sourceList">The original list containing items of type T. Must not be null.</param>
        /// <param name="columnFilters">The dictionary containing column names and their corresponding filter details. Must not be null.</param>
        /// <param name="visibleColumns">The list of column names that are currently visible. Must not be null.</param>
        /// <returns>A filtered list based on the column filters and visible columns.</returns>
        /// <exception cref="ArgumentNullException">Thrown if sourceList, columnFilters, or visibleColumns is null.</exception>
        private static IQueryable<T> ApplyColumnFilters<T>(IQueryable<T> query, Dictionary<string, List<PrimeNGTableFilterModel>> columnFilters, List<string> visibleColumns, MethodInfo stringDateFormatMethod) {
            foreach(var entry in columnFilters) { // Iterate through the column filters
                string key = entry.Key; // Get the key of the current column filter
                if((!visibleColumns.Contains(key) && key !="RowID") || key == "Selector") {
                    continue; // Skip processing if the column is not visible
                }
                List<PrimeNGTableFilterModel> values = entry.Value; // Get the filter values for the column
                bool andPredicateOperator = values[0].Operator == "and"; // Used to determine if the predicate operator is "AND" or "OR"
                ExpressionStarter<T>? combinedPredicate = PredicateBuilder.New<T>(true); // Create a predicate to combine filter conditions
                foreach(PrimeNGTableFilterModel value in values) { // Iterate through filter values for the column
                    if(value.Value is null || string.IsNullOrWhiteSpace(value.Value?.ToString())) { // Check if the filter value is null or whitespace
                        continue; // Skip to the next iteration if filter value is null or whitespace
                    }
                    PropertyInfo property = typeof(T).GetProperty(key) ?? throw new ArgumentNullException(key, $"The property with name '{key}' does not exist in type '{typeof(T).FullName}'."); // Retrieve the property
                    PrimeNGAttribute? attribute = (PrimeNGAttribute?)property.GetCustomAttributes(typeof(PrimeNGAttribute), false).FirstOrDefault() ?? throw new ArgumentNullException(key, $"The property with name '{key}' does not have the PrimeNGAttributes attribute in type '{typeof(T).FullName}'."); // Retrieve PrimeNGAttributes attribute and if its null throw error
                    if(value.MatchMode == "in") {
                        FilterPredicateInClauseBuilder<T>(value, property, attribute, stringDateFormatMethod, andPredicateOperator, ref combinedPredicate);
                    } else if(value.MatchMode == "notIn") {
                        FilterPredicateNotInClauseBuilder<T>(value, property, attribute, stringDateFormatMethod, andPredicateOperator, ref combinedPredicate);
                    } else {
                        FilterPredicateBuilder(property, attribute, value.Value, value.MatchMode, stringDateFormatMethod, andPredicateOperator, ref combinedPredicate);
                    }
                }
                query = query.Where(combinedPredicate); // Apply the combined predicate to filter the list   
            }
            return query;
        }
        private static void FilterPredicateBuilder<T>(PropertyInfo property, PrimeNGAttribute attribute, dynamic val, string matchMode, MethodInfo stringDateFormatMethod, bool andPredicateOperator, ref ExpressionStarter<T> combinedPredicate) {
            dynamic filterPredicate = GetColumnFilterPredicate<T>(property.Name, val, attribute.DataType, matchMode, stringDateFormatMethod); // Get the filter predicate for the column
            if(filterPredicate != null) { // If a valid filter predicate is obtained, combine it with the existing predicate using AND or OR
                if(combinedPredicate.Body.NodeType == ExpressionType.Constant) { // If the combined predicate is initially a constant expression, replace it with the filter predicate
                    combinedPredicate = filterPredicate;
                } else { // If the combined predicate already contains conditions, combine it with the new filter predicate using AND or OR
                    combinedPredicate = andPredicateOperator ? combinedPredicate.And(filterPredicate) : combinedPredicate.Or(filterPredicate);
                }
            }
        }
        private static void FilterPredicateInClauseBuilder<T>(PrimeNGTableFilterModel value, PropertyInfo property, PrimeNGAttribute attribute, MethodInfo stringDateFormatMethod, bool andPredicateOperator, ref ExpressionStarter<T> combinedPredicate) {
            if(value.Value is JsonElement jsonElement && jsonElement.ValueKind == JsonValueKind.Array) {
                List<object> items = JsonSerializer.Deserialize<List<object>>(jsonElement.GetRawText())!;
                foreach(object item in items) {
                    FilterPredicateBuilder(property, attribute, item, MatchModeEquals, stringDateFormatMethod, andPredicateOperator, ref combinedPredicate);
                }
            } else { // Workaround for .NET 5
                List<object> items = JsonSerializer.Deserialize<List<object>>(value.Value!.ToString()!);
                foreach(object item in items) {
                    FilterPredicateBuilder(property, attribute, item, MatchModeEquals, stringDateFormatMethod, andPredicateOperator, ref combinedPredicate);
                }
            }
        }
        private static void FilterPredicateNotInClauseBuilder<T>(PrimeNGTableFilterModel value, PropertyInfo property, PrimeNGAttribute attribute, MethodInfo stringDateFormatMethod, bool andPredicateOperator, ref ExpressionStarter<T> combinedPredicate) {
            if(value.Value is JsonElement jsonElement && jsonElement.ValueKind == JsonValueKind.Array) {
                List<object> items = JsonSerializer.Deserialize<List<object>>(jsonElement.GetRawText())!;
                foreach(object item in items) {
                    FilterPredicateBuilder(property, attribute, item, "notEquals", stringDateFormatMethod, andPredicateOperator, ref combinedPredicate);
                }
            } else { // Workaround for .NET 5
                List<object> items = JsonSerializer.Deserialize<List<object>>(value.Value!.ToString()!);
                foreach(object item in items) {
                    FilterPredicateBuilder(property, attribute, item, "notEquals", stringDateFormatMethod, andPredicateOperator, ref combinedPredicate);
                }
            }
        }
        /// <summary>
        /// Gets a global filter predicate for the specified property name, filter value, and filter data type.
        /// </summary>
        /// <typeparam name="T">The type of entity.</typeparam>
        /// <param name="propertyName">The name of the property to filter on.</param>
        /// <param name="filterValue">The value to filter with.</param>
        /// <param name="filterDataType">The data type of the filter (text, numeric, date, boolean).</param>
        /// <returns>
        /// An expression representing the filter predicate for the specified property and filter value.
        /// Returns null if the data type is not supported.
        /// </returns>
        /// <exception cref="ArgumentException">Thrown when the filterDataType is not supported.</exception>
        private static Expression<Func<T, bool>>? GetGlobalFilterPredicate<T>(string propertyName, string filterValue, EnumDataType filterDataType, MethodInfo stringDateFormatMethod, string dateFormat, string dateTimezone, string dateCulture) {
            Expression<Func<T, bool>>? predicate = null; // Initialize the predicate as null
            ParameterExpression parameter = Expression.Parameter(typeof(T), "x"); // Create an expression parameter to represent the generic entity T
            MemberExpression property = Expression.Property(parameter, propertyName); // Get the specific property of the entity using the provided property name
            if(filterDataType == EnumDataType.Text || filterDataType == EnumDataType.Numeric || filterDataType == EnumDataType.Date) { // Check the filter data type, if it's text, numeric, or date, call method to create a filter predicate
                predicate = CreateTextFilterPredicate<T>(property, filterValue, stringDateFormatMethod, "contains", dateFormat, dateTimezone, dateCulture);
            } else if (filterDataType != EnumDataType.Boolean) { // If the filter data type is not text, numeric, date or boolean, throw an exception
                throw new ArgumentException("Invalid filterDataType value", nameof(filterDataType));
            }
            return predicate; // Return the predicate (may be null if the data type is not supported)
        }

        /// <summary>
        /// Generates a predicate for filtering entities of type T based on the specified criteria.
        /// </summary>
        /// <typeparam name="T">The type of entities to filter.</typeparam>
        /// <param name="propertyName">The name of the property to filter on.</param>
        /// <param name="filterValue">The value to filter by.</param>
        /// <param name="filterDataType">The data type of the property being filtered.</param>
        /// <param name="matchMode">The matching mode for the filter.</param>
        /// <returns>An Expression<Func<T, bool>> predicate for filtering entities.</returns>
        /// <exception cref="ArgumentException">Thrown when the filterDataType is not supported.</exception>
        private static Expression<Func<T, bool>>? GetColumnFilterPredicate<T>(string propertyName, dynamic filterValue, EnumDataType filterDataType, string matchMode, MethodInfo stringDateFormatMethod) {
            Expression<Func<T, bool>>? predicate; // Initialize the predicate as null
            ParameterExpression parameter = Expression.Parameter(typeof(T), "x");  // Create an expression parameter to represent the generic entity T
            MemberExpression property = Expression.Property(parameter, propertyName);  // Get the specific property of the entity using the provided property name
            predicate = filterDataType switch {
                EnumDataType.Text => CreateTextFilterPredicate<T>(property, filterValue.ToString(), stringDateFormatMethod, matchMode),
                EnumDataType.Date => CreateDateFilterPredicate<T>(property, parameter, filterValue, matchMode),
                EnumDataType.Numeric => CreateNumericFilterPredicate<T>(property, parameter, filterValue, matchMode),
                EnumDataType.Boolean => CreateBoolFilterPredicate<T>(property, parameter, filterValue),
                _ => throw new ArgumentException("Invalid filterDataType value", nameof(filterDataType)),
            };
            return predicate;
        }

        /// <summary>
        /// Creates a text filter predicate for the specified property taking into account the passed filter value and match mode.
        /// </summary>
        /// <typeparam name="T">The type of entity.</typeparam>
        /// <param name="property">The property to filter on.</param>
        /// <param name="filterValue">The value to filter with.</param>
        /// <param name="matchMode">The mode of string matching. Valid values are: "startsWith", "contains", "notContains", "endsWith", "equals" or "notEquals". Optional. Default value is "contains".</param>
        /// <returns>An expression representing the text filter predicate for the specified property, filter value and match mode.</returns>
        /// <remarks>
        /// The method creates a predicate based on the provided filter value and match mode.
        /// It handles string matching, and optional null checks for specific data types. Search is case-insensitive
        /// </remarks>
        /// <exception cref="ArgumentException">Thrown when an unsupported match mode is specified.</exception>
        /// <exception cref="ArgumentNullException">Thrown when the property is null.</exception>
        private static Expression<Func<T, bool>> CreateTextFilterPredicate<T>(MemberExpression property, string filterValue, MethodInfo stringDateFormatMethod, string matchMode = "contains", string dateFormat = "", string dateTimezone = "", string dateCulture = "") {
            #region PREPARE THE toStringMethod
                Expression toStringMethod; // Prepare the method to convert the property to a string if necessary
                bool isStringProperty = property.Type == typeof(string) || Nullable.GetUnderlyingType(property.Type) == typeof(string); // Check if the property type is a string or nullable string
                bool isDateTimeProperty = property.Type == typeof(DateTime) || Nullable.GetUnderlyingType(property.Type) == typeof(DateTime); // Check if the property type is DateTime or nullable DateTime
                if(isStringProperty) { // If the property is a string (or nullable string)
                    toStringMethod = property; // Get the property as is, its already a string
                } else if(isDateTimeProperty) { // If the property is DateTime (or nullable DateTime)
                    Expression propertyAccess = property;
                    if(property.Type == typeof(DateTime?)) {
                        propertyAccess = Expression.Property(property, "Value");
                    }
                    toStringMethod = Expression.Call(
                        stringDateFormatMethod,
                        propertyAccess,
                        Expression.Constant(dateFormat), // Format
                        Expression.Constant(dateTimezone), // Timezone
                        Expression.Constant(dateCulture) // Culture
                    );
                } else { // The property is not a string
                    toStringMethod = Expression.Call(property, "ToString", null); // We need to cast ToString
                }
            #endregion
            MethodCallExpression toUpperMethod = Expression.Call(toStringMethod, "ToUpper", null); // Convert property string to uppercase (for case insensitive search)
            filterValue = filterValue.ToUpper(); // Convert filter value to uppercase (for case insensitive search)
            dynamic matchModeCheck = matchMode switch { // Create the predicate based on the match mode
                "startsWith" => Expression.Call(toUpperMethod, "StartsWith", null, Expression.Constant(filterValue)),
                "contains" => Expression.Call(toUpperMethod, "Contains", null, Expression.Constant(filterValue)),
                "notContains" => Expression.Not(Expression.Call(toUpperMethod, "Contains", null, Expression.Constant(filterValue))),
                "endsWith" => Expression.Call(toUpperMethod, "EndsWith", null, Expression.Constant(filterValue)),
                MatchModeEquals => Expression.Equal(toUpperMethod, Expression.Constant(filterValue)),
                "notEquals" => Expression.NotEqual(toUpperMethod, Expression.Constant(filterValue)),
                _ => throw new ArgumentException("Invalid filtering option value for text predicate", nameof(matchMode)),
            };
            #region PREPARE THE predicateBody
            dynamic predicateBody; // Prepare the predicate body
            if(isStringProperty) { // If filterDataType is text
                BinaryExpression nullCheck = Expression.NotEqual(property, Expression.Constant(null)); // Prepare binary expression to check for null values
                predicateBody = Expression.AndAlso(nullCheck, matchModeCheck); // Combine null check and string matching conditions using AndAlso
            } else {// If filterDataType is not text
                predicateBody = matchModeCheck; // Just use the matching conditions
            }
            #endregion
            return Expression.Lambda<Func<T, bool>>(predicateBody, property.Expression as ParameterExpression); // Create and return the lambda expression
        }

        /// <summary>
        /// Creates a date filter predicate for the specified property taking into account the passed filter value and match mode.
        /// </summary>
        /// <typeparam name="T">The type of entity.</typeparam>
        /// <param name="property">The property to filter on.</param>
        /// <param name="parameter">The parameter expression to use in the predicate.</param>
        /// <param name="filterValue">The value to filter with.</param>
        /// <param name="matchMode">The mode of date matching. Valid values are: "dateIs", "dateIsNot", "dateBefore", "dateAfter". Optional. Default value is "dateIs".</param>
        /// <returns>An expression representing the date filter predicate for the specified property, filter value and match mode.</returns>
        /// <remarks>
        /// The method creates a predicate based on the provided filter value and match mode.
        /// It handles date matching, and optional null checks for dates.
        /// </remarks>
        /// <exception cref="ArgumentException">Thrown when an unsupported match mode is specified.</exception>
        /// <exception cref="ArgumentNullException">Thrown when the property is null.</exception>
        private static Expression<Func<T, bool>>? CreateDateFilterPredicate<T>(MemberExpression property, ParameterExpression parameter, dynamic filterValue, string matchMode = "dateIs") {
            Expression<Func<T, bool>>? predicate; // Initialize the predicate as null since it will be set later
            MemberExpression dateProperty = null!; // Initialize the dateProperty as null since it will be set later
            if(!DateTime.TryParse(filterValue.ToString(), out DateTime filterDateTime)) { // Try parsing the filter value as a DateTime
                return null; // Early return if provided filter value is not a date
            }
            if(property.Type != typeof(DateTime)) { // Check if the property is of type DateTime, if not, extract the Date part
                MemberExpression valueExpression = Expression.Property(property, "Value"); // Create an expression representing the "Value" property of the original property
                dateProperty = Expression.Property(valueExpression, nameof(DateTime.Date)); // Create an expression representing the "Date" property of the "Value" property
            }
            predicate = matchMode switch { // Create the predicate based on the match mode
                "dateIs" => Expression.Lambda<Func<T, bool>>(
                    (property.Type == typeof(DateTime)) ? Expression.Equal(Expression.Property(property, nameof(DateTime.Date)), Expression.Constant(filterDateTime))
                    : Expression.AndAlso(Expression.NotEqual(property, Expression.Constant(null)), Expression.Equal(dateProperty, Expression.Constant(filterDateTime.Date))),
                    parameter),
                "dateIsNot" => Expression.Lambda<Func<T, bool>>(
                    (property.Type == typeof(DateTime)) ? Expression.NotEqual(Expression.Property(property, nameof(DateTime.Date)), Expression.Constant(filterDateTime))
                    : Expression.Condition(Expression.NotEqual(property, Expression.Constant(null)), Expression.NotEqual(dateProperty, Expression.Constant(filterDateTime.Date)), Expression.Constant(true))
                    , parameter),
                "dateBefore" => Expression.Lambda<Func<T, bool>>(
                    (property.Type == typeof(DateTime)) ? Expression.LessThan(Expression.Property(property, nameof(DateTime.Date)), Expression.Constant(filterDateTime))
                    : Expression.AndAlso(Expression.NotEqual(property, Expression.Constant(null)), Expression.LessThan(dateProperty, Expression.Constant(filterDateTime.Date))),
                    parameter),
                "dateAfter" => Expression.Lambda<Func<T, bool>>(
                    (property.Type == typeof(DateTime)) ? Expression.GreaterThan(Expression.Property(property, nameof(DateTime.Date)), Expression.Constant(filterDateTime))
                    : Expression.AndAlso(Expression.NotEqual(property, Expression.Constant(null)), Expression.GreaterThan(dateProperty, Expression.Constant(filterDateTime.Date))),
                    parameter),
                _ => throw new ArgumentException("Invalid filtering option value for date predicate", nameof(matchMode)),
            };
            return predicate;
        }

        /// <summary>
        /// Creates a numeric filter predicate for the specified property taking into account the passed filter value and match mode.
        /// </summary>
        /// <typeparam name="T">The type of entity.</typeparam>
        /// <param name="property">The property to filter on.</param>
        /// <param name="parameter">The parameter expression to use in the predicate.</param>
        /// <param name="filterValue">The value to filter with.</param>
        /// <param name="matchMode">The mode of numeric matching. Valid values are: "equals", "notEquals", "lt", "lte", "gt", "gte". Optional. Default value is "equals".</param>
        /// <returns>An expression representing the numeric filter predicate for the specified property, filter value, and match mode.</returns>
        /// <remarks>
        /// The method creates a predicate based on the provided filter value and match mode.
        /// It handles numeric matching and optional null checks for nullable numeric types.
        /// </remarks>
        /// <exception cref="ArgumentException">Thrown when an unsupported match mode is specified.</exception>
        /// <exception cref="ArgumentNullException">Thrown when the property is null.</exception>
        private static Expression<Func<T, bool>> CreateNumericFilterPredicate<T>(MemberExpression property, ParameterExpression parameter, dynamic filterValue, string matchMode = MatchModeEquals) {
            Expression<Func<T, bool>> predicate; // Initialize the predicate as null since it will be set later
            MemberExpression valueExpression; // Declare a member expression for the property value
            dynamic constantValue = null!; // Initialize the constant value as null since it will be set later
            MemberExpression conditionExpression; // Declare a member expression for the condition (for nullable types)
            dynamic convertedValue; // Declare a dynamic variable for the converted filter value
            bool isNullableNumber = IsNullableNumber(property); // Check if the property type is nullable
            if(isNullableNumber) { // If the property type is nullable
                convertedValue = Convert.ChangeType(filterValue.ToString(), Nullable.GetUnderlyingType(property.Type)); // Convert the filter value to the underlying type of the nullable property
                valueExpression = Expression.Property(property, "Value"); // Create an expression representing the "Value" property of the original property
                constantValue = Expression.Constant(Convert.ChangeType(convertedValue, Nullable.GetUnderlyingType(property.Type))); // Create a constant expression for the converted filter value
                conditionExpression = Expression.Property(property, "HasValue"); // Create an expression representing the "HasValue" property of the nullable property
            } else { // If the property type is not nullable
                convertedValue = Convert.ChangeType(filterValue.ToString(), property.Type); // Convert the filter value to the property type
                valueExpression = property; // Use the property directly as the value expression
                conditionExpression = null!; // Set the condition expression to null since it's not needed for non-nullable types
            }
            predicate = matchMode switch { // Create the predicate based on the match mode
                MatchModeEquals => Expression.Lambda<Func<T, bool>>(isNullableNumber ? Expression.AndAlso(conditionExpression, Expression.Equal(valueExpression, constantValue))
                                        : Expression.Equal(property, Expression.Constant(convertedValue)), parameter),
                "notEquals" => Expression.Lambda<Func<T, bool>>(isNullableNumber ? Expression.OrElse(Expression.AndAlso(conditionExpression, Expression.NotEqual(valueExpression, constantValue)),
                                        Expression.Equal(property, Expression.Constant(null, property.Type)))
                                        : Expression.NotEqual(property, Expression.Constant(convertedValue)), parameter),
                "lt" => Expression.Lambda<Func<T, bool>>(
                                        isNullableNumber ? Expression.AndAlso(conditionExpression, Expression.LessThan(valueExpression, constantValue))
                                        : Expression.LessThan(property, Expression.Constant(convertedValue)), parameter),
                "lte" => Expression.Lambda<Func<T, bool>>(
                                        isNullableNumber ? Expression.Condition(conditionExpression, Expression.LessThanOrEqual(valueExpression, constantValue), Expression.Constant(false))
                                        : Expression.LessThanOrEqual(property, Expression.Constant(convertedValue)), parameter),
                "gt" => Expression.Lambda<Func<T, bool>>(
                                        isNullableNumber ? Expression.AndAlso(conditionExpression, Expression.GreaterThan(valueExpression, constantValue))
                                        : Expression.GreaterThan(property, Expression.Constant(convertedValue)), parameter),
                "gte" => Expression.Lambda<Func<T, bool>>(
                                        isNullableNumber ? Expression.Condition(conditionExpression, Expression.GreaterThanOrEqual(valueExpression, constantValue), Expression.Constant(false))
                                        : Expression.GreaterThanOrEqual(property, Expression.Constant(convertedValue)), parameter),
                _ => throw new ArgumentException("Invalid filtering option value for numeric predicate", nameof(matchMode)),
            };
            return predicate;
        }
        private static bool IsNullableNumber(MemberExpression property) {
            return property.Type.IsGenericType && property.Type.GetGenericTypeDefinition() == typeof(Nullable<>);
        }
        /// <summary>
        /// Creates a boolean filter predicate for the specified property taking into account the passed filter value.
        /// </summary>
        /// <typeparam name="T">The type of entity.</typeparam>
        /// <param name="property">The property to filter on.</param>
        /// <param name="parameter">The parameter expression to use in the predicate.</param>
        /// <param name="filterValue">The value to filter with.</param>
        /// <returns>An expression representing the boolean filter predicate for the specified property and filter value.</returns>
        /// <remarks>
        /// The method creates a predicate based on the provided filter value and the type of the property.
        /// It handles boolean matching for both nullable and non-nullable boolean properties.
        /// </remarks>
        private static Expression<Func<T, bool>>? CreateBoolFilterPredicate<T>(MemberExpression property, ParameterExpression parameter, dynamic filterValue) {
            Expression<Func<T, bool>>? predicate = null; // Initialize the predicate as null since it will be set later
            Type propertyType = property.Type; // Get the type of the property
            if(!bool.TryParse(filterValue.ToString(), out bool filterBool)) { // Try parsing the filter value as a boolean
                return null; // Early return if provided filter value is not a boolean
            }
            if(propertyType == typeof(bool?)) { // If the property type is nullable boolean
                predicate = Expression.Lambda<Func<T, bool>>(
                    Expression.Equal(property, Expression.Constant((bool?)filterBool, typeof(bool?))),
                    parameter); // Create the predicate for nullable boolean property
            } else if(propertyType == typeof(bool)) { // If the property type is non-nullable boolean
                predicate = Expression.Lambda<Func<T, bool>>(
                    Expression.Equal(property, Expression.Constant(filterBool, typeof(bool))),
                    parameter); // Create the predicate for non-nullable boolean property
            }
            return predicate;
        }
    }
}