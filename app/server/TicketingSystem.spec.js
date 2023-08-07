const {it} = require('mocha');
const TicketingSystem = require('./TicketingSystem');
const expect = require('chai').expect;
const sinon = require('sinon');

describe('Ticketing System module', () => {

    it('should create ticket system with default capacity', () => {
        const ticketingSystem = new TicketingSystem();
        expect(ticketingSystem.maxCapacity).eq(10);
    });

    it('should create ticket system with provided capacity', () => {
        const ticketingSystem = new TicketingSystem(100);
        expect(ticketingSystem.maxCapacity).eq(100);
    });

    it('should create booking with time', () => {
        const ticketingSystem = new TicketingSystem(20);

        const bookingEvent = sinon.spy();
        ticketingSystem.on('BOOKING_ACCEPTED', bookingEvent);

        const booking = {
            name: "Skyler Semasinghe",
            destination: 'JFK'
        }
        ticketingSystem.createBooking(booking);

        setTimeout(() => {
            bookingEvent.callCount.should.eq(1);
        }, 10);


    });

});