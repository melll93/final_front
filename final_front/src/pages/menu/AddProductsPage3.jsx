//상품등록 페이지 - 은영 - 수정중

import React, { useCallback, useEffect, useRef, useState, useInsertionEffect } from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { useNavigate, useParams } from "react-router";
import { FestivalInsertDB, FetivalDetailDB, festivalUpdateDB } from "../../axios/festival/festival";
import ImageUploader, { handleUpload } from "../../util/imageUploader";
import { Button } from "react-bootstrap";
import { BlackBtn } from "../../styles/formStyle";
import Swal from "sweetalert2";
import { Cookies } from "react-cookie";
import {festTicketInsertDB, deleteFestTicketDB } from '../../axios/festival/festival';
import { firebaseConfig } from "../board/carpool/CarpoolBoardList";
import firebase from "firebase/compat/app";
import { deleteFestPosterDB, festivalDetailUpdateDB, saveFestDetailDB, saveFestPsUrlDB } from '../../axios/festival/festival';
import "../../styles/festivaldetails.css";




/* ========================= 상품 자체 등록 ============================ */

const cookies = new Cookies();
const _userData = cookies.get("_userData"); //유저 정보

const AddProducts = () => {
  const navigate = useNavigate();
  const {festMId}=useParams();

 /*  fest_main  */
  const [festTitle, setFesttitle] = useState();
  const [festLocation, setFestloc] = useState();
  const [festCategory, setFestcate] = useState();
  const [festStartday, setFeststart] = useState();
  const [festEndday, setFestend] = useState();
  const [festArea, setFestArea] = useState();
  const [festImages, setFestImages] = useState();
  const [festImageUrl, setFestImageUrl] = useState();
  const imgRef = useRef();

  /*fest_poster  */
  const [festPsUrl, setFestPsUrl] = useState();
  const [festPsNo, setFestPsNo] = useState();

/* fest_detail */
  const [festDtCrew, setFestDtCrew] = useState();
  const [festDtCasting, setFestDtCasting] = useState();
  const [festDtRuntime, setFestDtRuntime] = useState();
  const [festDtAge, setFestDtAge] = useState();

  /* fest_ticket */
  const [festTcType, setFestTcType] =useState();
  const [festTcPrice, setFestTcPrice] =useState();
  const [festTcTime, setFestTcTime]= useState();
  const [festTcNo, setFestTcNo]= useState();


/* 클라우디너리 */

  const [selectedFile, setSelectedFile] = useState(null);
  const [cloudImg, setCloudImg] = useState();
  const handleFileInput = (e) => {
    setSelectedFile(e);
  };
  const handleUploadClick = (e) => {
    e.preventDefault();
    handleUpload(selectedFile, setCloudImg); // util > imageupload.js 의 handleUpload 로 넘기기
  };


  /* 클라우디너리 */



  /* 추가정보입력 띄우기 */
  const [optionModal, setOptionModal] = useState(0);
  const optionModalOpen = () => {if (optionModal === 0) {setOptionModal(1);
    } else {setOptionModal(0);}};



/* 상품등록 insert */
const festivalInsert = async () => {
  if (festTitle == null || festTitle === '' || festLocation == null ||  festLocation === '' ||  festCategory == null || festCategory === '' ||  festStartday == null  || festStartday === '' || 
    festEndday == null  || festEndday === '' ||   festArea == null  || festArea === '' ||   festImageUrl == null  || festImageUrl === ''  ) {  alert('빈칸 없이 작성해주세요. ');  } else {
    const festival = {
      festMAuthor:_userData.memberId,
      festMName: festTitle,
      festMLoc: festLocation,
      festMGenre: festCategory,
      festMStart: festStartday,
      festMEnd: festEndday,
      festMArea: festArea,
      festMImg: festImageUrl,   //festImageUrl(위에꺼),   cloudImg(아래꺼)  바꾸면 위에 널처리도
    };
    const res = await FestivalInsertDB(festival);
    festivalDetailUpdate();
    /* console.log(festival); */
    if (!res.data) {
  alert('error')
    } else {
      const confirmResult = window.confirm('추가상세정보를 지금 입력하시겠습니까?', festival.festMId);
      if (confirmResult) {//예
       optionModalOpen() 
      } else {  //아니오
    navigate('/festival'); 
      }
    }
  }
};


/* READ 입력되어있던 정보 가져오기 */  
useEffect(() => {
const originDetail=async()=>{
  const festival={
    festMId,
  }
  const res = await FetivalDetailDB(festival);
  const temp = JSON.stringify(res.data)  //문자열 전환
  const jsonDoc=JSON.parse(temp)  //배열로 접근처리
  setFesttitle(jsonDoc[0].festMName)
  setFeststart(jsonDoc[0].festMStart )
setFestend(jsonDoc[0].festMEnd)
setFestloc(jsonDoc[0].festMLoc)
setFestcate(jsonDoc[0].festMGenre)
setFestArea(jsonDoc[0].festMArea)
setFestImageUrl(jsonDoc[0].festMImg)

/* fest_detail 받아서 props로 넘기는중 */
setFestDtRuntime(jsonDoc[0].festDtRuntime)
setFestDtAge(jsonDoc[0].festDtAge)
setFestDtCasting(jsonDoc[0].festDtCasting)
setFestDtCrew(jsonDoc[0].festDtCrew)

/* fest_poster 받아서 props로 넘기는 중 */
const festPsUrlAll = jsonDoc.map(item => item.festPsUrl);
setFestPsUrl(festPsUrlAll);
const festPsNoAll = jsonDoc.map(item => item.festPsNo);
setFestPsNo(festPsNoAll);


/* fest_ticket 받아서 props로 넘기는 중 */
const festTcNoAll = jsonDoc.map(item => item.festTcNo);
setFestTcNo(festTcNoAll);
const festTcTypeAll = jsonDoc.map(item => item.festTcType);
setFestTcType(festTcTypeAll);
const festTcPriceAll = jsonDoc.map(item => item.festTcPrice);
setFestTcPrice(festTcPriceAll);
const festTcTimeAll = jsonDoc.map(item => item.festTcTime);
setFestTcTime(festTcTimeAll);
}
originDetail()
},[]);


/* UPDATE */
    const festivalUpdate = async() => {
      const festival={
      festMId,
      festMName: festTitle,
      festMLoc: festLocation,
      festMGenre: festCategory,
      festMStart: festStartday,
      festMEnd: festEndday,
      festMArea: festArea,
      festMImg: festImageUrl,
      }   
      try {
      const res = await festivalUpdateDB(festival)
/*         console.log(res.data); */
        navigate(`/productsDetail/${festMId}`)
        /* alert('상품수정완료') */
        Swal.fire({
          title:'상품 수정 완료',
          icon:'success'
          })
          
      } catch (error) {
        console.log(error);
      }
  };

  const inuptTitle = useCallback((e) => {
    setFesttitle(e);
  }, []);
  const inputLocation = useCallback((e) => {
    setFestloc(e);
  }, []);
  const inputCategory = useCallback((e) => {
    setFestcate(e);
  }, []);
  const inputStartday = useCallback((e) => {
    setFeststart(e);
  }, []);
  const inputEndday = useCallback((e) => {
    setFestend(e);
  }, []);
  const inputArea = useCallback((e) => {
    setFestArea(e);
  }, []);


  //선택파일 이미지로 교체
  const festImage = () => {
    const file = imgRef.current.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setFestImages(reader.result);
    };
  };

  //클라우디너리에 업로드 ( 리액트 )
  const FestImageUpload = (e) => {
    festImage();
    const { files } = document.querySelector("#festivalsImg");
    const imageFile = document.querySelector("#festivalsImg");
    const filesa = imageFile.files;
    console.log("Image file", filesa[0]);
    const formData = new FormData();
    setFestImageUrl(festImageUrl);
    formData.append("file", files[0]);
    formData.append("upload_preset", "dpa186u8"); // "본인 프리셋 업로드 네임"
    const options = {
      method: "POST",
      body: formData,
    };
    return (
      fetch("https://api.Cloudinary.com/v1_1/djxfvm2ev/image/upload", options)
        //"https://api.Cloudinary.com/v1_1/본인 클라우드 네임/image/upload"
        .then((res) => res.json())
        .then((res) => {
   /*        console.log(res.secure_url); */
          const festImageUrl = res.secure_url;
          localStorage.setItem("imageUrl", festImageUrl);
/*           console.log("페스트 이미지 유알엘 : " + festImageUrl); */
          setFestImageUrl(festImageUrl);
        })
        .catch((err) => console.log(err))
    );
  };
