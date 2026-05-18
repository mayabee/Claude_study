function FilterBar({ filters, categories, onChange }) {
  const update = (key, value) => {
    onChange(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="filter-bar">
      <select value={filters.status} onChange={(e) => update('status', e.target.value)}>
        <option value="all">전체 상태</option>
        <option value="not_started">⬜ 시작안함</option>
        <option value="in_progress">🔄 진행중</option>
        <option value="completed">✅ 완료</option>
      </select>

      <select value={filters.priority} onChange={(e) => update('priority', e.target.value)}>
        <option value="all">전체 우선순위</option>
        <option value="high">🔴 높음</option>
        <option value="medium">🟡 중간</option>
        <option value="low">🟢 낮음</option>
      </select>

      <select value={filters.category} onChange={(e) => update('category', e.target.value)}>
        <option value="all">전체 카테고리</option>
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <label className="archive-toggle">
        <input
          type="checkbox"
          checked={filters.showArchived}
          onChange={(e) => update('showArchived', e.target.checked)}
        />
        완료 항목 보기
      </label>
    </div>
  )
}

export default FilterBar
