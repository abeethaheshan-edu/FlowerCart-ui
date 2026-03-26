import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';

export default function AppSelect({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  helperText,
  required,
  fullWidth = true,
  size = 'medium',
  disabled,
  placeholder,
  sx = {},
  ...props
}) {
  return (
    <FormControl fullWidth={fullWidth} size={size} error={error} required={required} sx={sx}>
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        name={name}
        value={value ?? ''}
        onChange={onChange}
        label={label}
        disabled={disabled}
        displayEmpty={!!placeholder}
        {...props}
      >
        {placeholder && (
          <MenuItem value="" disabled>
            {placeholder}
          </MenuItem>
        )}
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
