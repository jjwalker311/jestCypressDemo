const addToBasket = () =>  Promise.resolve({added : true})

const checkout = () => Promise.resolve({
    response : 200,
    next : 'Go To Checkout'
})

const onCheckoutErr = () => {}

export {addToBasket, checkout, onCheckoutErr}