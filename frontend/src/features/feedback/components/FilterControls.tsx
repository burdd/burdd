import Select from '../../../components/common/Select/Select';
import styles from './FilterControls.module.css';

interface FilterControlsProps {
  filters: { category: string; status: string };
  setFilters: React.Dispatch<React.SetStateAction<{ category: string; status: string }>>;
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  categoryMap: Record<string, string>;
  statusMap: Record<string, string>;
  categoryOptions: string[];
  statusOptions: string[];
  sortOptions: string[];
}

const FilterControls = ({
  filters,
  setFilters,
  sortBy,
  setSortBy,
  categoryMap,
  statusMap,
  categoryOptions,
  statusOptions,
  sortOptions,
}: FilterControlsProps) => {
  return (
    <div className={styles.wrapper}>
      <Select
        label="Sort By"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        {sortOptions.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </Select>
      <Select
        label="Category"
        value={filters.category}
        onChange={(e) => setFilters(f => ({ ...f, category: e.target.value }))}
      >
        {categoryOptions.map((option) => (
          <option key={option} value={option}>
            {categoryMap[option] || option}
          </option>
        ))}
      </Select>
      <Select
        label="Status"
        value={filters.status}
        onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
      >
        {statusOptions.map((option) => (
          <option key={option} value={option}>
            {statusMap[option] || option}
          </option>
        ))}
      </Select>
    </div>
  );
};

export default FilterControls;