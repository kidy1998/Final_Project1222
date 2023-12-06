package second.project.mungFriend.adopt.model.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import second.project.mungFriend.adopt.model.dto.Dog;

public interface AdoptService {

	// 강아지 목록 조회
	Map<String, Object> selectDogList(int cp);

	// 강아지 상세 조회
	Dog selectDogDetail(Map<String, Object> map);

	// DB이미지 파일 목록 조회
	List<String> selectImageList();
	
	// 좋아요 여부 확인
	int dogLikeCheck(Map<String, Object> map);

	// 좋아요 처리
	int like(Map<String, Integer> paraMap);


//	**********************************************************************************************

	// 강아지 insert
	int dogRegiInsert(Dog dog, List<MultipartFile> images) throws IllegalStateException, IOException;

	// 수정화면 띄우기용 상세조회
	Dog selectDogDetailForUpdate(Map<String, Object> map);
	
	// 강아지 update
	int dogUpdate(Dog dog, List<MultipartFile> images, String deleteList)  throws IllegalStateException, IOException ;
	
	// 강아지 delete
	int dogDelete(Map<String, Object> map);

//	**********************************************************************************************

	// 강아지 예약하기
	String dogReservation();



}
