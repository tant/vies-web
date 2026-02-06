interface SpecificationsTableProps {
  specifications: Array<{ key: string; value: string; id?: string | null }>
  title: string
  parameterLabel?: string
  valueLabel?: string
}

export function SpecificationsTable({ specifications, title, parameterLabel = 'Parameter', valueLabel = 'Value' }: SpecificationsTableProps) {
  if (!specifications || specifications.length === 0) {
    return null
  }

  return (
    <section className="mt-xl border-t border-border pt-xl">
      <h2 className="text-xl font-semibold mb-md">{title}</h2>
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="sr-only">
            <tr>
              <th scope="col">{parameterLabel}</th>
              <th scope="col">{valueLabel}</th>
            </tr>
          </thead>
          <tbody>
            {specifications.map((spec, index) => (
              <tr
                key={spec.id ?? `spec-${index}`}
                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                <th
                  scope="row"
                  className="px-4 py-3 font-medium text-gray-600 w-1/3 border-r border-border text-left"
                >
                  {spec.key}
                </th>
                <td className="px-4 py-3 text-gray-900">{spec.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
