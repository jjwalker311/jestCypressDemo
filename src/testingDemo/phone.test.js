import validator from './phone'
import runner from './runner'
import { validPhoneNumbers, invalidPhoneNumbers } from './data'

describe('Run suite of tests for valid phonenumbers', ()=>{

    it('should call one off method to validate mobile number', ()=>{
        expect(validator('07595627704')).toBe(true)
    })

    it('should call forEach method to validate mobile number', ()=>{
        validPhoneNumbers.forEach(phoneNumber => {
            expect(validator(phoneNumber)).toBe(true)
        })
    })

    //Values in Array passed into "each" can be accessed from function args
    it.each(validPhoneNumbers)(
        'should validate %s as true',
        number => {
            expect(validator(number)).toBe(true);
        },
    );

    it.each(invalidPhoneNumbers)(
        'should validate %s as false',
        number => {
            expect(validator(number)).toBe(false);
        },
    );

    //Creates a runner for our specific test
    const phoneNumberRunner = runner(validator)

    let runnerArgs = validPhoneNumbers.reduce((args, number) => {
        return {
            ...args,
            [`should validate ${number} as true`] : {
                input : [number],
                output : true
            }
        }
    }, {})

    phoneNumberRunner(runnerArgs)

    runnerArgs = invalidPhoneNumbers.reduce((args, number) => {
        return {
            ...args,
            [`should validate ${number} as false`] : {
                input : [number],
                output : false,
                //skip : number === 'banana'   
            }
        }
    }, {})

    phoneNumberRunner(runnerArgs)
})