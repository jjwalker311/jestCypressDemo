import validator, {parseDates} from './phone'
import { neapolitan, vanilla } from './runner'
import { validPhoneNumbers, invalidPhoneNumbers } from './data'

describe('Testing the Vanilla test runner using Sum', () => {
    const sum = (a,b) => a + b

    //[
    //  [ExpectedInput, ExpectedInput],...
    //]
    const args = [
        [[1,2], 3],
        [[2,7], 9],
        [[5,5], 10],
        [[112,2], 114],
        [[1,0], 1]
    ]

    vanilla(sum, args)
})

describe('Testing the Neapolitan test runner using parseDates', ()=>{

    const input = {date : new Date()}

    const dateArgs = {
        ['should return all the dates'] : {
          input,
          output : ['title', 'Thu 12 Jul -   1:00 PM to 6:00 PM'],
        },
        ['should always have a value'] : {
          input,
          output : ['value', '2018-07-12 01:00:00  13:00:00 - 18:00:00 PM'],
        },
        ['should always have a startDate'] : {
          input,
          output : ['startDate', '2018-07-12 01:00:00'],
        },
        ['should always have a timeSlots'] : {
          input,
          output : ['timeSlots', 'PM'],
        },
        ['should always have a startTime'] : {
          input,
          assertion : 'toHaveProperty',
          output : ['startTime', '13:00:00'],
        },
        ['should always have a endTime'] : {
          input,
          output : ['endTime', '18:00:00'],
        }
      }

      neapolitan(parseDates, dateArgs, 'toHaveProperty')

})

describe('Run Neapolitan for valid phonenumbers test', ()=>{

    //Basic methods of demo purposes
    // it('should call one off method to validate mobile number', ()=>{
    //     expect(validator('07595627704')).toBe(true)
    // })

    // it('should call forEach method to validate mobile number', ()=>{
    //     validPhoneNumbers.forEach(phoneNumber => {
    //         expect(validator(phoneNumber)).toBe(true)
    //     })
    // })

    // //Values in Array passed into "each" can be accessed from function args
    // it.each(validPhoneNumbers)(
    //     'should validate %s as true',
    //     number => {
    //         expect(validator(number)).toBe(true);
    //     },
    // );

    //Reduce Array of valid numbers
    const validArgs = validPhoneNumbers.reduce((args, number) => ({
            ...args,
            [`should validate ${number} as true`] : {
                input : number,
                output : true
                //?skip : Boolean
                //?only : Boolean,
                //?assertion : Function
            }
    }), {})

    neapolitan(validator, validArgs)

    //Reduce Array of invalid numbers
    const invalidArgs = invalidPhoneNumbers.reduce((args, number) => ({
            ...args,
            [`should validate ${number} as false`] : {
                input : number,
                output : false
                //?skip : Boolean
                //?only : Boolean
                //?assertion : Function
            }
    }), {})

    neapolitan(validator, invalidArgs)
})