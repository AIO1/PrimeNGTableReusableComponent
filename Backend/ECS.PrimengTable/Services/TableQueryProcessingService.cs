using ECS.PrimengTable.Attributes;
using ECS.PrimengTable.Models;
using System.Reflection;
using System.Linq.Dynamic.Core;

namespace ECS.PrimengTable.Services {
    internal class TableQueryProcessingService {
        internal static TablePagedResponseModel PerformDynamicQuery<T>(TableQueryRequestModel inputData, IQueryable<T> baseQuery, MethodInfo stringDateFormatMethod, List<string>? defaultSortColumnName = null, List<int>? defaultSortOrder = null) {
            long totalRecordsNotFiltered = 0; // All available records
            long totalRecords = 0; // Number of records after applying filters
            GetDynamicQueryBase<T>(ref inputData, ref baseQuery, stringDateFormatMethod, ref totalRecordsNotFiltered, ref totalRecords, defaultSortColumnName, defaultSortOrder);
            int currentPage = inputData.Page; // Get the current page that the user is viewing
            IQueryable<T> pagedItems = PerformPagination(baseQuery, totalRecords, ref currentPage, inputData.PageSize); // Perform the pagination
            List<dynamic> dataResult = GetDynamicSelect(pagedItems, inputData.Columns!); // Limit the columns that are going to be selected
            return new TablePagedResponseModel {
                Page = currentPage,
                TotalRecords = totalRecords,
                TotalRecordsNotFiltered = totalRecordsNotFiltered,
                Data = dataResult
            };
        }

        internal static void GetDynamicQueryBase<T>(ref TableQueryRequestModel inputData, ref IQueryable<T> baseQuery, MethodInfo stringDateFormatMethod, ref long totalRecordsNotFiltered, ref long totalRecords, List<string>? defaultSortColumnName = null, List<int>? defaultSortOrder = null, bool performSort = true, bool performFilters = true) {
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
            var updatedFilter = new Dictionary<string, List<ColumnFilterModel>>();
            foreach(var entry in inputData.Filter) {
                string updatedKey = char.ToUpper(entry.Key[0]) + entry.Key.Substring(1);
                updatedFilter[updatedKey] = entry.Value;
            }
            inputData.Filter = updatedFilter;
            if(performSort) {
                baseQuery = ApplySorting(baseQuery, inputData.Sort, defaultSortColumnName, defaultSortOrder); // Apply the sorting
            }
            totalRecordsNotFiltered = baseQuery.Count(); // Count all the available records (before applying filters)
            if(performFilters) {
                baseQuery = QueryFilterService.ApplyGlobalFilter(baseQuery, inputData.GlobalFilter, inputData.Columns!, stringDateFormatMethod, inputData.DateFormat, inputData.DateTimezone, inputData.DateCulture); // Apply the global filter
                baseQuery = QueryFilterService.ApplyColumnFilters(baseQuery, inputData.Filter, inputData.Columns!, stringDateFormatMethod); // Apply the column filters
            }
            totalRecords = baseQuery.Count(); // Count all the available records (after applying filters)
        }

        /// <summary>
        /// Performs pagination on a list of items.
        /// </summary>
        /// <typeparam name="T">The type of items in the list.</typeparam>
        /// <param name="itemList">The list of items to paginate.</param>
        /// <param name="page">The current page number (updated after pagination).</param>
        /// <param name="itemsPerPage">The number of items to display per page.</param>
        /// <returns>An IQueryable representing the paginated items.</returns>
        internal static IQueryable<T> PerformPagination<T>(IQueryable<T> itemList, long totalRecords, ref int page, byte itemsPerPage) {
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
        internal static List<dynamic> GetDynamicSelect<T>(IQueryable<T> query, List<string> columns) {
            PropertyInfo[] properties = typeof(T).GetProperties(); // Get properties of the class T
            List<string> additionalColumns = properties
                .Where(p => p.GetCustomAttribute<ColumnAttributes>()?.SendColumnAttributes == false)
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
        internal static IQueryable<T> ApplySorting<T>(IQueryable<T> query, List<ColumnSortModel>? sortModels, List<string>? defaultSortColumnName = null, List<int>? defaultSortOrder = null) {
            if(sortModels != null && sortModels.Count != 0) { // Check if explicit sorting details are provided
                string orderByExpression = string.Join(",", sortModels.Select(s => $"{s.Field} {(s.Order == 1 ? "ascending" : "descending")}")); // Apply sorting using dynamic LINQ library
                query = query.OrderBy(orderByExpression);
            } else if(defaultSortColumnName != null && defaultSortColumnName.Count > 0) { // If no explicit sorting is provided, check if default sorting is specified
                var orderByExpressions = new List<string>();
                for(int i = 0; i < defaultSortColumnName.Count; i++) {
                    string direction = (defaultSortOrder != null && i < defaultSortOrder.Count && defaultSortOrder[i] == 1) ? "ascending" : "descending";
                    orderByExpressions.Add($"{defaultSortColumnName[i]} {direction}");
                }
                string finalOrderByExpression = string.Join(",", orderByExpressions);
                query = query.OrderBy(finalOrderByExpression);
            }
            return query; // Return the modified query with applied sorting
        }
    }
}