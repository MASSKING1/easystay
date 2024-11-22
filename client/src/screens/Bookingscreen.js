import React, { useEffect, useState } from 'react';
import axios from "axios";
import Swal from 'sweetalert2';
import Error from "../components/Error";
import Loader from "../components/Loader";
import StripeCheckout from 'react-stripe-checkout';
import moment from "moment";
import AOS from 'aos';
import 'aos/dist/aos.css';

AOS.init();
AOS.refresh();

function Bookingscreen({ match }) {
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState(false);
    const [room, setroom] = useState();
    const roomid = match.params.roomid;
    const fromdate = moment(match.params.fromdate, 'DD-MM-YYYY');
    const todate = moment(match.params.todate, 'DD-MM-YYYY');
    const totalDays = moment.duration(todate.diff(fromdate)).asDays() + 1;
    const [totalAmount, settotalAmount] = useState();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    useEffect(() => {
        async function fetchRoom() {
            try {
                setloading(true);
                const data = await (await axios.post("/api/rooms/getroombyid", { roomid })).data;
                setroom(data);
                settotalAmount(data.rentperday * totalDays);
                setloading(false);
            } catch (error) {
                console.log(error);
                setloading(false);
                seterror(true);
            }
        }
        fetchRoom();
    }, []);

    async function tokenHandler(token) {
        const bookingDetails = {
            token,
            user: currentUser,
            room,
            fromdate,
            todate,
            totalDays,
            totalAmount
        };

        try {
            setloading(true);
            await axios.post('/api/bookings/bookroom', bookingDetails);
            setloading(false);
            Swal.fire('Congrats', 'Your Room has been booked successfully', 'success')
                .then(() => {
                    window.location.href = '/profile';
                });
        } catch (error) {
            console.log(error);
            setloading(false);
            Swal.fire('Oops', 'Something went wrong, please try later', 'error');
        }
    }

    function handlePayNowClick() {
        if (!currentUser) {
            Swal.fire({
                icon: 'error',
                title: 'Not Registered/Logged in',
                text: 'Please register/login to book a room',
                confirmButtonText: 'OK'
            });
        }
    }

    return (
        <div className='m-5'>
            {loading ? (
                <Loader />
            ) : error ? (
                <Error />
            ) : (
                <div className="row p-3 mb-5 bs" data-aos='flip-right' duration='2000'>
                    <div className="col-md-6 my-auto">
                        <div>
                            <h1>{room.name}</h1>
                            <img src={room.imageurls[0]} style={{ height: '400px' }} alt="Room" />
                        </div>
                    </div>
                    <div className="col-md-6 text-right">
                        <div>
                            <h1><b>Booking Details</b></h1>
                            <hr />
                            <p><b>Name</b>: {currentUser?.name || "Guest"}</p>
                            <p><b>From Date</b>: {match.params.fromdate}</p>
                            <p><b>To Date</b>: {match.params.todate}</p>
                            <p><b>Max Count</b>: {room.maxcount}</p>
                        </div>
                        <div className='mt-5'>
                            <h1><b>Amount</b></h1>
                            <hr />
                            <p>Total Days: <b>{totalDays}</b></p>
                            <p>Rent Per Day: <b>{room.rentperday}</b></p>
                            <h1><b>Total Amount: {totalAmount} /-</b></h1>

                            {currentUser ? (
                                <StripeCheckout
                                    amount={totalAmount * 100}
                                    shippingAddress
                                    token={tokenHandler}
                                    stripeKey='pk_test_51QKxV9F8G7NamUJmDnBS8tBasJCCZmOMZxw6RezOn8bsBhNFUxFtorLukZ7Y2q3DMOFvfia0okbxd3Rypql02Vl700cvQNrBe9'
                                    currency='PKR'
                                >
                                    <button className='btn btn-primary'>Pay Now</button>
                                </StripeCheckout>
                            ) : (
                                <button
                                    className='btn btn-primary'
                                    onClick={handlePayNowClick}
                                >
                                    Pay Now
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Bookingscreen;
