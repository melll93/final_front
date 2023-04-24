import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import TicketCancleInfo from "../../components/mypage/TicketCancleInfo";
import Sidebar from "../../components/Sidebar";
import { wishlistDelDB, wishlistDetailDB, wishlistSelectDB } from "../../axios/payment/wishlistLogic";
import { Cookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { MButton } from "../../styles/formStyle";
import Swal from "sweetalert2";
import { mk_minusLikesDB } from "../../axios/board/market/marketLogic";

const cookies = new Cookies();


const CartPage = () => {


   //회원 정보
   const _userData = cookies.get("_userData"); 
   /* console.log(_userData) */
   let member_no;
   if (_userData) {
     member_no = _userData.memberNo; //쿠키에서 가져온 회원번호 (내정보)
   }
 
   

   const [cartlist , setCartlist] = useState([])
   const cartlistLength = cartlist.length; //찜한 상품 갯수

  useEffect(()=>{
    const memberWdata = async() => {
      console.log(member_no)
      const wData = {
        memberNo : member_no
      }
      const res = await wishlistSelectDB(wData)
      console.log(res.data)
      setCartlist(res.data)
    }
    memberWdata()
    console.log(cartlist)
    },[])

    const navigate = useNavigate()



    //상세페이지 이동
    const linkToDetail = () => {
       navigate(`/market/mk_boardDetail?no=${cartlist.boardMkNo}`)
       
     }

 //체크박스 선택삭제|전체삭제 관리
     const [checkedList, setCheckedList] = useState([]); //체크된 상품 담아줌

     const handleCheckboxChange = (e, id) => {
      console.log(id)
      const isChecked = e.target.checked;
      setCheckedList(prevCheckedList => {
        if (isChecked) {
          // 체크박스가 선택된 경우, 이전 상태(prevCheckedList)를 기반으로 새로운 상태를 반환합니다.
          return [...prevCheckedList, id];
        } else {
          // 체크박스가 해제된 경우, 이전 상태(prevCheckedList)를 기반으로 새로운 상태를 반환합니다.
          return prevCheckedList.filter((item) => item !== id);
        }
      });
    };


    const handleDeleteAll = async () => { //전체삭제
      Swal.fire({
        title: '찜한 상품을 모두 삭제하시겠습니까?',
        icon: 'warning',
        showCancelButton: true,
      }).then(async (result) => { // async 키워드를 추가
        if (result.isConfirmed) {
          console.log('checkedList:', checkedList);
          console.log('cartlist:', cartlist);
          const wData = cartlist.map(item => item.boardMkNo)
          console.log(wData)
          const res = await wishlistDelDB(wData);
          console.log(res.data);
         
          const mkminusLikes = async() => {  //게시글 찜 갯수 감소
            console.log(cartlist)
            const board = cartlist.map(item => item.boardMkNo)
            console.log(board)
            const res = await mk_minusLikesDB(board)
            console.log(res.data);
           }
          Swal.fire('삭제가 완료되었습니다!', '', 'success');
        mkminusLikes()
        setCartlist([])
        setCheckedList([])
        }
      });
    };


    const handleDeleteSelected = async () => {
      Swal.fire({
        title: '선택한 상품을 삭제하시겠습니까?',
        icon: 'warning',
        showCancelButton: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          console.log('checkedList:', checkedList);
          console.log('cartlist:', cartlist);
          const wData = {
            boardMkNo: checkedList[0],
          };
          const res = await wishlistDelDB(wData);
          console.log(res.data);
          const mkminusLikes = async() => {  //게시글 찜 갯수 감소
            const board={
              boardMkNo : checkedList[0],
            }
            console.log(board)
            const res = await mk_minusLikesDB(board)
            console.log(res.data);
           }
           Swal.fire('삭제가 완료되었습니다!', '', 'success');
           const newCartList = cartlist.filter(
             (cart) => !checkedList.includes(cart.boardMkNo)
             );
          mkminusLikes()
          setCartlist(newCartList);
          setCheckedList([]);
        }
      });
    };

  return (
    <>
      <Header />
      <Sidebar />
      
      <div className="center">

        <section className="cart_main_section">
          <div className="main_left_div"></div> {/* main_left_div */}
          <div className="main_center_div">
            <h1 className="top_line" style={{fontFamily:'Nanum-Gothic', fontWeight:'bold'}}><i class="bi bi-cart-check"></i>{" "}찜한 상품
            {" "}<span style={{ color: 'red' }}>{cartlistLength}</span></h1>
            <div className="cart_table_div">
              <div style={{marginLeft:'50px'}}>
                <MButton onClick={handleDeleteAll}>전체삭제</MButton>{" "}<MButton onClick={handleDeleteSelected}>선택삭제</MButton>
              </div>
            {cartlist.map(cart => (
    <div className="card"
      key={cart.boardMkNo}
      style={{
        width:"16rem",
        display:"inline-block",
        margin: "50px 50px 0px 50px",
        borderRadius: "10px",
        cursor: "pointer",
      }}
    >
      <img src={cart.wishlistFileurl} style={{width:"100%", overflow:'hidden', height: '250px', objectFit: 'cover' , 
      borderTopLeftRadius:'10px',borderTopRightRadius:'10px',borderBottomLeftRadius:'0px',borderBottomRightRadius:'0px'}} 
      onClick={linkToDetail}
      alt="사진1"/>
      <div className="card-body" style={{overflow:"hidden", height:'120px'}}>
        <div style={{minHeight:'50px' , marginTop:'5px'}} onClick={linkToDetail}>
          <h5 className="card-title" style={{fontFamily:"Nanum Gothic", fontWeight:"bold" ,fontSize:'1rem'}}>
            {cart.wishlistTitle}</h5>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p className="card-text" style={{fontFamily:"Nanum Gothic", fontWeight:"bold" , fontSize: "1.5rem" }}>{cart.wishlistPrice}원</p>
          <input
  type="checkbox"
  style={{width:'25px' , marginBottom:'10px'}}
  checked={checkedList.indexOf(cart.boardMkNo) !== -1}
  onChange={(e) => handleCheckboxChange(e, cart.boardMkNo)}
/>
        </div>
      </div>
    </div>
  ))}
            </div>

          </div>{" "}
          {/* main_center_div */}
        </section>
      </div>
    </>
  );
};

export default CartPage;
