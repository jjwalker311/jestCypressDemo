import React, { Component } from 'react'
import {addToBasket, checkout, onCheckoutErr} from '../mockServices/methods'
import { Redirect, CheckoutButton, Add } from '../mockServices/components'
import stateReducer from './stateReducer'

export default class Basket extends Component {

    state = {
        quantity : 0,
        redirect : null
    }
    /**
     * Uses a StateReducer to determine what state to update
     * @param  {String} type
     * @param  {Andy} payload
     */
    updateState(type, payload){
        const update =  stateReducer(this.state, {type , payload})
        console.log(update)
        this.setState( update)    
    }

    constructor() {
        super()
        this.handleAdd = this.handleAdd.bind(this)
        this.handleCheckout = this.handleCheckout.bind(this)
    }    

    handleAdd = async e => {
        await addToBasket(true, e.target.id)

        this.updateState('increment')
    }

    handleCheckout = async () => {
        const { quantity } = this.state
        try{
            const {response, next : redirect} = await checkout(quantity)
            if (response === 200){
                //Success
                this.updateState('redirect', redirect)
                
            } else {
                //Failure non 200
                onCheckoutErr(`Response error: ${response}`)
            }
        } catch(e){
            //throw error
            onCheckoutErr(e)
        }
    }

    render() {
        const {quantity, redirect, disableAddition} = this.state
        const checkoutDisabled = quantity===0
        return (
            <div className='basket'>
                {
                    redirect ?  <Redirect to={redirect}/> : (
                        <>
                            <p data-test='quantity' className='quantity'>{`Current Basket quantity of: ${quantity}`}</p>  
                            <Add onClick={this.handleAdd} disabled={disableAddition}/>
                            <CheckoutButton onClick={this.handleCheckout} disabled={checkoutDisabled}/>
                        </>
                    )
                }
            </div>
        )
    }
}
