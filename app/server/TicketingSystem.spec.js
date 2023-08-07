const {it} = require('mocha');
const TicketingSystem = require('./TicketingSystem');
const expect = require('chai').expect;
const sinon = require('sinon');
const BookingEvents = require('./BookingEventTypes')

describe('Ticketing System module', () => {

    it('should create ticket system with default capacity', () => {
        const ticketingSystem = new TicketingSystem();
        expect(ticketingSystem.maxCapacity).eq(10);
    });

    it('should create ticket system with provided capacity', () => {
        const ticketingSystem = new TicketingSystem(100);
        expect(ticketingSystem.maxCapacity).eq(100);
    });

    it('should create booking with time', (done) => {
        const ticketingSystem = new TicketingSystem(20);

        const bookingEvent = sinon.spy();
        ticketingSystem.on(BookingEvents.ACCEPTED, bookingEvent);

        const booking = {
            name: "Skyler Semasinghe",
            destination: 'JFK'
        }
        ticketingSystem.createBooking(booking);

        setTimeout(() => {
            expect(bookingEvent.callCount).eq(1);
            expect(bookingEvent.bookingId).not.eq(null);
            expect(bookingEvent.bookingCreateTime).not.eq(null);
            done();
        }, 10);

    });

});