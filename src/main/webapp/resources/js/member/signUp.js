// 유효성 검사 여부를 기록할 객체 생성
const checkObj = {
    "memberEmail" : false,
    "memberPw" : false,
    "memberPwConfirm" : false,
    "memberNickname" : false,
    "memberTel" : false,
    "sendEmail" : false,
};

// 이메일 유효성 검사
const memberEmail = document.getElementById("memberEmail");
const emailMessage = document.getElementById("emailMessage");

memberEmail.addEventListener("input", function () {
    // 입력이 되지 않은 경우
    if(memberEmail.value.length == 0) {
        emailMessage.innerText = "이메일을 입력해주세요.";
        emailMessage.classList.remove("confirm", "error");
        
        checkObj.memberEmail = false; // 유효하지 않다. 기록 안할거임
        return;
    }

    // 입력이 된 경우
    const regExp = /^[\w\-\_]{4,}@[\w\-\_]+(\.\w+){1,3}$/;
    if(regExp.test(memberEmail.value)) { // 유효한 경우
        //**********  이메일 중복 검사 (ajax) 진행 예정 ************ 
        $.ajax({
            url : "emailDupCheck",
            // 필수 속성 url
            // 현재 주소: /community/member/signUp
            // 상대 경로: /community/member/emailDupCheck

            data: {"memberEmail" : memberEmail.value},
            // data 속성: 비동기 통신 시 서버로 전달한 값을 작성(JS 객체 형식)
            // -> 비동기 통신 시 input에 입력된 값을
            // "memberEmail" 이라는 key 값(파라미터)으로 전달

            success : function(result) {
                // 비동기 통신(ajax)가 오류 없이 요청/응답 성공한 경우

                // 매개변수 result : servlet에서 출력된 result 값이 담겨있음.
                console.log(result);

                if(result == 1) { // 중복임
                    emailMessage.innerText = "이미 사용중인 이메일 입니다.";
                    emailMessage.classList.add("error");
                    emailMessage.classList.remove("confirm");
                    checkObj.memberEmail = false;

                } else { // 중복 아님
                    emailMessage.innerText = "사용 가능한 이메일 입니다.";
                    emailMessage.classList.remove("error");
                    emailMessage.classList.add("confirm");
                    
                    checkObj.memberEmail = true; // 유효하다 기록된다
                }


            }, 

            error : function() {
                // 비동기 통신(ajax)중 오류가 발생한 경우
                console.log("에러 발생");
            }


        });

    } else {
        emailMessage.innerText = "이메일 형식이 유효하지 않습니다.";
        emailMessage.classList.add("error");
        emailMessage.classList.remove("confirm");

        checkObj.memberEmail = false; // 유효하지 않다. 기록 안할거임
    } 

});




// 인증번호 보내기
const sendBtn = document.getElementById("sendBtn");

sendBtn.addEventListener("click", function() {

     if(checkObj.memberEmail) { // 유효한 이메일이 작성되어 있을 경우에만 메일 보내기
        $.ajax({
            url: "sendEmail",
            data: {"inputEmail" : memberEmail.value},
            success : function(result) {
                console.log("이메일 발송 성공");
                console.log(result);

                // 인증 버튼이 클릭되어 정상적으로 메일이 보내졌음을 
                checkObj.sendEmail = true;
                
            },
            error : function() {
                console.log("이메일 발송 실패");
            }


        })

     }
});