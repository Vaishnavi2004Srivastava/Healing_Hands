import Layout from "../components/Layout";
//.............................................
import { useSelector } from "react-redux";
//............................................
import React, { useState, useEffect } from "react";
import moment from "moment";

import { useParams } from "react-router-dom";
import axios from "axios";
import { DatePicker, TimePicker, message } from "antd";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { useDispatch } from "react-redux";

const BookingPage = () => {
  // const {user} = useSelector(state => state.user)

  const params = useParams();
  const [doctors, setDoctors] = useState([]);
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const [isAvailable, setisAvailable] = useState();
  const dispatch = useDispatch();
  //Login user data.................................................
  const { user } = useSelector((state) => state.user);
  const id = user?.user?._id;
  const getUserData = async () => {
    try {
      console.log(localStorage.getItem("token"));
      const res = await axios.post(
        "/api/v1/doctor/getDoctorById ",
        //...................................
        { doctorId: params.doctorId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      // console.log(res.data);
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  //=========================Booking Function
  const handleBooking = async () => {
    try {
      setisAvailable(true);
      if (!date && !time) {
        return alert("Date & Time Requires");
      }
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user._id,
          date: date,
          userInfo: user,
          doctorInfo: doctors,
          time: time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  const handleAvailability = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/booking-availbility",
        { doctorId: params.doctorId, date, time },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        setisAvailable(true);
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
    //eslint-disable-next-line
  }, []);
  return (
    <Layout>
      <h3>Booking Page</h3>
      <div className="container m-2">
        {doctors && (
          <div>
            <h4>
              Dr.{doctors.firstName} {doctors.lastName}
            </h4>
            <h4>Fees : {doctors.feesPerCunsultation} </h4>
            {/* <h4>
              Timings: {doctors.timing[0]}-{doctors.timing[1]}
            </h4> */}
            <h4>Timings:</h4>
            <div className="d-flex flex-column w-50">
              <DatePicker
                className="m-2"
                format="DD-MM-YYYY"
                onChange={(value) => {
                  // setisAvailable(false);
                  setDate(moment(value).format("DD-MM-YYYY"));
                }}
              />
              <TimePicker
                className="m-2"
                form="HH:mm"
                onChange={(value) => {
                  // setisAvailable(false);
                  setTime(moment(value).format("HH:mm"));
                }}
              />
              <button
                className="btn btn-primary mt-2"
                onClick={handleAvailability}
              >
                Check Availability
              </button>
              {/* {!isAvailable && ( */}
              <button className="btn btn-dark mt-2" onClick={handleBooking}>
                Book Now
              </button>
              {/* )} */}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookingPage;
