import React from "react";
import { Dropdown } from "react-bootstrap";
import { Cookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
const cookies = new Cookies();

const UserProfile = (_userData) => {
  const navigate = useNavigate();
  const _myData = cookies.get("_userData");

  const myId = _myData && _myData.memberId;
  const friendId = _userData.memberId;

  const handleChatFromProfile = (myId, friendId) => {
    console.log(myId);
    console.log(friendId);
    navigate("/chat");
  };

  return (
    <div className="userImage">
      <Dropdown>
        <Dropdown.Toggle
          variant="none"
          id="profile-dropdown"
          style={{ border: "none" }}
        >
          <img
            id="profile"
            className="icon image40"
            style={{ borderRadius: "50%" }}
            // src="https://phinf.pstatic.net/contact/20230416_257/1681630347916iq32w_PNG/avatar_profile.png?type=s160"
            src={
              _userData &&
              (_userData.memberProfileImage ?? "../logos/PROFILE.png")
            }
          />
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdown items">
          <Dropdown.Item
            onClick={(e) => {
              handleChatFromProfile(myId, friendId);
            }}
          >
            1:1 채팅
          </Dropdown.Item>
          <Dropdown.Item>프로필</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default UserProfile;
