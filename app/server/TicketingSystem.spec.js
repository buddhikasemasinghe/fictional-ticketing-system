const {it} = require('mocha');
const TicketingSystem = require('./TicketingSystem');
const expect = require('chai').expect;
const sinon = require('sinon');
const BookingEvents = require('./BookingEventTypes');
const {uniqueNamesGenerator, countries, starWars} = require('unique-names-generator');

describe('Ticketing System module', () => {

    let configName;
    let countryConfig;
    let ticketingSystem;

    before(() => {
        configName = {
            dictionaries: [starWars]
        };

        countryConfig = {
            dictionaries: [countries]
        };


    });

    afterEach(() => {
        ticketingSystem.pauseReservation();
    });


    it('should create ticket system with default capacity', () => {
        ticketingSystem = new TicketingSystem();
        expect(ticketingSystem.maxCapacity).eq(10);
    });

    it('should create ticket system with provided capacity', () => {
        ticketingSystem = new TicketingSystem(100);
        expect(ticketingSystem.maxCapacity).eq(100);
    });

    it('should create booking and emit event', (done) => {
        ticketingSystem = new TicketingSystem(20);

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
        ticketingSystem = new TicketingSystem(3);

        const bookingEvent = sinon.spy();
        ticketingSystem.on(BookingEvents.ACCEPTED, bookingEvent);

        const maxBookingNotification = sinon.spy();
        ticketingSystem.on(BookingEvents.MAX_BOOKING, maxBookingNotification);


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
        ticketingSystem = new TicketingSystem();
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

    it('should return valid inflight bookings when reservation system is started and paused', done => {
        ticketingSystem = new TicketingSystem(20, 100);

        for (let key of Array(10).keys()) {
            const booking = {
                name: uniqueNamesGenerator(configName),
                destination: uniqueNamesGenerator(countryConfig)
            };

            ticketingSystem.createBooking(booking);
        }

        expect(ticketingSystem.getUnProcessedBookings(), 10);

        const reservationEvent = sinon.spy();
        ticketingSystem.on(BookingEvents.RESERVATION_COMPLETED, reservationEvent);

        setTimeout(() => {
            expect(ticketingSystem.getUnProcessedBookings(), 7);
            expect(reservationEvent.callCount).eq(3);
        }, 350);

        setTimeout(() => {
            expect(ticketingSystem.getUnProcessedBookings(), 2);
            expect(reservationEvent.callCount).eq(8);
        }, 850);

        setTimeout(() => {
            expect(ticketingSystem.getUnProcessedBookings(), 0);
            expect(reservationEvent.callCount).eq(10);
            ticketingSystem.pauseReservation();

            for (let key of Array(5).keys()) {
                const booking = {
                    name: uniqueNamesGenerator(configName),
                    destination: uniqueNamesGenerator(countryConfig)
                };

                ticketingSystem.createBooking(booking);
            }


        }, 1200);

        setTimeout(() => {
            expect(ticketingSystem.getUnProcessedBookings(), 5);
            expect(reservationEvent.callCount).eq(10);
            done();
        }, 1620);

    });

});