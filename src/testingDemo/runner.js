
/**
 * Method to allow call of function with args as Array or single variable
 * @param  {Function} func
 * @param  {Any} args
 */
const handleArgsAsArray = (func, args) => {
    return Array.isArray(args) ? func(...args) : func(args)
}

/**
 * Parse title String based on input/outputs
 * @param  {Any} input
 * @param  {Any} output
 */
const parseTitle = (input, output) => {
    const parsedInput = JSON.stringify(input)
    const parsedOutput =JSON.stringify(output) 

    return `should return ${parsedOutput} on submission of ${parsedInput}`
}

const ASSERTION_DEFAULT = 'toEqual'


/**
 * Runner function to call a given method for a range of test
 * @param  {Function} method
 * @param  {Object} tests
 * @param  {?String} assertion
 */
const neapolitan  = function(method, tests,  assertion = ASSERTION_DEFAULT){

    /**
    * Structure of TESTS Object
    * {
    *      TITLE_OF_TEST : {
    *          input : Any //arguments for method
    *          output : Any //expected return value for the method
    *          ?skip : Boolean
    *          ?only : Boolean
    *      }
    * }
    */
    Object.keys(tests).forEach(title =>{
        const {input, output, only, skip, assertion : assertionOverride} = tests[title]
        //Run method with given args and expect output 
        const testFn = () => {
            //Allows Input/Output of assertion as Array or single var
            //Assertion itself is defined on initialisation
            //Allows assertion overide for a particular test
            handleArgsAsArray(expect(handleArgsAsArray(method, input))[assertionOverride || assertion], output)
        }
            
        if (only){
            test.only(title, testFn)
        } else if (skip){
            test.skip(title, testFn)
        } else {
            test(title, testFn)
        }
    })
}   

/**
 * Simple function run a method on an Array of Arrays
 * @param {Function} method 
 * @param {[Array  : [Array : [Any, Any]]]} tests 
 */
const vanilla  = function(method, tests){

    /**
     * Structure vanilla tests
     * [Array  : [Array : [Any, Any]]]
     * 
     * Array of Arrays containing input as first arg and expected output as second
     * Array of single var for input/output is acceptable
     */

    for(let t of tests){
        const [input, output] = t

        const testFn = () => {
            //Allows Input/Output of assertion as Array or single var
            //Assertion itself is defined on initialisation
            handleArgsAsArray(expect(handleArgsAsArray(method, input))[ASSERTION_DEFAULT], output)
        }

        //Run basic test
        test(parseTitle(input, output), testFn)
    }
}

export { vanilla, neapolitan }