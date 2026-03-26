import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export function AppTableContainer({ children, sx = {} }) {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3, ...sx }}>
      {children}
    </TableContainer>
  );
}

export function AppTableHead({ columns }) {
  return (
    <TableHead>
      <TableRow>
        {columns.map((col) => (
          <TableCell
            key={col.key}
            align={col.align || 'left'}
            sx={{ whiteSpace: 'nowrap', ...col.sx }}
          >
            {col.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export function AppTableRow({ row, columns, onClick, sx = {} }) {
  return (
    <TableRow
      hover
      onClick={onClick}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        '&:last-child td': { border: 0 },
        ...sx,
      }}
    >
      {columns.map((col) => (
        <TableCell key={col.key} align={col.align || 'left'} sx={col.cellSx}>
          {col.render ? col.render(row[col.key], row) : row[col.key]}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function AppTableSkeleton({ columns, rows = 5 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i}>
          {columns.map((col) => (
            <TableCell key={col.key}>
              <Skeleton variant="text" width="80%" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

export function AppTableEmpty({ message = 'No data found', colSpan }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} align="center" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {message}
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );
}

export default function AppTable({ columns, rows = [], loading = false, emptyMessage, sx = {} }) {
  return (
    <AppTableContainer sx={sx}>
      <Table size="small">
        <AppTableHead columns={columns} />
        <TableBody>
          {loading ? (
            <AppTableSkeleton columns={columns} />
          ) : rows.length === 0 ? (
            <AppTableEmpty message={emptyMessage} colSpan={columns.length} />
          ) : (
            rows.map((row, i) => (
              <AppTableRow key={row.id ?? i} row={row} columns={columns} />
            ))
          )}
        </TableBody>
      </Table>
    </AppTableContainer>
  );
}
