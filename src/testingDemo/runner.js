
/**
 * Runner function to call a given method for a range of test
 * @param  {Function} method
 * @param  {Object} tests
 */
export default function(method){

    /**
     * Returns function for a given method
     * @param  {Object} tests - see structure 
     */
    return function(tests){

        /**
         * Structure of TESTS Object
         * {
         *      TITLE_OF_TEST : {
         *          input : Array //arguments for method
         *          output : Any //expected return value for the method
         *          ?skip : Boolean
         *          ?only : Boolean
         *      }
         * }
         */
        Object.keys(tests).forEach(title =>{
            const {input, output, only, skip} = tests[title]
            //Run method with given args and expect output
            const testFn = () => {
                expect(method(...input)).toEqual(output)
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
}   