/* 부모요소 선택된 값 스타일 바꾸기 */
function changeParentBorderStyle(radio) {
  var radioGroup = document.querySelectorAll('input[name="' + radio.getAttribute('name') + '"]');
  
  radioGroup.forEach(function(radioButton) {
    var parentElement = radioButton.parentElement;
    
    if (parentElement) {
      parentElement.classList.remove('selected'); // 모든 버튼의 선택 상태 제거
    }
  });
  
  var parent = radio.parentElement;
  
  if (parent) {
    parent.classList.add('selected'); // 선택된 버튼에 선택 상태 추가
  }
}

var radioButtons = document.querySelectorAll('.donationButton input[type="radio"]');

radioButtons.forEach(function(radio) {
  radio.addEventListener('change', function() {
    changeParentBorderStyle(radio);
  });
});



/* 직접입력 창 display */
const donationRadio = document.querySelectorAll('input[type = "radio"]:not([value="input"])'); // 다른 후원 금액
const donationInputBtn = document.querySelector('input[value="input"]');
const donationInputArea = document.getElementById("inputAmountArea");
var inputFlag = false; // 안열린 상태

donationInputBtn.addEventListener('click', function() {
	
	console.log("누름");
	console.log(donationInputBtn.value);
	console.log(typeof donationInputBtn.value);
	
	if(!inputFlag){
		donationInputArea.style.display = "flex";		
		inputFlag = true;
	}
	
})

for(let i = 0; i <donationRadio.length; i++){
	
	donationRadio[i].addEventListener('click', function() {
		console.log("다른 버튼 눌림");
		
		if(inputFlag){
			donationInputArea.style.display = "none";		
			inputFlag = false;
		}
		
		
	});
}


