package back.spring.final_back.board.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import back.spring.final_back.board.repository.CarpoolDto;
import back.spring.final_back.board.repository.TogetherDto;
import back.spring.final_back.board.service.CarpoolService;
import lombok.RequiredArgsConstructor;

@Controller
@ResponseBody
@CrossOrigin("http://localhost:3333")
@RequestMapping("/carpool")
@RequiredArgsConstructor
public class CarpoolController {
    Logger logger = LoggerFactory.getLogger(TogetherController.class);
    private final CarpoolService carpoolService;

    // carpool 게시판 조회(SelectAll)
    @GetMapping("/selectCarpool")
    public List<TogetherDto> selectCarpool() {
        logger.info("CarpoolController : selectCarpool 호출");
        List<TogetherDto> mList = null;
        mList = carpoolService.selectCarpool();
        return mList;
    }

    // 게시글 상세보기(SelectOne)
    @GetMapping("/carpoolDetail")
    public TogetherDto CarpoolDetail(CarpoolDto carpoolDto) {
        logger.info("BoardController : selectBoardDetail 호출");
        TogetherDto mList = carpoolService.CarpoolDetail(carpoolDto);
        return mList;
    }

    // 게시판 등록(Insert)
    @GetMapping("/insertCarpool")
    public int insertCarpool(CarpoolDto carpoolDto) {
        logger.info("CarpoolController : insertCarpool 호출");
        int result = carpoolService.insertCarpool(carpoolDto);
        return result;
    }

    // 게시판 삭제(Delete)
    @GetMapping("/deleteCarpool")
    public int deleteCarpool(CarpoolDto carpoolDto) {
        logger.info("RestMemberController : deleteCarpool 호출");
        int result = 0;
        result = carpoolService.deleteCarpool(carpoolDto);
        return result;
    }
}
