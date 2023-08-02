const classList = ["seven", "eight", "nine", "ten", "eleven"];

const requiredRoleId = "868526806972653609";
const sectionList = [
  "togor",
  "kadam",
  "palash",
  "shapla",
  "bokul",
  "sigma",
  "delta",
  "pi",
  "omega",
];

const houseList = ["bijoy", "sajek", "chimbuk", "keokradong"];

const bloodGroupList = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const POINTS_CONST = {
  ATTENDANCE: "ATTENDANCE",
  COMPLETE_TASK: "COMPLETE_TASK",
  EVENT_DUTY: "EVENT_DUTY",
  GIVE_REPORT: "GIVE_REPORT",
  DISCIPLINE_BREAK1: "DISCIPLINE_BREAK1",
  DISCIPLINE_BREAK2: "DISCIPLINE_BREAK2",
  DISCIPLINE_BREAK3: "DISCIPLINE_BREAK3",
};

const POINTS = {
  ATTENDANCE: 3,
  COMPLETE_TASK: 2,
  EVENT_DUTY: 4,
  GIVE_REPORT: 4,
  DISCIPLINE_BREAK1: -3,
  DISCIPLINE_BREAK2: -5,
  DISCIPLINE_BREAK3: -7,
};

module.exports = {
  classList,
  sectionList,
  houseList,
  bloodGroupList,
  POINTS,
  POINTS_CONST,
  requiredRoleId,
};
