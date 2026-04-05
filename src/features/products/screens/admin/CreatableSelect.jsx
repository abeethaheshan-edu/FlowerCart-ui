import { useState, useRef, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckIcon from '@mui/icons-material/Check';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function CreatableSelect({
  label,
  options = [],
  value,
  onChange,
  onCreate,
  error,
  helperText,
  size = 'small',
  creating = false,
}) {
  const [open, setOpen]         = useState(false);
  const [query, setQuery]       = useState('');
  const inputRef                = useRef(null);
  const containerRef            = useRef(null);
  const pendingCreateRef        = useRef('');

  const selectedLabel = options.find(
    (o) => String(o.value) === String(value)
  )?.label ?? '';

  const filtered = query.trim()
    ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : options;

  const trimmedQuery  = query.trim();
  const exactMatch    = options.some(
    (o) => o.label.toLowerCase() === trimmedQuery.toLowerCase()
  );
  const showCreate    = trimmedQuery.length > 0 && !exactMatch;

  const openDropdown = () => {
    setQuery('');
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 30);
  };

  const closeDropdown = useCallback(() => {
    setOpen(false);
    setQuery('');
  }, []);

  useEffect(() => {
    const onMouseDown = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        closeDropdown();
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [closeDropdown]);

  const handleSelect = (option) => {
    onChange(String(option.value));
    closeDropdown();
  };

  const handleCreate = () => {
    if (!trimmedQuery || creating) return;
    pendingCreateRef.current = trimmedQuery;
    setOpen(false);
    setQuery('');
    onCreate(pendingCreateRef.current);
  };

  const displayValue = open ? query : selectedLabel;

  return (
    <Box ref={containerRef} sx={{ position: 'relative' }}>
      <TextField
        inputRef={inputRef}
        label={label}
        size={size}
        fullWidth
        value={displayValue}
        error={error}
        helperText={helperText}
        onClick={open ? undefined : openDropdown}
        onChange={(e) => {
          setQuery(e.target.value);
          if (!open) setOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') closeDropdown();
          if (e.key === 'Enter' && showCreate) { e.preventDefault(); handleCreate(); }
          if (e.key === 'Enter' && filtered.length === 1 && !showCreate) {
            e.preventDefault();
            handleSelect(filtered[0]);
          }
        }}
        slotProps={{
          input: {
            endAdornment: creating ? (
              <CircularProgress size={14} sx={{ color: 'primary.main', mr: 0.5 }} />
            ) : (
              <KeyboardArrowDownIcon
                sx={{
                  fontSize: 20, color: 'text.secondary', cursor: 'pointer',
                  transform: open ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s',
                  flexShrink: 0,
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  open ? closeDropdown() : openDropdown();
                }}
              />
            ),
          },
        }}
        sx={{ '& .MuiOutlinedInput-root': { cursor: 'pointer' } }}
      />

      {open && (
        <Paper
          elevation={6}
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1500,
            mt: 0.5,
            borderRadius: 2,
            maxHeight: 230,
            overflowY: 'auto',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          {filtered.length === 0 && !showCreate && (
            <Box sx={{ px: 2, py: 2 }}>
              <Typography variant="body2" color="text.secondary">
                No options found. Type to create a new one.
              </Typography>
            </Box>
          )}

          {filtered.map((option) => {
            const isSelected = String(option.value) === String(value);
            return (
              <Box
                key={option.value}
                onMouseDown={(e) => { e.preventDefault(); handleSelect(option); }}
                sx={{
                  px: 2, py: 1.2, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  bgcolor: isSelected ? '#fce4ec' : 'background.paper',
                  '&:hover': { bgcolor: isSelected ? '#fce4ec' : 'action.hover' },
                }}
              >
                <Typography variant="body2" fontWeight={isSelected ? 700 : 400}>
                  {option.label}
                </Typography>
                {isSelected && <CheckIcon sx={{ fontSize: 15, color: 'primary.main' }} />}
              </Box>
            );
          })}

          {showCreate && (
            <>
              {filtered.length > 0 && (
                <Box sx={{ borderTop: '1px solid', borderColor: 'divider' }} />
              )}
              <Box
                onMouseDown={(e) => { e.preventDefault(); handleCreate(); }}
                sx={{
                  px: 2, py: 1.3, cursor: creating ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: 1,
                  bgcolor: 'background.paper',
                  '&:hover': { bgcolor: '#fce4ec' },
                }}
              >
                {creating ? (
                  <CircularProgress size={14} sx={{ color: 'primary.main' }} />
                ) : (
                  <AddCircleOutlineIcon sx={{ fontSize: 17, color: 'primary.main' }} />
                )}
                <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>
                  {creating ? 'Creating…' : `Add "${trimmedQuery}"`}
                </Typography>
              </Box>
            </>
          )}
        </Paper>
      )}
    </Box>
  );
}
