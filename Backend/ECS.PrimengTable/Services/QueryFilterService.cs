using ECS.PrimengTable.Attributes;
using ECS.PrimengTable.Models;
using LinqKit;
using System.Reflection;

namespace ECS.PrimengTable.Services {
    internal class QueryFilterService {
        /// <summary>
        /// Applies a global filter to a list based on the specified filter text and visible columns.
        /// </summary>
        /// <typeparam name="T">The type of items in the list.</typeparam>
        /// <param name="sourceList">The original list containing items of type T.</param>
        /// <param name="globalFilter">The text used for global filtering.</param>
        /// <param name="visibleColumns">The list of column names that are currently visible.</param>
        /// <returns>A filtered list based on the global filter and visible columns.</returns>
        internal static IQueryable<T> ApplyGlobalFilter<T>(IQueryable<T> query, string? globalFilter, List<string> visibleColumns, MethodInfo stringDateFormatMethod, string dateFormat, string dateTimezone, string dateCulture) {
            if(string.IsNullOrEmpty(globalFilter) || string.IsNullOrWhiteSpace(globalFilter)) { // If the global filter is empty or whitespace, return the original list
                return query;
            }
            var predicate = PredicateBuilder.New<T>(); // Create a predicate to combine filter conditions
            foreach(PropertyInfo property in typeof(T).GetProperties().Where(x => visibleColumns.Contains(x.Name))) { // Iterate through properties of type T where the property is visible
                ColumnAttributes? attribute = (ColumnAttributes?)property.GetCustomAttributes(typeof(ColumnAttributes), false).FirstOrDefault(); // Retrieve PrimeNGAttributes attribute
                if(attribute != null && attribute.CanBeGlobalFiltered) {  // Check if the property can be globally filtered
                    var filterPredicate = QueryPredicateService.GetGlobalFilterPredicate<T>(property.Name, globalFilter, attribute.DataType, stringDateFormatMethod, dateFormat, dateTimezone, dateCulture); // Get the filter predicate for the property
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
        internal static IQueryable<T> ApplyColumnFilters<T>(IQueryable<T> query, Dictionary<string, List<ColumnFilterModel>> columnFilters, List<string> visibleColumns, MethodInfo stringDateFormatMethod) {
            foreach(var entry in columnFilters) { // Iterate through the column filters
                string key = entry.Key; // Get the key of the current column filter
                if((!visibleColumns.Contains(key) && key != "RowID") || key == "Selector") {
                    continue; // Skip processing if the column is not visible
                }
                List<ColumnFilterModel> values = entry.Value; // Get the filter values for the column
                bool andPredicateOperator = values[0].Operator == "and"; // Used to determine if the predicate operator is "AND" or "OR"
                ExpressionStarter<T>? combinedPredicate = PredicateBuilder.New<T>(true); // Create a predicate to combine filter conditions
                foreach(ColumnFilterModel value in values) { // Iterate through filter values for the column
                    if(value.Value is null || string.IsNullOrWhiteSpace(value.Value?.ToString())) { // Check if the filter value is null or whitespace
                        continue; // Skip to the next iteration if filter value is null or whitespace
                    }
                    PropertyInfo property = typeof(T).GetProperty(key) ?? throw new ArgumentNullException(key, $"The property with name '{key}' does not exist in type '{typeof(T).FullName}'."); // Retrieve the property
                    ColumnAttributes? attribute = (ColumnAttributes?)property.GetCustomAttributes(typeof(ColumnAttributes), false).FirstOrDefault() ?? throw new ArgumentNullException(key, $"The property with name '{key}' does not have the PrimeNGAttributes attribute in type '{typeof(T).FullName}'."); // Retrieve PrimeNGAttributes attribute and if its null throw error
                    if(value.MatchMode == "in") {
                        QueryPredicateService.FilterPredicateInClauseBuilder<T>(value, property, attribute, stringDateFormatMethod, andPredicateOperator, ref combinedPredicate);
                    } else if(value.MatchMode == "notIn") {
                        QueryPredicateService.FilterPredicateNotInClauseBuilder<T>(value, property, attribute, stringDateFormatMethod, andPredicateOperator, ref combinedPredicate);
                    } else {
                        QueryPredicateService.FilterPredicateBuilder(property, attribute, value.Value, value.MatchMode, stringDateFormatMethod, andPredicateOperator, ref combinedPredicate);
                    }
                }
                query = query.Where(combinedPredicate); // Apply the combined predicate to filter the list   
            }
            return query;
        }
    }
}