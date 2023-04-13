package back.spring.final_back.festival.service;

import java.sql.Date;
import java.util.List;

import back.spring.final_back.festival.repository.FestivalDto;

public interface FestivalService {


  List<FestivalDto> festivalListByDate(Date date);

  List<FestivalDto> festivalList();

  List<FestivalDto> areaFestivalList();

  int festivalInsert(FestivalDto festivalDto);

  int festivalDelete(Integer fest_m_id);

FestivalDto festivalDetail(FestivalDto festivalDto);


}
