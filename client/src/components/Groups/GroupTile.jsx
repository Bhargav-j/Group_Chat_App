import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { formatDateTime } from "../Chat/MessageTime";

const GroupTile = ({ eachGroup, lastSinglemessages }) => {
  const [lastMessage, setLastMessage] = useState("Start Conversation...");
  const [lastTime, setLastTime] = useState("");

  useEffect(() => {
    if (lastSinglemessages[eachGroup._id]) {
      const message = lastSinglemessages[eachGroup._id];
      setLastMessage(message.content);
      setLastTime(message.createdAt);
    }
  }, [lastSinglemessages, eachGroup]);

  return (
    <div className="flex py-2 ">
      {/* Group Image */}
      <div className="flex items-center justify-between">
        <div className="w-8 h-8 rounded-full mr-2 bg-orange-300 font-bold flex items-center justify-center">
          {eachGroup.name.toUpperCase().slice(0, 2)}
        </div>
        {/* <img
                    src={avatar}
                    alt="User 1"
                    className="w-8 h-8 rounded-full mr-2"
                  /> */}
      </div>
      {/* Group Details */}
      <div className="w-full pl-4 overflow-hidden">
        <div className="flex items-baseline justify-between">
          <div className="flex flex-1 overflow-hidden">
            <span className="font-semibold truncate">{eachGroup.name}</span>
          </div>
          <div className="flex flex-1 justify-evenly items-baseline">
            <span className="text-xs font-semibold text-green-400">
              {eachGroup.isAdmin ? "Admin" : ""}
            </span>
            {lastTime && (
              <span className="text-gray-500 text-xs">
                {formatDateTime(lastTime)}
              </span>
            )}
          </div>
        </div>
        <p className="text-gray-600 truncate">{lastMessage}</p>
        {/* <p className="text-gray-600 truncate">Hey, how's it going?</p> */}
      </div>
    </div>
  );
};

// export default GroupTile;

GroupTile.propTypes = {
  eachGroup: PropTypes.shape({
    name: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
    isAdmin: PropTypes.bool.isRequired,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  lastSinglemessages: state.messages.messages.latest,
});

// Connect your component to Redux and export it with a name
const ConnectedGroupTile = connect(mapStateToProps)(GroupTile);
export default ConnectedGroupTile;
