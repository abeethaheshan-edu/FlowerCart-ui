import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export default function AppPagination({
  page,
  count,
  total,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [10, 25, 50],
  showRowsPerPage = true,
  sx = {},
}) {
  const from = (page - 1) * rowsPerPage + 1;
  const to = Math.min(page * rowsPerPage, total ?? 0);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2,
        px: 2,
        py: 1.5,
        ...sx,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {total != null ? `Showing ${from}–${to} of ${total}` : ''}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {showRowsPerPage && onRowsPerPageChange && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Rows:
            </Typography>
            <Select
              size="small"
              value={rowsPerPage}
              onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
              sx={{ fontSize: '0.82rem' }}
            >
              {rowsPerPageOptions.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </Box>
        )}
        <Pagination
          page={page}
          count={count}
          onChange={(_, val) => onPageChange(val)}
          color="primary"
          size="small"
          shape="rounded"
        />
      </Box>
    </Box>
  );
}
