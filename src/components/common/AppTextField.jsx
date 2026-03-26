import TextField from '@mui/material/TextField';

export default function AppTextField({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  error,
  helperText,
  required,
  fullWidth = true,
  size = 'medium',
  startAdornment,
  endAdornment,
  multiline,
  rows,
  disabled,
  sx = {},
  ...props
}) {
  return (
    <TextField
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
      error={error}
      helperText={helperText}
      required={required}
      fullWidth={fullWidth}
      size={size}
      multiline={multiline}
      rows={rows}
      disabled={disabled}
      slotProps={{
        input: {
          startAdornment: startAdornment || undefined,
          endAdornment: endAdornment || undefined,
        },
      }}
      sx={sx}
      {...props}
    />
  );
}
