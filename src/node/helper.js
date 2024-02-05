const { getMessagesApi, getMatchesApi, sendMessageApi } = require("./api");
const { sleep } = require("./util");

const MY_MESSAGES = [
  "I like your message , you look really nice!",
  "I am thinking the same way , we should go out sometime",
  "I knew that I can count on your opinions",
  "they say that I am the best company for cooking and even more ",
  "what are you up to next friday ? ",
  "good , what would you like to do ?",
];

const getCountWomenMessages = (messages) => {
  let count = 0;
  let wasPreviousTwo = false;

  for (let message of messages) {
    if (message.from !== process.env.NEXT_PUBLIC_MY_USER_ID) {
      if (!wasPreviousTwo) {
        count++;
        wasPreviousTwo = true;
      }
    } else {
      wasPreviousTwo = false;
    }
  }

  return count;
};

const getWomeUserId = (messages) => {
  return messages.find(
    (message) => message.from !== process.env.NEXT_PUBLIC_MY_USER_ID
  ).from;
};
const getWomeMatchId = (messages) => {
  return messages.find(
    (message) => message.from !== process.env.NEXT_PUBLIC_MY_USER_ID
  ).matchId;
};
function filterLastHerMessage(matches) {
  const matchesLastByGirls = matches.filter(
    (match) => match.messages[0].from !== process.env.NEXT_PUBLIC_MY_USER_ID
  );
  return matchesLastByGirls;
}
const autoPilotMessaging = async () => {
  const paylod = {
    message: 1,
    amount: 100,
    is_tinder_u: true,
  };
  const res = await getMatchesApi(paylod);
  let c = 0;
  let matches = res.data.matches;
  console.log(matches.length);
  matches = filterLastHerMessage(matches);
  console.log(matches.length);
  for (const match of matches) {
    let messages = await getMessagesApi(match._id);
    messages = messages.reverse();
    const count = getCountWomenMessages(messages);
    if (count === 0) continue;
    const messageToSend = MY_MESSAGES[count - 1];

    const matchId = getWomeMatchId(messages);
    const to = getWomeUserId(messages);
    if (messageToSend) {
      const payloadMessage = {
        userId: process.env.NEXT_PUBLIC_MY_USER_ID,
        otherId: match?.person._id,
        matchId: match?.id,
        sessionId: null,
        message: messageToSend,
      };
      console.log(payloadMessage);
      await sendMessageApi(payloadMessage);
      await sleep();
    }
  }
};
module.exports = {
  autoPilotMessaging,
};
