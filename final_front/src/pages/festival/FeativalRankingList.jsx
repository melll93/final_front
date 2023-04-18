import React, { useEffect, useState } from "react";
import {
  festivalHitListDB,
} from "../../axios/festival/festival";
import CommonPagination from "../../components/CommonPagination";
import { Card } from "react-bootstrap";

///////////////////////////////      페스티발 지역별   >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const FestivalRankingList = () => {
  const [festivalHitList, setFestivalHitList] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  const indexOfLastPost = page * perPage;
  const indexOfFirstPost = indexOfLastPost - perPage;
    useEffect(() => {
      const festivalHitList = async () => {
        const festMHit = true; // festHit 변수에 true 값을 할당하여 HIT가 높은 순으로 데이터를 가져옴
        const result = await festivalHitListDB(festMHit); // FestivalHitListDB 함수를 호출하여 데이터를 가져옴
        setFestivalHitList(result); // 가져온 데이터를 상태값에 할당
      };
      festivalHitList(); // 데이터 가져오기
      console.log(festivalHitList);
    }, []);
    
    
  
    const currentFest = (festivalHitList) => {
      let currentFest = 0;
      currentFest = festivalHitList.slice(indexOfFirstPost, indexOfLastPost);
      return currentFest;
    };
    
    
    
    
    
    
    
    return (
  <>

  {currentFest(festivalHitList).map((festival, i) => (
     
    
     <div
     key={festival.festMId}
     className="card "
     style={{
      width: "18rem", 
       display: "inline-block",
       margin: "50px 0px 0px 50px",
     }}
   >
     <a
       style={{ textDecoration: "none", color: "black" }}
       href={"/productsDetail/" + festival.festMId}
     >
       <img src={festival.festMImg} style={{width:"100%", overflow:'hidden', height:'400px'}} alt="사진1" />
       <div className="card-body" style={{overflow:'hidden', height:'220px'}} >
         <h5 className="card-title">제목 : {festival.festMName}</h5>
         <p className="card-text">로케 : {festival.festMLoc}</p>
         <p className="card-text">
           {festival.festMStart} ~ {festival.festMEnd}
         </p>
     {/*     <p className="card-text"> festId: {festival.festMId} </p> */}
         <p className="card-text">
           festCategory: {festival.festMGenre}
         </p>
       </div>
     </a>
   </div>
    ))}
 
 <CommonPagination
          pagination={setPage}
          perPage={perPage}
          totalItems={festivalHitList.length}
        />
  </>
    );
  };
  

export default FestivalRankingList;