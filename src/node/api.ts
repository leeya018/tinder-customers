// require("dotenv").config()
import fs from "fs"
import axios from "axios"
import { getHeaders, tinderBaseUrl } from "@/pages/api/util"

const getProfileApi = async (token: string) => {
  var config = {
    method: "get",
    maxBodyLength: Infinity,

    url: `https://api.gotinder.com/v2/profile?locale=en&include=account%2Cavailable_descriptors%2Cboost%2Cbouncerbypass%2Ccontact_cards%2Cemail_settings%2Cfeature_access%2Cinstagram%2Clikes%2Cprofile_meter%2Cnotifications%2Cmisc_merchandising%2Cofferings%2Conboarding%2Cpaywalls%2Cplus_control%2Cpurchase%2Creadreceipts%2Cspotify%2Csuper_likes%2Ctinder_u%2Ctravel%2Ctutorials%2Cuser`,
    headers: getHeaders(token),
  }
  return axios(config)
    .then(function (response) {
      return response.data
    })
    .catch(function (error) {
      console.log(error.message)
    })
}

const getMessagesApi = async (token: string, matchId: string) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${tinderBaseUrl}/v2/matches/${matchId}/messages?locale=en&count=100`,
    headers: getHeaders(token),
  }

  return axios
    .request(config)
    .then((response) => {
      return response.data.data.messages
    })
    .catch((error) => {
      throw error
    })
}
const unmatchUsersApi = async (token: string, matchId: string) => {
  let data = ""
  let config = {
    method: "delete",
    maxBodyLength: Infinity,
    url: `${tinderBaseUrl}/user/matches/${matchId}?locale=en`,
    headers: getHeaders(token),
    data: data,
  }

  return axios
    .request(config)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      throw error.message
    })
}
const getMyLikesApi = async (token: string) => {
  // console.log({ TOKEN: token })
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${tinderBaseUrl}/v2/fast-match?locale=en`,
    headers: getHeaders(token),
  }

  return axios
    .request(config)
    .then((response) => {
      // console.log(response.data.data.results)
      return response.data.data.results
    })
    .catch((error) => {
      console.log(error.message)
      throw error.message
    })
}
const getMatchesApi = async (token: string, payload: any) => {
  const { message, is_tinder_u, amount, pageToken } = payload
  const withToken = pageToken ? `&page_token=${pageToken}` : ""

  var config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${tinderBaseUrl}/v2/matches?locale=en&count=${amount}&is_tinder_u=${is_tinder_u}&message=${message}${withToken}`,
    headers: getHeaders(token),
  }
  return axios(config)
    .then(function (response) {
      return response.data
    })
    .catch(function (error) {
      console.log(error.message)
      throw error.message
    })
}

const sendMessageApi = async (token: string, payload: any) => {
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${tinderBaseUrl}/user/matches/${payload.matchId}?locale=en`,
    headers: getHeaders(token),
    data: JSON.stringify(payload),
  }

  return axios
    .request(config)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      // console.log(error);
      throw error.message
    })
}
const passUserApi = async (
  token: string,
  user: any,
  s_number: string,
  user_traveling: number
) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${tinderBaseUrl}/pass/${user._id}?locale=en&s_number=${s_number}&user_traveling=${user_traveling}`,
    headers: getHeaders(token),
  }
  return axios
    .request(config)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      console.log(error.message)
      throw error.message
    })
}
const passUserWithMatchApi = async (
  token: string,
  user: any,
  s_number: string
) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${tinderBaseUrl}/pass/${user._id}?locale=en&fast_match=1&s_number=${s_number}`,
    headers: getHeaders(token),
  }
  return axios
    .request(config)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      console.log(error.message)
      throw error.message
    })
}

const likeUserApi = async (token: string, user: any, data: any) => {
  // console.log({ token: token })
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${tinderBaseUrl}/like/${user._id}`,
    headers: getHeaders(token),
    data: data,
  }

  return axios
    .request(config)

    .then((response) => {
      return response.data
    })
    .catch((error) => {
      //   console.log(error);
      throw error.message
    })
}
const getRecsApi = async (token: string) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${tinderBaseUrl}/v2/recs/core?locale=en`,
    headers: getHeaders(token),
  }

  return axios
    .request(config)
    .then((response) => {
      const user = response.data.data.results[0].user
      return response.data
    })
    .catch((error) => {
      console.log(error.message)
      throw error
    })
}

const getUserApi = async (token: string, userId: string) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${tinderBaseUrl}/user/${userId}?locale=en`,
    headers: getHeaders(token),
  }

  return axios
    .request(config)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      console.log(error.message)
      throw error
    })
}

export {
  getRecsApi,
  likeUserApi,
  passUserApi,
  sendMessageApi,
  getMatchesApi,
  getMyLikesApi,
  unmatchUsersApi,
  getMessagesApi,
  getProfileApi,
  passUserWithMatchApi,
  getUserApi,
}
