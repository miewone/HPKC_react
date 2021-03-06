import React, { useRef, useState } from 'react';
import axios from 'axios';
import '../styles/newlogin.scss';
import storage from '../lib/storage';
import { SosialLogin, ButtonLogin, Input } from '../styles/loginStyle';
const Register = ({ closeModal, openModal }) => {
    const regExp =
        /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

    const userName = useRef();
    const userEmail = useRef();
    const userPwd = useRef();
    const userPwdcheck = useRef();
    const [checkEmail, setCheckEmail] = useState(true);
    const [checkedPwd, setCheckedPwd] = useState(true);
    const checkEmailregExp = (e) => {
        console.log(e);
        if (!regExp.test(e.target.value)) {
            setCheckEmail(false);
        } else {
            setCheckEmail(true);
        }
    };
    const checkPwd = (e) => {
        if (e.target.value === userPwd.current.value) {
            setCheckedPwd(true);
        } else {
            setCheckedPwd(false);
        }
    };
    const event_login = () => {
        if (
            !userName.current.value ||
            !userEmail.current.value ||
            !userPwd.current.value
        ) {
            alert('공란이 존재합니다. 확인 후 다시 시도해주세요');
            return;
        }
        if (!checkEmail) {
            alert('이메일 형식을 맞춰주세요');
            userEmail.current.focus();
            return;
        }

        axios
            .post('/api/oauth/register', {
                userName: userName.current.value,
                userEmail: userEmail.current.value,
                password: userPwd.current.value,
            })
            .then((res) => {
                if (!res.data.success) {
                    alert(res.data.msg);
                    return;
                }
                alert('회원가입이 완료되었습니다.');
                openModal();
            })
            .catch((err) => {
                console.log(err);
                if (err) {
                    alert('로그인에 실패 하였습니다.');
                }
            });
    };
    const kakaoLogin = () => {
        storage.set('kakao', true);
        window.location.href = '/api/oauth/kakao';
    };
    return (
        <div className="loginBody">
            <div className="xbutton" onClick={closeModal}>
                <SosialLogin></SosialLogin>
            </div>

            <div className="back logo">
                <img
                    src="/img/logopptogether.png"
                    alt="logo"
                    className="logoimg"
                />
            </div>
            <Input
                className="input"
                type="text"
                name="name"
                placeholder="이름"
                ref={userName}
            ></Input>
            <Input
                className="input"
                type="text"
                name="email"
                placeholder="이메일"
                style={checkEmail ? {} : { border: '2px solid red' }}
                ref={userEmail}
                onChange={checkEmailregExp}
            ></Input>

            <Input
                className="input"
                type="password"
                name="passwod"
                placeholder="비밀번호"
                ref={userPwd}
            ></Input>
            <Input
                className="input"
                type="password"
                name="passwod"
                placeholder="비밀번호 확인"
                ref={userPwdcheck}
                onChange={checkPwd}
            ></Input>
            <ButtonLogin className="sosial kakao" onClick={event_login}>
                회원 가입
            </ButtonLogin>
            {!checkEmail && (
                <span style={{ color: 'red' }}>
                    이메일 형식에 맞지 않습니다.
                </span>
            )}
            {!checkedPwd && (
                <span style={{ color: 'red' }}>
                    입력하신 비밀번호가 같지 않습니다.
                </span>
            )}
            <div className="back oauthExplain">소셜 계정으로 가입</div>
            <div className="back oauthClick">
                <SosialLogin
                    className="kakao"
                    onClick={kakaoLogin}
                ></SosialLogin>
                {/* <SosialLogin className="google"></SosialLogin>
                <SosialLogin className="facebook"></SosialLogin>
                <SosialLogin className="naver"></SosialLogin> */}
            </div>
        </div>
    );
};

export default Register;
