import React, { useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setTeamList } from '../store/modules/team';
import { ButtonLogin, Input } from '../styles/loginStyle';
import '../styles/teamMemberDel.scss';
function TeamMemberDel() {
    const dispatch = useDispatch();
    const { team } = useSelector((state) => state);
    const { teamList } = team;
    const teamName = useRef();
    const [members, setMembers] = useState([]);
    useEffect(() => {}, [teamList]);
    const findTeamMember = () => {
        axios
            .post('/api/team/userlist', {
                teamName: teamName.current.value,
            })
            .then((res) => {
                if (res.data.success) {
                    setMembers(
                        res.data.msg.map((ele) => {
                            return {
                                selected: false,
                                id: ele.id,
                                email: ele.email,
                            };
                        })
                    );
                } else {
                }
            });
    };
    const send = () => {
        const existTeam = teamList.filter(
            (ele) => ele.teamName === teamName.current.value
        );
        console.log(teamList, teamName.current.value);
        console.log(existTeam);
        const sendMembers = members.filter((ele) => ele.selected);
        if (existTeam.length > 0) {
            axios
                .put('/api/team/memberremove', {
                    teamName: teamName.current.value,
                    members: sendMembers,
                })
                .then((res) => {
                    console.log(res);
                    if (res.data.success) {
                        const remainTeam = teamList.map((ele) => {
                            if (ele.teamName === teamName.current.value) {
                                return {
                                    ...ele,
                                    members: ele.members - sendMembers.length,
                                };
                            } else {
                                return ele;
                            }
                        });
                        console.log(remainTeam);
                        dispatch(setTeamList([...remainTeam]));

                        alert(sendMembers.length + '?????? ?????????????????????.');
                    } else {
                        alert('????????? ?????????????????????.' + res.data.msg);
                        // window.location.href = '/';
                    }
                });
        } else {
            alert('???????????? ?????? ????????????.');
        }
    };
    const select = (data) => {
        return () => {
            setMembers(
                members.map((ele) => {
                    if (data.email === ele.email) {
                        return {
                            ...ele,
                            selected: !ele.selected,
                        };
                    } else {
                        return ele;
                    }
                })
            );
        };
    };
    return (
        <div id="teamMemberDeleteContainer">
            <span>??? ?????? ??????</span>
            <div>
                <input
                    type="text"
                    name="teamName"
                    placeholder="??? ????????? ???????????????"
                    ref={teamName}
                />
                <div onClick={findTeamMember}>??? ??????</div>
            </div>

            <div>
                {members.length > 0 &&
                    members.map((ele, idx) => {
                        console.log(members);
                        return (
                            <section
                                key={idx}
                                className={
                                    ele.selected ? 'selected' : 'nonselected'
                                }
                                onClick={select(ele)}
                            >
                                <span>{ele.id}</span>
                                <span>{ele.email}</span>
                            </section>
                        );
                    })}
            </div>
            <ButtonLogin onClick={send}>??? ?????? ??????</ButtonLogin>
        </div>
    );
}

export default TeamMemberDel;