// 결제 진행 
function requestPay() {

	var donationFlag = true;
	
	var donationType = document.querySelector('input[name="donationType"]:checked'); // 후원 주기
	var donationAmount = document.querySelector('input[name="donationAmount"]:checked'); // 후원 금액 
	var donationCheck = document.querySelectorAll('.donationProcessCheck input[type="checkbox"]:checked'); // 후원 동의
	var donationContent = document.querySelector('.donationContent'); // 후원 내용
	
	var donationName = ''; // 후원자 이름
	var donationEmail = ''; // 후원자 이메일
	
	
	
	if(loginMember == null){
		var donationInputName = document.querySelector('input[name="donationName"]').value; // 후원자 입력 이름 (비회원)
    	var donationInputEmail = document.querySelector('input[name="donationEmail"]').value; // 후원자 입력 이메일 (비회원)
		console.log("로그인안됨");
		
		// 입력값 유효성?
		if(donationInputName.length == 0 ){
			alert("후원자 이름을 작성해주세요!")
			document.querySelector('input[name="donationName').focus();
			return;
		}
		if(donationInputEmail.length == 0){
			alert("후원자 이메일을 작성해주세요!")
			document.querySelector('input[name="donationEmail').focus();
			return;
		}
	
		donationName = donationInputName;
		donationEmail = donationInputEmail;
		console.log("로그인안됨 이룸 : " + donationName);
		console.log("로그인안됨 이메일 : " + donationInputEmail);
	}else{
		console.log("로그인됨");		
		donationName =  loginMember.memberName;
		donationEmail =  loginMember.memberEmail;
	}
		
	/* 후원하기의 체크된 내용 확인하기*/
	if(donationType == null){ // 후원하기 주기가 체크가 되지 않았다면 다시 실행하게 하기
		alert("후원 주기를 체크해주세요~");
		donationFlag = false;
		return;
	}else if(donationAmount == null){
		alert("후원 금액을 선택해주세요~");
		donationFlag = false;
		return;
	}else if (donationCheck.length != 2){
		alert("동의해주세요");
		donationFlag = false;
/*		const donation
		donationCheck.focus();
*/
		return;	
	}
	
	/* 직접입력의 경우*/	
	if(donationAmount.value == 'input'){
		console.log("금액이 input으로 눌림");	
		
		/* 재사용 */
		donationAmount = document.querySelector('#inputAmount'); // 입력된 후원 금액 
		
		console.log("입력된 후원 금액 : " + donationAmount.value);	
		
		if(donationAmount == 0){
			alert("후원 금액을 입력해주세요!");
			donationAmount.focus();
			return ;
		}
		
	}	
	
	
	console.log("나 그냥 직접입력 그거 안하고 갈거임");
	
	
	if(!donationFlag){
		console.log("후원 진입불가");	
		return;
	}else{
		
        // 결제정보를 결제api 진행하면서 넣어야 하는거 아니야? 왜 미리 넣어?
        // => 미리 넣는다고 했을 때 loginMember의 정보를 넣음
	    console.log("type : " + donationType.value);
	    console.log("amount : " + donationAmount.value);
	    
	    // 결제 정보
	    var paymentData = {
	            pg: "html5_inicis",		//KG이니시스 pg파라미터 값
				//pg: "kakaopay",
	            pay_method: "card",		//결제 방법
			
	            merchant_uid: "donation_" + new Date().getTime(),//주문번호 전달 
		        // 라디오 버튼에서 선택한 값을 결제 정보에 추가
		        name: '멍프랜드 ' + (donationType.value === '일시' ? '일시 후원' : '정기 후원'),
		        amount: parseInt(donationAmount.value), // 문자열을 숫자로 변환하여 저장	  
		        //customer_uid : "123456",   
		        // 구매자 정보
		        buyer_name : donationName,
		        buyer_email : donationEmail,
		        
		        
		        
		        
	            //customer_uid : "CUSTOMER_UID", //customer_uid 파라메터가 있어야 빌링키 발급을 시도합니다.★★★
				//customer_uid : /*buyer_name +*/ new Date().getTime(),
	    		//buyer_email : email,
	    		//buyer_name : buyer_name,
	    		//buyer_tel : hp,
	    		//buyer_addr : addr,
		};

	    // '정기'인 경우에만 빌링키 추가
	    if (donationType.value === '정기') {
			paymentData.customer_uid = 'CUSTOMER_UID' + loginMember.memberNo; // 빌링키 발급 시도
			
			
					// 결제검증
					fetch('/billingkey/' + paymentData.customer_uid, {
					    method: 'POST'
					})
					.then(function(response) {
					    return response.json();
					})
					.then(function(data) {
							console.log("들어옴");
							
							console.log(data);
				
					})
					.catch(function(error) {
					    alert("결제에 실패하였습니다.", "에러 내용: " + error, "error");
					});
			
	    }
	    
		
		var IMP = window.IMP;
	    IMP.init("imp82107782");
	
	    IMP.request_pay(paymentData,
	        function (rsp) {
				
		        if (rsp.success) { // 결제 성공
					alert("결제 성공");
					
					// 결제검증
					fetch('/verifyIamport/' + rsp.imp_uid, {
					    method: 'POST'
					})
					.then(function(response) {
					    return response.json();
					})
					.then(function(data) {
							console.log("들어옴");
							
							console.log(data);
				
					})
					.catch(function(error) {
					    alert("결제에 실패하였습니다.", "에러 내용: " + error, "error");
					});
				}
			});

	  }
}


/* 금액 합산 */
$('#btn_add').click(function(evt) {
    $('.inputAmount').each(function(idx, ele) {
        $(ele).val(parseInt($(ele).val())+100);
    });
    evt.preventDefault();
});
$('#btn_add2').click(function(evt) {
    $('.inputAmount').each(function(idx, ele) {
        $(ele).val(parseInt($(ele).val())+1000);
    });
    evt.preventDefault();
});
$('#btn_add3').click(function(evt) {
    $('.inputAmount').each(function(idx, ele) {
        $(ele).val(parseInt($(ele).val())+50000);
    });
    evt.preventDefault();
});
$('#btn_add4').click(function(evt) {
    $('.inputAmount').each(function(idx, ele) {
        $(ele).val(parseInt($(ele).val())+100000);
    });
    evt.preventDefault();
});

// 직접입력 금액 초기화 
const inputAmount = document.getElementById("inputAmount");
document.getElementById("inputReset").addEventListener('click', function(){
	
	inputAmount.value = 0;
	
	
});