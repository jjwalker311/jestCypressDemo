export default phoneNumber => /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/.test(phoneNumber)


const parseDates = () => ({
    'title' :  'Thu 12 Jul -   1:00 PM to 6:00 PM',
    'value':  '2018-07-12 01:00:00  13:00:00 - 18:00:00 PM',
    'startDate':  '2018-07-12 01:00:00',
    'timeSlots': 'PM',
    'startTime': '13:00:00',
    'endTime': '18:00:00'
})

export {parseDates}