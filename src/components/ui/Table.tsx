import React from 'react';

interface TableProps {
  headers: React.ReactNode[];
  children: React.ReactNode;
}

const Table: React.FC<TableProps> = ({ headers, children }) => (
  <table className="min-w-full border border-slate-200 rounded-lg">
    <thead>
      <tr className="bg-slate-100">
        {headers.map((header, idx) => (
          <th key={idx} className="px-4 py-2 text-left">{header}</th>
        ))}
      </tr>
    </thead>
    
      {children}
    
  </table>
);

export default Table;
