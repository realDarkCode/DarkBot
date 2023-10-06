const Notify = require("../../schemas/notify.schema");

const getNotificationToSend = async () => {
  const toNotifies = await Notify.find({
    hasSend: false,
    time: { $lte: new Date() },
  });

  const notifies = toNotifies.map((notify) => {
    return notify.toObject();
  });

  return notifies;
};
const updateNotifyStatusToTrue = async (ids) => {
  return await Notify.updateMany({ _id: { $in: ids } }, { hasSend: true });
};

const createNotification = async ({
  userID,
  userTag,
  recipientID,
  message,
  image,
  time,
}) => {
  if (time < new Date()) {
    throw new Error("Time must be in the future");
  }
  const notify = new Notify({
    userID,
    userTag,
    recipientID,
    message,
    image,
    time,
  });

  return await notify.save();
};

module.exports = {
  getNotificationToSend,
  updateNotifyStatusToTrue,
  createNotification,
};
