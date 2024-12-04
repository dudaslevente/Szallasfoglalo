export interface Booking{
    id: string,
    userId: string,
    userName?: string
    accomID: string,
    accomName?: string,
    accomAddr?: string,
    bookingDate: string,
    startDate: string,
    endDate: string,
    personCount: number,
    checkout: number
}