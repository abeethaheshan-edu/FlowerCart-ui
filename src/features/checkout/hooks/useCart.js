import { useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/cartService';

export function useCart() {
  const [cart,     setCart]     = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [mutating, setMutating] = useState(false);
  const [error,    setError]    = useState('');

  const load = useCallback(() => {
    setLoading(true);
    cartService.getCart()
      .then(setCart)
      .catch(() => setError('Failed to load cart.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const withMutation = async (fn) => {
    setMutating(true);
    try {
      const result = await fn();
      if (result) setCart(result);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setMutating(false);
    }
  };

  const updateQty  = (cartItemId, qty) => withMutation(() => cartService.updateItemQuantity(cartItemId, qty));
  const removeItem = (cartItemId)       => withMutation(() => cartService.removeItem(cartItemId));
  const clearCart  = ()                 => withMutation(async () => { await cartService.clearCart(); return { items: [], subtotal: 0, itemCount: 0 }; });

  return { cart, loading, mutating, error, updateQty, removeItem, clearCart, dismissError: () => setError('') };
}
