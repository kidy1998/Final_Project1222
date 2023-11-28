package second.project.mungFriend.adopt.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import second.project.mungFriend.adopt.model.dto.Dog;
import second.project.mungFriend.adopt.model.dto.DogImage;
import second.project.mungFriend.adopt.model.service.AdoptService;
import second.project.mungFriend.member.model.dto.Member;

@Controller
@RequestMapping("/adopt")
@SessionAttributes("{loginMember}")
public class AdoptController {
	
	@Autowired
	private AdoptService service;
	
	// 강아지 목록 조회
	@GetMapping("/dogList")
	public String selectDogList(@RequestParam(value="cp", required= false, defaultValue="1") int cp,
			Model model) {
		
		Map<String, Object> map = service.selectDogList(cp);
		
		model.addAttribute("map", map);
		
		return "adopt/dogList";
	}
	
	// 강아지 상세 조회
	@GetMapping("/dogList/{dogNo}") 
	public String dogDetail(@PathVariable("dogNo") int dogNo,
							Model model,
							RedirectAttributes ra,
							@SessionAttribute(value = "loginMember", required = false) Member loginMember) {
		
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("dogNo", dogNo);
		
		Dog dog = service.selectDogDetail(map);
	
		String path = null;
		
		if(dog != null) { // 조회한 dogList가 있을 때
			
			if(loginMember != null) { // 회원인 경우
				
				map.put("memberNo", loginMember.getMemberNo());
				
				// 좋아요 여부 확인
				int result = service.dogLikeCheck(map);
				
				if(result > 0) model.addAttribute("likeCheck", "on");
				
			}
			
			path = "adopt/dogDetail";
			
			model.addAttribute("dog", dog);
			
			if(dog.getImageList() != null) { // 강아지 이미지가 있을 경우				
				
				DogImage thumbnail = null;
				
				if(dog.getImageList().get(0).getImageOrder() == 0) {
					
					thumbnail = dog.getImageList().get(0);
				}
				
				model.addAttribute("thumbnail", thumbnail);
				model.addAttribute("start", thumbnail != null ? 1 : 0);
								
			}
		
		}else { // 조회결과가 없을 경우
			
			path = "redirect:/adopt/dogList";
			ra.addFlashAttribute("message", "해당 게시글이 존재하지 않습니다");
			
		}
		
	
		return path;
		
	}
	
	// 좋아요 처리
	@PostMapping("/like")
	@ResponseBody // 반환되는 값이 비동기 요청한 곳으로 돌아가게 함
	public int like(@RequestBody Map<String, Integer> paraMap) {
		
		return service.like(paraMap);
	}
	
	
	
//	**********************************************************************************************
	
	// 게시글 작성 화면 전환
	@GetMapping("/dogRegistration")
	public String dogInsert() {
		
		return "adopt/dogRegistration";
	}
	
	// 강아지 insert
	@PostMapping("/dogRegistration/insert")
	public String dogRegiInsert(Dog dog,
								@RequestParam(value="images", required = false) List<MultipartFile> images, 
								@SessionAttribute("loginMember") Member loginMember,
								RedirectAttributes ra) throws IllegalStateException, IOException {
		

		int dogNo = service.dogRegiInsert(dog, images);
		
		String message = null;
		String path = "redirect:";
		
		if(dogNo > 0) {
			
			message = "게시글 등록이 완료되었습니다.";
			path += "/adopt/dogList/" + dogNo;
			
		}else {
			message = "게시글 등록을 실패하였습니다.";
			path += "insert";
		}
		
		ra.addFlashAttribute("message", message);
		return path;
		
	}
	
	// 강아지 update 화면 전환 및 상세페이지 재조회
	@GetMapping("/dogList/{dogNo}/update")
	public String dogUpdate(@PathVariable("dogNo")int dogNo,
							Model model) {
		
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("dogNo", dogNo);
		
		// 기존 상세조회 메서드 재사용
		Dog dog = service.selectDogDetail(map);		
		
		model.addAttribute("dog", dog);
		
		return "adopt/dogUpdate";
		
	}
	
	// 강아지 update
	
	

	// 강아지 delete
	@GetMapping("/dogList/{dogNo}/delete")
	public String dogDelete(@PathVariable("dogNo") int dogNo,
							RedirectAttributes ra) {
		
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("dogNo", dogNo);
		
		int result = service.dogDelete(map);
		
		String message = null;
		String path = "redirect:";
		
		if(result > 0) {
			
			message = "게시글이 삭제되었습니다";
			path += "/adopt/dogList";
		}else {
			
			message = "게시글 삭제 실패";
			path += "/adopt/dogList/" + dogNo;
		}
		
		ra.addFlashAttribute("message", message);
		
		return path;
		
	}


}
