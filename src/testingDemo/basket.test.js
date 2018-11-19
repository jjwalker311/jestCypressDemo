import Basket from './basket'
import React from 'react'
import reducer from './stateReducer'

//Enzyme setup bleugh....
import Enzyme, {shallow} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() })

import runner from './runner'

import {
    checkout as mockCheckout,
    addToBasket as mockAddToBasket,
    onCheckoutErr as mockOnCheckoutErr
} from '../mockServices/methods'


jest.mock('../mockServices/methods', () => {
    return {
        ...jest.requireActual('../mockServices/methods'),
        addToBasket : jest.fn(() => Promise.resolve({added : true})),
        checkout : jest.fn(),
        onCheckoutErr : jest.fn()
    }
})

const checkoutSuccess = {
    response : 200,
    next : 'myOrders'
}

const checkoutFailure = {
    response : 500
}

let userJourneyWrapper
let instance

const getQuantityDisplayed = () => userJourneyWrapper.find('p.quantity').text();

beforeAll(() => {
    mockCheckout.mockImplementation(() => Promise.resolve(checkoutSuccess))

    userJourneyWrapper  = shallow(<Basket/>)
    instance = userJourneyWrapper.instance()
})

afterEach(()=>{
    mockOnCheckoutErr.mockClear()
})

describe('Run sample test suite on Basket', ()=>{

    it('should render without blowing up', ()=>{
        expect(userJourneyWrapper.length).toBe(1)
        expect(userJourneyWrapper).toMatchSnapshot();

        expect(getQuantityDisplayed()).toMatch(/quantity of: 0/i)
        expect(userJourneyWrapper.find('Add').prop('onClick')).toBe((instance.handleAdd))
        expect(userJourneyWrapper.find('CheckoutButton').prop('onClick')).toBe(instance.handleCheckout)
    })

    it('should disable the checkout button by default', ()=>{
        const disabledValue = userJourneyWrapper.find('CheckoutButton').prop('disabled')
        expect(disabledValue).toBe(true)
    })

    it('should call the addToBasket method on handleAdd of add with correct args and update state', async ()=>{
        const event = {
            target : {
                id : 'someId'
            }
        }

        expect(getQuantityDisplayed()).toMatch(/quantity of: 0/i)

        await instance.handleAdd(event)

        //Quantity has been updated
        expect(getQuantityDisplayed()).toMatch(/quantity of: 1/i)
        expect(mockAddToBasket).toBeCalled()
        expect(mockAddToBasket).toBeCalledWith(true, event.target.id)

        await instance.handleAdd(event)
        expect(getQuantityDisplayed()).toMatch(/quantity of: 2/i)

        await instance.handleAdd(event)
        expect(getQuantityDisplayed()).toMatch(/quantity of: 3/i)

        await instance.handleAdd(event)
        expect(getQuantityDisplayed()).toMatch(/quantity of: 4/i)
    })

    it('should enable the checkout button by after handleAdd has been called', ()=>{
        const disabledValue = userJourneyWrapper.find('CheckoutButton').prop('disabled')
        expect(disabledValue).toBe(false)
    })

    it('should call onCheckoutErr if checkout response is not 200', async ()=>{
        expect(mockOnCheckoutErr).not.toBeCalled()
        mockCheckout.mockImplementationOnce(() => Promise.resolve(checkoutFailure))

        await instance.handleCheckout()

        expect(mockOnCheckoutErr).toBeCalled()
        expect(mockOnCheckoutErr).toBeCalledWith(`Response error: ${checkoutFailure.response}`)
    })

    it('should call onCheckoutErr if checkout throws an error', async ()=>{
        const err = 'someError'
        expect(mockOnCheckoutErr).not.toBeCalled()
        mockCheckout.mockImplementationOnce(() => Promise.reject(err))

        await instance.handleCheckout()

        expect(mockOnCheckoutErr).toBeCalled()
        expect(mockOnCheckoutErr).toBeCalledWith(err)
    })

    it('should not call error handler and succesfull checkout and redirect', async ()=>{
        const getRedirectionComponent = () => userJourneyWrapper.find('Redirect')
        const areWeRedirecting = () => {
            return getRedirectionComponent().length > 0
        }


        expect(areWeRedirecting()).toBe(false)

        await instance.handleCheckout()

        expect(mockOnCheckoutErr).not.toBeCalled()
        expect(areWeRedirecting()).toBe(true)
        expect(getRedirectionComponent().prop('to')).toBe(checkoutSuccess.next)
    })
})

describe('Run tests against state reducer', ()=>{
    
    let state = {
        quantity : 0
    }
    let action = {
        type : null,
        payload : null
    }

    it ('should return null for invalid type', ()=>{
        expect(reducer(state, action)).toEqual(null)

        action.type = 'something_unknown_not_in_enum'
        expect(reducer(state, action)).toEqual(null)
    })

    it('should return an error for an empty redirect payload and not with a valid payload', ()=>{
        action.type = 'redirect'

        const {redirectError : shouldBeTrue} = reducer(state, action)
        expect(shouldBeTrue).toEqual(true)

        action.payload = 'someRedirectActions'
        const {redirectError : shouldBeFalse} = reducer(state, action)
        expect(shouldBeFalse).toEqual(false)
    })

    it('should return redirect if valid payload sent', ()=>{
        const {redirect} = reducer(state, action)
        expect(redirect).toEqual(action.payload)
    })

    it('should increment quantity up to 10', ()=>{
        const expectedResults = [1,2,3,4,5,6,7,8,9,10]

        action.type = 'increment'

        expectedResults.forEach(result => {

            const updatedState = reducer(state, action)
            const {quantity, disableAddition} = updatedState

            expect(quantity).toBe(result)

            //Updating state for next test
            state = {
                ...state, ...updatedState
            }
        })
        
    })

    it('should disable the addition button when quantity is 10', ()=>{
        state.quantity = 0
        action.type

        let updatedState

        for(let i=1;i<=10;i++){
            updatedState = reducer(state, action)
            expect(updatedState.disableAddition).toEqual(i < 10 ? undefined : true)

            //Updating state for next assertion
            state = {
                ...state, ...updatedState
            }
        }
    })
})
