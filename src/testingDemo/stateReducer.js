/**
 * Immutably returns state update for a given action
 * @param  {type : String, payload : Object}
 * @param {Object} - current state
 */
export default function(currentState, {type, payload}){
    switch(type) {
        case 'redirect':
            return payload ? {redirect : payload, redirectError : false} : {redirectError : true}

        case 'increment':
            let { quantity } = currentState

            //increment
            quantity++

            return (Number.isInteger(quantity) && quantity < 10) ? { quantity } : { quantity, disableAddition : true }

        default:
            return null
    }        
}