import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import qs from "qs"
import {
    GET_ERRORS,
    SET_CURRENT_USER,
    USER_LOADING
} from "./types";

export const registerUser = (data, history) => dispatch => {
    var userData = qs.stringify({ email: data.email, password: data.password, name: data.name, username: data.username })
    return new Promise((resovle, reject) => {
        axios
            .post("/users/register", userData)
            .then(res => {
                resovle()
                history.push("/login")
            })
            .catch(err => {
                dispatch({
                    type: GET_ERRORS,
                    payload: err.response.data
                })
                reject()
            }
            );
    })
};
export const loginUser = data => dispatch => {
    var userData = qs.stringify({ email: data.email, password: data.password })
    return new Promise((resovle, reject) => {
        axios
            .post("/users/authenticate", userData)
            .then(res => {
                const { token } = res.data;
                localStorage.setItem("jwtToken", token);
                setAuthToken(token);
                const decoded = jwt_decode(token);
                dispatch(setCurrentUser(decoded));
                resovle();
            })
            .catch(err => {
                dispatch({
                    type: GET_ERRORS,
                    payload: err.response.data
                })
                reject();
            }
            );
    })
};

export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    };
};

export const setUserLoading = () => {
    return {
        type: USER_LOADING
    };
};

export const logoutUser = () => dispatch => {
    localStorage.removeItem("jwtToken");
    setAuthToken(false);
    dispatch(setCurrentUser({}));
};