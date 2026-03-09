import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function AppButton({
  children,
  type = "button",
  variant = "contained",
  color = "primary",
  size = "medium",
  fullWidth = false,
  loading = false,
  disabled = false,
  startIcon,
  endIcon,
  onClick,
  sx = {},
  ...props
}) {
  return (
    <Button
      type={type}
      variant={variant}
      color={color}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      onClick={onClick}
      startIcon={!loading ? startIcon : null}
      endIcon={!loading ? endIcon : null}
      sx={{
        minHeight: fullWidth ? 52 : 48,
        px: fullWidth ? 3 : 3,
        borderRadius: "16px",
        fontSize: "1rem",
        fontWeight: 600,
        textTransform: "none",
        boxShadow: "none",
        whiteSpace: "nowrap",
        "&:hover": {
          boxShadow: "none",
        },

        ...(variant === "contained" && {
          color: "#fff",
        }),

        ...(variant === "outlined" && {
          borderWidth: "1px",
          backgroundColor: "transparent",
        }),

        ...sx,
      }}
      {...props}
    >
      {loading ? (
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1.2,
          }}
        >
          <CircularProgress size={18} color="inherit" />
          <span>{children}</span>
        </Box>
      ) : (
        children
      )}
    </Button>
  );
}