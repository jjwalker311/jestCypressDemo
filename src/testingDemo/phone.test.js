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

    const phoneNumberRunner = runner(validator)

    let runnerArgs = validPhoneNumbers.reduce((args, number) => ({
            ...args,
            [`should validate ${number} as true`] : {
                input : [number],
                output : true
                //?skip : Boolean
                //?only : Boolean
            }
    }), {})

    phoneNumberRunner(runnerArgs)
})