export function exportCSV(items, columns, filename) {
  if (!items || items.length === 0) return alert('Tidak ada data untuk diekspor');
  
  const headers = columns.map(col => col.label).join(',');
  const rows = items.map(item => 
    columns.map(col => {
      let val = item[col.key] ?? '';
      if (col.type === 'date') val = new Date(val).toLocaleDateString();
      if (typeof val === 'string' && val.includes(',')) val = `"${val}"`;
      return val;
    }).join(',')
  );
  
  const csv = [headers, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
}

export function importCSV(file, columns) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n').filter(line => line.trim());
        if (lines.length < 2) return reject('File kosong');
        
        const headerLine = lines[0];
        const headers = headerLine.split(',').map(h => h.trim());
        
        // Map header ke key columns
        const colMap = columns.map(col => {
          const idx = headers.findIndex(h => h === col.label);
          return { ...col, idx };
        });
        
        const result = [];
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
          const obj = {};
          colMap.forEach(col => {
            if (col.idx !== -1) {
              let val = values[col.idx] || '';
              if (col.type === 'number') val = parseFloat(val) || 0;
              if (col.type === 'date') val = val || new Date().toISOString().split('T')[0];
              obj[col.key] = val;
            }
          });
          if (Object.keys(obj).length) result.push(obj);
        }
        resolve(result);
      } catch (err) {
        reject(err.message);
      }
    };
    reader.readAsText(file);
  });
}