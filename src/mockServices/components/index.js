import React from 'react'

const Redirect = ({to}) => <div data-test='redirect' className='redirect'>{to}</div>

const CheckoutButton = ({disabled, onClick}) => <button data-test='checkout' className='checkout 'onClick={onClick} disabled={disabled}>Checkout</button>

const Add = ({disabled, onClick}) => <button data-test='add' className='add' onClick={onClick}  disabled={disabled}>Add</button>

export {  Redirect, CheckoutButton, Add }