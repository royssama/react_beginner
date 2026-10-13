import { useState, useEffect, useRef } from "react";
import styled from "styled-components";

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  cursor: pointer;
  user-select: none;

  .header-label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .filter-icon-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    margin-left: 4px;

    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }

    &.filter-active {
      color: #0066cc;
    }
  }

  .filter-icon {
    font-size: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 1;
  }

  .sort-indicator {
    position: absolute;
    font-size: 8px;
    font-weight: bold;
  }

  .sort-indicator.asc {
    top: 2px;
    color: #0066cc;
  }

  .sort-indicator.desc {
    bottom: 2px;
    color: #0066cc;
  }
`;

const CustomHeaderWithFilterSort = (props) => {
  const [sortDirection, setSortDirection] = useState(null);
  const [filterActive, setFilterActive] = useState(false);
  const filterIconRef = useRef(null);

  useEffect(() => {
    const onSortChanged = () => {
      const sort = props.column.getSort();
      setSortDirection(sort || null);
    };

    const onFilterChanged = () => {
      setFilterActive(props.column.isFilterActive());
    };

    onSortChanged();
    onFilterChanged();

    props.column.addEventListener("sortChanged", onSortChanged);
    props.column.addEventListener("filterChanged", onFilterChanged);

    return () => {
      props.column.removeEventListener("sortChanged", onSortChanged);
      props.column.removeEventListener("filterChanged", onFilterChanged);
    };
  }, [props.column]);

  const handleHeaderClick = (e) => {
    if (filterIconRef.current?.contains(e.target)) {
      return;
    }

    let nextSort;
    if (sortDirection === null) {
      nextSort = "asc";
    } else if (sortDirection === "asc") {
      nextSort = "desc";
    } else {
      nextSort = null;
    }

    props.setSort(nextSort, e.shiftKey);
  };

  const handleFilterClick = (e) => {
    e.stopPropagation();
    props.showColumnMenu(filterIconRef.current);
  };

  return (
    <HeaderContainer onClick={handleHeaderClick}>
      <span className="header-label">{props.displayName}</span>
      <div
        ref={filterIconRef}
        className={`filter-icon-wrapper ${filterActive ? "filter-active" : ""}`}
        onClick={handleFilterClick}
        title="필터 메뉴 열기"
      >
        <span className="filter-icon">
          {sortDirection === "asc" && <span className="sort-indicator asc">▲</span>}
          ☰
          {sortDirection === "desc" && <span className="sort-indicator desc">▼</span>}
        </span>
      </div>
    </HeaderContainer>
  );
};

export default CustomHeaderWithFilterSort;
