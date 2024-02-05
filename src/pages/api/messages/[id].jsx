import { getMessagesApi } from "lib/api";
import { useEffect, useState } from "react";
export default function Messages({ matchId }) {
  console.log({ matchId });
  const [messages, setMessages] = useState();
  useEffect(() => {
    const getMessages = async () => {
      getMessagesApi(matchId).then((res) => setMessages(res));
    };
    getMessages();
  }, [matchId]);

  return (
    <div>
      <h1 className="text-3xl font-bold underline">MESSAGES</h1>
      {/* <div>{JSON.stringify(messages)}</div> */}
      <ul>
        <ul>
          {messages?.map((msg) => (
            <li>
              <p>
                {" "}
                <span className="font-bold">from: </span> {msg.from}
              </p>
              <p>
                {" "}
                <span className="font-bold">to: </span>
                {msg.to}
              </p>
              <p>
                {" "}
                <span className="font-bold">message: </span>
                {msg.message}
              </p>
              <p>
                {" "}
                <span className="font-bold">date: </span>
                {msg.sent_date}
              </p>
            </li>
          ))}
        </ul>
      </ul>
      {/* <div>{JSON.stringify()}</div> */}
    </div>
  );
}
export async function getServerSideProps({ params }) {
  return { props: { matchId: params.id } };
}
