import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkShowCart, thunkRemoveFromCart, thunkClearCart, thunkUpdateItemQuantity } from '../../redux/cart';

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cart_items || []);

  // show all items in the cart
  useEffect(() => {
    dispatch(thunkShowCart());
  }, [dispatch]);

  // Handle quantity update
  const handleQuantityChange = async (itemId, quantity) => {
    if (quantity < 1) return alert('Quantity must be at least 1');
    await dispatch(thunkUpdateItemQuantity(itemId, quantity));
  };

  // Handle remove item
  const handleRemoveItem = async (itemId) => {
    await dispatch(thunkRemoveFromCart(itemId));
  };

  // Handle clear cart
  const handleClearCart = async () => {
    await dispatch(thunkClearCart());
  };

  return (
    <div>
      <h1>Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td> 
                <td>${parseFloat(item.price).toFixed(2)}</td>  {/* 价格显示为小数 */}
                <td>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10))}
                  />
                </td>
                <td>${(parseFloat(item.price) * item.quantity).toFixed(2)}</td>  {/* 总价 */}
                <td>
                  <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {cartItems.length > 0 && (
        <button onClick={handleClearCart}>Clear Cart</button>
      )}
    </div>
  );
};

export default Cart;


