import React from 'react';

interface DropdownProps {
  label?: string;
  id?: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
    required?: boolean;
    disabled?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({ id,label, value, options, onChange, required, disabled }) => (
  <div>
    {label && id && <label htmlFor={id} className="block text-slate-700 mb-1">{label}</label>}
    <select
      id={id}
      className="w-full border border-slate-300 rounded-lg px-3 py-2"
      value={value}
      onChange={e => onChange(e.target.value)}
            required={required}
            disabled={disabled}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

export default Dropdown;
