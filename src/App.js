import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Modal from "react-bootstrap/Modal";
import Badge from "react-bootstrap/Badge";
import { get, set, values } from "idb-keyval";
import cogoToast from "cogo-toast";

import "./App.css";
import MessagingForm from "./components/form";

const groupingHandler = ({ messages, filter }) => {
  let uniques = messages
    .sort((a, b) => b.timestamp - a.timestamp)
    .filter(
      (item, pos, self) =>
        self.findIndex((v) => v.option === filter && v.index === item.index) ===
        pos
    );

  uniques = uniques.map((unique) => ({
    ...unique,
    unreadMessages: messages.filter(
      (message) =>
        message.read === false &&
        message.index === unique.index &&
        message.option === filter
    )?.length,
  }));

  return uniques;
};

const App = () => {
  const [open, setOpen] = useState(false);
  const [conversations, setConversation] = useState([]);
  const [data, setCurrentData] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    getConversations();
  }, []);

  const getConversations = async () => {
    const conversation = await values();
    let allMessages = [];

    for (let messages of conversation) {
      for (let message of messages) {
        allMessages.push(message);
      }
    }

    groupingHandler({ messages: allMessages });

    setConversation(allMessages);
  };

  const handleSubmit = async (values) => {
    const conversation = await get(values.index);

    const oldConversation = conversation ? conversation : [];
    await set(values.index, [
      ...oldConversation,
      {
        ...values,
        timestamp: new Date(),
        read: false,
      },
    ]);

    cogoToast.success("Message successfully sent.");

    await getConversations();
  };

  const handleReadMessages = async (row, filter) => {
    get(row.index).then(async (values) => {
      await set(
        row.index,
        values.map((message) => {
          if (message.option === filter) {
            return { ...message, read: true };
          } else {
            return message;
          }
        })
      );

      await getConversations();
    });
  };

  return (
    <>
      <Modal
        show={open}
        size="lg"
        onHide={() => setOpen(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ margin: 5, padding: 20 }}>
            {data
              .sort((a, b) => a.timestamp - b.timestamp)
              .map((message) => {
                return (
                  <>
                    {message.option === "outbox" && (
                      <div
                        className="row"
                        key={message.timestamp}
                        style={{ padding: 10 }}
                      >
                        <div
                          className="card col-md-6 incoming"
                          style={{ padding: 10 }}
                        >
                          {message.message}
                        </div>
                      </div>
                    )}

                    {message.option === "inbox" && (
                      <div
                        className="row"
                        key={message.timestamp}
                        style={{ padding: 10 }}
                      >
                        <div className="col-md-6"></div>
                        <div
                          className="card col-md-6 float-right outgoing"
                          style={{ padding: 10 }}
                        >
                          {message.message}
                        </div>
                      </div>
                    )}
                  </>
                );
              })}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="row" style={{ padding: 200 }}>
        <div className="col-md-6 col-sm-12">
          <Card>
            <Card.Header className="text-center">Form</Card.Header>
            <Card.Body>
              <MessagingForm handleSubmit={handleSubmit} />
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-6 col-sm-12">
          <Card>
            <Card.Header className="text-center">Message List</Card.Header>
            <Card.Body>
              <Card.Title>Inbox</Card.Title>
              <ListGroup>
                {groupingHandler({
                  messages: conversations,
                  filter: "inbox",
                })?.map((row) => (
                  <ListGroup.Item
                    action
                    key={row.timestamp}
                    onClick={() => {
                      setTitle("Inbox");

                      setOpen(true);
                      setCurrentData(
                        conversations.filter(
                          (message) => message.index === row.index
                        )
                      );
                      handleReadMessages(row, "inbox");
                    }}
                  >
                    <div className="row">
                      <div className="col-md-4">
                        {row.unreadMessages > 0 && (
                          <Badge pill variant="danger">
                            {row.unreadMessages}
                          </Badge>
                        )}{" "}
                        <strong>{row.name}</strong>
                      </div>
                      <div className="col-md-4">
                        <strong className="mr-5">{row.subject}</strong>
                      </div>
                      <div className="col-md-4">{row.message}</div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <br />
              <Card.Title>Outbox</Card.Title>
              <ListGroup>
                {groupingHandler({
                  messages: conversations,
                  filter: "outbox",
                })?.map((row) => (
                  <ListGroup.Item
                    action
                    key={row.timestamp}
                    onClick={() => {
                      setTitle("Outbox");
                      setOpen(true);
                      setCurrentData(
                        conversations.filter(
                          (message) => message.index === row.index
                        )
                      );
                      handleReadMessages(row, "outbox");
                    }}
                  >
                    <div className="row">
                      <div className="col-md-4">
                        {row.unreadMessages > 0 && (
                          <Badge pill variant="danger">
                            {row.unreadMessages}
                          </Badge>
                        )}{" "}
                        <strong>{row.name}</strong>
                      </div>
                      <div className="col-md-4">
                        <strong className="mr-5">{row.subject}</strong>
                      </div>
                      <div className="col-md-4">{row.message}</div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  );
};

export default App;