/* @@@@@@@@@@@@@@@festTcDetail@@@@@@@@@@@@@@@@@@@@@ */
/* @@@@@@@@@@@@@@@festTcDetail@@@@@@@@@@@@@@@@@@@@@ */
/* @@@@@@@@@@@@@@@festTcDetail@@@@@@@@@@@@@@@@@@@@@ *//* @@@@@@@@@@@@@@@festTcDetail@@@@@@@@@@@@@@@@@@@@@ */
/* @@@@@@@@@@@@@@@festTcDetail@@@@@@@@@@@@@@@@@@@@@ */

/*    console.log(festMId)  */
/*   console.log(festTcType); 
console.log(festTcTime); */
/* console.log(festPsNo); */
/* console.log(festOrginPsUrl); */
const[festDetailCasting, setFestDetailCasting] = useState(festDtCasting)
const[festDetailCrew, setFestDetailCrew] = useState(festDtCrew)
const[festDetailRuntime, setFestDetailRuntime] = useState(festDtRuntime)
const[festDetailAge, setFestDetailAge] = useState(festDtAge)

/* const[festPsUrl, setFestPsUrl] = useState() */
/* const imgRef = useRef() */



/* fest_detail INSERT */
const saveFestDetail=async()=>{
  const festival = {
    festMId,
    festDtCasting: festDetailCasting,
    festDtCrew: festDetailCrew,
    festDtRuntime: festDetailRuntime,
    festDtAge: festDetailAge,
};
try {
const res = await saveFestDetailDB(festival);
/*   console.log(festival); */
if (!res.data) {
} else {
}
} catch (error) {
/* alert('이미 등록된 정보가 있어 수정만 가능합니다.'); */
Swal.fire({
  title:'이미 등록된 정보가 있어 수정만 가능합니다.',
  icon:'warning'
})
}

};

