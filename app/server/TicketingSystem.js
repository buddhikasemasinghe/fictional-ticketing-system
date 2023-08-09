const EventEmitter = require('events');
const {v4: uuidv4} = require('uuid')
const BookingEvents = require('./BookingEventTypes')

class TicketingSystem extends EventEmitter {
    constructor(capacity, reservationFrequency) {
        super();
        this.maxCapacity = capacity || 10;
        this.frequency = reservationFrequency || 250;
        this.bookingQueue = [];

        setInterval(() => {
            const bookingToProcess = this.bookingQueue.pop();
            if(bookingToProcess !== undefined){
                const reservedBooking = {...bookingToProcess, reservationNo: uuidv4(), reservedTime: Date.now()}
                this.emit(BookingEvents.RESERVATION_COMPLETED, reservedBooking);
            }
        }, this.frequency);
    }

    createBooking(booking) {
        if(this.bookingQueue.length === this.maxCapacity){
            this.emit(BookingEvents.MAX_BOOKING, {...booking});
            return;
        }
        const bookingToProcess = {...booking, bookingId: uuidv4(), bookingCreateTime: Date.now()};
        this.bookingQueue.push(bookingToProcess);
        this.emit(BookingEvents.ACCEPTED, bookingToProcess);
    }


}

module.exports = TicketingSystem;