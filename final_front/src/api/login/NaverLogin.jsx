import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendNaverMember } from "../../axios/main/socialLogin";
const { naver } = window;
const NAVER_CLIENT_ID = "3fiEhnoQMSqSfg5o2LKi";
const NAVER_CALLBACK_URL = encodeURI(
  "http://localhost:3333/oauth/login/naver/callback"
);

const NaverLogin = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState();
  const [id, setId] = useState();
  const [name, setName] = useState();
  const [age, setAge] = useState();
  const [birthday, setBirthday] = useState();
  const [birthyear, setBirthyear] = useState();
  const [email, setEmail] = useState();
  const [gender, setGender] = useState();
  const [nickname, setNickname] = useState();
  const [profile_image, setImage] = useState();

  const initializeNaverLogin = () => {
    const naverLogin = new naver.LoginWithNaverId({
      clientId: NAVER_CLIENT_ID,
      callbackUrl: NAVER_CALLBACK_URL,
      isPopup: false,
      loginButton: { color: "green", type: 3, height: 50 },
      callbackHandle: true,
    });
    naverLogin.init();

    naverLogin.getLoginStatus(async function (status) {
      if (status) {
        setId(naverLogin.user.id);
        setName(naverLogin.user.name);
        setAge(naverLogin.user.age);
        setBirthday(naverLogin.user.birthday);
        setBirthyear(naverLogin.user.birthyear);
        setEmail(naverLogin.user.email);
        setGender(naverLogin.user.gender);
        setNickname(naverLogin.user.nickname);
        setImage(naverLogin.user.profile_image);

        setUser(naverLogin.user);
        console.log(naverLogin.user);
        await sendMemberData(naverLogin.user).then(console.log);
      }
    });
  };

  const userAccessToken = () => {
    window.location.href.includes("access_token") && getToken();
  };

  const getToken = () => {
    const token = window.location.href.split("=")[1].split("&")[0];
    window.localStorage.setItem("access_token", token);
    window.localStorage.setItem("login_domain", "naver");
    navigate("/");
  };

  const sendMemberData = async (user) => {
    const member = {
      id: user.id,
      name: user.name,
      age: user.age,
      birthday: user.birthday,
      birthyear: user.birthyear,
      email: user.email,
      gender: user.gender,
      nickname: user.nickname,
      profile_image: user.profile_image,
    };
    const result = await sendNaverMember(member);
    return result;
  };

  useEffect(() => {
    initializeNaverLogin();
    userAccessToken();
  }, []);

  return (
    <>
      <div className="loginbutton" id="naverIdLogin"></div>
    </>
  );
};

export default NaverLogin;
