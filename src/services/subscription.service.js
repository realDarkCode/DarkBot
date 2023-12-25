const Subscription = require("../schemas/subscription.schema");

const updateOne = ({ userId, userName, serviceName, isActive }) => {
  return Subscription.updateOne(
    {
      userId,
      serviceName,
    },
    {
      serviceName,
      userId,
      userName,
      isActive,
    },
    {
      upsert: true,
      new: true,
    }
  );
};

const find = (queries) => {
  return Subscription.find({ ...queries });
};

const searchOne = (queries) => {
  return Subscription.findOne({ ...queries });
};

const subscribe = async ({ userId, serviceName, userName }) => {
  return await updateOne({ userId, serviceName, userName, isActive: true });
};

const unSubscribe = async ({ userId, userName, serviceName }) => {
  return await updateOne({ userId, userName, serviceName, isActive: false });
};

const getUserSubscriptionList = (userId) => {
  return find({ userId });
};

module.exports = { subscribe, unSubscribe, getUserSubscriptionList, searchOne };
