import React, { useEffect, useState } from 'react';
import { DateTimePicker } from '@progress/kendo-react-dateinputs';
// import DatePicker from 'react-datepicker'

const ConnectAccount = () => {
    const SECRET = "MLVCI101200929101641VwhIEjAFW";
    // {"user_id":"600","connection_type":"2","status":"success","iAccountId":"74","expires_on":"2021-03-29 18:21:45"}

    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [email, setEmail] = useState("");
    const [first, setFirst] = useState("");
    const [last, setLast] = useState("");
    const [duration, setDuration] = useState("");
    const [participant, setParticipant] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const [meetings, setMeetings] = useState([]);

    useEffect(async () => {
        let url = "https://services.medixcel.in/connect/get_meetings_of_client_for_date"
        let obj = {
            client_key: "meeting",
            date: new Date().toISOString().split('T')[0],
            user_id: "74"
        }
        let params = await encrypt(obj);
        console.log('params:', params)

        let res = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                client_key: "meeting",
                parameters: params
            })
        });
        let data = await res.json();
        console.log('data:', data)

    })

    async function connectAccount(type) {
        let text = {
            "client_key": "meeting",
            "connection_type": type,
            "user_id": "600",
        }
        console.log('text:', text)
        let params = await encrypt(text);
        let url = `https://services.medixcel.in/connect/connectUserAccount.php?client_key=meeting&parameters=${params}`;
        window.open(url, '_blank');
    }

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
            <button onClick={() => { connectAccount('2') }}>Connect With Google</button>
            <br />
            <br />
            <button onClick={() => { connectAccount('1') }}>Connect With Zoom</button>

            <br />
            <br />


            <h4>Schdule Meeting</h4>
            <label>Enter Meeting Title</label>
            <input onChange={text => setTitle(text.target.value)} type="text" />
            <br />


            <label style={{ marginRight: '20px' }}>Enter Meeting Date-time</label>
            <DateTimePicker onChange={date => setStartDate(date.target.value)}
                value={startDate} />

            <br />

            <label>Enter Duration in Minutes</label>
            <input onChange={text => setDuration(text.target.value)} type="text" />
            <br />

            <label>Enter Email</label>
            <input onChange={text => setEmail(text.target.value)} type="text" />
            <br />

            <label>Enter FirstName</label>
            <input onChange={text => setFirst(text.target.value)} type="text" />
            <br />

            <label>Enter LastName</label>
            <input onChange={text => setLast(text.target.value)} type="text" />
            <br />
            <br />

            <label>Enter Participant Name</label>
            <input onChange={text => setParticipant(text.target.value)} type="text" />
            <br />
            <br />
            <br />




            <button onClick={async () => {
                let sendObj = {
                    client_key: "meeting",
                    video_call_provider_account_id: "74",
                    start_time: new Date(startDate).toISOString().split('T')[0] + ' ' + new Date(startDate).toISOString().split('T')[1].slice(0, 8),
                    duration_in_minutes: duration,
                    meeting_title: title,
                    participants: [{
                        iUserID: "100",
                        sEmail: email,
                        sFirstName: first,
                        sLastName: last
                    }]
                }

                console.log('sendObj:', sendObj)
                let params = await encrypt(sendObj);
                console.log('params:', params)

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
                let obj = {
                    title: data.output.meeting_summary.sMeetingTitle,
                    date: data.output.meeting_summary.sStartTime,
                    url: data.output.meeting_summary.sHostMeetingURL
                }

                let arr = meetings.concat(obj)
                setMeetings(arr)

            }}> Schdule Meeting</button>


            {meetings.length > 0 && <div>
                <br />
                <br />
                <br />
                <h5>Schdule Meetings</h5>
                <table>
                    <thead>
                        <tr>
                            <td>Title</td>
                            <td>Date</td>
                            <td>URL</td>
                        </tr>
                    </thead>
                    <tbody>
                        {meetings.map((el, i) => (
                            <tr>
                                <td>{el.title}</td>
                                <td>{el.date}</td>
                                <td>{el.url}</td>
                            </tr>
                        ))
                        }
                    </tbody>
                </table>
            </div>}
        </div>
    );
};

export default ConnectAccount;