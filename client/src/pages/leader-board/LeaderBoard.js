import { Button, Container, Table } from "react-bootstrap";
import { getPlays } from 'actions/play';
import { useEffect, useState } from "react";
import { useStateContext } from 'contexts/ContextProvider';
import { convertSeconds2DHMS, convertRegularNumber100 } from "utils/helper";
import { useNavigate } from 'react-router-dom';

const LeaderBoard = () => {
    const navigate = useNavigate();
    const [plays, setPlays] = useState([]);
    const { message, setMessage } = useStateContext();
    const onError = (error) => {
        setMessage(error);
    }

    useEffect(() => {
        getPlays(onError, setPlays);
    }, []);

    const convertFormattedTime = (time) => {
        const milliSeconds = time - Math.floor(time / 1000) * 1000;
        const DHMS = convertSeconds2DHMS(Math.floor(time / 1000));
        
        return `${DHMS.minutes} : ${DHMS.seconds} . ${convertRegularNumber100(milliSeconds)}`;
    }

    const onClickPlay = () => {
        return navigate('/play');
    }

    return (
        <div className="mt-lg-4">
            <div className="row">
                <div className="col-md-9">
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>User</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                plays.map((play, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{play.user.account}</td>
                                            <td>{convertFormattedTime(play.trackTime)}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                </div>
                <div className="col-md-3 pe-4 ps-4 pt-4 text-center">
                <Button variant="primary" className='w-100' onClick={onClickPlay}>Play Now</Button>
                </div>
            </div>
            
        </div>
    )
}

export default LeaderBoard;