// lib/requestController.js
let controllers = [];

export const addAbortController = (controller) => {
  controllers.push(controller);
};

export const abortAllRequests = () => {
  controllers.forEach((controller) => controller.abort());
  controllers = []; // Clear after aborting
};
