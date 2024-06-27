namespace PrimeNG.Attributes {
    /// <summary>
    /// Custom attributes for PrimeNG tables
    /// </summary>
    [AttributeUsage(AttributeTargets.Property, Inherited = false, AllowMultiple = false)]
    sealed class PrimeNGAttribute : Attribute {
        public string Header { get; }
        public string DataType { get; }
        public string DataAlign { get; }
        public bool CanBeHidden { get; }
        public bool StartHidden { get; }
        public bool CanBeResized { get; }
        public bool CanBeReordered { get; }
        public bool CanBeSorted { get; }
        public bool CanBeFiltered { get; }
        public bool FilterUsesPredifinedValues { get; }
        public string FilterPredifinedValuesName { get; }
        public bool CanBeGlobalFiltered { get; }
        public bool SendColumnAttributes { get; }

        /// <summary>
        /// Initializes a new instance of the <see cref="PrimeNGAttribute"/> class.
        /// </summary>
        /// <param name="header">The name that will be used to display this column in the table.</param>
        /// <param name="dataType">The data type that will be used for the filter ("text" by default).</param>
        /// <param name="dataAlign">The data alignment for the column ("center" by default).</param>
        /// <param name="canBeHidden">If <c>true</c>, the column can be hidden.</param>
        /// <param name="startHidden">If <c>true</c>, the column starts hidden (if it can be hidden).</param>
        /// <param name="canBeResized">If <c>true</c>, the column can be resized.</param>
        /// <param name="canBeReordered">If <c>true</c>, the column can be reordered.</param>
        /// <param name="canBeSorted">If <c>true</c>, the column can be sorted.</param>
        /// <param name="canBeFiltered">If <c>true</c>, the column can be filtered.</param>
        /// <param name="filterUsesPredifinedValues">If <c>true</c>, the row filter will use a list of predifined values to select from.</param>
        /// <param name="filterPredifinedValuesName">The name used on typescript to store the list of allowed values in the dropdown.</param>
        /// <param name="canBeGlobalFiltered">If <c>true</c>, the data can be globally filtered.</param>
        /// <param name="sendColumnAttributes">If <c>true</c>, the column attirbutes will be sent. If <c>false</c> column attributes won't be sent and has to be explicitly declared in PerformDynamicQuery to be sent</param>
        /// <exception cref="ArgumentException">
        /// Thrown if an invalid dataAlign or dataType value is provided.
        /// </exception>
        public PrimeNGAttribute(
            string header = "",
            string dataType = "text",
            string dataAlign = "center",
            bool canBeHidden = true,
            bool startHidden = false,
            bool canBeResized = true,
            bool canBeReordered = true,
            bool canBeSorted = true,
            bool canBeFiltered = true,
            bool filterUsesPredifinedValues = false,
            string filterPredifinedValuesName = "",
            bool canBeGlobalFiltered = true,
            bool sendColumnAttributes = true) {
            if(!IsValidDataAlignType(dataAlign)) {
                throw new ArgumentException("Invalid dataAlign value", nameof(dataAlign));
            }
            if(!IsValidDataType(dataType)) {
                throw new ArgumentException("Invalid dataType value", nameof(dataType));
            }
            Header = header;
            DataType = dataType;
            DataAlign = dataAlign;
            CanBeHidden = canBeHidden;
            StartHidden = startHidden && canBeHidden;
            CanBeResized = canBeResized;
            CanBeReordered = canBeReordered;
            CanBeSorted = canBeSorted;
            CanBeFiltered = canBeFiltered;
            FilterUsesPredifinedValues = filterUsesPredifinedValues;
            FilterPredifinedValuesName = filterPredifinedValuesName;
            CanBeGlobalFiltered = canBeGlobalFiltered && canBeFiltered && dataType != "boolean";
            SendColumnAttributes = sendColumnAttributes;
        }
        private static bool IsValidDataAlignType(string alignType) {
            var allowedValues = new[] { "left", "center", "right" };
            return allowedValues.Contains(alignType);
        }
        private static bool IsValidDataType(string dataType) {
            var allowedValues = new[] { "text", "numeric", "boolean", "date" };
            return allowedValues.Contains(dataType);
        }
    }
}