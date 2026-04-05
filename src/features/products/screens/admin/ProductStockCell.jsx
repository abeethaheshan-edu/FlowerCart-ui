import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { inventoryService } from '../../../../features/inventroy/services/inventoryService';

function StockButton({ symbol, onClick, disabled }) {
  return (
    <Box
      onClick={disabled ? undefined : onClick}
      sx={{
        width: 26, height: 26, borderRadius: 1, cursor: disabled ? 'default' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        bgcolor: symbol === '+' ? 'primary.main' : '#f4f4f5',
        color: symbol === '+' ? '#fff' : 'text.secondary',
        fontWeight: 700, fontSize: '1rem', lineHeight: 1,
        border: '1px solid',
        borderColor: symbol === '+' ? 'primary.main' : '#e5e7eb',
        transition: 'opacity 0.15s',
        opacity: disabled ? 0.4 : 1,
        '&:hover': disabled ? {} : { opacity: 0.85 },
        userSelect: 'none',
      }}
    >
      {symbol}
    </Box>
  );
}

export default function ProductStockCell({ product, onStockChange }) {
  const [qty, setQty] = useState(product.stockQty ?? 0);
  const [updating, setUpdating] = useState(false);

  const isLow = qty > 0 && qty <= (product.reorderLevel ?? 5);
  const stockColor = qty === 0 ? 'error.main' : isLow ? '#f59e0b' : 'text.primary';

  const adjust = async (delta) => {
    if (updating) return;
    const next = Math.max(0, qty + delta);
    setQty(next);
    setUpdating(true);
    try {
      await inventoryService.updateStock(product.productId, next, product.reorderLevel ?? 5);
      onStockChange?.(product.productId, next);
    } catch {
      setQty(qty);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
      <StockButton symbol="−" onClick={() => adjust(-1)} disabled={updating || qty === 0} />
      <Typography
        fontWeight={700}
        sx={{ minWidth: 28, textAlign: 'center', color: stockColor, fontSize: '0.9rem' }}
      >
        {qty}
      </Typography>
      <StockButton symbol="+" onClick={() => adjust(1)} disabled={updating} />
    </Box>
  );
}
