import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function SearchBar({ value, onChange, disabled }: SearchBarProps): JSX.Element {
  return (
    <label className="search-bar" aria-label="Search tasks by title">
      <Search size={16} />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search tasks"
        disabled={disabled}
      />
    </label>
  );
}
