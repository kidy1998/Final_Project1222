package second.project.mungFriend.adoptReview.model.service;

import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import second.project.mungFriend.adoptReview.model.dto.Review;

public interface ReviewService {

	// 게시글 조회
	Map<String, Object> selectReviewList(int cp);

	Map<String, Object> selectSearchReviewList(Map<String, Object> paramMap, int cp);

	
	
	// 게시글 삽입
	int reviewInsert(Review review, List<MultipartFile> images) throws Exception;
	
	

}
