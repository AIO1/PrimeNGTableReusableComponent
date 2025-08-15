using ECS.PrimengTable.Attributes;
using ECS.PrimengTable.Enums;
using ECS.PrimengTable.Models;
using LinqKit;
using System.Linq.Expressions;
using System.Reflection;
using System.Text.Json;

namespace ECS.PrimengTable.Services {
    internal class QueryPredicateService {
        internal static void FilterPredicateBuilder<T>(PropertyInfo property, ColumnAttributes attribute, dynamic val, string matchMode, MethodInfo stringDateFormatMethod, bool andPredicateOperator, ref ExpressionStarter<T> combinedPredicate) {
            dynamic filterPredicate = GetColumnFilterPredicate<T>(property.Name, val, attribute.DataType, matchMode, stringDateFormatMethod); // Get the filter predicate for the column
            if(filterPredicate != null) { // If a valid filter predicate is obtained, combine it with the existing predicate using AND or OR
                if(combinedPredicate.Body.NodeType == ExpressionType.Constant) { // If the combined predicate is initially a constant expression, replace it with the filter predicate
                    combinedPredicate = filterPredicate;
                } else { // If the combined predicate already contains conditions, combine it with the new filter predicate using AND or OR
                    combinedPredicate = andPredicateOperator ? combinedPredicate.And(filterPredicate) : combinedPredicate.Or(filterPredicate);
                }
            }
        }
        internal static void FilterPredicateInClauseBuilder<T>(ColumnFilterModel value, PropertyInfo property, ColumnAttributes attribute, MethodInfo stringDateFormatMethod, bool andPredicateOperator, ref ExpressionStarter<T> combinedPredicate) {
            if(value.Value is JsonElement jsonElement && jsonElement.ValueKind == JsonValueKind.Array) {
                List<object> items = JsonSerializer.Deserialize<List<object>>(jsonElement.GetRawText())!;
                foreach(object item in items) {
                    FilterPredicateBuilder(property, attribute, item, "equals", stringDateFormatMethod, andPredicateOperator, ref combinedPredicate);
                }
            } else { // Workaround for .NET 5
                List<object> items = JsonSerializer.Deserialize<List<object>>(value.Value!.ToString()!);
                foreach(object item in items) {
                    FilterPredicateBuilder(property, attribute, item, "equals", stringDateFormatMethod, andPredicateOperator, ref combinedPredicate);
                }
            }
        }
        internal static void FilterPredicateNotInClauseBuilder<T>(ColumnFilterModel value, PropertyInfo property, ColumnAttributes attribute, MethodInfo stringDateFormatMethod, bool andPredicateOperator, ref ExpressionStarter<T> combinedPredicate) {
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
        internal static Expression<Func<T, bool>>? GetGlobalFilterPredicate<T>(string propertyName, string filterValue, DataType filterDataType, MethodInfo stringDateFormatMethod, string dateFormat, string dateTimezone, string dateCulture) {
            Expression<Func<T, bool>>? predicate = null; // Initialize the predicate as null
            ParameterExpression parameter = Expression.Parameter(typeof(T), "x"); // Create an expression parameter to represent the generic entity T
            MemberExpression property = Expression.Property(parameter, propertyName); // Get the specific property of the entity using the provided property name
            if(filterDataType == DataType.Text || filterDataType == DataType.Numeric || filterDataType == DataType.Date) { // Check the filter data type, if it's text, numeric, or date, call method to create a filter predicate
                predicate = PredicateBuilderService.CreateTextFilterPredicate<T>(property, filterValue, stringDateFormatMethod, "contains", dateFormat, dateTimezone, dateCulture);
            } else if(filterDataType != DataType.Boolean) { // If the filter data type is not text, numeric, date or boolean, throw an exception
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
        private static Expression<Func<T, bool>>? GetColumnFilterPredicate<T>(string propertyName, dynamic filterValue, DataType filterDataType, string matchMode, MethodInfo stringDateFormatMethod) {
            Expression<Func<T, bool>>? predicate; // Initialize the predicate as null
            ParameterExpression parameter = Expression.Parameter(typeof(T), "x");  // Create an expression parameter to represent the generic entity T
            MemberExpression property = Expression.Property(parameter, propertyName);  // Get the specific property of the entity using the provided property name
            predicate = filterDataType switch {
                DataType.Text => PredicateBuilderService.CreateTextFilterPredicate<T>(property, filterValue.ToString(), stringDateFormatMethod, matchMode),
                DataType.Date => PredicateBuilderService.CreateDateFilterPredicate<T>(property, parameter, filterValue, matchMode),
                DataType.Numeric => PredicateBuilderService.CreateNumericFilterPredicate<T>(property, parameter, filterValue, matchMode),
                DataType.Boolean => PredicateBuilderService.CreateBoolFilterPredicate<T>(property, parameter, filterValue),
                _ => throw new ArgumentException("Invalid filterDataType value", nameof(filterDataType)),
            };
            return predicate;
        }
    }
}