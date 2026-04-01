/**
 * Socket Event Utility
 * Central place to manage all Socket.io events
 */

const EVENTS = {
  TASK_ADDED: "taskAdded",
  TASK_UPDATED: "taskUpdated",
  TASK_DELETED: "taskDeleted",
  STATUS_UPDATED: "statusUpdated",
};

/**
 * Emit events to all connected clients
 * @param {object} io - Socket.io server instance
 * @param {string} eventName - Event name
 * @param {object} data - Payload to send
 */
const emitEvent = (io, eventName, data) => {
  if (io && typeof io.emit === "function") {
    io.emit(eventName, data);
  }
};

export { EVENTS, emitEvent };