/* fest_detail Update  */
const festivalDetailUpdate = async() => {
const festival={
  festMId,
  festDtCasting: festDetailCasting,
  festDtCrew: festDetailCrew,
  festDtRuntime: festDetailRuntime,
  festDtAge: festDetailAge
}
try {
const res = await festivalDetailUpdateDB(festival)
  Swal.fire({
    title:'상품 수정 완료',
    icon:'success'
  })
} catch (error) {
  console.log(error);
}
};





/* fest_poster */
const saveFestPoster=async()=>{
const festival = {
  festMId,
  festPsUrl,
};
try {
  const res = await saveFestPsUrlDB(festival);
  const newPsPoster = [...festPsUrl,festival.festPsUrl]
  setFestPsUrl(newPsPoster)
  /* console.log(festival); */
alert('추가완료')
if (!res.data) {
} else {
}    
} catch (error) {
}
};




    /* fest_detail 추가정보 입력 */
    const inputCasting = useCallback((e) => {
      setFestDetailCasting (e)
    },[])
    const inputCrew= useCallback((e) => {
      setFestDetailCrew (e)
    },[])
    const inputRuntime= useCallback((e) => {
      setFestDetailRuntime (e)
    },[])
    const inputAge= useCallback((e) => {
      setFestDetailAge (e)
    },[])
    
    


