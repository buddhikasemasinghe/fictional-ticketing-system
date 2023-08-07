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
            expect(bookingEvent.bookingId).not.eq(null);
            expect(bookingEvent.bookingCreateTime).not.eq(null);
            done();
        }, 10);

    });

    it('should not accept booking after max capacity', (done) => {
        const ticketingSystem = new TicketingSystem(3);

        const bookingEvent = sinon.spy();
        ticketingSystem.on(BookingEvents.ACCEPTED, bookingEvent);

        const countryConfig = {
            dictionaries: [countries]
        }

        const booking1 = {
            name: uniqueNamesGenerator(configName),
            destination: uniqueNamesGenerator(countryConfig)
        };

        const booking2 = {
            name: uniqueNamesGenerator(configName),
            destination: uniqueNamesGenerator(countryConfig)
        };

        const booking3 = {
            name: uniqueNamesGenerator(configName),
            destination: uniqueNamesGenerator(countryConfig)
        };

        const booking4 = {
            name: uniqueNamesGenerator(configName),
            destination: uniqueNamesGenerator(countryConfig)
        };

        [booking1, booking2, booking3, booking4]
            .forEach(booking=> ticketingSystem.createBooking(booking));


        setTimeout(() => {
            expect(bookingEvent.callCount).eq(1);
            expect(bookingEvent.bookingId).not.eq(null);
            expect(bookingEvent.bookingCreateTime).not.eq(null);
            done();
        }, 10);
    });

});