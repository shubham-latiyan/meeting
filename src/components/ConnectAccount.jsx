import React, { useEffect, useState } from 'react';
import { DateTimePicker } from '@progress/kendo-react-dateinputs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const axios = require('axios');

const ConnectAccount = (props) => {
    // const SECRET = "MLVCI101200929101641VwhIEjAFW";
    const [title, setTitle] = useState("");
    const [first, setFirst] = useState("");
    const [last, setLast] = useState("");
    const [duration, setDuration] = useState("");
    const [participant, setParticipant] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const [meetings, setMeetings] = useState([]);
    const [userObj, setUserObj] = useState([]);
    const [email, setEmail] = useState("");
    const [isG, setG] = useState("on");
    const [isZ, setZ] = useState("");

    let clearTime;

    useEffect(() => {
        setUserObj(props.userObj)
        getAllMeetings();

        clearInterval(clearTime);
        clearTime = setInterval(() => {
            getuserInfo();
        }, 5000);
    }, [])

    async function getuserInfo() {
        let url = "http://52.74.133.214:6388/getId"
        let res = await axios.post(url, {
            email: props.userObj.email
        });
        // console.log('res.data.data:', res.data.data)
        localStorage.setItem('userId', res.data.data.userId);
        localStorage.setItem('userObj', JSON.stringify(res.data.data));
        // props = { userObj: res.data.data };
        setUserObj(res.data.data)
    }

    async function getAllMeetings() {
        let url = "https://services.medixcel.in/connect/get_meetings_of_client_for_date"
        let obj = {
            client_key: "meeting",
            date: new Date().toISOString().split('T')[0],
            user_id: props.userObj.userId
        }
        let params = await encrypt(obj);
        let res = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                client_key: "meeting",
                parameters: params
            })
        });
        let data = await res.json();
        console.log('meet data:', data)
        setMeetings(data.output.meetings);
    }

    async function connectAccount(type) {
        let text = {
            "client_key": "meeting",
            "connection_type": type,
            "user_id": props.userObj.userId
        }
        if (type === '2' && userObj.isG === 1) {
            disccUserAcc(type);
        }
        else if (type === '1' && userObj.isZ === 1) {
            disccUserAcc(type);
        }
        else {
            console.log('text:', text)
            let params = await encrypt(text);
            let url = `https://services.medixcel.in/connect/connectUserAccount.php?client_key=meeting&parameters=${params}`;
            window.open(url, '_blank');
        }
    }

    async function disccUserAcc(type) {
        let url = "https://services.medixcel.in/connect/disconnect_user_account"
        let obj = {
            client_key: "meeting",
            account_id: type === '2' ? userObj.connectidG : userObj.connectidZ
        }
        let params = await encrypt(obj);

        let res = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                client_key: "meeting",
                parameters: params
            })
        });
        let data = await res.json();
        console.log('User dissconnect data:', data)
        // if (data.msg === 'success') {
        notify('Account Disconnected')
        let nurl = "http://52.74.133.214:6388/updateuser"
        let nres = await axios.post(nurl, {
            disconnectedId: type === '2' ? userObj.connectidG : userObj.connectidZ
        });
        console.log('Second    res:', nres)
        // }
    }

    async function cancelMeeting(param) {
        let url = "https://services.medixcel.in/connect/cancel_meeting"
        let obj = {
            client_key: "meeting",
            meeting_id: param.meeting_id
        }
        console.log('obj:', obj)
        let params = await encrypt(obj);

        let res = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                client_key: "meeting",
                parameters: params
            })
        });
        let data = await res.json();
        console.log('Cancel meeting data:', data)
    }

    const notify = (text) => toast(text);

    async function encrypt(text) {
        let res = await fetch('http://54.190.123.160/themes/encrypt.php', {
            method: 'POST',
            body: JSON.stringify(text)
        });
        let data = await res.json();
        return data.output.parameters;
    }

    return (
        <div style={{ padding: '50px' }}>
            <button onClick={() => { connectAccount('2') }} style={{ background: userObj.isG === 0 ? '#48e748' : '#fa8643' }}>{userObj.isG === 0 ? 'Connect With Google Account' : 'Disconnect Google Account'}</button>
            &nbsp;
            &nbsp;
            <button onClick={() => { connectAccount('1') }} style={{ background: userObj.isZ === 0 ? '#48e748' : '#fa8643' }}>{userObj.isZ === 0 ? 'Connect With Zoom Account' : 'Disconnect Zoom Account'}</button>

            <br />
            <br />


            <h4>Schdule Meeting</h4>


            <div className="flex">
                <label className="w20">Enter Meeting Title</label>
                <input onChange={text => setTitle(text.target.value)} type="text" />
            </div>
            <br />
            <div className="flex">
                <label className="w20">Enter Meeting Date-time</label>
                <DateTimePicker onChange={date => setStartDate(date.target.value)}
                    value={startDate} />
            </div>
            <br />
            <div className="flex">
                <label className="w20">Enter Duration in Minutes</label>
                <input onChange={text => setDuration(text.target.value)} type="text" />
            </div>
            <br />


            <div>
                <label className="w20">Choose Platform</label>
                <span>Google Meet</span> &nbsp;&nbsp;
                <input type="radio" onChange={(val) => {
                    setZ(!val.target.value)
                    setG(val.target.value)
                }} aria-label="Radio button for following text input" disabled={!userObj.isG} checked={isG} />
                &nbsp;&nbsp; &nbsp;&nbsp;
                <span>Zoom</span> &nbsp;&nbsp;
                <input onChange={(val) => {
                    setZ(val.target.value)
                    setG(!val.target.value)
                }} type="radio" aria-label="Radio button for following text input" disabled={!userObj.isZ} checked={isZ} />
            </div>
            <br />


            <div className="flex">
                <label className="w20">Enter Email</label>
                <input value={userObj.email} readOnly={true} onChange={text => setEmail(text.target.value)} type="text" />
            </div>
            <br />

            <div className="flex">
                <label className="w20">Enter FirstName</label>
                <input onChange={text => setFirst(text.target.value)} type="text" />
            </div>
            <br />

            <div className="flex">
                <label className="w20">Enter LastName</label>
                <input onChange={text => setLast(text.target.value)} type="text" />
            </div>
            <br />
            <br />

            <div className="flex">
                <label className="w20">Enter Participant Name</label>
                <input onChange={text => setParticipant(text.target.value)} type="text" />
            </div>
            <br />
            <br />

            <button disabled={!title || !first || !last || !duration || !startDate || !participant} onClick={async () => {
                let sendObj = {
                    client_key: "meeting",
                    video_call_provider_account_id: isG === 'on' ? userObj.connectidG : userObj.connectidZ,
                    start_time: new Date(startDate).toISOString().split('T')[0] + ' ' + new Date(startDate).toISOString().split('T')[1].slice(0, 8),
                    duration_in_minutes: duration,
                    meeting_title: title,
                    participants: [{
                        iUserID: "100",
                        sEmail: 'participant@gmail.com',
                        sFirstName: participant,
                        sLastName: last
                    }]
                }

                console.log('sendObj:', sendObj)
                let params = await encrypt(sendObj);
                // console.log('params:', params);

                let url = 'https://services.medixcel.in/connect/set_up_meeting'
                let res = await fetch(url, {
                    method: 'POST',
                    body: JSON.stringify({
                        client_key: "meeting",
                        parameters: params
                    })
                });
                let data = await res.json();
                console.log('data:', data)
                notify('Meeting is Schduled')
                let obj = {
                    title: data.output.meeting_summary.sMeetingTitle,
                    date: data.output.meeting_summary.sStartTime,
                    url: data.output.meeting_summary.sHostMeetingURL
                }

                // let arr = meetings.concat(obj)
                // setMeetings(arr)
                getAllMeetings();

            }}> Schdule Meeting</button>

            <br />
            <br />
            <br />


            {meetings.length > 0 && <div>
                <br />
                <br />
                <h5>All Meetings</h5>
                <span style={{ color: 'red' }}>Cancel API is not working as Expected, Kaveri is working on it</span>
                <table className="table">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">S.No</th>
                            <th scope="col">Platform</th>
                            <th scope="col">Meeting Date</th>
                            <th scope="col">Duration</th>
                            <th scope="col">URL</th>
                            <th scope="col">Cancel Meeting</th>
                        </tr>
                    </thead>
                    <tbody>
                        {meetings.map((el, i) => (
                            <tr key={i} scope="row">
                                <td>{i + 1}</td>
                                <td>{el.connection_type === '2' ? 'Google Meet' : 'Zoom'}</td>
                                <td>{el.meeting_start_time}</td>
                                <td>{el.meeting_duration + 'Mins'}</td>
                                <td> <a onClick={() => { window.open(el.meeting_url, '_blank') }}>{el.meeting_url}</a></td>
                                <td>
                                    <button onClick={() => {
                                        cancelMeeting(el)
                                    }}>
                                        Cancel
                                    </button>
                                </td>
                            </tr>
                        ))
                        }
                    </tbody>
                </table>
            </div>}
            <ToastContainer />
        </div>
    );
};

export default ConnectAccount;