import React, { useState, useEffect } from "react";

const WebSocketNotification = ({ authToken }) => {
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (authToken) {
      // Create WebSocket connection using the token
      const socketUrl = `wss://localhost:5000/ws?token=${authToken}`;
      const newSocket = new WebSocket(socketUrl);

      newSocket.onopen = () => {
        console.log("WebSocket connection established.");
      };

      newSocket.onmessage = (event) => {
        const message = event.data;
        console.log("Received message from server:", message);

        // Add new message to notifications array
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          message,
        ]);
      };

      newSocket.onclose = () => {
        console.log("WebSocket connection closed.");
      };

      // Store the socket object for cleanup
      setSocket(newSocket);

      // Cleanup WebSocket connection when the component is unmounted
      return () => {
        newSocket.close();
      };
    }
  }, [authToken]);

  const handleReadNotification = (index) => {
    setNotifications((prevNotifications) => {
      const newNotifications = [...prevNotifications];
      newNotifications[index] = `Read: ${newNotifications[index]}`;
      return newNotifications;
    });
  };

  return (
    <div>
      <h2>Transaction Notifications</h2>
      <div className="notifications-list">
        {notifications.length === 0 ? (
          <p>No notifications yet!</p>
        ) : (
          notifications.map((notification, index) => (
            <div key={index} className="notification">
              <p>{notification}</p>
              <button onClick={() => handleReadNotification(index)}>
                Mark as Read
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WebSocketNotification;
