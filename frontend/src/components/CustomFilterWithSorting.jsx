import { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from "react";
import styled from "styled-components";

const FilterContainer = styled.div`
  padding: 10px;
  min-width: 200px;
  max-width: 300px;
  background: white;
  font-size: 13px;

  .sort-section {
    border-bottom: 1px solid #ddd;
    padding-bottom: 8px;
    margin-bottom: 8px;
  }

  .sort-option {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    cursor: pointer;
    border-radius: 4px;

    &:hover {
      background: #f0f0f0;
    }

    &.active {
      background: #e6f3ff;
      color: #0066cc;
    }
  }

  .sort-icon {
    width: 16px;
    text-align: center;
  }

  .search-section {
    margin-bottom: 8px;
  }

  .search-input {
    width: 100%;
    padding: 6px 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 13px;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: #0066cc;
    }
  }

  .values-section {
    max-height: 200px;
    overflow-y: auto;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .value-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    cursor: pointer;

    &:hover {
      background: #f5f5f5;
    }

    input[type="checkbox"] {
      cursor: pointer;
    }

    label {
      flex: 1;
      cursor: pointer;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .select-all {
    border-bottom: 1px solid #ddd;
    background: #fafafa;
  }
`;

const CustomFilterWithSorting = forwardRef((props, ref) => {
  const [selectedValues, setSelectedValues] = useState(new Set());
  const [sortDirection, setSortDirection] = useState(null);
  const [uniqueValues, setUniqueValues] = useState([]);
  const [searchText, setSearchText] = useState("");

  useImperativeHandle(ref, () => ({
    doesFilterPass(params) {
      if (selectedValues.size === 0) return true;
      const value = params.data?.[props.colDef.field];
      return selectedValues.has(value);
    },
    isFilterActive() {
      return selectedValues.size > 0 && selectedValues.size < uniqueValues.length;
    },
    getModel() {
      if (selectedValues.size === 0 || selectedValues.size === uniqueValues.length) {
        return null;
      }
      return { values: [...selectedValues] };
    },
    setModel(model) {
      if (model?.values) {
        setSelectedValues(new Set(model.values));
      } else {
        setSelectedValues(new Set());
      }
    },
  }));

  useEffect(() => {
    const values = new Set();
    props.api.forEachNode((node) => {
      const val = node.data?.[props.colDef.field];
      if (val != null) {
        values.add(val);
      }
    });
    const sortedValues = [...values].sort((a, b) => {
      if (typeof a === "string") return a.localeCompare(b);
      return a - b;
    });
    setUniqueValues(sortedValues);

    const currentSort = props.column.getSort();
    setSortDirection(currentSort || null);

    const onSortChanged = () => {
      setSortDirection(props.column.getSort() || null);
    };
    props.column.addEventListener("sortChanged", onSortChanged);

    return () => {
      props.column.removeEventListener("sortChanged", onSortChanged);
    };
  }, [props.api, props.colDef.field, props.column]);

  const handleCheckboxChange = useCallback(
    (value, checked) => {
      setSelectedValues((prev) => {
        const newSelected = new Set(prev);
        if (checked) {
          newSelected.add(value);
        } else {
          newSelected.delete(value);
        }
        setTimeout(() => {
          props.filterChangedCallback();
        }, 0);
        return newSelected;
      });
    },
    [props]
  );

  const handleSelectAll = useCallback(
    (checked) => {
      if (checked) {
        const filtered = uniqueValues.filter((v) =>
          String(v).toLowerCase().includes(searchText.toLowerCase())
        );
        setSelectedValues(new Set(filtered));
      } else {
        setSelectedValues(new Set());
      }
      setTimeout(() => {
        props.filterChangedCallback();
      }, 0);
    },
    [uniqueValues, searchText, props]
  );

  const handleSort = useCallback(
    (direction) => {
      props.column.setSort(direction, "uiColumnSorted");
      setSortDirection(direction);
    },
    [props.column]
  );

  const filteredValues = uniqueValues.filter((v) =>
    String(v).toLowerCase().includes(searchText.toLowerCase())
  );

  const isAllSelected =
    filteredValues.length > 0 &&
    filteredValues.every((v) => selectedValues.has(v));

  return (
    <FilterContainer>
      <div className="sort-section">
        {sortDirection !== "asc" && (
          <div className="sort-option" onClick={() => handleSort("asc")}>
            <span className="sort-icon">▲</span>
            <span>Sort ascending order</span>
          </div>
        )}
        {sortDirection !== "desc" && (
          <div className="sort-option" onClick={() => handleSort("desc")}>
            <span className="sort-icon">▼</span>
            <span>Sort descending order</span>
          </div>
        )}
        {sortDirection !== null && (
          <div className="sort-option" onClick={() => handleSort(null)}>
            <span className="sort-icon">✕</span>
            <span>Reset order</span>
          </div>
        )}
      </div>

      <div className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="Search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <div className="values-section">
        <div className="value-item select-all">
          <input
            type="checkbox"
            id={`select-all-${props.colDef.field}`}
            checked={isAllSelected}
            onChange={(e) => handleSelectAll(e.target.checked)}
          />
          <label htmlFor={`select-all-${props.colDef.field}`}>
            (Select All)
          </label>
        </div>
        {filteredValues.map((value, index) => (
          <div className="value-item" key={`${value}-${index}`}>
            <input
              type="checkbox"
              id={`filter-${props.colDef.field}-${index}`}
              checked={selectedValues.has(value)}
              onChange={(e) => handleCheckboxChange(value, e.target.checked)}
            />
            <label htmlFor={`filter-${props.colDef.field}-${index}`}>
              {String(value)}
            </label>
          </div>
        ))}
      </div>
    </FilterContainer>
  );
});

CustomFilterWithSorting.displayName = "CustomFilterWithSorting";

export default CustomFilterWithSorting;
