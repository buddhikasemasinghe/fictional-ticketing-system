const EventEmitter = require('events');
const {v4: uuidv4} = require('uuid')
const BookingEvents = require('./BookingEventTypes')

class TicketingSystem extends EventEmitter {
    constructor(capacity) {
        super();
        this.maxCapacity = capacity || 10;
    }

    createBooking(booking) {
        const bookingToProcess = {...booking, bookingId: uuidv4(), bookingCreateTime: Date.now()};
        this.emit(BookingEvents.ACCEPTED, bookingToProcess);
    }
}

module.exports = TicketingSystem;