/**
 * Reusable Data Table matching DESIGN.md
 */
export default function DataTable({
  columns,
  data,
  onRowClick,
  className = "",
}) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center p-4 text-on-surface-variant">
        No data available.
      </div>
    );
  }

  return (
    <div className={`table-responsive ${className}`}>
      <table
        className="table table-hover mb-0 "
        style={{ borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                className="text-label-md text-on-surface-variant text-uppercase py-3"
                style={{
                  backgroundColor: "#F8FAFC", // tinted header from design
                  borderBottom: "1px solid var(--color-outline-variant)",
                  borderTop: "none",
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={row.id || rowIndex}
              onClick={() => onRowClick && onRowClick(row)}
              style={{ cursor: onRowClick ? "pointer" : "default" }}
            >
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  className="py-3 align-middle text-body-md text-on-surface"
                  style={{
                    borderBottom: "1px solid var(--color-outline-variant)",
                  }}
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
