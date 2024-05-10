import GroupsDisplay from "../Groups/GroupsDisplay";
import UserHeader from "../Headers/UserHeader";

const ChatLeftContainer = () => {
  

  return (
    // <div className="conversation-list">
    //   <h2>Groups</h2>
    //   <ul>
    //     {groups.map((group) => (
    //       <GroupDetails
    //         key={group.id}
    //         group={group}
    //         onGroupClick={onGroupClick}
    //       />
    //     ))}
    //   </ul>
    // </div>

    <section className="w-1/4 bg-white border-r-2">
      {/* User Header */}
      <UserHeader/>
      <GroupsDisplay/>
    </section>
  );
};

export default ChatLeftContainer;