const deleteFestPsUrl = async ({i}) => {
const festival = {
  fest_ps_no: festPsNo[i],
};
const res = await deleteFestPosterDB(festival);
if (!res.data) {
  const updatedFestPsUrl = festPsUrl.filter((item, index) => index !== i);
  setFestPsUrl(updatedFestPsUrl);
} else {
  alert("에러")
}
};




//클라우디너리에 업로드
/* const FestImageUpload = (e) => {
const { files } = document.querySelector("#festivalPoster");
const imageFile = document.querySelector("#festivalPoster");
  const filesa = imageFile.files;
  console.log("Image file", filesa[0]);
  const formData = new FormData();
  setFestPsUrl(festPsUrl);
  formData.append("file", files[0]);
  formData.append("upload_preset", "dpa186u8"); // "본인 프리셋 업로드 네임"
  const options = {
    method: "POST",
    body: formData,
  };
  return (
    fetch("https://api.Cloudinary.com/v1_1/djxfvm2ev/image/upload", options)
    //"https://api.Cloudinary.com/v1_1/본인 클라우드 네임/image/upload"
    .then((res) => res.json())
    .then((res) => {
      console.log(res.secure_url);
      const festPsUrl = res.secure_url;
        localStorage.setItem("imageUrl", festPsUrl);
        console.log("페스트 이미지 유알엘 : " + festPsUrl);
        setFestPsUrl(festPsUrl);
        
        
      })
      .catch((err) => console.log(err))
      );
    }; */





/* @@@@@@@@@@@@@@@festTcDetail@@@@@@@@@@@@@@@@@@@@@ *//* @@@@@@@@@@@@@@@festTcDetail@@@@@@@@@@@@@@@@@@@@@ */
/* @@@@@@@@@@@@@@@festTcDetail@@@@@@@@@@@@@@@@@@@@@ */
/* @@@@@@@@@@@@@@@festTcDetail@@@@@@@@@@@@@@@@@@@@@ *//* @@@@@@@@@@@@@@@festTcDetail@@@@@@@@@@@@@@@@@@@@@ */
/* @@@@@@@@@@@@@@@festTcDetail@@@@@@@@@@@@@@@@@@@@@ */





/* @@@@@@@@@@@@@@@festTcDetail@@@@@@@@@@@@@@@@@@@@@ *//* @@@@@@@@@@@@@@@festTcDetail@@@@@@@@@@@@@@@@@@@@@ */
/* @@@@@@@@@@@@@@@festTcDetail@@@@@@@@@@@@@@@@@@@@@ */
/* @@@@@@@@@@@@@@@festTcDetail@@@@@@@@@@@@@@@@@@@@@ *//* @@@@@@@@@@@@@@@festTcDetail@@@@@@@@@@@@@@@@@@@@@ */
/* @@@@@@@@@@@@@@@festTcDetail@@@@@@@@@@@@@@@@@@@@@ */
/* @@@@@@@@@@@@@@@festTcDetail@@@@@@@@@@@@@@@@@@@@@ */
/* @@@@@@@@@@@@@@@festTcDetail@@@@@@@@@@@@@@@@@@@@@ */
/* @@@@@@@@@@@@@@@festTcDetail@@@@@@@@@@@@@@@@@@@@@ */
/* @@@@@@@@@@@@@@@festTcDetail@@@@@@@@@@@@@@@@@@@@@ */
const [dbTickets, setDbTickets] = useState(
  festTcType && festTcType
    .filter((_, index) => festTcType[index] !== null) // null인 요소 필터링
    .map((_, index) => ({
      no: festTcNo[index], // 좌석 정보의 개수
      seatType: festTcType[index], // 티켓의 좌석 유형
      price: festTcPrice[index], // 티켓의 가격
      time: festTcTime[index] // 티켓의 시간 정보
    }))
);



 const [tickets, setTickets] = useState([
   {
     no: "", // 좌석 정보의 개수
     seatType: "", // 티켓의 좌석 유형
     price: "", // 티켓의 가격
     time: "", // 티켓의 시간 정보
     seat:'',  //fb넣을 총좌석수 
   },
 ]);
   

