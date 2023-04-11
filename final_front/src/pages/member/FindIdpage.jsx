import React from 'react'
import { useState } from 'react';
import { BButton, LoginForm, MyH1, MyInput, MyLabel, SubmitButton } from '../../styles/formStyle';

const FindIdPage = () => {
  const [memInfo, setMemInfo] = useState({
    name: "",
    mobile: "",
  });
  const changeMemInfo = (event) => {
    const id = event.currentTarget.id;
    const value = event.target.value;
    setMemInfo({...memInfo, [id]: value});
  }
  const find = async() => {
    const member = {
      member_name : memInfo.name,
      member_mobile : memInfo.mobile,
      type : 'email',
    }
  }
  return (
    <LoginForm>
    <MyH1>아이디 찾기</MyH1>
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center',Content: 'center', marginTop: '20px', width:"100%"}}>
      <MyLabel> 이름
        <MyInput type="text" id="name" placeholder="회원님의 이름을 입력해 주세요" 
        onChange={(e)=>{changeMemInfo(e);}}/>
      </MyLabel>
      <MyLabel> 전화번호
        <MyInput type="number" id="hp" placeholder="회원님의 전화번호를 입력해 주세요" 
        onChange={(e)=>{changeMemInfo(e);}} />
      </MyLabel>
      <BButton onClick={()=>{find();}}>찾기</BButton>
    </div>
  </LoginForm>
  )
}

export default FindIdPage