import axios from 'axios';
import { useState, useEffect } from 'react';
import PresenterDetail from '../presentation/PresenterDetail';
import { Presentation } from '../styles/PresentationList';
import Modal from 'react-awesome-modal';
import PresentationHeader from './PresentationHeader';
function PresentationList({ match }) {
    const { teamName } = match.params;
    const [modalVisible, setModalVisible] = useState(false);

    const [attendents, setAttendents] = useState([]);
    const [presenter, setpresenter] = useState({
        _id: '',
        ptName: '',
        attendents: [],
        createdAt: '',
        joined_people: 0,
        resultVote: '',
    });

    useEffect(() => {
        axios
            .post('/pt/ptlist', { teamName })
            .then((data) => {
                setAttendents(data.data);
                setpresenter({
                    _id: '',
                    ptName: '',
                    attendents: [],
                    createdAt: '',
                    joined_people: 0,
                    resultVote: '',
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }, [teamName]);
    const updatePresenter = (update) => {
        const attendenta = presenter.attendents.map((ele) => {
            if (ele.name === update.name) return update;
            else return ele;
        });
        setpresenter({ ...presenter, attendents: attendenta });
    };
    const updatePtList = () => {
        axios
            .post('/pt/ptlist', { teamName: teamName })
            .then((data) => {
                setAttendents(data.data);
                setpresenter({
                    _id: '',
                    ptName: '',
                    attendents: [],
                    createdAt: '',
                    joined_people: 0,
                    resultVote: '',
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const openModal = (pt) => {
        return () => {
            if (pt.ptName !== presenter.ptName) {
                setpresenter({
                    _id: pt._id,
                    ptName: pt.ptName,
                    attendents: pt.attendents,
                    createdAt: pt.createdAt,
                    joined_people: pt.joined_people,
                    resultVote: pt.resultVote,
                });
            }
            setModalVisible(true);
        };
    };
    const closeModal = () => {
        console.log(teamName);
        axios
            .post('/pt/ptlist', { teamName: teamName })
            .then((data) => {
                setAttendents(data.data);
                setpresenter({
                    _id: '',
                    ptName: '',
                    attendents: [],
                    createdAt: '',
                    joined_people: 0,
                    resultVote: '',
                });
            })
            .catch((err) => {
                console.log(err);
            });
        setModalVisible(false);
    };

    return (
        <>
            <div className="ptHeader">
                <PresentationHeader
                    teamName={teamName}
                    updatePtList={updatePtList}
                />
            </div>
            {attendents < 1 && (
                <h1>발표 내역이 없습니다. 추가 하시겠습니까?</h1>
            )}
            {attendents.length > 1 && (
                <div
                    style={{ display: 'flex', justifyContent: 'space-around' }}
                >
                    <div>발표명</div>
                    <div>참석자 수</div>
                    <div>첫번째 발표자</div>
                    <div>만든 날짜</div>
                </div>
            )}
            {attendents &&
                attendents.map((ele) => {
                    return (
                        <Presentation key={ele._id + 'div'}>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-around',
                                }}
                            >
                                <button onClick={openModal(ele)}>
                                    <span>{ele.ptName}</span>
                                </button>
                            </div>
                            <div>{ele.joined_people}</div>
                            <div>{ele.attendents[0].name}</div>
                            <div>{ele.createdAt}</div>
                        </Presentation>
                    );
                })}
            {presenter._id !== '' && (
                <Modal
                    visible={modalVisible}
                    width="1000"
                    height="600"
                    effect="fadeInUp"
                    onClickAway={closeModal}
                >
                    <div>
                        <PresenterDetail
                            teamName={teamName}
                            presenter={presenter}
                            updatePresenter={updatePresenter}
                        />
                        <button onClick={closeModal}>모달 닫기</button>
                    </div>
                </Modal>
            )}
        </>
    );
}

export default PresentationList;