/*(신규입력용) 좌석추가 버튼 누를때 로우 추가  */
 const addTicket = () => {
   const newTicket = {
     no:'', // 좌석 정보의 개수
     seatType:'', // 티켓의 좌석 유형
     price:'', // 티켓의 가격
     time: '', // 티켓의 시간 정보
     seat:'',
   };
   setTickets(prevTickets => [...prevTickets, newTicket]);
 }

/* (신규입력용) 로우 삭제  */
 const removeTicket = (index) => {
   setTickets(prevTickets => prevTickets.filter((_, i) => i !== index));
 }




/* 티켓 로우 삭제 */
const deleteFestTcRow = async (festTcNo, index) => { // 매개변수 수정
 console.log(festTcNo)
 const festival = {
   fest_tc_no: festTcNo
 }
 const res = await deleteFestTicketDB(festival);
 if (!res.data) {
   // 삭제 성공 시 처리할 로직

setDbTickets(prevTickets => prevTickets.filter((_, i) => i !== index));
 } else {
   alert("에러")
 }
};



/* fest_tc */
const inputTcPrice = (index, price) => {
 setTickets(prevTickets => {
   const updatedTickets = [...prevTickets];
   updatedTickets[index].price = price;
   return updatedTickets;
 });
}

const inputTcSeatType = (index, seatType) => {
 setTickets(prevTickets => {
   const updatedTickets = [...prevTickets];
   updatedTickets[index].seatType = seatType;
   return updatedTickets;
 });
}

const inputTcTime = (index, time) => {
 setTickets(prevTickets => {
   const updatedTickets = [...prevTickets];
   updatedTickets[index].time = time;
   return updatedTickets;
 });
}

const inputFbSeat = (index, seat) => {
 setTickets(prevTickets => {
   const updatedTickets = [...prevTickets];
   updatedTickets[index].seat = seat;
   return updatedTickets;
 });
}




const festTicketInsert = async () => {
 for (const ticket of tickets) {
   if (ticket.seatType === '' || ticket.price === ''|| ticket.time === '' || ticket.seat === '') {
     alert('빈칸이 존재합니다. 확인해주세요. ');
   } else {
     const res = await festTicketInsertDB({  
       festMId,
       festTcType: ticket.seatType,
       festTcPrice: ticket.price,
       festTcTime: ticket.time,
     });    
     if (!res.data) {
       alert('error');
     } 
     else {
       /* 성공 */
       alert('저장완료');
       const newTickets=[];
       setTickets(newTickets);
       const updatedDbTickets = [...dbTickets, ...tickets]; 
       setDbTickets(updatedDbTickets); 
     }
   }
 } /* for */
 insertData(tickets);
}; /* festTicketInsert */







/* fireBase  */

/* 초기화 */
const[festMData, setFestMData]=useState(null);

useEffect(() => {
 firebase.initializeApp(firebaseConfig);
 const database = firebase.database();
 database.ref().on("value", (snapshot) => {
   setFestMData(festMData);
 });
 return () => {
   database.ref().off();
 };
}, []); 

/* FireBase Insert */


