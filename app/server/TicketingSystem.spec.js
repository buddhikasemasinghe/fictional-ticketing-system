const {it} = require('mocha');
const TicketingSystem = require('./TicketingSystem');
const expect = require('chai').expect;
const sinon = require('sinon');
const BookingEvents = require('./BookingEventTypes');
const {uniqueNamesGenerator, countries, starWars} = require('unique-names-generator');

describe('Ticketing System module', () => {

    let configName;

    before(() => {
        configName = {
            dictionaries: [starWars]
        }
    });

    it('should create ticket system with default capacity', () => {
        const ticketingSystem = new TicketingSystem();
        expect(ticketingSystem.maxCapacity).eq(10);
    });

    it('should create ticket system with provided capacity', () => {
        const ticketingSystem = new TicketingSystem(100);
        expect(ticketingSystem.maxCapacity).eq(100);
    });

    it('should create booking and emit event', (done) => {
        const ticketingSystem = new TicketingSystem(20);

        const bookingEvent = sinon.spy();
        ticketingSystem.on(BookingEvents.ACCEPTED, bookingEvent);

        const booking = {
            name: uniqueNamesGenerator(configName),
            destination: 'JFK'
        }
        ticketingSystem.createBooking(booking);

        setTimeout(() => {
            expect(bookingEvent.callCount).eq(1);
            const result = bookingEvent.getCall(0).args[0];
            expect(result.bookingId).not.eq(undefined);
            expect(result.bookingCreateTime).not.eq(undefined);
            done();
        }, 10);

    });

    it('should not accept booking after max capacity', (done) => {
        const ticketingSystem = new TicketingSystem(3);

        const bookingEvent = sinon.spy();
        ticketingSystem.on(BookingEvents.ACCEPTED, bookingEvent);

        const maxBookingNotification = sinon.spy();
        ticketingSystem.on(BookingEvents.MAX_BOOKING, maxBookingNotification);

        const countryConfig = {
            dictionaries: [countries]
        }

        for (let key of Array(4).keys()) {
            const booking = {
                name: uniqueNamesGenerator(configName),
                destination: uniqueNamesGenerator(countryConfig)
            };

            ticketingSystem.createBooking(booking)
        }


        setTimeout(() => {
            expect(bookingEvent.callCount).eq(3);
            const result = bookingEvent.getCall(2).args[0];
            expect(result.bookingId).not.eq(undefined);
            expect(result.bookingCreateTime).not.eq(undefined);

            const maxResult = bookingEvent.getCall(0).args[0];
            expect(maxBookingNotification.callCount).eq(1);
            expect(maxResult.name).not.eq(undefined);
            done();
        }, 10);
    });

    it('should start reservation process with the default interval and emit event', (done) => {
        const ticketingSystem = new TicketingSystem();

        const bookingEvent = sinon.spy();
        ticketingSystem.on(BookingEvents.ACCEPTED, bookingEvent);

        const booking = {
            name: 'John Lenon',
            destination: 'JFK'
        }
        ticketingSystem.createBooking(booking);

        const reservationEvent = sinon.spy();
        ticketingSystem.on(BookingEvents.RESERVATION_COMPLETED, reservationEvent);

        setTimeout(() => {
            expect(bookingEvent.callCount).eq(1);
            const result = bookingEvent.getCall(0).args[0];
            expect(result.bookingId).not.eq(undefined);
            expect(result.name).eq('John Lenon');
        }, 10);

        setTimeout(() => {
            expect(reservationEvent.callCount).eq(1);
            const reservationResult = reservationEvent.getCall(0).args[0];
            expect(reservationResult.reservedTime).not.eq(undefined);
            expect(reservationResult.name).eq('John Lenon');
            expect(reservationResult.reservationNo).not.eq(undefined);
            done();
        }, 350);

    });

});