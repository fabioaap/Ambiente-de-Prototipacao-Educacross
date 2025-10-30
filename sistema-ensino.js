document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }

  const searchInput = document.querySelector('#mission-search');
  const table = document.querySelector('.table-card table');
  const paginationInfo = document.querySelector('.table-card__footer p');

  if (!searchInput || !table || !paginationInfo) {
    return;
  }

  const rows = Array.from(table.querySelectorAll('tbody tr'));
  const totalRows = rows.length;
  const emptyRow = createEmptyRow(table);

  function createEmptyRow(currentTable) {
    const placeholder = document.createElement('tr');
    placeholder.className = 'table__empty';
    const cell = document.createElement('td');
    const headerCount = currentTable.tHead?.rows?.[0]?.cells?.length ?? 1;
    cell.colSpan = headerCount;
    cell.textContent = 'Nenhuma miss\u00e3o encontrada com os filtros atuais.';
    placeholder.appendChild(cell);
    return placeholder;
  }

  function normalise(text) {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function updatePagination(visibleCount) {
    const label =
      visibleCount === totalRows
        ? 'Exibindo 1 a 10 de '
        : `Exibindo ${Math.min(visibleCount, totalRows)} de `;
    paginationInfo.innerHTML = `${label}<strong>${totalRows}</strong> entradas`;
  }

  function applyFilter(query) {
    const value = normalise(query.trim());
    let visible = 0;

    rows.forEach((row) => {
      const matches = !value || normalise(row.textContent || '').includes(value);
      row.style.display = matches ? '' : 'none';
      if (matches) {
        visible += 1;
      }
    });

    if (visible === 0 && !emptyRow.isConnected) {
      table.tBodies[0].appendChild(emptyRow);
    } else if (visible > 0 && emptyRow.isConnected) {
      emptyRow.remove();
    }

    updatePagination(visible);
  }

  searchInput.addEventListener('input', (event) => {
    applyFilter(event.target.value);
  });

  updatePagination(totalRows);

  requestAnimationFrame(() => {
    document.querySelectorAll('.progress[data-value]').forEach((progress) => {
      const value = Number(progress.getAttribute('data-value') || '0');
      const bar = progress.querySelector('span');
      if (bar) {
        bar.style.width = `${Math.min(Math.max(value, 0), 100)}%`;
      }
    });
  });

  document.querySelectorAll('.filter__button').forEach((button) => {
    button.addEventListener('click', () => {
      window.alert(
        'Esta vers\u00e3o \u00e9 est\u00e1tica para demonstra\u00e7\u00e3o; conecte os filtros conforme necess\u00e1rio.'
      );
    });
  });
});