const insertData = (tickets) => {
 for (const ticket of tickets) {
   if (ticket.seatType === '' || ticket.price === ''|| ticket.time === '' || ticket.seat === '') {
     alert('빈칸이 존재합니다. 확인해주세요. ');
   } else{
     const data = {
       [ticket.time+'-'+ticket.seatType]:{
         price: ticket.price,
         seatAvailable: ticket.seat,
         seatTotal: ticket.seat,
         time:ticket.time,
         type:ticket.seatType
       }
   }

 firebase.database().ref(`FestMId/${festMId}`).update(data)  //ref에 원하는 경로 적으면 됨. 안해놔서 비워둠
   .then(() => {
     console.log("데이터가 성공적으로 삽입되었습니다.");
   })
   .catch((error) => {
     console.error("데이터 삽입 중 오류가 발생하였습니다.", error);
   });
}};
}
/* @@@@@@@@@@@@@@@festTcDetail@@@@@@@@@@@@@@@@@@@@@ */
/* @@@@@@@@@@@@@@@festTcDetail@@@@@@@@@@@@@@@@@@@@@ *//* @@@@@@@@@@@@@@@festTcDetail@@@@@@@@@@@@@@@@@@@@@ */
/* @@@@@@@@@@@@@@@festTcDetail@@@@@@@@@@@@@@@@@@@@@ *//* @@@@@@@@@@@@@@@festTcDetail@@@@@@@@@@@@@@@@@@@@@ */
/* @@@@@@@@@@@@@@@festTcDetail@@@@@@@@@@@@@@@@@@@@@ */



  return (
    <>
      <div
        className="addproductstotalDiv"
        style={{ textAlign: "center", width: "900px", marginLeft: "25%" }}
      >
        <br /> {/* //등록 div 시작 */}
        <select
          defaultValue="1"
          className="form-select"
          id="fest_category"
          aria-label="Default select example"
          style={{ width: "150px" }}
          value={festCategory}
          onChange={(e) => {
            inputCategory(e.target.value);
          }}
        >
          <option value="1" disabled>
            카테고리
          </option>
          <option value="FESTIVAL">FESTIVAL</option>
          <option value="CONCERT">CONCERT</option>
        </select>
        <br />
        <h2>상품 자체 등록</h2>
        <div id="uploadImg">
          <img
            id="festivalImgChange"
            className="thumbNail"
            style={{width:'60%'}}
              src={festImageUrl ? festImageUrl : "https://via.placeholder.com/400x300/D9D9D9/979892.png?text=image+upload"}
              alt="Festival Image"
   /*            festImages
                ? festImages
                : `https://via.placeholder.com/400x300/D9D9D9/979892.png?text=image+upload` */
           /*  }
            alt="미리보기" */
          />
          {/* - 가로x세로/배경색/글자색.확장자?text=텍스트(공백은+로) */}
        </div>
        <br />
        <input
          className="form-control"
          type="file"
          accept="image/*"
          id="festivalsImg"
          onChange={FestImageUpload}
          ref={imgRef}
        />{" "}
        <br />





        
{/* 클라우드 Test */}

{/* <div className="cloudinary_image">
<input
          className="form-control"
          type="file"
          accept="image/*"
          id="festivalsImg"
          onChange={(e) => {handleFileInput(e.target.files[0])}}
        />  <BlackBtn onClick={handleUploadClick}>클라우디너리 파일 저장</BlackBtn>

        {cloudImg && <img src={cloudImg} alt="uploaded image" />}
      </div> */}

{/* 클라우드 Test */}






        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="festTitle"
          defaultValue={festTitle}
            onChange={(e) => {
              inuptTitle(e.target.value);
            }}
          />
          <label htmlFor="floatingInput"> festTitle </label>
        </div>
        <select
          className="form-select"
          id="festArea"
          aria-label="Default select example"
          style={{ width: "150px" }}
          value={festArea==null? '': festArea}
          onChange={(e) => {
            inputArea(e.target.value);
          }}
        >
          <option disabled value="">
            지역
          </option>
          <option value="서울">서울</option>
          <option value="경기/인천">경기/인천</option>
          <option value="충청/강원">충청/강원</option>
          <option value="대구/경북">대구/경북</option>
          <option value="부산/경남">부산/경남</option>
          <option value="광주/전라">광주/전라</option>
          <option value="제주">제주</option>
        </select>
        <br />
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            id="festLocation"
            defaultValue={festLocation}
            onChange={(e) => {
              inputLocation(e.target.value);
            }}
          />
          <label htmlFor="floatingInput">location</label>
        </div>
        <br />
        <div className="form-floating mb-3">
          <input
            type="date"
            className="form-control"
            id="festStartday"
            name="startDay"
            defaultValue={festStartday}
            onChange={(e) => {
              inputStartday(e.target.value);
            }}
          />
          <label htmlFor="floatingInput"> 행사시작일</label>
        </div>


        <div className="form-floating mb-3">
          <input
            type="date"
            className="form-control"
            id="festEndday"
            name="startDay"
            defaultValue={festEndday}
            onChange={(e) => {
              inputEndday(e.target.value);
            }}
          />
          <label htmlFor="floatingInput"> 행사종료일</label>
        </div>
        <br />


{/* @@@@@@@@@@@@@@@@@@@@@@@@ 테스트 @@@@@@@@@@@@@@@@@@@@@@@@*/}


<table className="table-seats"><thead>
          <tr>
          <th colSpan={6}><input type="checkbox" name="color" value="blue" style={{width:'50px'}} />추가 정보 입력  
          </th></tr></thead>
        <tbody>
            <tr><td colSpan={6}>
            <div className="form-floating">
  <input type="text" className="form-control" defaultValue={festDtCasting}  id="festDetailCasting" style={{border:'none'}}/>
  <label htmlFor="floatingInput">캐스팅정보</label></div>
              </td></tr>
              <tr><td colSpan={6}>
            <div className="form-floating">
  <input type="text" className="form-control" defaultValue={festDtCrew}  id="festDetailCasting" style={{border:'none'}}/>
  <label htmlFor="floatingInput">제작진정보</label></div>
              </td></tr>
              <tr><td colSpan={3}>
              <div className="form-floating">
              <input type="text" className="form-control" style={{border:'none'}}  defaultValue={festDtRuntime}/>
              <label htmlFor="floatingInput">runtime</label></div>
              </td><td colSpan={3}>
              <div className="form-floating">
              <input type="text" className="form-control" style={{border:'none'}} defaultValue={festDtAge}/>
              <label htmlFor="floatingInput">관람등급</label></div>
              </td></tr>
              <tr><td style={{textAlign:'left', color:'gray'}} colSpan={6}>
                <p style={{paddingLeft:'13px', fontSize:'12px'}}>상품 상세보기_포스터 이미지 추가</p>
                <div style ={{display:'flex'}}>
            <input
          className="form-control"
          style={{width:'85%'}}
          type="file"
          accept="image/*"
          id="festivalPoster"
          onChange={FestImageUpload}
          ref={imgRef} 
          />
          <BlackBtn height='38px'>선택파일 저장</BlackBtn>
          </div></td></tr>
        </tbody>
      </table>




{/* @@@@@@@@@@@@@@@@@@@@@@@@ 테스트 @@@@@@@@@@@@@@@@@@@@@@@@*/}


<div>
    <h1 style={{borderBottom:'1px solid lightgray', marginTop:'30px', color:'darkgray'}}>
fest_ticket 추가 정보 입력  
<p style={{fontSize:'15px'}}>(상품 등록 후, 가능합니다.)</p>
    </h1>

    <div className="input-group">
        <div className="form-floating" style={{ flex: '1' }}>
          <input
            type="number"
            className="form-control"
            disabled
          defaultValue={dbTickets&&dbTickets.length} 
            style={{ width: '100%' }}btn
          />
          <label htmlFor="floatingInput">좌석정보</label>
        </div>
        <button type="button" className="btn-add-seat" onClick={addTicket}>
          좌석 추가
        </button>
        <button type="submit" className="btn-save" onClick={festTicketInsert}>
          저장
        </button>
      </div>  


{/* DB 에 이미 있는 티켓정보 */}
    <table className="table-seats"><thead>
          <tr>
          <th>no</th><th>시간    {/* fest_schedule  (fest_sc_time) */}
          </th><th>좌석정보  {/* fest_ticket   (fest_tc_type) */}
          </th><th>티켓가격  {/* fest_ticket   (fest_tc_price) */}
          </th><th style={{width:'120px'}}>총좌석수   
          </th><th style={{width:'60px'}} >삭제</th>
          </tr>
        </thead>
        <tbody>
        {dbTickets&&dbTickets.map((ticket, index) => (
            <tr key={index}><td>
                  {index+1}
              </td><td>
              <span>{ticket.time}
                </span>
              </td><td>
             <span>
              {ticket.seatType}
              </span>
              </td><td>
                <div>
                {ticket.price}   원
                </div>
              </td><td>
              <div>
                {/* {festMData.[{ticket.time}].seat}
                 */}???석</div>
              </td><td>
                <button type="button" className="btn-delete" onClick={() => deleteFestTcRow(ticket.no, index)}>
                  삭제 
                </button>
              </td></tr>
          ))}
        </tbody>
      </table><br/> <br/>



{/*  티켓 추가 입력 칸  */}
      <table className="table-seats"><thead>
          <tr>
          <th>no</th><th>시간    {/* fest_schedule  (fest_sc_time) */}
          </th><th>좌석정보  {/* fest_ticket   (fest_tc_type) */}
          </th><th>티켓가격  {/* fest_ticket   (fest_tc_price) */}
          </th><th style={{width:'120px'}}>총좌석수   {/* 리얼타임dv 예정 fest_seats   (fest_tc_total) */}
          </th><th style={{width:'60px'}}>삭제</th>
          </tr>
        </thead>
        <tbody>
        {tickets&&tickets.map((ticket, index) => (
            <tr key={index}><td>  {dbTickets ? index + 1 + dbTickets.length : index + 1}
              </td><td>
              <input
                  type="text"
                  className="form-control"
                  onChange={(e) => {
                      inputTcTime(index, e.target.value);
                  }}
                />
              </td><td>
                <input
                  type="text"
                  className="form-control"
                  onChange={(e) => {
                      inputTcSeatType(index, e.target.value);
                  }}
                />
              </td><td>
                <input
                  type="number"
                  className="form-control"
                  onChange={(e) => {
                          inputTcPrice(index, e.target.value);
                  }}
                style={{display:'inline-block', width:'80%'}}
                />원
              </td><td>
              <input
                  type="number"
                  className="form-control"
                style={{display:'inline-block', width:'75%'}}
                              onChange={(e) => {
                          inputFbSeat(index, e.target.value);}}
                />{festMData}석
              </td><td>
                <button type="button" className="btn-delete" onClick={() => removeTicket(index)}>
                  삭제
                </button>
              </td></tr>
          ))}
        </tbody>
      </table>
      <div style={{textAlign:'left', paddingLeft:'20px'}}>
      </div>

    </div>







{/* @@@@@@@@@@@@@@@@@@@@@@@@ 테스트 @@@@@@@@@@@@@@@@@@@@@@@@*/}




        <br />
        <br />
        <BlackBtn
          onClick={() => {
            navigate(-1);
          }}
        >
          취소
        </BlackBtn>
        &nbsp;
        {festMId==='new'? <BlackBtn onClick={festivalInsert}>상품등록하기</BlackBtn> : <BlackBtn onClick={festivalUpdate}>상품수정완료</BlackBtn>}
      </div>
      {/* //등록 div 끝 */}
    </>
  );
};
/* ========================= 상품등록  끝 ============================ */

const AddProductsPage = () => {
  return (
    <>
        <Header />
      <Sidebar />
      <div className="center">
        <AddProducts />
      
      </div>
    </>
  );
};

export default AddProductsPage;
